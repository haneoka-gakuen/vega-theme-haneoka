import { createHaneokaShellTypography } from "./shellTypography.js";
import { prepareHaneokaFonts } from "./typography.js";
import { chatDefaultDataRoot, chatIconImagePath, isAdvChatIconAssetName, iterateAdvCommands } from "@haneoka/vega";
import {
  ADV_COMMAND,
  STORY_FRAME_LAYOUT_PROVIDER,
  STORY_STILL_PRESENTATION_PROVIDER,
} from "@haneoka/vega/renderer-kit";
import { haneokaFrameLayouts } from "./frameLayouts.js";
import { haneokaStillPresentations } from "./stillPresentations.js";
import {
  defineVegaPlugin,
  type StoryResourceDeclaration,
  type StoryResourcePreparationContext,
} from "@haneoka/vega/plugin";
import { storyRuntime } from "@haneoka/vega/runtime";
import { VEGA_SHELL_CONTROLLER, VEGA_SHELL_TYPOGRAPHY } from "@haneoka/vega/shell";
import { HANEOKA_CONTROLS_ID, mountHaneokaControls } from "./controls.js";
import {
  HANEOKA_THEME_HOST,
  HANEOKA_THEME_ASSETS,
  resolveHaneokaSourceAsset,
  type HaneokaThemeAssetProvider,
  type HaneokaThemeAssets,
} from "./host.js";
import { mountHaneokaStoryUi } from "./story-ui.js";
import { HANEOKA_THEME_CSS } from "./theme.js";
import { HANEOKA_CONTROL_ASSETS } from "./controlAssets.js";
import { HANEOKA_CHAT_DATA_ROOT, HANEOKA_CHAT_ICONS, haneokaChatSkin } from "./chatAssets.js";

export const HANEOKA_THEME_ID = "haneoka";
export { HANEOKA_POST_TEXTURE_ASSETS } from "./postAssets.js";

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

const texture = (source: string | undefined, label: string): StoryResourceDeclaration | null => {
  const value = String(source ?? "").trim();
  return value ? { source: value, kind: "texture", label } : null;
};

const resolveHostSource = resolveHaneokaSourceAsset;

const resolveHostChatImage = (
  host: HaneokaThemeAssetProvider | undefined,
  value: unknown,
  kind: "icon" | "stamp",
): string => {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try {
    return host?.resolveChatImage?.(source, kind) ?? "";
  } catch {
    return "";
  }
};

const resolveThemeChatImage = (
  host: HaneokaThemeAssetProvider | undefined,
  runtime: StoryResourcePreparationContext["runtime"],
  value: unknown,
  kind: "icon" | "stamp",
  activeRoot: string,
): string => {
  const source = String(value ?? "").trim();
  if (!source) return "";
  const hostResolved = resolveHostChatImage(host, source, kind);
  if (hostResolved) return hostResolved;
  if (/^(?:data:|blob:|https?:\/\/|\/)/iu.test(source)) return source;
  if (kind === "icon" && isAdvChatIconAssetName(source)) {
    return resolveHostSource(host, chatIconImagePath(source, runtime) || source);
  }
  const file = source.endsWith(".png") ? source : `${source}.png`;
  const defaultRoot = chatDefaultDataRoot(runtime) || HANEOKA_CHAT_DATA_ROOT;
  const lineRoot = chatLineDataRoot(defaultRoot);
  const path = source.includes("/")
    ? file
    : /^ADVChat/iu.test(source)
      ? `${lineRoot}/${file}`
      : /^(?:Icon|stamp)/iu.test(source)
        ? `${defaultRoot}/${file}`
        : `${activeRoot || defaultRoot}/${file}`;
  return resolveHostSource(host, path);
};

