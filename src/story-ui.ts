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
  type HaneokaThemeAssets,
  type HaneokaThemeHost,
} from "./host.js";
import {
  createHaneokaRichTextPresenter,
  type HaneokaRichTextPresenter,
} from "./rich-text.js";

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

/**
 * Haneoka owns this complete story surface instead of inheriting portable
 * markup. It keeps the renderer/canvas as the playfield and mounts only the
 * authored FrontCanvas-equivalent DOM in this slot.
 */
export const mountHaneokaStoryUi = (
  host: HTMLElement,
  context: VegaUiSlotContext,
): VegaDisposable => {
  const document = host.ownerDocument;
  const themeHost = context.services(HANEOKA_THEME_HOST);
  const richText = createHaneokaRichTextPresenter(
    context.services(VEGA_RICH_TEXT_SERVICE),
  );
  const root = node(document, "section", "haneoka-story-ui vega-portable-ui");
  root.setAttribute("aria-live", "polite");

  const dialogue = node(
    document,
    "div",
    "vega-portable-dialogue vega-dialogue",
  );
  dialogue.tabIndex = 0;
  dialogue.setAttribute("role", "button");
  dialogue.setAttribute("aria-label", "Advance dialogue");
  const speaker = node(
    document,
    "div",
    "vega-portable-speaker vega-dialogue__speaker",
  );
  const text = node(
    document,
    "div",
    "vega-portable-text vega-dialogue__text haneoka-rich-text",
  );
  dialogue.append(speaker, text);

  const choices = node(
    document,
    "div",
    "vega-portable-choices vega-choice-list UIAdvChoiceView",
  );
  const title = node(
    document,
    "div",
    "vega-portable-title haneoka-rich-text",
  );
  const location = node(
    document,
    "div",
    "vega-portable-location haneoka-rich-text",
  );
  const subtitles = node(
    document,
    "div",
    "vega-portable-subtitles haneoka-rich-text",
  );

  const loading = node(document, "div", "vega-portable-loading");
  const loadingText = node(document, "span");
  const loadingProgress = document.createElement("progress");
  loadingProgress.max = 1;
  loading.append(loadingText, loadingProgress);

  const error = node(document, "div", "vega-portable-error");
  error.setAttribute("role", "alert");
  const phone = createPhone(document);

  root.append(
    dialogue,
    choices,
    title,
    location,
    subtitles,
    loading,
    error,
    phone.root,
  );
  host.append(root);

  const advance = (event: Event): void => {
    event.stopPropagation();
    context.player.requestNext();
  };
  const advanceByKey = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    advance(event);
  };
  dialogue.addEventListener("click", advance);
  dialogue.addEventListener("keydown", advanceByKey);

  let lastChoices = "";
  let lastChat = "";
  let lastStoryAssets = "";
  const titleSurface: TransientSurface = {
    signature: "",
    deadline: 0,
    sourceVisible: false,
  };
  const locationSurface: TransientSurface = {
    signature: "",
    deadline: 0,
    sourceVisible: false,
  };
  const phoneLifecycle: PhoneLifecycle = {
    sourceVisible: false,
    window: undefined,
    mode: undefined,
    screenMode: phoneMode(context.state.chat.screenMode),
  };
  const releaseAssets = captureStoryAssetProperties(context.root);

  const render = (): void => {
    const state = context.state;
    const now = clock(document);
    dialogue.hidden = !state.talk.visible;
    dialogue.dataset.window = talkWindow(state.talk.window);
    dialogue.style.transform = `translate(${finite(state.talk.shakeX)}px, ${finite(
      state.talk.shakeY,
    )}px)`;
    speaker.hidden = !state.talk.speaker;
    setText(speaker, state.talk.speaker);
    setLanguage(speaker, state.talk.speakerLang);
    richText.render(
      text,
      createAdvTextRenderValue(state.talk.displayedText, {
        format: state.talk.textFormat,
        displayMode: state.talk.textDisplayMode,
        language: state.talk.textLang,
      }),
    );
    setLanguage(text, state.talk.textLang);

    const choiceSignature = choiceKey(
      state.choices.items,
      state.choices.visible,
    );
    if (choiceSignature !== lastChoices) {
      lastChoices = choiceSignature;
      renderChoices(
        document,
        choices,
        state.choices.visible ? state.choices.items : [],
        context,
        richText,
      );
    }
    choices.hidden = !state.choices.visible;

    const titleDuration =
      finite(state.title.duration) > 0
        ? finite(state.title.duration) * 1_000
        : TITLE_DURATION_MILLISECONDS;
    title.hidden = !transientVisible(
      titleSurface,
      state.title.visible,
      state.title.text,
      titleDuration,
      now,
    );
    title.style.setProperty(
      "--haneoka-title-duration",
      `${titleDuration}ms`,
    );
    richText.render(title, state.title.text);
    setLanguage(title, state.title.lang);

    location.hidden = !transientVisible(
      locationSurface,
      state.location.visible,
      state.location.text,
      LOCATION_DURATION_MILLISECONDS,
      now,
    );
    richText.render(location, state.location.text);
    setLanguage(location, state.location.lang);

    subtitles.hidden = !state.subtitles.visible || !state.subtitles.text;
    richText.render(subtitles, state.subtitles.text);
    setLanguage(subtitles, state.subtitles.lang);

    loading.hidden = !state.loading;
    loadingText.textContent = state.preload.total
      ? `Loading ${state.preload.done} / ${state.preload.total}`
      : "Loading";
    loadingProgress.value = state.preload.total
      ? Math.min(1, state.preload.done / state.preload.total)
      : 0;
    error.hidden = !state.error;
    setText(error, state.error);

    const assets = themeHost?.assets?.();
    const storyAssets = storyAssetKey(state, context, assets);
    const chatSignature = `${chatKey(state)}\u0002${storyAssets}`;
    if (chatSignature !== lastChat) {
      lastChat = chatSignature;
      renderPhone(document, phone, state, context, themeHost, richText);
    }
    updatePhoneLifecycle(phone, context, phoneLifecycle, now);
    phone.root.dataset.group = String(Boolean(state.chat.group));
    if (storyAssets !== lastStoryAssets) {
      lastStoryAssets = storyAssets;
      applyStoryAssets(context.root, state, context, themeHost, assets);
    }
  };

  const stop = animate(host, context.signal, render);
  render();

  const dispose = (): void => {
    stop();
    richText.dispose();
    dialogue.removeEventListener("click", advance);
    dialogue.removeEventListener("keydown", advanceByKey);
    releaseAssets();
    root.remove();
  };

  return { dispose };
};

