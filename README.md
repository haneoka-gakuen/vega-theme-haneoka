# `@haneoka/vega-theme-haneoka`

Asset-free Haneoka-style presentation for Vega, including dialogue, rich text,
choices, title and location bars, phone scenes, and chart-style playback
controls.

```ts
import { VegaEngine } from "@haneoka/vega";
import { vegaDefaultShell } from "@haneoka/vega-shell-default";
import { vegaHaneokaTheme } from "@haneoka/vega-theme-haneoka";
import { vegaPortableUiPlugin } from "@haneoka/vega-ui-portable";

const engine = new VegaEngine({
  officialPlugins: [vegaPortableUiPlugin, vegaDefaultShell, vegaHaneokaTheme],
});
```

Applications may provide licensed presentation resources through CSS custom
properties or `HANEOKA_THEME_HOST.assets()`. The package includes no game,
Cubism, Live2D, or Spine assets.
