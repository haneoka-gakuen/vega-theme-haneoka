import { bindHaneokaViewport } from "./viewport.js";
import { resolveEase } from "@haneoka/vega/renderer-kit";
import { createHaneokaSdfBinding } from "./typography.js";
import { createHaneokaMenuEntry } from "./menuEntry.js";
import type { VegaDisposable, VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { HANEOKA_STORY_SEQUENCE, HANEOKA_THEME_HOST } from "./host.js";
import { createHaneokaShellTypography } from "./shellTypography.js";
import { haneokaUiLocale } from "./locale.js";
import { mountHaneokaProgress } from "./progress.js";
export const HANEOKA_CONTROLS_ID = "haneoka-controls";
let nextQuickbarId = 0;
const labels = {
  en: [
    "Menu",
    "Auto",
    "Skip",
    "Log",
    "Q.Save",
    "Load",
    "Hide",
    "Skip video",
    "Saved",
    "Subtitles",
    "Fullscreen",
    "Continuous",
    "Leave story",
    "Fast",
    "More",
  ],
  ja: [
    "メニュー",
    "オート",
    "スキップ",
    "ログ",
    "Q.セーブ",
    "ロード",
    "非表示",
    "動画スキップ",
    "セーブしました",
    "字幕",
    "全画面",
    "連続再生",
    "中断",
    "早送り",
    "その他",
  ],
  "zh-CN": [
    "菜单",
    "自动",
    "跳过",
    "回看",
    "快存",
    "读档",
    "隐藏",
    "跳过视频",
    "已快速保存",
    "字幕",
    "全屏",
    "连续播放",
    "退出剧情",
    "快进",
    "更多",
  ],
  "zh-TW": [
    "選單",
    "自動",
    "跳過",
    "回看",
    "快存",
    "讀檔",
    "隱藏",
    "跳過影片",
    "已快速儲存",
    "字幕",
    "全螢幕",
    "連續播放",
    "離開劇情",
    "快轉",
    "更多",
  ],
  ko: [
    "메뉴",
    "자동",
    "스킵",
    "로그",
    "빠른 저장",
    "불러오기",
    "숨기기",
    "영상 건너뛰기",
    "저장 완료",
    "자막",
    "전체 화면",
    "연속 재생",
    "스토리 나가기",
    "빨리 감기",
    "더 보기",
  ],
} as const;
export function mountHaneokaControls(host: HTMLElement, context: VegaUiSlotContext): VegaDisposable {
  const controller = context.services(VEGA_SHELL_CONTROLLER);
  if (!controller) throw new Error("A shell controller is required");
  const adapter = context.services(HANEOKA_THEME_HOST);
  const sequence = context.services(HANEOKA_STORY_SEQUENCE);
  // The host renders the transport itself; the in-game menu stays.
  const stopProgress = adapter?.externalPlaybackControls ? undefined : mountHaneokaProgress(host, context);
  const document = host.ownerDocument,
    root = document.createElement("nav");
  root.className = "haneoka-controls";
  root.hidden = true;
  host.append(root);
  const viewport = bindHaneokaViewport(host, context);
  const font = createHaneokaShellTypography(context),
    events = new AbortController();
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
  quick.id = `haneoka-quickbar-${++nextQuickbarId}`;
  menu.setAttribute("aria-controls", quick.id);
  menu.setAttribute("aria-haspopup", "menu");
  let expanded = false;
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
      expanded = !expanded;
      render();
    },
    { signal: events.signal },
  );
  const actions = [
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
    ["fullscreen", 10, () => adapter?.toggleFullscreen() ?? context.root.requestFullscreen?.()],
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
    const label = document.createElement("span");
    label.className = "haneoka-control-label";
    button.append(label);
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
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
    const fullscreenActive = adapter ? adapter.snapshot().fullscreen : Boolean(document.fullscreenElement);
    const next = `${locale}|${hidden}|${expanded}|${context.state.autoPlay}|${context.state.fastForward}|${context.state.video.visible}|${snapshot.settings.subtitlesEnabled}|${fullscreenActive}|${sequence?.continuous}`;
    if (next === signature) return;
    signature = next;
    root.hidden = hidden;
    quick.dataset.open = String(expanded && !hidden);
    menu.setAttribute("aria-expanded", String(expanded && !hidden));
    root.lang = locale;
    const words = labels[locale];
    menu.setAttribute("aria-label", words[0]);
    nativeFont.render(menuLabel, "MENU");
    for (const { button, label, index, action } of controls) {
      font.set(label, words[index]);
      button.setAttribute("aria-label", words[index]);
      if (
        action === "auto" ||
        action === "fast" ||
        action === "subtitles" ||
        action === "fullscreen" ||
        action === "continuous"
      )
        button.setAttribute(
          "aria-pressed",
          String(
            action === "auto"
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
      disposed = true;
      viewport.dispose();
      events.abort();
      document.defaultView?.cancelAnimationFrame(frame);
      clearTimeout(toastTimer);
      stopProgress?.();
      if (typeof sequenceSubscription === "function") void sequenceSubscription();
      else if (sequenceSubscription && "dispose" in sequenceSubscription) void sequenceSubscription.dispose();
      else if (sequenceSubscription && "destroy" in sequenceSubscription) void sequenceSubscription.destroy();
      else if (sequenceSubscription) void sequenceSubscription.close();
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