const transientVisible = (
  surface: TransientSurface,
  visible: boolean,
  text: unknown,
  duration: number,
  now: number,
): boolean => {
  const signature = String(text ?? "").trim();
  if (!visible || !signature) {
    surface.sourceVisible = false;
    surface.signature = signature;
    surface.deadline = 0;
    return false;
  }
  if (!surface.sourceVisible || surface.signature !== signature) {
    surface.sourceVisible = true;
    surface.signature = signature;
    surface.deadline = now + Math.max(0, duration);
  }
  return now < surface.deadline;
};

interface PhoneElements {
  readonly root: HTMLElement;
  readonly frame: HTMLElement;
  readonly title: HTMLElement;
  readonly battery: HTMLElement;
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
  const screen = node(document, "div", "haneoka-phone__screen");
  const status = node(document, "div", "haneoka-phone__status");
  const statusIcons = node(document, "div", "haneoka-phone__status-icons");
  for (const name of ["signal", "rss", "alarm", "navi"]) {
    const icon = node(document, "span", "haneoka-phone__status-icon");
    icon.dataset.icon = name;
    statusIcons.append(icon);
  }
  const battery = node(document, "span", "haneoka-phone__battery");
  status.append(statusIcons, battery);

  const chat = node(document, "section", "haneoka-phone__chat");
  const chatHeader = node(document, "header", "haneoka-phone__header");
  const back = node(document, "span", "haneoka-phone__header-icon");
  back.dataset.icon = "back";
  const title = node(document, "h2", "haneoka-phone__title");
  const actions = node(document, "div", "haneoka-phone__header-actions");
  const call = node(document, "span", "haneoka-phone__header-icon");
  call.dataset.icon = "call";
  const rows = node(document, "span", "haneoka-phone__header-icon");
  rows.dataset.icon = "bars";
  actions.append(call, rows);
  chatHeader.append(back, title, actions);
  const messages = node(document, "div", "haneoka-phone__messages");
  const composer = node(document, "footer", "haneoka-phone__composer");
  for (const name of ["plus", "photo", "picture"]) {
    const action = node(document, "span", "haneoka-phone__composer-action");
    action.dataset.icon = name;
    composer.append(action);
  }
  const typingShell = node(document, "div", "haneoka-phone__typing-shell");
  const typing = node(
    document,
    "span",
    "haneoka-phone__typing haneoka-rich-text",
  );
  const smile = node(document, "span", "haneoka-phone__composer-action");
  smile.dataset.icon = "smile";
  typingShell.append(typing, smile);
  const microphone = node(document, "span", "haneoka-phone__composer-action");
  microphone.dataset.icon = "microphone";
  composer.append(typingShell, microphone);
  chat.append(chatHeader, messages, composer);

