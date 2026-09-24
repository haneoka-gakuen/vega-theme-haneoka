import { bindHaneokaViewport } from "./viewport.js";
import { resolveEase } from "@haneoka/vega/renderer-kit";
import { createHaneokaSdfBinding } from "./typography.js";
import { createHaneokaMenuEntry } from "./menuEntry.js";
import type { VegaDisposable, VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { HANEOKA_THEME_HOST } from "./host.js";
import { createHaneokaShellTypography } from "./shellTypography.js";
import { haneokaUiLocale } from "./locale.js";
import { mountHaneokaProgress } from "./progress.js";
export const HANEOKA_CONTROLS_ID = "haneoka-controls";
const labels = {
  en: ["Menu", "Auto", "Skip", "Log", "Q.Save", "Load", "Hide", "Skip video", "Saved"],
  ja: ["メニュー", "オート", "スキップ", "ログ", "Q.セーブ", "ロード", "非表示", "動画スキップ", "セーブしました"],
  "zh-CN": ["菜单", "自动", "快进", "回看", "快存", "读档", "隐藏", "跳过视频", "已快速保存"],
  "zh-TW": ["選單", "自動", "快轉", "回看", "快存", "讀檔", "隱藏", "跳過影片", "已快速儲存"],
  ko: ["메뉴", "자동", "스킵", "로그", "빠른 저장", "불러오기", "숨기기", "영상 건너뛰기", "저장 완료"],
} as const;
export function mountHaneokaControls(host: HTMLElement, context: VegaUiSlotContext): VegaDisposable {
  const controller = context.services(VEGA_SHELL_CONTROLLER);
  if (!controller) throw new Error("A shell controller is required");
  const adapter = context.services(HANEOKA_THEME_HOST);
  if (adapter?.externalPlaybackControls) return { dispose() {} };
  const document = host.ownerDocument,
    root = document.createElement("nav");
  root.className = "haneoka-controls";
  root.hidden = true;
  host.append(root);
  const viewport = bindHaneokaViewport(host, context);
  const font = createHaneokaShellTypography(context),
    events = new AbortController(),
    stopProgress = mountHaneokaProgress(host, context);
  const nativeFont = createHaneokaSdfBinding(document, context.resources, context.signal);
  const { button: menu, surface: pressLayer, label: menuLabel } = createHaneokaMenuEntry(document);
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
    const ease = resolveEase(down ? 30 : 9);
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
  const toast = document.createElement("output");
  toast.className = "haneoka-control-toast";
  toast.setAttribute("role", "status");
  toast.hidden = true;
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
  const invoke = (action: () => unknown) =>
    void Promise.resolve()
      .then(action)
      .catch((error) => message(error instanceof Error ? error.message : String(error)));
  menu.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      invoke(() => controller.open("menu"));
    },
    { signal: events.signal },
  );
  const actions = [
    ["auto", 1, () => controller.toggleAuto()],
    ["fast", 2, () => controller.toggleFastForward()],
    ["log", 3, () => controller.open("backlog")],
    [
      "save",
      4,
      async () => {
        await controller.quickSave();
        message(labels[haneokaUiLocale(controller.snapshot().settings.uiLanguage, document)][8]);
      },
    ],
    ["load", 5, () => controller.open("load")],
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
    const label = document.createElement("span");
    label.className = "haneoka-control-label";
    button.append(label);
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
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
      hidden = snapshot.screen !== "game" || context.state.loading || !context.state.ready,
      next = `${locale}|${hidden}|${context.state.autoPlay}|${context.state.fastForward}|${context.state.video.visible}`;
    if (next === signature) return;
    signature = next;
    root.hidden = hidden;
    root.lang = locale;
    const words = labels[locale];
    menu.setAttribute("aria-label", words[0]);
    nativeFont.render(menuLabel, "MENU");
    for (const { button, label, index, action } of controls) {
      font.set(label, words[index]);
      button.setAttribute("aria-label", words[index]);
      if (action === "auto" || action === "fast")
        button.setAttribute(
          "aria-pressed",
          String(action === "auto" ? context.state.autoPlay : context.state.fastForward),
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
  const update = () => {
    if (disposed || context.signal.aborted) return;
    viewport.update();
    render();
    frame = document.defaultView?.requestAnimationFrame(update) ?? 0;
  };
  update();
  return {
    dispose() {
      disposed = true;
      viewport.dispose();
      events.abort();
      document.defaultView?.cancelAnimationFrame(frame);
      clearTimeout(toastTimer);
      stopProgress();
      document.defaultView?.cancelAnimationFrame(pressFrame);
      nativeFont.dispose();
      font.dispose();
      if (typeof subscription === "function") void subscription();
      else if ("dispose" in subscription) void subscription.dispose();
      else if ("destroy" in subscription) void subscription.destroy();
      else void subscription.close();
      root.remove();
    },
  };
}
