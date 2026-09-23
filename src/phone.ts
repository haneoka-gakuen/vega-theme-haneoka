import { createHaneokaSdfBinding } from "./typography.js";
import { applyPhoneTextProfile } from "./phoneText.js";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { HANEOKA_UI_TEXT, haneokaUiLocale } from "./locale.js";
import {
  ADV_CHAT_WINDOW_TRANSITION,
  advChatWindowTransitionSeconds,
  chatDefaultDataRoot,
  chatIconImagePath,
  chatWindowSpriteRectForDataRoot,
  createAdvTextRenderValue,
  evaluateAdvChatOutCubic,
  evaluateAdvChatOutExpo,
  isAdvChatIconAssetName,
  type VegaDisposable,
  type VegaUiSlotContext,
} from "@haneoka/vega/plugin";
import { VEGA_RICH_TEXT_SERVICE } from "@haneoka/vega-plugin-richtext";
import { storyRuntime } from "@haneoka/vega/runtime";
import {
  HANEOKA_THEME_HOST,
  HANEOKA_THEME_ASSETS,
  resolveHaneokaSourceAsset,
  type HaneokaThemeAssetProvider,
  type HaneokaThemeAssets,
} from "./host.js";
import { HANEOKA_CHAT_DATA_ROOT, HANEOKA_CHAT_ICONS, haneokaChatSkin } from "./chatAssets.js";
import { createHaneokaRichTextPresenter, type HaneokaRichTextPresenter } from "./rich-text.js";

type AdvPlayerState = VegaUiSlotContext["state"];
type AdvChoiceItem = AdvPlayerState["choices"]["items"][number];
type AdvChatMessage = AdvPlayerState["chat"]["messages"][number];

interface TransientSurface {
  signature: string;
  deadline: number;
  sourceVisible: boolean;
}

interface NumericTransition {
  duration: number;
  from: number;
  startedAt: number;
  to: number;
}

interface PhoneLifecycle {
  seekRevision: number;
  sourceVisible: boolean;
  window: NumericTransition | undefined;
  mode:
    | {
        duration: number;
        fromScaleX: number;
        fromScaleY: number;
        fromX: number;
        fromY: number;
        startedAt: number;
      }
    | undefined;
  screenMode: string;
}

const LOCATION_DURATION_MILLISECONDS = 2_500;
const TITLE_DURATION_MILLISECONDS = 6_000;

const chatLineDataRoot = (root: string): string => {
  const normalized = root.replace(/\/+$/u, "");
  if (!normalized || /\/ChatLINE$/iu.test(normalized)) return normalized;
  return `${normalized}/ChatLINE`;
};

const chatCommonSpritesRoot = (root: string): string => {
  const normalized = root.replace(/\/+$/u, "");
  const branch = /\/(?:Data|Prefabs)\//iu.exec(normalized);
  return branch ? `${normalized.slice(0, branch.index)}/Common/Sprites` : "";
};