const haneokaThemeResources = (
  host: HaneokaThemeAssetProvider | undefined,
  assets: HaneokaThemeAssets | undefined,
  { story, runtime }: StoryResourcePreparationContext,
  externalControls = false,
): readonly StoryResourceDeclaration[] => {
  const declarations: StoryResourceDeclaration[] = [];
  const add = (entry: StoryResourceDeclaration | null) => {
    if (entry) declarations.push(entry);
  };
  if (!externalControls) {
    for (const source of Object.values(HANEOKA_CONTROL_ASSETS)) {
      add(texture(source, "Haneoka controls"));
    }
  }
  const chatAssets = runtime.chatAssets;
  const rootModes = new Map<string, Set<number>>();
  const chatImages = new Set<string>();
  let usesPhoneUi = false;
  let activeRoot = "";
  let activeMode = 0;
  const noteRootMode = (root: string, mode: number): void => {
    const normalized = root.replace(/\/+$/u, "");
    if (!normalized) return;
    const modes = rootModes.get(normalized) ?? new Set<number>();
    modes.add(mode);
    rootModes.set(normalized, modes);
  };
  for (const command of iterateAdvCommands(story.commands ?? [])) {
    const commandCode = Number(command.command);
    const master = chatAssets?.masters?.[String(command.targetChatID ?? "")];
    const windowAsset = command.chatWindowAssetName || master?.chatWindowAssetName || "";
    const root = chatAssets?.dataRootsByWindowAsset?.[windowAsset] ?? haneokaChatSkin(windowAsset)?.dataRoot;
    const isPhoneCommand = Boolean(
      commandCode === ADV_COMMAND.ChatWindow ||
      commandCode === ADV_COMMAND.ChatTalk ||
      commandCode === ADV_COMMAND.ChatStamp ||
      commandCode === ADV_COMMAND.ChatTyping ||
      command.targetChatID !== undefined ||
      command.chatMemoryId ||
      command.chatWindowAssetName ||
      command.chatIconAssetName ||
      master,
    );
    if (isPhoneCommand) {
      usesPhoneUi = true;
      if (commandCode === ADV_COMMAND.ChatWindow) {
        const parsedMode = Number(command.params?.[1] ?? 0);
        activeMode = Number.isFinite(parsedMode) ? Math.max(0, Math.trunc(parsedMode)) : 0;
        if (root) activeRoot = root;
      }
      noteRootMode(root || activeRoot, activeMode);
      const referencedImages = [
        [command.chatIconAssetName || master?.chatIconAssetName, "icon"],
        [commandCode === ADV_COMMAND.ChatTalk ? command.targetAssetName : undefined, "icon"],
        [commandCode === ADV_COMMAND.ChatStamp ? command.targetAssetName : undefined, "stamp"],
      ] as const;
      for (const [value, kind] of referencedImages) {
        const resolved = resolveThemeChatImage(host, runtime, value, kind, root ?? "");
        if (resolved) chatImages.add(resolved);
      }
    }
  }
  const phoneAssetNames = new Set<keyof HaneokaThemeAssets>([
    "chatWindow",
    "chatBackground",
    "chatBackgroundFallback",
    "chatLock",
    "chatTextBox",
    "chatComposerPlus",
    "chatComposerPhoto",
    "chatComposerPicture",
    "chatComposerSmile",
    "chatComposerMicrophone",
    "chatIcons",
  ]);
  const usedModes = new Set<number>();
  for (const modes of rootModes.values()) {
    for (const mode of modes) usedModes.add(mode);
  }
  if (usesPhoneUi && usedModes.size === 0) usedModes.add(0);
  const phoneAssetRequired = (name: keyof HaneokaThemeAssets): boolean => {
    if (!phoneAssetNames.has(name)) return true;
    if (!usesPhoneUi) return false;
    if (name === "chatWindow") return true;
    if (name === "chatLock") return usedModes.has(2);
    if (name === "chatTextBox") {
      return usedModes.has(0) || usedModes.has(2);
    }
    return usedModes.has(0);
  };
  for (const [name, source] of Object.entries(assets ?? {})) {
    if (typeof source !== "string" || !phoneAssetRequired(name as keyof HaneokaThemeAssets)) {
      continue;
    }
    add(texture(source, `Haneoka ${name}`));
  }
  if (usesPhoneUi) {
    if (usedModes.has(0)) {
      const selectedChatIcons = {
        ...HANEOKA_CHAT_ICONS,
        ...storyRuntime().chatIconSprites,
        ...assets?.chatIcons,
      };
      for (const [name, source] of Object.entries(selectedChatIcons ?? {})) {
        add(texture(source, `Haneoka chat ${name}`));
      }
    }
    const defaultRoot = String(chatAssets?.defaultDataRoot || HANEOKA_CHAT_DATA_ROOT).replace(/\/+$/u, "");
    const lineRoot = chatLineDataRoot(defaultRoot);
    const commonSpritesRoot = chatCommonSpritesRoot(defaultRoot);
    if (rootModes.size === 0) {
      for (const mode of usedModes) noteRootMode(defaultRoot, mode);
    }
    for (const [root, modes] of rootModes) {
      const skin = haneokaChatSkin("", root);
      if (assets?.chatWindow == null) {
        add(texture(resolveHostSource(host, skin?.window ?? `${root}/chatwindow_image.png`), "Haneoka chat window"));
      }
      if (modes.has(0) && assets?.chatBackground == null) {
        add(
          texture(
            resolveHostSource(host, skin ? (skin.background ?? "") : `${root}/back.png`),
            "Haneoka chat background",
          ),
        );
      }
      if (modes.has(2) && assets?.chatLock == null) {
        add(texture(resolveHostSource(host, skin ? (skin.lock ?? "") : `${root}/lock.png`), "Haneoka chat lock"));
      }
    }
    if (usedModes.has(0) && defaultRoot && assets?.chatBackgroundFallback == null) {
      add(texture(resolveHostSource(host, `${defaultRoot}/back.png`), "Haneoka fallback chat background"));
    }
    if ((usedModes.has(0) || usedModes.has(2)) && assets?.chatTextBox == null) {
      add(
        texture(
          resolveHostSource(host, commonSpritesRoot ? `${commonSpritesRoot}/default_text_box.png` : ""),
          "Haneoka chat text box",
        ),
      );
    }
    if (defaultRoot && usedModes.has(0)) {
      for (const [key, file] of [
        ["chatComposerPlus", "ADVChatIconLine_Plus.png"],
        ["chatComposerPhoto", "ADVChatIconLine_Photo.png"],
        ["chatComposerPicture", "ADVChatIconLine_Pic.png"],
        ["chatComposerSmile", "ADVChatIconLine_Smile.png"],
        ["chatComposerMicrophone", "ADVChatIconLine_Mic.png"],
      ] as const) {
        if (assets?.[key] != null) continue;
        add(texture(resolveHostSource(host, `${lineRoot}/${file}`), "Haneoka chat control"));
      }
    }
  }
  for (const source of chatImages) add(texture(source, "Haneoka chat image"));
  return declarations;
};

