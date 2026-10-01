import { bindHaneokaViewport } from "./viewport.js";
import { resolveEase } from "@haneoka/vega/renderer-kit";
import { createHaneokaMenuEntry } from "./menuEntry.js";
import { HANEOKA_CONTROL_ASSETS } from "./controlAssets.js";
import type { VegaDisposable, VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { HANEOKA_STORY_SEQUENCE, HANEOKA_THEME_HOST } from "./host.js";
import { createHaneokaShellTypography } from "./shellTypography.js";
import { haneokaUiLocale, HANEOKA_QUICKBAR_TEXT as labels } from "./locale.js";
import { mountHaneokaProgress } from "./progress.js";
export const HANEOKA_CONTROLS_ID = "haneoka-controls";
let nextQuickbarId = 0;

export function mountHaneokaControls(host: HTMLElement, context: VegaUiSlotContext): VegaDisposable {
  const controller = context.services(VEGA_SHELL_CONTROLLER);
  if (!controller) throw new Error("A shell controller is required");
  const adapter = context.services(HANEOKA_THEME_HOST);
  const sequence = context.services(HANEOKA_STORY_SEQUENCE);
  // The host renders the transport itself; the in-game menu stays.
  const progress = adapter?.externalPlaybackControls ? undefined : mountHaneokaProgress(host, context);
  const document = host.ownerDocument,
    root = document.createElement("nav");
  root.className = "haneoka-controls";
  root.hidden = true;
  host.append(root);
  const viewport = bindHaneokaViewport(host, context);
  const font = createHaneokaShellTypography(context),
    events = new AbortController();
  const { button: menu, surface: pressLayer, setExpanded: paintMenuState } = createHaneokaMenuEntry(document);
  let pressFrame = 0,
    pressValue = 1,
    pressed = false;
  const animatePress = (down: boolean) => {
    const view = document.defaultView;
    view?.cancelAnimationFrame(pressFrame);
    if (view?.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pressValue = 1;
      pressLayer.style.transform = "none";
      return;
    }
    const start = performance.now(),
      from = pressValue,
      to = down ? Math.fround(0.9) : 1,
      duration = down ? 150 : 100;
    const ease = resolveEase(down ? 26 : 9);
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      pressValue = from + (to - from) * ease(progress);
      pressLayer.style.transform = `scale(${pressValue})`;
      if (progress < 1) pressFrame = view?.requestAnimationFrame(step) ?? 0;
    };
    pressFrame = view?.requestAnimationFrame(step) ?? 0;
  };
  root.append(menu);
  const quick = document.createElement("div");
  quick.className = "haneoka-quickbar";
  // The native face can scale below the menu's minimum touch target.
  // Keep the first row below that full target at small story viewports.
  const quickTop = "calc(.740741cqh + max(44px, 11.111111cqh) + 4px)";
  quick.style.top = quickTop;
  quick.style.maxHeight = `calc(100% - ${quickTop} - 8px)`;
  quick.style.width = "clamp(180px, 28cqh, 240px)";
  quick.style.maxWidth = "calc(100% - 16px)";
  quick.id = `haneoka-quickbar-${++nextQuickbarId}`;
  menu.setAttribute("aria-controls", quick.id);
  let expanded = false;
  const toast = document.createElement("output");
  toast.className = "haneoka-control-toast";
  toast.setAttribute("role", "status");
  toast.hidden = true;
  // The timer can be frozen while a backgrounded tablet tab throttles tasks,
  // so a tap always dismisses the toast as well.
  toast.addEventListener(
    "pointerdown",
    () => {
      toast.hidden = true;
      clearTimeout(toastTimer);
    },
    { signal: events.signal },
  );
  let disposed = false,
    frame = 0,
    signature = "",
    toastTimer: ReturnType<typeof setTimeout> | undefined,
    snapshot = controller.snapshot();
  const message = (value: string) => {
    toast.textContent = value;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  };
  // Control failures degrade to the console: raw error text (a rejected
  // fullscreen shows "...the user denied permission") must never surface over
  // a playing episode.
  const invoke = (action: () => unknown) => {
    try {
      // Fullscreen needs the trusted click's user activation.
      void Promise.resolve(action()).catch((error) => console.warn("[haneoka-theme] control action failed", error));
    } catch (error) {
      console.warn("[haneoka-theme] control action failed", error);
    }
  };
  menu.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      expanded = !expanded;
      render();
    },
    { signal: events.signal },
  );
  const actions = [
    ...(progress || adapter?.setPlaybackControlsVisible
      ? ([
          [
            "progress",
            15,
            () => {
              const visible = adapter?.externalPlaybackControls
                ? (adapter.snapshot().playbackControlsVisible ?? false)
                : (progress?.visible ?? false);
              if (adapter?.externalPlaybackControls) adapter.setPlaybackControlsVisible?.(!visible);
              else progress?.setVisible(!visible);
            },
          ],
        ] as const)
      : []),
    ["skip", 2, () => context.player.skip()],
    ["auto", 1, () => controller.toggleAuto()],
    ["fast", 13, () => controller.toggleFastForward()],
    ...(sequence
      ? ([
          ["continuous", 11, () => sequence.toggleContinuous()],
          ["interrupt", 12, () => sequence.interrupt()],
        ] as const)
      : []),
    ["log", 3, () => controller.open("backlog")],
    ["fullscreen", 10, () => (adapter ? adapter.toggleFullscreen() : context.root.requestFullscreen?.())],
    ["subtitles", 9, () => controller.setSetting("subtitlesEnabled", !controller.snapshot().settings.subtitlesEnabled)],
    [
      "save",
      4,
      async () => {
        await controller.quickSave();
        message(labels[haneokaUiLocale(controller.snapshot().settings.uiLanguage, document)][8]);
      },
    ],
    ["load", 5, () => controller.open("load")],
    ["more", 14, () => controller.open("menu")],
    [
      "hide",
      6,
      () => {
        context.root.dataset.vegaUiHidden = "true";
      },
    ],
  ] as const;
  const controls = actions.map(([action, index, execute]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.style.minHeight = "44px";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.gap = "8px";
    const label = document.createElement("span");
    label.className = "haneoka-control-label";
    const source = HANEOKA_CONTROL_ASSETS[action as keyof typeof HANEOKA_CONTROL_ASSETS];
    if (source) {
      const icon = document.createElement("img");
      icon.src = source;
      icon.alt = "";
      icon.draggable = false;
      icon.width = 24;
      icon.height = 24;
      icon.style.flexShrink = "0";
      button.append(icon);
    }
    button.append(label);
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        if (event.detail === 0) menu.focus();
        expanded = false;
        render();
        invoke(execute);
      },
      { signal: events.signal },
    );
    quick.append(button);
    return { button, label, index, action };
  });
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "haneoka-video-skip";
  const skipLabel = document.createElement("span");
  skipLabel.className = "haneoka-control-label";
  skip.append(skipLabel);
  skip.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      context.player.skipCurrentVideo();
    },
    { signal: events.signal },
  );
  root.append(quick, skip, toast);
  const render = () => {
    const locale = haneokaUiLocale(snapshot.settings.uiLanguage, document),
      hidden = snapshot.screen !== "game" || context.state.loading || !context.state.ready;
    if (hidden) expanded = false;
    const hostSnapshot = adapter?.snapshot();
    const fullscreenActive = hostSnapshot?.fullscreen ?? Boolean(document.fullscreenElement);
    const progressVisible = adapter?.externalPlaybackControls
      ? (hostSnapshot?.playbackControlsVisible ?? false)
      : (progress?.visible ?? false);
    const next = `${locale}|${hidden}|${expanded}|${context.state.autoPlay}|${context.state.fastForward}|${context.state.video.visible}|${snapshot.settings.subtitlesEnabled}|${fullscreenActive}|${sequence?.continuous}|${progressVisible}`;
    if (next === signature) return;
    signature = next;
    root.hidden = hidden;
    quick.dataset.open = String(expanded && !hidden);
    quick.inert = !expanded || hidden;
    menu.setAttribute("aria-expanded", String(expanded && !hidden));
    root.lang = locale;
    const words = labels[locale];
    menu.setAttribute("aria-label", words[0]);
    paintMenuState(expanded && !hidden);
    menu.title = words[0];
    for (const { button, label, index, action } of controls) {
      font.set(label, words[index]);
      button.setAttribute("aria-label", words[index]);
      if (
        action === "auto" ||
        action === "progress" ||
        action === "fast" ||
        action === "subtitles" ||
        action === "fullscreen" ||
        action === "continuous"
      )
        button.setAttribute(
          "aria-pressed",
          String(
            action === "progress"
              ? progressVisible
              : action === "auto"
                ? context.state.autoPlay
                : action === "fast"
                  ? context.state.fastForward
                  : action === "subtitles"
                    ? snapshot.settings.subtitlesEnabled
                    : action === "continuous"
                      ? sequence?.continuous
                      : fullscreenActive,
          ),
        );
    }
    skip.hidden = !context.state.video.visible;
    font.set(skipLabel, words[7]);
  };
  const releasePress = () => {
    if (!pressed) return;
    pressed = false;
    animatePress(false);
  };
  menu.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      pressed = true;
      animatePress(true);
    },
    { signal: events.signal },
  );
  document.addEventListener("pointerup", releasePress, {
    signal: events.signal,
  });
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!expanded || root.contains(event.target as Node)) return;
      expanded = false;
      render();
    },
    { signal: events.signal },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (!expanded || event.key !== "Escape") return;
      expanded = false;
      render();
      menu.focus();
    },
    { signal: events.signal },
  );
  document.addEventListener("pointercancel", releasePress, {
    signal: events.signal,
  });
  menu.addEventListener(
    "keydown",
    (event) => {
      if (!event.repeat && ["Enter", " "].includes(event.key)) {
        pressed = true;
        animatePress(true);
      }
    },
    { signal: events.signal },
  );
  menu.addEventListener("keyup", releasePress, { signal: events.signal });
  menu.addEventListener("blur", releasePress, { signal: events.signal });
  const subscription = controller.subscribe((next) => {
    snapshot = next;
    render();
  });
  const sequenceSubscription = sequence?.subscribe(render);
  const update = () => {
    if (disposed || context.signal.aborted) return;
    viewport.update();
    render();
    frame = document.defaultView?.requestAnimationFrame(update) ?? 0;
  };
  update();
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      viewport.dispose();
      events.abort();
      document.defaultView?.cancelAnimationFrame(frame);
      clearTimeout(toastTimer);
      progress?.dispose();
      if (typeof sequenceSubscription === "function") void sequenceSubscription();
      else if (sequenceSubscription && "dispose" in sequenceSubscription) void sequenceSubscription.dispose();
      else if (sequenceSubscription && "destroy" in sequenceSubscription) void sequenceSubscription.destroy();
      else if (sequenceSubscription) void sequenceSubscription.close();
      document.defaultView?.cancelAnimationFrame(pressFrame);
      font.dispose();
      if (typeof subscription === "function") void subscription();
      else if ("dispose" in subscription) void subscription.dispose();
      else if ("destroy" in subscription) void subscription.destroy();
      else void subscription.close();
      root.remove();
    },
  };
}
