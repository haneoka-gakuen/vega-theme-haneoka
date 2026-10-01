import type { VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { createHaneokaIcon } from "./icons.js";
import { haneokaUiLocale, HANEOKA_PROGRESS_TEXT as text } from "./locale.js";

export interface HaneokaProgressControl {
  readonly visible: boolean;
  setVisible(visible: boolean): void;
  dispose(): void;
}

export function mountHaneokaProgress(host: HTMLElement, context: VegaUiSlotContext): HaneokaProgressControl {
  const shell = context.services(VEGA_SHELL_CONTROLLER)!;
  const player = context.player;
  const document = host.ownerDocument;
  const view = document.defaultView;
  const events = new AbortController();
  const transport = document.createElement("div");
  transport.className = "haneoka-progress";
  transport.hidden = true;
  transport.dataset.vegaUiSlot = "controls";
  const play = document.createElement("button");
  play.type = "button";
  Object.assign(play.style, { width: "44px", height: "44px", flexBasis: "44px" });
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "1";
  slider.step = "any";
  slider.style.height = "44px";
  const position = document.createElement("output");
  const status = document.createElement("span");
  status.className = "haneoka-progress__status";
  status.setAttribute("role", "status");
  transport.append(play, slider, position, status);
  // The footer belongs to the whole player, outside the letterboxed controls
  // slot. Reserve its measured height in the renderer's stage host.
  context.root.append(transport);
  const stage = context.root.querySelector<HTMLElement>("[data-vega-stage-host]");
  const previousBottom = stage?.style.getPropertyValue("bottom") ?? "";
  const previousBottomPriority = stage?.style.getPropertyPriority("bottom") ?? "";
  let disposed = false;
  let enabled = true;
  let dragging = false;
  let committing = false;
  let resumeAfterDrag = false;
  let pausedBeforeDrag = false;
  let revision = 0;
  let interaction = 0;
  let frame = 0;
  let lastSignature = "";
  let snapshot = shell.snapshot();
  const subscription = shell.subscribe((next) => {
    snapshot = next;
  });

  function reserveSpace(): void {
    if (disposed) return;
    const visible = !transport.hidden;
    const height = visible ? transport.getBoundingClientRect().height : 0;
    if (stage) {
      if (visible) stage.style.setProperty("bottom", `${height}px`);
      else if (previousBottom) stage.style.setProperty("bottom", previousBottom, previousBottomPriority);
      else stage.style.removeProperty("bottom");
    }
    if (visible) context.root.dataset.vegaTransportVisible = "true";
    else delete context.root.dataset.vegaTransportVisible;
  }
  const observer = view?.ResizeObserver ? new view.ResizeObserver(reserveSpace) : undefined;
  observer?.observe(transport);

  function begin(): void {
    if (dragging || disposed) return;
    interaction += 1;
    if (!committing) {
      resumeAfterDrag = context.state.playing && !context.state.paused;
      pausedBeforeDrag = context.state.paused;
    }
    committing = false;
    dragging = true;
    player.pause();
    status.textContent = "";
  }

  async function seek(): Promise<boolean> {
    const requested = ++revision;
    try {
      const target = player.resolveSeekRatio(Number(slider.value));
      await player.seekTo(target, { resume: false });
      return !disposed && requested === revision;
    } catch (error) {
      if (!disposed && requested === revision) {
        report(error);
        resumeAfterDrag = false;
      }
      return false;
    }
  }

  async function finish(): Promise<void> {
    if (!dragging || committing || disposed) return;
    dragging = false;
    committing = true;
    const currentInteraction = interaction;
    const succeeded = await seek();
    if (disposed || interaction !== currentInteraction) return;
    committing = false;
    if (succeeded && shell.snapshot().screen === "game") {
      if (!pausedBeforeDrag) player.resume();
      if (resumeAfterDrag) void player.play().catch(report);
    }
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
  slider.addEventListener("change", () => void finish(), { signal: events.signal });
  slider.addEventListener("blur", () => void finish(), { signal: events.signal });
  document.addEventListener("pointerup", () => void finish(), { signal: events.signal });
  document.addEventListener("pointercancel", () => void finish(), { signal: events.signal });
  play.addEventListener(
    "click",
    () => {
      if (context.state.finished) void shell.start().catch(report);
      else if (context.state.playing && !context.state.paused) player.pause();
      else {
        player.resume();
        void player.play().catch(report);
      }
    },
    { signal: events.signal },
  );

  function paint(): void {
    const timeline = player.currentSeekProgress();
    const labels = text[haneokaUiLocale(snapshot.settings.uiLanguage, document)];
    const playing = context.state.playing && !context.state.paused;
    const fraction = dragging || committing ? Number(slider.value) : timeline.ratio;
    const ordinal = Math.round(fraction * timeline.maximum);
    const label = `${ordinal} / ${timeline.maximum}`;
    const hidden = !enabled || snapshot.screen !== "game" || context.state.loading || !context.state.ready;
    const disabled = context.state.loading || timeline.maximum === 0;
    const signature = `${fraction}|${label}|${labels[0]}|${playing}|${context.state.finished}|${hidden}|${disabled}|${dragging}|${committing}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    const visibilityChanged = transport.hidden !== hidden;
    transport.hidden = hidden;
    transport.inert = hidden;
    if (hidden) delete transport.dataset.visible;
    else transport.dataset.visible = "true";
    if (visibilityChanged) reserveSpace();
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
    if (disposed || context.signal.aborted) return;
    paint();
    frame = view?.requestAnimationFrame(update) ?? 0;
  }
  update();
  const stopPresentation = player.subscribePresentationObserver?.(paint) ?? (() => {});
  return {
    get visible() {
      return enabled && !transport.hidden;
    },
    setVisible(visible: boolean) {
      enabled = visible;
      paint();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      revision += 1;
      interaction += 1;
      events.abort();
      stopPresentation();
      observer?.disconnect();
      view?.cancelAnimationFrame(frame);
      if (typeof subscription === "function") void subscription();
      else if ("dispose" in subscription) void subscription.dispose();
      else if ("destroy" in subscription) void subscription.destroy();
      else void subscription.close();
      transport.remove();
      if (stage) {
        if (previousBottom) stage.style.setProperty("bottom", previousBottom, previousBottomPriority);
        else stage.style.removeProperty("bottom");
      }
      delete context.root.dataset.vegaTransportVisible;
    },
  };
}
