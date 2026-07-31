import type { VegaDisposable, VegaUiSlotContext } from "@haneoka/vega/plugin";
import {
  VEGA_SHELL_CONTROLLER,
  type VegaShellSnapshot,
} from "@haneoka/vega/shell";
import {
  HANEOKA_THEME_HOST,
  type HaneokaThemeHost,
  type HaneokaThemeHostSnapshot,
} from "./host.js";
import { createHaneokaIcon } from "./icons.js";

export const HANEOKA_CONTROLS_ID = "haneoka-controls";

let controlsSequence = 0;

/**
 * Haneoka is an archive story viewer, not a save-based visual novel shell.
 * Its persistent transport deliberately mirrors the chart player: one
 * play/pause action and one seekable timeline, with no game menu utilities.
 */
export const mountHaneokaControls = (
  host: HTMLElement,
  context: VegaUiSlotContext,
): VegaDisposable => {
  const shell = context.services(VEGA_SHELL_CONTROLLER);
  if (!shell) {
    throw new ReferenceError(
      "The Haneoka theme controls require VEGA_SHELL_CONTROLLER",
    );
  }
  const themeHost = context.services(HANEOKA_THEME_HOST);
  if (themeHost?.externalPlaybackControls) {
    return { dispose() {} };
  }
  const document = host.ownerDocument;
  const listeners = new AbortController();
  const controlsId = `haneoka-controls-${++controlsSequence}`;

  const root = document.createElement("nav");
  root.className =
    "haneoka-controls md3-runtime-surface md3-runtime-surface--dock";
  root.id = controlsId;
  root.setAttribute(
    "aria-label",
    themeHost ? label(themeHost, "playback", "Playback") : "Playback",
  );

  const play = document.createElement("button");
  play.type = "button";
  play.className =
    "haneoka-controls__button md3-icon-button md3-icon-button--runtime is-emphasis";
  play.dataset.action = "play";

  const playIcon = document.createElement("span");
  playIcon.className = "haneoka-controls__icon md3-icon-button__icon";
  playIcon.setAttribute("aria-hidden", "true");
  const playLabel = document.createElement("span");
  playLabel.className = "haneoka-controls__label";
  play.append(playIcon, playLabel);

  const timeline = document.createElement("label");
  timeline.className =
    "haneoka-controls__timeline md3-timeline md3-timeline--runtime";
  const timelineName = document.createElement("span");
  timelineName.className = "haneoka-controls__timeline-name";
  timelineName.textContent = themeHost
    ? label(themeHost, "seek", "Seek")
    : "Seek";
  const currentLabel = document.createElement("span");
  currentLabel.className = "haneoka-controls__progress-label";
  const progress = range(document, 0, 1, 0.001);
  progress.className = "haneoka-controls__progress md3-timeline__input";
  progress.setAttribute("aria-label", timelineName.textContent);
  const durationLabel = document.createElement("span");
  durationLabel.className = "haneoka-controls__progress-label";
  timeline.append(timelineName, currentLabel, progress, durationLabel);

  const status = document.createElement("p");
  status.className = "haneoka-controls__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  root.append(play, timeline, status);
  host.append(root);
  context.root.classList.add("haneoka-theme-controls-active");
  context.root.dataset.haneokaControls = "true";

  let latest = shell.snapshot();
  let latestHost = themeHost?.snapshot();
  let localSeekValue: number | undefined;
  let disposed = false;

  const paintProgress = (value: number, valueText?: string): void => {
    progress.value = String(value);
    progress.setAttribute("aria-valuetext", valueText ?? String(value));
    timeline.style.setProperty(
      "--haneoka-controls-progress",
      `${value * 100}%`,
    );
  };

  const paintPlayback = (
    shellSnapshot: VegaShellSnapshot,
    hostSnapshot: HaneokaThemeHostSnapshot | undefined,
  ): void => {
    const playing = hostSnapshot?.autoAdvance ?? shellSnapshot.autoPlay;
    const actionLabel = themeHost
      ? playing
        ? label(themeHost, "pause", "Pause")
        : label(themeHost, "play", "Play")
      : playing
        ? "Pause"
        : "Play";
    play.setAttribute("aria-label", actionLabel);
    play.title = actionLabel;
    playLabel.textContent = actionLabel;
    playIcon.replaceChildren(
      createHaneokaIcon(document, playing ? "pause" : "play"),
    );
    play.disabled = hostSnapshot?.autoAdvanceDisabled ?? false;
  };

  const render = (snapshot = latest): void => {
    latest = snapshot;
    latestHost = themeHost?.snapshot() ?? latestHost;
    root.hidden = snapshot.screen !== "game";
    paintPlayback(snapshot, latestHost);

    timeline.hidden = !latestHost;
    if (!latestHost) return;
    const value = clampProgress(latestHost.progress);
    progress.disabled = !latestHost.progressEnabled;
    timeline.classList.toggle("is-disabled", !latestHost.progressEnabled);
    const labels = splitProgressLabel(latestHost.progressLabel);
    currentLabel.textContent = labels.current;
    durationLabel.textContent = labels.duration;
    if (!latestHost.progressEnabled) localSeekValue = undefined;
    if (localSeekValue === undefined) {
      paintProgress(value, latestHost.progressLabel);
    }
  };

  play.addEventListener(
    "click",
    () => {
      if (themeHost) themeHost.toggleAutoAdvance();
      else shell.toggleAuto();
    },
    { signal: listeners.signal },
  );

  progress.addEventListener(
    "input",
    () => {
      localSeekValue = clampProgress(Number(progress.value));
      paintProgress(localSeekValue);
    },
    { signal: listeners.signal },
  );
  const commitSeek = (): void => {
    if (!themeHost || progress.disabled) {
      localSeekValue = undefined;
      return;
    }
    const value = localSeekValue ?? clampProgress(Number(progress.value));
    try {
      themeHost.seekProgress(value);
    } finally {
      localSeekValue = undefined;
    }
  };
  const cancelSeek = (): void => {
    if (localSeekValue === undefined) return;
    localSeekValue = undefined;
    if (latestHost) {
      paintProgress(
        clampProgress(latestHost.progress),
        latestHost.progressLabel,
      );
    }
  };
  progress.addEventListener("change", commitSeek, {
    signal: listeners.signal,
  });
  progress.addEventListener("pointercancel", cancelSeek, {
    signal: listeners.signal,
  });
  progress.addEventListener(
    "blur",
    () => {
      if (localSeekValue !== undefined) commitSeek();
    },
    { signal: listeners.signal },
  );

  const onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || latest.screen !== "game") return;
    if (isEditingTarget(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  document.addEventListener("keydown", onDocumentKeyDown, {
    capture: true,
    signal: listeners.signal,
  });

  const subscription = shell.subscribe(render);
  const hostSubscription = themeHost?.subscribe((snapshot) => {
    latestHost = snapshot;
    render();
  });
  render();

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    listeners.abort();
    release(subscription);
    if (hostSubscription) release(hostSubscription);
    context.signal.removeEventListener("abort", dispose);
    context.root.classList.remove("haneoka-theme-controls-active");
    delete context.root.dataset.haneokaControls;
    root.remove();
  }

  if (context.signal.aborted) dispose();
  else context.signal.addEventListener("abort", dispose, { once: true });

  return { dispose };
};

const splitProgressLabel = (
  value: string | undefined,
): { current: string; duration: string } => {
  const match = /^\s*(.*?)\s*\/\s*(.*?)\s*$/.exec(value ?? "");
  if (!match) return { current: "", duration: value?.trim() ?? "" };
  return {
    current: match[1]?.trim() ?? "",
    duration: match[2]?.trim() ?? "",
  };
};

const range = (
  document: Document,
  minimum: number,
  maximum: number,
  step: number,
): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(minimum);
  input.max = String(maximum);
  input.step = String(step);
  return input;
};

const clampProgress = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

const label = (host: HaneokaThemeHost, key: string, fallback: string): string =>
  host.labels?.[key] || fallback;

const release = (
  disposable: VegaDisposable | (() => void) | undefined,
): void => {
  if (!disposable) return;
  if (typeof disposable === "function") void disposable();
  else if ("dispose" in disposable) void disposable.dispose();
  else if ("destroy" in disposable) void disposable.destroy();
  else void disposable.close();
};

const isEditingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"]',
    ),
  );
};