  const lock = node(document, "section", "haneoka-phone__lock");
  const lockTime = node(document, "div", "haneoka-phone__lock-time");
  lockTime.textContent = "12:00";
  const lockLabel = node(document, "div", "haneoka-phone__lock-label");
  lockLabel.textContent = "通知センター";
  const lockMessages = node(document, "div", "haneoka-phone__lock-messages");
  lock.append(lockTime, lockLabel, lockMessages);

  const incoming = node(document, "section", "haneoka-phone__incoming");
  const incomingName = node(document, "h2", "haneoka-phone__incoming-name");
  const incomingLabel = node(document, "p", "haneoka-phone__incoming-label");
  incomingLabel.textContent = "着信中…";
  const incomingPulse = node(document, "span", "haneoka-phone__incoming-pulse");
  incoming.append(incomingName, incomingLabel, incomingPulse);

  screen.append(status, chat, lock, incoming);
  frame.append(screen);
  root.append(frame);
  return {
    root,
    frame,
    title,
    battery,
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
  const shortcut =
    Boolean(context.state.seeking) ||
    Boolean(context.player.Model.shouldShortCut) ||
    context.root.dataset.vegaReducedMotion === "true" ||
    Boolean(
      phone.root.ownerDocument.defaultView?.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches,
    );
  const playbackRate = context.player.Model.getCurrentSpeedRate();
  const travel = Math.max(
    0,
    context.root.clientHeight,
    phone.root.parentElement?.clientHeight ?? 0,
  );

  if (sourceVisible !== lifecycle.sourceVisible) {
    lifecycle.mode = undefined;
    phone.frame.style.removeProperty("transform");
    phone.frame.style.removeProperty("transform-origin");
    phone.frame.style.removeProperty("will-change");
    const current = transitionValue(
      lifecycle.window,
      now,
      sourceVisible ? travel : 0,
    );
    const duration =
      advChatWindowTransitionSeconds(
        sourceVisible ? "show" : "hide",
        playbackRate,
        shortcut,
      ) * 1_000;
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
    if (
      sourceVisible &&
      !shortcut &&
      before.width > 0 &&
      before.height > 0 &&
      after.width > 0 &&
      after.height > 0
    ) {
      lifecycle.mode = {
        duration:
          (ADV_CHAT_WINDOW_TRANSITION.screenModeDuration /
            Math.max(0.0001, playbackRate)) *
          1_000,
        fromScaleX: before.width / after.width,
        fromScaleY: before.height / after.height,
        fromX:
          before.left +
          before.width / 2 -
          (after.left + after.width / 2),
        fromY:
          before.top +
          before.height / 2 -
          (after.top + after.height / 2),
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
      windowTransition.from +
      (windowTransition.to - windowTransition.from) *
        evaluateAdvChatOutExpo(progress);
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
        : Math.max(
            0,
            Math.min(1, (now - modeTransition.startedAt) / modeTransition.duration),
          );
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

const transitionProgress = (
  transition: NumericTransition,
  now: number,
): number =>
  transition.duration <= 0
    ? 1
    : Math.max(
        0,
        Math.min(1, (now - transition.startedAt) / transition.duration),
      );

const transitionValue = (
  transition: NumericTransition | undefined,
  now: number,
  fallback: number,
): number => {
  if (!transition) return fallback;
  const progress = evaluateAdvChatOutExpo(transitionProgress(transition, now));
  return transition.from + (transition.to - transition.from) * progress;
};

const renderPhone = (
  document: Document,
  phone: PhoneElements,
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  themeHost: HaneokaThemeHost | undefined,
  richText: HaneokaRichTextPresenter,
): void => {
  setText(phone.title, state.chat.title || "CHAT");
  setLanguage(phone.title, state.chat.titleLang);
  setText(phone.battery, state.chat.batteryText || "100%");
  richText.render(phone.typing, state.chat.typing);
  setLanguage(phone.typing, state.chat.typingLang);
  setText(phone.incomingName, state.chat.title || "CHAT");
  setLanguage(phone.incomingName, state.chat.titleLang);
  renderPhoneMessages(
    document,
    phone.messages,
    state.chat.messages,
    state,
    context,
    themeHost,
    false,
    richText,
  );
  renderPhoneMessages(
    document,
    phone.lockMessages,
    state.chat.messages,
    state,
    context,
    themeHost,
    true,
    richText,
  );
  phone.messages.scrollTop = phone.messages.scrollHeight;
  phone.lockMessages.scrollTop = phone.lockMessages.scrollHeight;
};

const renderPhoneMessages = (
  document: Document,
  host: HTMLElement,
  messages: readonly AdvChatMessage[],
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  themeHost: HaneokaThemeHost | undefined,
  notification: boolean,
  richText: HaneokaRichTextPresenter,
): void => {
  richText.releaseWithin(host);
  const fragment = document.createDocumentFragment();
  for (const message of messages) {
    const item = node(
      document,
      "article",
      notification
        ? "haneoka-phone__notification"
        : "haneoka-phone__message",
    );
    item.dataset.self = String(Boolean(message.self));
    item.dataset.stamp = String(Boolean(message.stamp));

    if (!message.self) {
      const avatar = node(document, "span", "haneoka-phone__avatar");
      const source = resolveChatImage(
        themeHost,
        state,
        context,
        message.icon || message.iconAssetName,
        "icon",
      );
      if (source) {
        const image = document.createElement("img");
        image.src = source;
        image.alt = "";
        avatar.append(image);
      }
      item.append(avatar);
    }

    const content = node(document, "div", "haneoka-phone__message-content");
    if (message.speaker && (!message.self || notification)) {
      const name = node(document, "b", "haneoka-phone__message-name");
      setText(name, message.speaker);
      setLanguage(name, message.speakerLang);
      content.append(name);
    }
    const row = node(document, "div", "haneoka-phone__message-row");
    if (message.self && Number(message.readCount || 0) > 0) {
      const read = node(document, "span", "haneoka-phone__read");
      read.textContent = "既読";
      row.append(read);
    }
    if (message.stamp) {
      const source = resolveChatImage(
        themeHost,
        state,
        context,
        message.stamp,
        "stamp",
      );
      if (source) {
        const image = document.createElement("img");
        image.className = "haneoka-phone__stamp";
        image.src = source;
        image.alt = "";
        row.append(image);
      }
    } else {
      const bubble = node(
        document,
        "div",
        "haneoka-phone__bubble haneoka-rich-text",
      );
      richText.render(bubble, message.text);
      setLanguage(bubble, message.textLang);
      row.append(bubble);
    }
    content.append(row);
    item.append(content);
    fragment.append(item);
  }
  host.replaceChildren(fragment);
};

const resolveChatImage = (
  themeHost: HaneokaThemeHost | undefined,
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
  if (!resolved && themeHost?.resolveSourceAsset) {
    const resolveSource = (path: string): string => {
      try {
        return themeHost.resolveSourceAsset?.(path) ?? "";
      } catch {
        return "";
      }
    };
    if (kind === "icon" && isAdvChatIconAssetName(source)) {
      const path = chatIconImagePath(source, context.player.runtime);
      if (!path) return "";
      resolved = resolveSource(path);
    }
    if (!resolved) {
      const file = source.endsWith(".png") ? source : `${source}.png`;
      const activeRoot =
        state.chat.dataRoot ||
        chatDefaultDataRoot(context.player.runtime);
      const defaultRoot = chatDefaultDataRoot(context.player.runtime);
      const path = source.includes("/")
        ? file
        : /^(?:ADVChat|Icon|stamp)/iu.test(source)
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

const renderChoices = (
  document: Document,
  host: HTMLElement,
  items: readonly AdvChoiceItem[],
  context: VegaUiSlotContext,
  richText: HaneokaRichTextPresenter,
): void => {
  richText.releaseWithin(host);
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const button = node(
      document,
      "button",
      "vega-portable-choice vega-choice-list__item",
    );
    button.type = "button";
    richText.render(button, item.text);
    button.disabled = item.enabled === false;
    button.setAttribute("aria-disabled", String(button.disabled));
    setLanguage(button, item.lang);
    if (!button.disabled) {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        context.player.choose(item.key);
      });
    }
    fragment.append(button);
  }
  host.replaceChildren(fragment);
};

const animate = (
  host: HTMLElement,
  signal: AbortSignal,
  render: () => void,
): (() => void) => {
  const view = host.ownerDocument.defaultView;
  let active = true;
  let handle = 0;
  const request =
    view?.requestAnimationFrame?.bind(view) ??
    ((callback: FrameRequestCallback) =>
      view?.setTimeout(() => callback(Date.now()), 16) ?? 0);
  const cancel =
    view?.cancelAnimationFrame?.bind(view) ??
    ((id: number) => view?.clearTimeout(id));
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
  const next =
    typeof value === "string" ? value : value == null ? "" : String(value);
  if (element.textContent !== next) element.textContent = next;
};

const setLanguage = (element: HTMLElement, value: unknown): void => {
  const next = typeof value === "string" ? value : "";
  if (element.lang !== next) element.lang = next;
};

const finite = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const clock = (document: Document): number =>
  document.defaultView?.performance?.now() ?? Date.now();

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

const choiceKey = (
  items: readonly AdvChoiceItem[],
  visible: boolean,
): string =>
  visible
    ? items
        .map(
          ({ key, text, lang, enabled }) =>
            `${key}\u0000${text}\u0000${lang ?? ""}\u0000${
              enabled === false ? "0" : "1"
            }`,
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
        ...state.chat.messages.map(
          ({
            id,
            speaker,
            speakerLang,
            text,
            textLang,
            stamp,
            icon,
            iconAssetName,
            self,
            readCount,
          }) =>
            [
              id,
              speaker,
              speakerLang,
              text,
              textLang,
              stamp,
              icon,
              iconAssetName,
              self,
              readCount,
            ].join("\u0000"),
        ),
      ].join("\u0001")
    : "";

const STORY_ASSET_PROPERTIES: Readonly<
  Record<
    | "chatWindow"
    | "chatBackground"
    | "chatLock"
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
  chatLock: "--haneoka-chat-lock-image",
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
  "--haneoka-chat-mask-width",
  "--haneoka-chat-mask-height",
] as const);

const captureStoryAssetProperties = (root: HTMLElement): (() => void) => {
  const properties = [
    ...Object.values(STORY_ASSET_PROPERTIES),
    ...Object.values(CHAT_ICON_PROPERTIES),
    ...CHAT_LAYOUT_PROPERTIES,
  ];
  const previous = new Map(
    properties.map(
      (property) => [property, root.style.getPropertyValue(property)] as const,
    ),
  );
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
  themeHost: HaneokaThemeHost | undefined,
  assets: HaneokaThemeAssets | undefined,
): void => {
  const runtime = context.player.runtime;
  const dataRoot =
    String(state.chat.dataRoot || "").replace(/\/+$/u, "") ||
    chatDefaultDataRoot(runtime);
  const defaultRoot = chatDefaultDataRoot(runtime);
  const resolveSource = (path: string): string | undefined => {
    if (!path || !themeHost?.resolveSourceAsset) return undefined;
    try {
      return themeHost.resolveSourceAsset(path);
    } catch {
      return undefined;
    }
  };
  const sourcePath = (directory: string, file: string): string =>
    directory ? `${directory}/${file}` : "";
  const derived: Readonly<
    Record<HaneokaStoryAssetKey, string | undefined>
  > = {
    chatWindow: resolveSource(sourcePath(dataRoot, "chatwindow_image.png")),
    chatBackground: resolveSource(sourcePath(dataRoot, "back.png")),
    chatLock: resolveSource(sourcePath(dataRoot, "lock.png")),
    chatComposerPlus: resolveSource(
      sourcePath(defaultRoot, "ADVChatIconLine_Plus.png"),
    ),
    chatComposerPhoto: resolveSource(
      sourcePath(defaultRoot, "ADVChatIconLine_Photo.png"),
    ),
    chatComposerPicture: resolveSource(
      sourcePath(defaultRoot, "ADVChatIconLine_Pic.png"),
    ),
    chatComposerSmile: resolveSource(
      sourcePath(defaultRoot, "ADVChatIconLine_Smile.png"),
    ),
    chatComposerMicrophone: resolveSource(
      sourcePath(defaultRoot, "ADVChatIconLine_Mic.png"),
    ),
  };
  for (const [key, property] of Object.entries(
    STORY_ASSET_PROPERTIES,
  ) as Array<[keyof typeof STORY_ASSET_PROPERTIES, string]>) {
    setCssImage(root, property, assets?.[key] ?? derived[key]);
  }
  const chatIcons = assets?.chatIcons ?? storyRuntime().chatIconSprites;
  for (const [key, property] of Object.entries(CHAT_ICON_PROPERTIES)) {
    setCssImage(
      root,
      property,
      chatIcons?.[key as keyof typeof chatIcons],
    );
  }

  const rect = chatWindowSpriteRectForDataRoot(dataRoot, runtime);
  const overlayWidth = positive(rect.width) ? (rect.width / 720) * 100 : 100;
  const overlayHeight = positive(rect.height)
    ? (rect.height / 700) * 100
    : 100;
  const maskTop = positive(rect.maskTop) ? (rect.maskTop / 700) * 100 : 1.8;
  const maskWidth = positive(rect.maskWidth)
    ? (rect.maskWidth / 720) * 100
    : 96.4;
  const maskHeight = positive(rect.maskHeight)
    ? (rect.maskHeight / 700) * 100
    : 96.4;
  root.style.setProperty("--haneoka-chat-overlay-width", `${overlayWidth}%`);
  root.style.setProperty("--haneoka-chat-overlay-height", `${overlayHeight}%`);
  root.style.setProperty("--haneoka-chat-mask-top", `${maskTop}%`);
  root.style.setProperty("--haneoka-chat-mask-width", `${maskWidth}%`);
  root.style.setProperty("--haneoka-chat-mask-height", `${maskHeight}%`);
};

const storyAssetKey = (
  state: AdvPlayerState,
  context: VegaUiSlotContext,
  assets: HaneokaThemeAssets | undefined,
): string => {
  const fallbackIcons = storyRuntime().chatIconSprites;
  const icons = assets?.chatIcons ?? fallbackIcons;
  return [
    state.chat.dataRoot,
    state.chat.windowAssetName,
    chatDefaultDataRoot(context.player.runtime),
    ...Object.keys(STORY_ASSET_PROPERTIES).map(
      (key) => assets?.[key as HaneokaStoryAssetKey] ?? "",
    ),
    ...Object.keys(CHAT_ICON_PROPERTIES).map(
      (key) => icons?.[key as keyof typeof icons] ?? "",
    ),
  ].join("\u0000");
};

const positive = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const setCssImage = (
  root: HTMLElement,
  property: string,
  value: string | undefined,
): void => {
  if (!value) {
    root.style.removeProperty(property);
    return;
  }
  root.style.setProperty(
    property,
    `url("${value.replace(/["\\\n\r]/gu, (character) =>
      encodeURIComponent(character),
    )}")`,
  );
};