export const vegaHaneokaTheme = defineVegaPlugin({
  manifest: {
    id: "haneoka.theme",
    name: "Haneoka Theme",
    version: "0.1.0",
    apiVersion: 1,
    description: "Haneoka game presentation and controls for Vega",
    capabilities: ["theme", "ui-slot"],
    dependencies: {
      "haneoka.vega-portable-ui": "^0.1.0",
      "haneoka.vega-richtext": "^0.1.0",
      "haneoka.vega-shell-default": "^0.1.0",
    },
  },
  setup(context) {
    context.provide(STORY_FRAME_LAYOUT_PROVIDER, haneokaFrameLayouts);
    context.provide(STORY_STILL_PRESENTATION_PROVIDER, haneokaStillPresentations);
    context.provide(VEGA_SHELL_TYPOGRAPHY, {
      create: createHaneokaShellTypography,
    });
    const themeHost = () => context.service(HANEOKA_THEME_HOST);
    context.contribute("theme", {
      id: HANEOKA_THEME_ID,
      name: "Haneoka",
      default: true,
      tokens: {
        surface: "#f8f9ff",
        text: "#282c63",
        muted: "#6e7395",
        accent: "#6c70d8",
        accentSecondary: "#ef8aa7",
      },
      cssText: HANEOKA_THEME_CSS,
      prepareStoryResources: prepareHaneokaFonts,
      enumerateStoryResources(preparation) {
        const legacyHost = themeHost();
        const host = context.service(HANEOKA_THEME_ASSETS) ?? legacyHost;
        let assets: HaneokaThemeAssets | undefined;
        try {
          assets = host?.assets?.();
        } catch {
          assets = undefined;
        }
        return haneokaThemeResources(host, assets, preparation, Boolean(legacyHost?.externalPlaybackControls));
      },
    });
    context.contribute(
      "ui-slot",
      {
        id: "haneoka-story-ui",
        name: "Haneoka story UI",
        slot: "dialogue",
        replace: true,
        mount: mountHaneokaStoryUi,
      },
      {
        priority: 100,
        override: "haneoka.vega-portable-ui:portable-story-ui",
        singletonPort: "vega.story-ui",
      },
    );
    context.contribute(
      "ui-slot",
      {
        id: HANEOKA_CONTROLS_ID,
        name: "Haneoka game controls",
        slot: "controls",
        replace: true,
        requiredServices: [VEGA_SHELL_CONTROLLER],
        mount: mountHaneokaControls,
      },
      {
        priority: 100,
        override: "haneoka.vega-shell-default:default-toolbar",
        singletonPort: "vega.game-controls",
      },
    );
  },
});

export { HANEOKA_CONTROLS_ID, HANEOKA_THEME_CSS, mountHaneokaControls, mountHaneokaStoryUi };
export {
  createHaneokaThemeHostPlugin,
  createHaneokaThemeAssetsPlugin,
  HANEOKA_THEME_ASSETS,
  type HaneokaThemeAssetProvider,
  HANEOKA_THEME_HOST,
  type HaneokaThemeAssets,
  type HaneokaThemeHost,
  type HaneokaThemeHostSnapshot,
} from "./host.js";
export default vegaHaneokaTheme;
