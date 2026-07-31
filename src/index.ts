import { defineVegaPlugin } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { HANEOKA_CONTROLS_ID, mountHaneokaControls } from "./controls.js";
import { mountHaneokaStoryUi } from "./story-ui.js";
import { HANEOKA_THEME_CSS } from "./theme.js";

export const HANEOKA_THEME_ID = "haneoka";

export const vegaHaneokaTheme = defineVegaPlugin({
  manifest: {
    id: "haneoka.theme",
    name: "Haneoka Theme",
    version: "0.1.0",
    apiVersion: 1,
    description:
      "Asset-free original-style game presentation and controls for Vega",
    capabilities: ["theme", "ui-slot"],
    dependencies: {
      "haneoka.vega-portable-ui": "^0.1.0",
      "haneoka.vega-richtext": "^0.1.0",
      "haneoka.vega-shell-default": "^0.1.0",
    },
  },
  setup(context) {
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

export {
  HANEOKA_CONTROLS_ID,
  HANEOKA_THEME_CSS,
  mountHaneokaControls,
  mountHaneokaStoryUi,
};
export {
  createHaneokaThemeHostPlugin,
  HANEOKA_THEME_HOST,
  type HaneokaThemeAssets,
  type HaneokaThemeHost,
  type HaneokaThemeHostSnapshot,
} from "./host.js";
export default vegaHaneokaTheme;