export const mountHaneokaPhone = (host: HTMLElement, context: VegaUiSlotContext): { dispose(): void } => {
  const document = host.ownerDocument,
    themeHost = context.services(HANEOKA_THEME_HOST),
    assetProvider = context.services(HANEOKA_THEME_ASSETS) ?? themeHost;
  const richText = createHaneokaRichTextPresenter(
    context.services(VEGA_RICH_TEXT_SERVICE),
    createHaneokaSdfBinding(document, context.resources, context.signal),
  );
  const phone = createPhone(document);
  host.append(phone.root);
  const lifecycle: PhoneLifecycle = {
    seekRevision: context.player.seekRevision,
    sourceVisible: false,
    window: undefined,
    mode: undefined,
    screenMode: phoneMode(context.state.chat.screenMode),
  };
  let lastChat = "",
    lastMessages = "",
    lastAssets = "";
  const releaseAssets = captureStoryAssetProperties(context.root);
  const events = new AbortController();
  const advance = (event: Event) => {
    event.stopPropagation();
    context.player.requestNext();
  };
  phone.frame.addEventListener("click", advance, { signal: events.signal });
  phone.frame.addEventListener(
    "keydown",
    (event) => {
      if (!event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        advance(event);
      }
    },
    { signal: events.signal },
  );
  const render = (immediate = false) => {
    const state = context.state;
    if (state.seeking) return;
    if (!state.chat.visible && !lifecycle.sourceVisible && !lifecycle.window) return;
    const assets = assetProvider?.assets?.(),
      assetKey = storyAssetKey(state, context, assets),
      messages = `${state.chat.visible ? chatMessagesKey(state.chat.messages) : ""}\u0002${assetKey}`,
      signature = `${chatKey(state)}\u0002${messages}`;
    if (state.chat.visible && (immediate || signature !== lastChat)) {
      lastChat = signature;
      renderPhone(
        document,
        phone,
        state,
        context,
        assetProvider,
        richText,
        immediate || messages !== lastMessages,
        immediate,
        assetKey,
      );
      lastMessages = messages;
    }
    updatePhoneLifecycle(phone, context, lifecycle, clock(document));
    phone.root.dataset.group = String(Boolean(state.chat.group));
    if (lastAssets !== assetKey) {
      lastAssets = assetKey;
      applyStoryAssets(context.root, state, context, assetProvider, assets);
    }
  };
  const shell = context.services(VEGA_SHELL_CONTROLLER);
  const subscription = shell?.subscribe((snapshot) => {
    const labels = HANEOKA_UI_TEXT[haneokaUiLocale(snapshot.settings.uiLanguage, document)];
    phone.root.setAttribute("aria-label", labels.phone);
    phone.frame.setAttribute("aria-label", labels.advancePhone);
    const notifications = phone.root.querySelector<HTMLElement>(".haneoka-phone__lock-label"),
      incoming = phone.root.querySelector<HTMLElement>(".haneoka-phone__incoming-label");
    if (notifications) richText.render(notifications, labels.notifications, true);
    if (incoming) richText.render(incoming, labels.incoming, true);
  });
  const stop = animate(host, context.signal, render),
    unsubscribe = context.player.subscribePresentationObserver?.(() => render(true));
  render();
  return {
    dispose() {
      stop();
      unsubscribe?.();
      if (typeof subscription === "function") void subscription();
      else if (subscription && "dispose" in subscription) void subscription.dispose();
      events.abort();
      richText.dispose();
      releaseAssets();
      phone.root.remove();
    },
  };
};
interface PhoneElements {
  readonly root: HTMLElement;
  readonly frame: HTMLElement;
  readonly title: HTMLElement;
  readonly batteryText: HTMLElement;
  readonly batteryFill: HTMLElement;
  readonly messages: HTMLElement;
  readonly lockMessages: HTMLElement;
  readonly typing: HTMLElement;
  readonly incomingName: HTMLElement;
}

