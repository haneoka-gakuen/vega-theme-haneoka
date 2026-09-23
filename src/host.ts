import { defineVegaPlugin, defineVegaService, type VegaDisposable, type VegaPlugin } from "@haneoka/vega/plugin";
import type { StoryChatIconSprites } from "@haneoka/vega/runtime";
import { bundledHaneokaChatSource } from "./chatAssets.js";

export interface HaneokaThemeAssets {
  readonly arrow?: string;
  readonly auto?: string;
  /** Optional host-owned phone frame and conversation background. */
  readonly chatWindow?: string;
  readonly chatBackground?: string;
  readonly chatBackgroundFallback?: string;
  readonly chatLock?: string;
  readonly chatTextBox?: string;
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
  readonly skip?: string;
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

export interface HaneokaThemeAssetProvider {
  assets?(): HaneokaThemeAssets;
  resolveChatImage?(value: string, kind: "icon" | "stamp"): string;
  resolveSourceAsset?(path: string): string;
}

export const HANEOKA_THEME_ASSETS = defineVegaService<HaneokaThemeAssetProvider>("haneoka.theme-assets.v1");

export const resolveHaneokaSourceAsset = (provider: HaneokaThemeAssetProvider | undefined, path: string): string => {
  if (!path) return "";
  try {
    const resolved = provider?.resolveSourceAsset?.(path);
    if (resolved) return resolved;
  } catch {
    /* Use the bundled theme resource when no host resource resolves. */
  }
  return bundledHaneokaChatSource(path);
};

export const createHaneokaThemeAssetsPlugin = (provider: HaneokaThemeAssetProvider): VegaPlugin =>
  defineVegaPlugin({
    manifest: {
      id: "haneoka.theme-assets",
      name: "Haneoka Theme Assets",
      version: "0.1.0",
      apiVersion: 1,
    },
    setup(context) {
      context.provide(HANEOKA_THEME_ASSETS, provider);
    },
  });

export interface HaneokaThemeHost extends HaneokaThemeAssetProvider {
  readonly labels?: Readonly<Record<string, string>>;
  /**
   * The application renders its own transport using its shared playback
   * component. The theme still replaces Vega's default toolbar, but does not
   * mount a second transport.
   */
  readonly externalPlaybackControls?: boolean;
  snapshot(): HaneokaThemeHostSnapshot;
  subscribe(listener: (snapshot: HaneokaThemeHostSnapshot) => void): VegaDisposable;
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
export const HANEOKA_THEME_HOST = defineVegaService<HaneokaThemeHost>("haneoka.theme-host.v1");

export const createHaneokaThemeHostPlugin = (host: HaneokaThemeHost): VegaPlugin =>
  defineVegaPlugin({
    manifest: {
      id: "haneoka.theme-host",
      name: "Haneoka Theme Host",
      version: "0.1.0",
      apiVersion: 1,
      description: "Application ports for licensed assets and Haneoka theme settings",
    },
    setup(context) {
      context.provide(HANEOKA_THEME_HOST, host);
    },
  });
