import {
  defineVegaPlugin,
  defineVegaService,
  type VegaDisposable,
  type VegaPlugin,
} from "@haneoka/vega/plugin";
import type { StoryChatIconSprites } from "@haneoka/vega/runtime";

export interface HaneokaThemeAssets {
  readonly arrow?: string;
  readonly auto?: string;
  /** Optional host-owned phone frame and conversation background. */
  readonly chatWindow?: string;
  readonly chatBackground?: string;
  readonly chatLock?: string;
  readonly chatComposerPlus?: string;
  readonly chatComposerPhoto?: string;
  readonly chatComposerPicture?: string;
  readonly chatComposerSmile?: string;
  readonly chatComposerMicrophone?: string;
  /**
   * Host-resolved common phone chrome for the active story release.
   * This takes precedence over the process-wide runtime fallback.
   */
  readonly chatIcons?: Readonly<StoryChatIconSprites>;
  readonly fast?: string;
  readonly frame?: string;
  readonly fullscreen?: string;
  readonly subtitles?: string;
}

export interface HaneokaThemeHostSnapshot {
  readonly autoAdvance: boolean;
  readonly autoAdvanceDisabled: boolean;
  readonly instantText: boolean;
  readonly subtitlesEnabled: boolean;
  readonly videoVisible: boolean;
  readonly fullscreen: boolean;
  readonly bgmEnabled: boolean;
  readonly volume: number;
  readonly bgmVolume: number;
  readonly autoPlayDelaySeconds: number;
  readonly maximumAutoPlayDelaySeconds: number;
  readonly textSize: number;
  readonly progress: number;
  readonly progressEnabled: boolean;
  readonly progressLabel?: string;
}

export interface HaneokaThemeHost {
  readonly labels?: Readonly<Record<string, string>>;
  /**
   * The application renders its own transport using its shared playback
   * component. The theme still replaces Vega's default toolbar, but does not
   * mount a second transport.
   */
  readonly externalPlaybackControls?: boolean;
  assets?(): HaneokaThemeAssets;
  /**
   * Resolves a scenario-owned chat icon or stamp without coupling this public
   * plugin to one game's asset namespace.
   */
  resolveChatImage?(value: string, kind: "icon" | "stamp"): string;
  /**
   * Resolves one canonical source-asset path inside the host's active release.
   * The public theme only carries path metadata and never bundles those files.
   */
  resolveSourceAsset?(path: string): string;
  snapshot(): HaneokaThemeHostSnapshot;
  subscribe(
    listener: (snapshot: HaneokaThemeHostSnapshot) => void,
  ): VegaDisposable;
  toggleAutoAdvance(): void;
  setInstantText(value: boolean): void;
  setSubtitlesEnabled(value: boolean): void;
  setBgmEnabled(value: boolean): void;
  setVolume(value: number): void;
  setBgmVolume(value: number): void;
  setAutoPlayDelaySeconds(value: number): void;
  setTextSize(value: number): void;
  seekProgress(value: number): void;
  skipCurrentVideo(): void;
  toggleFullscreen(): void | Promise<void>;
  rotateLeft?(): void;
  rotateRight?(): void;
  openTextView?(): void;
}

/**
 * Optional host adapter for licensed images and application-owned settings.
 * The public theme remains fully functional when this service is absent.
 */
export const HANEOKA_THEME_HOST = defineVegaService<HaneokaThemeHost>(
  "haneoka.theme-host.v1",
);

export const createHaneokaThemeHostPlugin = (
  host: HaneokaThemeHost,
): VegaPlugin =>
  defineVegaPlugin({
    manifest: {
      id: "haneoka.theme-host",
      name: "Haneoka Theme Host",
      version: "0.1.0",
      apiVersion: 1,
      description:
        "Application ports for licensed assets and Haneoka theme settings",
    },
    setup(context) {
      context.provide(HANEOKA_THEME_HOST, host);
    },
  });