const createPhone = (document: Document): PhoneElements => {
  const root = node(document, "section", "haneoka-phone");
  root.hidden = true;
  root.setAttribute("aria-label", "Story phone");

  const frame = node(document, "div", "haneoka-phone__frame");
  frame.tabIndex = 0;
  frame.setAttribute("role", "button");
  frame.setAttribute("aria-label", "Advance phone story");
  const screen = node(document, "div", "haneoka-phone__screen");
  const status = node(document, "div", "haneoka-phone__status");
  const statusIcons = node(document, "div", "haneoka-phone__status-icons");
  for (const name of ["signal", "rss", "alarm", "navi"]) {
    const icon = node(document, "span", "haneoka-phone__status-icon");
    icon.dataset.icon = name;
    statusIcons.append(icon);
  }
  const battery = node(document, "span", "haneoka-phone__battery");
  const batteryText = node(document, "span", "haneoka-phone__battery-text");
  applyPhoneTextProfile(batteryText, "battery");
  const batteryGauge = node(document, "span", "haneoka-phone__battery-gauge");
  const batteryFrame = node(document, "span", "haneoka-phone__battery-frame");
  const batteryFill = node(document, "span", "haneoka-phone__battery-fill");
  batteryGauge.append(batteryFill, batteryFrame);
  battery.append(batteryText, batteryGauge);
  status.append(statusIcons, battery);

  const chat = node(document, "section", "haneoka-phone__chat");
  const chatHeader = node(document, "header", "haneoka-phone__top");
  const back = node(document, "span", "haneoka-phone__header-icon");
  back.dataset.icon = "back";
  const title = node(document, "h2", "haneoka-phone__title");
  applyPhoneTextProfile(title, "title");
  const actions = node(document, "div", "haneoka-phone__header-actions");
  const call = node(document, "span", "haneoka-phone__header-icon");
  call.dataset.icon = "call";
  const rows = node(document, "span", "haneoka-phone__header-icon");
  rows.dataset.icon = "bars";
  actions.append(call, rows);
  chatHeader.append(status, back, title, actions);
  const messages = node(document, "div", "haneoka-phone__messages");
  const composer = node(document, "footer", "haneoka-phone__composer");
  for (const name of ["plus", "photo", "picture"]) {
    const action = node(document, "span", "haneoka-phone__composer-action");
    action.dataset.icon = name;
    composer.append(action);
  }
  const typingShell = node(document, "div", "haneoka-phone__typing-shell");
  const typing = node(document, "span", "haneoka-phone__typing haneoka-rich-text");
  applyPhoneTextProfile(typing, "typing");
  const smile = node(document, "span", "haneoka-phone__composer-action");
  smile.dataset.icon = "smile";
  typingShell.append(typing, smile);
  const microphone = node(document, "span", "haneoka-phone__composer-action");
  microphone.dataset.icon = "microphone";
  composer.append(typingShell, microphone);
  chat.append(chatHeader, messages, composer);

  const lock = node(document, "section", "haneoka-phone__lock");
  const lockLabel = node(document, "div", "haneoka-phone__lock-label");
  applyPhoneTextProfile(lockLabel, "lockStatus");
  lockLabel.textContent = "通知センター";
  const lockMessages = node(document, "div", "haneoka-phone__lock-messages");
  lock.append(lockLabel, lockMessages);

  const incoming = node(document, "section", "haneoka-phone__incoming");
  const incomingName = node(document, "h2", "haneoka-phone__incoming-name");
  const incomingLabel = node(document, "p", "haneoka-phone__incoming-label");
  applyPhoneTextProfile(incomingName, "incomingName");
  applyPhoneTextProfile(incomingLabel, "incomingStatus");
  incomingLabel.textContent = "着信中...";
  incoming.append(incomingName, incomingLabel);

  screen.append(chat, lock, incoming);
  frame.append(screen);
  root.append(frame);
  return {
    root,
    frame,
    title,
    batteryText,
    batteryFill,
    messages,
    lockMessages,
    typing,
    incomingName,
  };
};

