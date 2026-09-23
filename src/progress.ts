import type { VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { createHaneokaIcon } from "./icons.js";
import { haneokaUiLocale } from "./locale.js";

const text = {
  en: ["Story progress", "Play", "Pause", "Replay"],
  ja: ["シナリオ進行", "再生", "一時停止", "もう一度"],
  "zh-CN": ["剧情进度", "播放", "暂停", "重新播放"],
  "zh-TW": ["劇情進度", "播放", "暫停", "重新播放"],
  ko: ["이야기 진행", "재생", "일시 정지", "다시 재생"],
} as const;

export function mountHaneokaProgress(host: HTMLElement, context: VegaUiSlotContext): () => void {
  const shell = context.services(VEGA_SHELL_CONTROLLER)!;
  const player = context.player;
  const document = host.ownerDocument;
  const events = new AbortController();
  const transport = document.createElement("div");
  transport.className = "haneoka-progress";
  const play = document.createElement("button");
  play.type = "button";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "1";
  slider.step = "any";
  const position = document.createElement("output");
  const status = document.createElement("span");
  status.className = "haneoka-progress__status";
  status.setAttribute("role", "status");
  transport.append(play, slider, position, status);
  host.append(transport);
  let disposed = false;
  let dragging = false;
  let committing = false;
  let resumeAfterDrag = false;
  let pausedBeforeDrag = false;
  let revision = 0;
  let interaction = 0;
  let frame = 0;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let lastSignature = "";
  let snapshot = shell.snapshot();
  const subscription = shell.subscribe((next) => {
    snapshot = next;
  });

  function reveal(): void {
    transport.dataset.visible = "true";
    context.root.dataset.vegaTransportVisible = "true";
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!dragging && !committing) {
        delete transport.dataset.visible;
        delete context.root.dataset.vegaTransportVisible;
      }
    }, 2200);
  }

  function begin(): void {
    if (dragging) return;
    interaction += 1;
    if (!committing) {
      resumeAfterDrag = context.state.playing && !context.state.paused;
      pausedBeforeDrag = context.state.paused;
    }
    committing = false;
    dragging = true;
    player.pause();
    status.textContent = "";
    reveal();
  }

  async function seek(): Promise<void> {
    const requested = ++revision;
    const target = player.resolveSeekRatio(Number(slider.value));
    try {
      await player.seekTo(target, { resume: false });
    } catch (error) {
      if (!disposed && requested === revision) {
        status.textContent = error instanceof Error ? error.message : String(error);
        resumeAfterDrag = false;
      }
    }
  }

  async function finish(): Promise<void> {
    if (!dragging || committing) return;
    dragging = false;
    committing = true;
    const currentInteraction = interaction;
    await seek();
    if (disposed || interaction !== currentInteraction) return;
    committing = false;
    if (disposed) return;
    if (shell.snapshot().screen === "game") {
      if (!pausedBeforeDrag) player.resume();
      if (resumeAfterDrag) void player.play().catch(report);
    }
    reveal();
    paint();
  }

  function report(error: unknown): void {
    if (!disposed) status.textContent = error instanceof Error ? error.message : String(error);
  }

  slider.addEventListener("pointerdown", begin, { signal: events.signal });
  slider.addEventListener(
    "input",
    () => {
      begin();
      void seek();
      paint();
    },
    { signal: events.signal },
  );
  slider.addEventListener("change", () => void finish(), {
    signal: events.signal,
  });
  slider.addEventListener("blur", () => void finish(), {
    signal: events.signal,
  });
  document.addEventListener("pointerup", () => void finish(), {
    signal: events.signal,
  });
  document.addEventListener("pointercancel", () => void finish(), {
    signal: events.signal,
  });
  play.addEventListener(
    "click",
    () => {
      if (context.state.finished) void shell.start().catch(report);
      else if (context.state.playing && !context.state.paused) player.pause();
      else {
        player.resume();
        void player.play().catch(report);
      }
      reveal();
    },
    { signal: events.signal },
  );
  context.root.addEventListener("pointermove", reveal, {
    signal: events.signal,
  });
  context.root.addEventListener("pointerdown", reveal, {
    signal: events.signal,
  });
  transport.addEventListener("focusin", reveal, { signal: events.signal });

  function paint(): void {
    const timeline = player.currentSeekProgress();
    const labels = text[haneokaUiLocale(snapshot.settings.uiLanguage, document)];
    const playing = context.state.playing && !context.state.paused;
    const fraction = dragging || committing ? Number(slider.value) : timeline.ratio;
    const ordinal = Math.round(fraction * timeline.maximum);
    const label = `${ordinal} / ${timeline.maximum}`;
    const hidden = snapshot.screen !== "game" || context.state.loading || !context.state.ready;
    const disabled = context.state.loading || timeline.maximum === 0;
    const signature = `${fraction}|${label}|${labels[0]}|${playing}|${context.state.finished}|${hidden}|${disabled}|${dragging}|${committing}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    transport.hidden = hidden;
    play.disabled = disabled || dragging || committing;
    const action = labels[context.state.finished ? 3 : playing ? 2 : 1];
    play.setAttribute("aria-label", action);
    play.title = action;
    if (play.dataset.playing !== String(playing)) {
      play.dataset.playing = String(playing);
      play.replaceChildren(createHaneokaIcon(document, playing ? "pause" : "play"));
    }
    slider.disabled = disabled;
    slider.setAttribute("aria-label", labels[0]);
    slider.setAttribute("aria-valuetext", label);
    if (!dragging && !committing) slider.value = String(fraction);
    transport.style.setProperty("--haneoka-progress", `${fraction * 100}%`);
    position.value = label;
  }
  function update(): void {
    if (disposed) return;
    paint();
    frame = requestAnimationFrame(update);
  }
  reveal();
  update();
  const stopPresentation = player.subscribePresentationObserver?.(paint) ?? (() => {});
  return () => {
    disposed = true;
    events.abort();
    stopPresentation();
    cancelAnimationFrame(frame);
    clearTimeout(hideTimer);
    if (typeof subscription === "function") void subscription();
    else if ("dispose" in subscription) void subscription.dispose();
    else if ("destroy" in subscription) void subscription.destroy();
    else void subscription.close();
    transport.remove();
    delete context.root.dataset.vegaTransportVisible;
  };
}