const updatePhoneLifecycle = (
  phone: PhoneElements,
  context: VegaUiSlotContext,
  lifecycle: PhoneLifecycle,
  now: number,
): void => {
  const sourceVisible = Boolean(context.state.chat.visible);
  const nextMode = phoneMode(context.state.chat.screenMode);
  const restored = lifecycle.seekRevision !== context.player.seekRevision;
  lifecycle.seekRevision = context.player.seekRevision;
  if (restored) {
    lifecycle.window = undefined;
    lifecycle.mode = undefined;
    phone.root.style.removeProperty("transform");
    phone.frame.style.removeProperty("transform");
    phone.frame.style.removeProperty("transform-origin");
    phone.frame.style.removeProperty("will-change");
    phone.root.dataset.phase = "idle";
  }
  const shortcut =
    restored ||
    Boolean(context.state.seeking) ||
    Boolean(context.player.Model.shouldShortCut) ||
    context.root.dataset.vegaReducedMotion === "true" ||
    Boolean(phone.root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const playbackRate = context.player.Model.getCurrentSpeedRate();
  const travel = Math.max(0, context.root.clientHeight, phone.root.parentElement?.clientHeight ?? 0);

  if (sourceVisible !== lifecycle.sourceVisible) {
    lifecycle.mode = undefined;
    phone.frame.style.removeProperty("transform");
    phone.frame.style.removeProperty("transform-origin");
    phone.frame.style.removeProperty("will-change");
    const current = transitionValue(lifecycle.window, now, sourceVisible ? travel : 0);
    const duration = advChatWindowTransitionSeconds(sourceVisible ? "show" : "hide", playbackRate, shortcut) * 1_000;
    lifecycle.sourceVisible = sourceVisible;
    lifecycle.window = {
      duration,
      from: current,
      startedAt: now,
      to: sourceVisible ? 0 : travel,
    };
    phone.root.hidden = false;
    phone.root.dataset.phase = sourceVisible ? "enter" : "leave";
  }

  if (nextMode !== lifecycle.screenMode) {
    const before = phone.frame.getBoundingClientRect();
    lifecycle.mode = undefined;
    phone.frame.style.removeProperty("transform");
    lifecycle.screenMode = nextMode;
    phone.root.dataset.mode = nextMode;
    const after = phone.frame.getBoundingClientRect();
    if (sourceVisible && !shortcut && before.width > 0 && before.height > 0 && after.width > 0 && after.height > 0) {
      lifecycle.mode = {
        duration: (ADV_CHAT_WINDOW_TRANSITION.screenModeDuration / Math.max(0.0001, playbackRate)) * 1_000,
        fromScaleX: before.width / after.width,
        fromScaleY: before.height / after.height,
        fromX: before.left + before.width / 2 - (after.left + after.width / 2),
        fromY: before.top + before.height / 2 - (after.top + after.height / 2),
        startedAt: now,
      };
    }
  } else {
    phone.root.dataset.mode = nextMode;
  }

  const windowTransition = lifecycle.window;
  if (windowTransition) {
    const progress = transitionProgress(windowTransition, now);
    const value =
      windowTransition.from + (windowTransition.to - windowTransition.from) * evaluateAdvChatOutExpo(progress);
    phone.root.style.transform = `translateY(${value}px)`;
    if (progress >= 1) {
      lifecycle.window = undefined;
      phone.root.style.removeProperty("transform");
      if (sourceVisible) phone.root.dataset.phase = "idle";
      else {
        phone.root.hidden = true;
        phone.root.dataset.phase = "idle";
      }
    }
  } else {
    phone.root.hidden = !sourceVisible;
  }

  const modeTransition = lifecycle.mode;
  if (modeTransition) {
    const progress =
      modeTransition.duration <= 0
        ? 1
        : Math.max(0, Math.min(1, (now - modeTransition.startedAt) / modeTransition.duration));
    const remaining = 1 - evaluateAdvChatOutCubic(progress);
    phone.frame.style.transform = `translate(${
      modeTransition.fromX * remaining
    }px, ${modeTransition.fromY * remaining}px) scale(${
      1 + (modeTransition.fromScaleX - 1) * remaining
    }, ${1 + (modeTransition.fromScaleY - 1) * remaining})`;
    phone.frame.style.transformOrigin = "50% 50%";
    phone.frame.style.willChange = "transform";
    if (progress >= 1) {
      lifecycle.mode = undefined;
      phone.frame.style.removeProperty("transform");
      phone.frame.style.removeProperty("transform-origin");
      phone.frame.style.removeProperty("will-change");
    }
  }
};

const transitionProgress = (transition: NumericTransition, now: number): number =>
  transition.duration <= 0 ? 1 : Math.max(0, Math.min(1, (now - transition.startedAt) / transition.duration));

const transitionValue = (transition: NumericTransition | undefined, now: number, fallback: number): number => {
  if (!transition) return fallback;
  const progress = evaluateAdvChatOutExpo(transitionProgress(transition, now));
  return transition.from + (transition.to - transition.from) * progress;
};

const renderPhone = (
  document: Document,
  phone: PhoneElements,
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  themeHost: HaneokaThemeAssetProvider | undefined,
  richText: HaneokaRichTextPresenter,
  messagesChanged: boolean,
  immediate = false,
  assetKey = "",
): void => {
  richText.render(phone.title, state.chat.title || "CHAT", immediate);
  setLanguage(phone.title, state.chat.titleLang);
  richText.render(phone.batteryText, state.chat.batteryText || "100%", immediate);
  const battery = Number(state.chat.battery);
  phone.batteryFill.style.setProperty(
    "--haneoka-chat-battery-level",
    `${(Number.isFinite(battery) ? Math.max(0, Math.min(1, battery / 100)) : 1) * 100}%`,
  );
  richText.render(phone.typing, state.chat.typing, immediate);
  setLanguage(phone.typing, state.chat.typingLang);
  richText.render(phone.incomingName, state.chat.title || "CHAT", immediate);
  setLanguage(phone.incomingName, state.chat.titleLang);
  if (!messagesChanged) return;
  const mode = phoneMode(state.chat.screenMode);
  if (mode === "incoming") return;
  const messagesHost = mode === "lock" ? phone.lockMessages : phone.messages;
  renderPhoneMessages(
    document,
    messagesHost,
    state.chat.messages,
    state,
    context,
    themeHost,
    richText,
    immediate,
    assetKey,
  );
  messagesHost.scrollTop = messagesHost.scrollHeight;
};

const messageRows = new WeakMap<HTMLElement, Map<string, { element: HTMLElement; signature: string }>>();

const renderPhoneMessages = (
  document: Document,
  host: HTMLElement,
  messages: readonly AdvChatMessage[],
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  themeHost: HaneokaThemeAssetProvider | undefined,
  richText: HaneokaRichTextPresenter,
  immediate = false,
  assetKey = "",
): void => {
  const previous = messageRows.get(host) ?? new Map();
  const next = new Map<string, { element: HTMLElement; signature: string }>();
  const occurrences = new Map<string, number>();
  const lock = host.classList.contains("haneoka-phone__lock-messages");
  for (const message of messages) {
    const ordinal = occurrences.get(message.id) ?? 0;
    occurrences.set(message.id, ordinal + 1);
    const key = JSON.stringify([message.id, ordinal]);
    const signature = `${assetKey}\u0002${chatMessagesKey([message])}`;
    const existing = previous.get(key);
    if (existing?.signature === signature) {
      next.set(key, existing);
      continue;
    }
    const item = node(document, "article", "haneoka-phone__message");
    item.dataset.messageId = message.id;
    item.dataset.self = String(Boolean(message.self));
    item.dataset.stamp = String(Boolean(message.stamp));

    if (!message.self) {
      const avatar = node(document, "span", "haneoka-phone__avatar");
      const source = resolveChatImage(themeHost, state, context, message.icon || message.iconAssetName, "icon");
      if (source) {
        const image = document.createElement("img");
        image.src = source;
        image.alt = "";
        avatar.append(image);
      }
      item.append(avatar);
    }

    const content = node(document, "div", "haneoka-phone__message-content");
    let name: HTMLElement | undefined;
    if (message.speaker && !message.self) {
      name = node(document, "b", "haneoka-phone__message-name");
      applyPhoneTextProfile(name, "speaker");
      richText.render(name, message.speaker, immediate);
      setLanguage(name, message.speakerLang);
      if (!lock || message.stamp) content.append(name);
    }
    const row = node(document, "div", "haneoka-phone__message-row");
    if (message.self && Number(message.readCount || 0) > 0) {
      const read = node(document, "span", "haneoka-phone__read");
      applyPhoneTextProfile(read, "read");
      richText.render(read, "既読", immediate);
      row.append(read);
    }
    if (message.stamp) {
      const source = resolveChatImage(themeHost, state, context, message.stamp, "stamp");
      if (source) {
        const image = document.createElement("img");
        image.className = "haneoka-phone__stamp";
        image.src = source;
        image.alt = "";
        row.append(image);
      }
    } else {
      const bubble = node(document, "div", "haneoka-phone__bubble");
      const text = node(document, "div", "haneoka-phone__message-text haneoka-rich-text");
      applyPhoneTextProfile(text, "message");
      richText.render(text, message.text, immediate);
      setLanguage(text, message.textLang);
      if (lock && name) bubble.append(name);
      bubble.append(text);
      row.append(bubble);
    }
    content.append(row);
    item.append(content);
    if (existing) {
      richText.releaseWithin(existing.element);
      existing.element.replaceWith(item);
    }
    next.set(key, { element: item, signature });
  }
  let index = 0;
  for (const { element } of next.values()) {
    if (host.children[index] !== element) host.insertBefore(element, host.children[index] ?? null);
    index++;
  }
  for (const [key, row] of previous)
    if (!next.has(key)) {
      richText.releaseWithin(row.element);
      row.element.remove();
    }
  messageRows.set(host, next);
};

const resolveChatImage = (
  themeHost: HaneokaThemeAssetProvider | undefined,
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  value: unknown,
  kind: "icon" | "stamp",
): string => {
  const source = String(value ?? "").trim();
  if (!source) return "";
  let resolved = themeHost?.resolveChatImage?.(source, kind) ?? "";
  if (!resolved && /^(?:data:|blob:|https?:\/\/|\/)/iu.test(source)) {
    resolved = source;
  }
  if (!resolved) {
    const resolveSource = (path: string): string => resolveHaneokaSourceAsset(themeHost, path);
    if (kind === "icon" && isAdvChatIconAssetName(source)) {
      const path = chatIconImagePath(source, context.player.runtime) || source;
      resolved = resolveSource(path);
    }
    if (!resolved) {
      const file = source.endsWith(".png") ? source : `${source}.png`;
      const activeRoot = state.chat.dataRoot || chatDefaultDataRoot(context.player.runtime) || HANEOKA_CHAT_DATA_ROOT;
      const defaultRoot = chatDefaultDataRoot(context.player.runtime) || HANEOKA_CHAT_DATA_ROOT;
      const lineRoot = chatLineDataRoot(defaultRoot);
      const path = source.includes("/")
        ? file
        : /^ADVChat/iu.test(source)
          ? `${lineRoot}/${file}`
          : /^(?:Icon|stamp)/iu.test(source)
            ? `${defaultRoot}/${file}`
            : `${activeRoot}/${file}`;
      resolved = resolveSource(path);
    }
  }
  if (!resolved) return "";
  try {
    return storyRuntime().validateResourceUrl(resolved, `chat ${kind}`);
  } catch {
    return "";
  }
};

const animate = (host: HTMLElement, signal: AbortSignal, render: () => void): (() => void) => {
  const view = host.ownerDocument.defaultView;
  let active = true;
  let handle = 0;
  const request =
    view?.requestAnimationFrame?.bind(view) ??
    ((callback: FrameRequestCallback) => view?.setTimeout(() => callback(Date.now()), 16) ?? 0);
  const cancel = view?.cancelAnimationFrame?.bind(view) ?? ((id: number) => view?.clearTimeout(id));
  const frame: FrameRequestCallback = () => {
    if (!active || signal.aborted) return;
    render();
    handle = request(frame);
  };
  handle = request(frame);
  const stop = (): void => {
    if (!active) return;
    active = false;
    cancel(handle);
  };
  signal.addEventListener("abort", stop, { once: true });
  return () => {
    signal.removeEventListener("abort", stop);
    stop();
  };
};

const node = <K extends keyof HTMLElementTagNameMap>(
  document: Document,
  tag: K,
  className = "",
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const setText = (element: HTMLElement, value: unknown): void => {
  const next = typeof value === "string" ? value : value == null ? "" : String(value);
  if (element.textContent !== next) element.textContent = next;
};

const setLanguage = (element: HTMLElement, value: unknown): void => {
  const next = typeof value === "string" ? value : "";
  if (element.lang !== next) element.lang = next;
};

const finite = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);

const clock = (document: Document): number => document.defaultView?.performance?.now() ?? Date.now();

const talkWindow = (value: string): "default" | "center" | "psych" => {
  const normalized = value.toLowerCase();
  if (normalized.includes("center")) return "center";
  if (normalized.includes("psych")) return "psych";
  return "default";
};

const phoneMode = (value: unknown): "chat" | "incoming" | "lock" => {
  const mode = Number(value);
  if (mode === 1) return "incoming";
  if (mode === 2) return "lock";
  return "chat";
};

const choiceKey = (items: readonly AdvChoiceItem[], visible: boolean): string =>
  visible
    ? items
        .map(
          ({ key, text, lang, enabled }) =>
            `${key}\u0000${text}\u0000${lang ?? ""}\u0000${enabled === false ? "0" : "1"}`,
        )
        .join("\u0001")
    : "";

const chatKey = (state: AdvPlayerState): string =>
  state.chat.visible
    ? [
        state.chat.title,
        state.chat.titleLang,
        state.chat.typing,
        state.chat.typingLang,
        state.chat.batteryText,
        state.chat.screenMode,
        state.chat.group,
      ].join("\u0001")
    : "";

const chatMessagesKey = (messages: readonly AdvChatMessage[]): string =>
  messages
    .map(({ id, speaker, speakerLang, text, textLang, stamp, icon, iconAssetName, self, readCount }) =>
      [id, speaker, speakerLang, text, textLang, stamp, icon, iconAssetName, self, readCount].join("\u0000"),
    )
    .join("\u0001");

const STORY_ASSET_PROPERTIES: Readonly<
  Record<
    | "chatWindow"
    | "chatBackground"
    | "chatBackgroundFallback"
    | "chatLock"
    | "chatTextBox"
    | "chatComposerPlus"
    | "chatComposerPhoto"
    | "chatComposerPicture"
    | "chatComposerSmile"
    | "chatComposerMicrophone",
    string
  >
> = Object.freeze({
  chatWindow: "--haneoka-chat-window-image",
  chatBackground: "--haneoka-chat-background-image",
  chatBackgroundFallback: "--haneoka-chat-background-fallback-image",
  chatLock: "--haneoka-chat-lock-image",
  chatTextBox: "--haneoka-chat-text-box-image",
  chatComposerPlus: "--haneoka-chat-composer-plus-image",
  chatComposerPhoto: "--haneoka-chat-composer-photo-image",
  chatComposerPicture: "--haneoka-chat-composer-picture-image",
  chatComposerSmile: "--haneoka-chat-composer-smile-image",
  chatComposerMicrophone: "--haneoka-chat-composer-microphone-image",
});

type HaneokaStoryAssetKey = keyof typeof STORY_ASSET_PROPERTIES;

const CHAT_ICON_PROPERTIES: Readonly<Record<string, string>> = Object.freeze({
  signal: "--haneoka-chat-icon-signal-image",
  rss: "--haneoka-chat-icon-rss-image",
  alarm: "--haneoka-chat-icon-alarm-image",
  navi: "--haneoka-chat-icon-navi-image",
  back: "--haneoka-chat-icon-back-image",
  bars: "--haneoka-chat-icon-bars-image",
  call: "--haneoka-chat-icon-call-image",
  batteryFrame: "--haneoka-chat-icon-battery-frame-image",
});

const CHAT_LAYOUT_PROPERTIES = Object.freeze([
  "--haneoka-chat-overlay-width",
  "--haneoka-chat-overlay-height",
  "--haneoka-chat-mask-top",
  "--haneoka-chat-mask-offset-x",
  "--haneoka-chat-mask-width",
  "--haneoka-chat-mask-height",
  "--haneoka-chat-incoming-root-width-height",
  "--haneoka-chat-incoming-root-width-width",
] as const);

const captureStoryAssetProperties = (root: HTMLElement): (() => void) => {
  const properties = [
    ...Object.values(STORY_ASSET_PROPERTIES),
    ...Object.values(CHAT_ICON_PROPERTIES),
    ...CHAT_LAYOUT_PROPERTIES,
  ];
  const previous = new Map(properties.map((property) => [property, root.style.getPropertyValue(property)] as const));
  return () => {
    for (const [property, value] of previous) {
      if (value) root.style.setProperty(property, value);
      else root.style.removeProperty(property);
    }
  };
};

const applyStoryAssets = (
  root: HTMLElement,
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  themeHost: HaneokaThemeAssetProvider | undefined,
  assets: HaneokaThemeAssets | undefined,
): void => {
  const runtime = context.player.runtime;
  const dataRoot =
    String(state.chat.dataRoot || "").replace(/\/+$/u, "") || chatDefaultDataRoot(runtime) || HANEOKA_CHAT_DATA_ROOT;
  const defaultRoot = chatDefaultDataRoot(runtime) || HANEOKA_CHAT_DATA_ROOT;
  const skin = haneokaChatSkin(state.chat.windowAssetName, dataRoot);
  const lineRoot = chatLineDataRoot(defaultRoot);
  const commonSpritesRoot = chatCommonSpritesRoot(defaultRoot);
  const mode = phoneMode(state.chat.screenMode);
  const usesChat = mode === "chat";
  const usesMessages = usesChat || mode === "lock";
  const resolveSource = (path: string): string => resolveHaneokaSourceAsset(themeHost, path);
  const sourcePath = (directory: string, file: string): string => (directory ? `${directory}/${file}` : "");
  const derived: Readonly<Record<HaneokaStoryAssetKey, string | undefined>> = {
    chatWindow: resolveSource(skin?.window ?? sourcePath(dataRoot, "chatwindow_image.png")),
    chatBackground: usesChat
      ? resolveSource(skin ? (skin.background ?? "") : sourcePath(dataRoot, "back.png"))
      : undefined,
    chatBackgroundFallback: usesChat ? resolveSource(sourcePath(defaultRoot, "back.png")) : undefined,
    chatLock: mode === "lock" ? resolveSource(skin ? (skin.lock ?? "") : sourcePath(dataRoot, "lock.png")) : undefined,
    chatTextBox: usesMessages ? resolveSource(sourcePath(commonSpritesRoot, "default_text_box.png")) : undefined,
    chatComposerPlus: usesChat ? resolveSource(sourcePath(lineRoot, "ADVChatIconLine_Plus.png")) : undefined,
    chatComposerPhoto: usesChat ? resolveSource(sourcePath(lineRoot, "ADVChatIconLine_Photo.png")) : undefined,
    chatComposerPicture: usesChat ? resolveSource(sourcePath(lineRoot, "ADVChatIconLine_Pic.png")) : undefined,
    chatComposerSmile: usesChat ? resolveSource(sourcePath(lineRoot, "ADVChatIconLine_Smile.png")) : undefined,
    chatComposerMicrophone: usesChat ? resolveSource(sourcePath(lineRoot, "ADVChatIconLine_Mic.png")) : undefined,
  };
  for (const [key, property] of Object.entries(STORY_ASSET_PROPERTIES) as Array<
    [keyof typeof STORY_ASSET_PROPERTIES, string]
  >) {
    const required =
      key === "chatWindow" ||
      (key === "chatLock" && mode === "lock") ||
      (key === "chatTextBox" && usesMessages) ||
      (key !== "chatLock" && key !== "chatTextBox" && usesChat);
    setCssImage(root, property, required ? (assets?.[key] ?? derived[key]) : undefined);
  }
  const chatIcons = {
    ...HANEOKA_CHAT_ICONS,
    ...storyRuntime().chatIconSprites,
    ...assets?.chatIcons,
  };
  for (const [key, property] of Object.entries(CHAT_ICON_PROPERTIES)) {
    setCssImage(root, property, usesChat ? chatIcons?.[key as keyof typeof chatIcons] : undefined);
  }

  const rect = {
    ...(skin?.rect ?? chatWindowSpriteRectForDataRoot(dataRoot, runtime)),
    ...runtime.chatAssets?.windowRectsByDataRoot?.[skin?.dataRoot ?? dataRoot],
  };
  const overlayWidth = positive(rect.width) ? (rect.width / 720) * 100 : (768 / 720) * 100;
  const overlayHeight = positive(rect.height) ? (rect.height / 700) * 100 : (1536 / 700) * 100;
  const maskTop = positive(rect.maskTop) ? (rect.maskTop / 700) * 100 : (30 / 700) * 100;
  const maskWidth = positive(rect.maskWidth) ? (rect.maskWidth / 720) * 100 : (700.2445068359375 / 720) * 100;
  const maskHeight = positive(rect.maskHeight) ? (rect.maskHeight / 700) * 100 : (1470.4112548828125 / 700) * 100;
  const incomingRootWidthHeight = positive(rect.height) ? (720 / rect.height) * 100 : 46.875;
  const incomingRootWidthWidth = positive(rect.width) ? (720 / rect.width) * 100 : 93.75;
  root.style.setProperty("--haneoka-chat-overlay-width", `${overlayWidth}%`);
  root.style.setProperty("--haneoka-chat-overlay-height", `${overlayHeight}%`);
  root.style.setProperty("--haneoka-chat-mask-top", `${maskTop}%`);
  root.style.setProperty("--haneoka-chat-mask-offset-x", `${(finite(rect.maskOffsetX) / 720) * 100}%`);
  root.style.setProperty("--haneoka-chat-mask-width", `${maskWidth}%`);
  root.style.setProperty("--haneoka-chat-mask-height", `${maskHeight}%`);
  root.style.setProperty("--haneoka-chat-incoming-root-width-height", `${incomingRootWidthHeight}cqh`);
  root.style.setProperty("--haneoka-chat-incoming-root-width-width", `${incomingRootWidthWidth}cqw`);
};

const storyAssetKey = (
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  assets: HaneokaThemeAssets | undefined,
): string => {
  const fallbackIcons = storyRuntime().chatIconSprites;
  const icons = {
    ...HANEOKA_CHAT_ICONS,
    ...fallbackIcons,
    ...assets?.chatIcons,
  };
  return [
    state.chat.screenMode,
    state.chat.dataRoot,
    state.chat.windowAssetName,
    chatDefaultDataRoot(context.player.runtime),
    ...Object.keys(STORY_ASSET_PROPERTIES).map((key) => assets?.[key as HaneokaStoryAssetKey] ?? ""),
    ...Object.keys(CHAT_ICON_PROPERTIES).map((key) => icons?.[key as keyof typeof icons] ?? ""),
  ].join("\u0000");
};

const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

const setCssImage = (root: HTMLElement, property: string, value: string | undefined): void => {
  if (!value) {
    root.style.removeProperty(property);
    return;
  }
  root.style.setProperty(
    property,
    `url("${value.replace(/["\\\n\r]/gu, (character) => encodeURIComponent(character))}")`,
  );
};
