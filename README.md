# `@haneoka/vega-theme-haneoka`

`@haneoka/vega-theme-haneoka` supplies the Haneoka presentation layer for Vega:
dialogue, rich text, choices, title and location bars, phone scenes, chart-style
controls, shell typography, and authored frame/still layouts.

The theme is asset-free at the package boundary. It contains CSS, layout rules,
and resource-key resolution; the application supplies licensed images and
release paths through `HANEOKA_THEME_ASSETS` or `HANEOKA_THEME_HOST`.

## Build from a clean Git workspace

The theme depends on unpublished Vega workspace packages. Clone every package
that the theme manifest names and link them locally:

```sh
mkdir haneoka-theme-workspace
cd haneoka-theme-workspace
git clone https://github.com/haneoka-gakuen/vega.git packages/vega
git clone https://github.com/haneoka-gakuen/vega-plugin-richtext.git packages/vega-plugin-richtext
git clone https://github.com/haneoka-gakuen/vega-ui-portable.git packages/vega-ui-portable
git clone https://github.com/haneoka-gakuen/vega-shell-default.git packages/vega-shell-default
git clone https://github.com/haneoka-gakuen/vega-theme-haneoka.git packages/vega-theme-haneoka
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - packages/*
  - packages/vega/packages/*
linkWorkspacePackages: true
```

Install and build in dependency order:

```sh
corepack enable
corepack prepare pnpm@11.14.0 --activate
pnpm install
pnpm --filter @haneoka/vega build:core
pnpm --filter @haneoka/vega-plugin-richtext build
pnpm --filter @haneoka/vega-ui-portable build
pnpm --filter @haneoka/vega-shell-default build
pnpm --filter @haneoka/vega-theme-haneoka check
```

All packages in this workspace require Node 20 or newer.

## Smallest complete composition

Install the portable UI, default shell, and Haneoka theme before creating the
player. The theme's manifest requires the portable rich-text and shell services,
so all three plugins belong in one engine:

```ts
import { VegaEngine } from "@haneoka/vega/engine";
import { VEGA_ADV_OPCODE } from "@haneoka/vega-protocol/opcodes";
import { vegaPortableUiPlugin } from "@haneoka/vega-ui-portable";
import { vegaDefaultShell } from "@haneoka/vega-shell-default";
import { vegaHaneokaTheme } from "@haneoka/vega-theme-haneoka";

const mount = document.querySelector<HTMLElement>("#player");
if (!mount) throw new Error("Add <div id=\"player\"></div> to the page");

const engine = new VegaEngine({
  plugins: [vegaPortableUiPlugin, vegaDefaultShell, vegaHaneokaTheme]
});
const handle = await engine.createPlayer({
  mount,
  story: {
    vegaProject: { id: "hello", title: "Hello", formatVersion: 1 },
    commands: [
      {
        command: VEGA_ADV_OPCODE.Talk,
        targetName: "Guide",
        text: "Welcome to the Haneoka theme.",
        noWait: true
      }
    ]
  },
  shell: { title: "Hello", projectId: "hello", initialScreen: "game" }
});

await handle.player.play();
await handle.dispose();
await engine.dispose();
```

The `vegaProject` object is optional for a one-off `AdvStory`; it gives the
shell a stable project id and title for saves, settings, and flow metadata. The
theme contributes a `theme` named `haneoka`, a dialogue UI-slot replacement, and
Haneoka controls. Vega selects the default theme automatically; pass
`theme: "haneoka"` in `VegaPlayerOptions` when several themes are installed.

## Authorized resource loading

The theme enumerates resources from the story commands that actually use them.
It resolves control images, fonts, phone frames, chat icons, chat backgrounds,
and stamps through the host provider. A provider can expose a release URL map:

```ts
import { createHaneokaThemeAssetsPlugin } from "@haneoka/vega-theme-haneoka";

const assets = createHaneokaThemeAssetsPlugin({
  resolveSourceAsset(path) {
    return `/releases/our-notes/${encodeURIComponent(path)}`;
  },
  assets() {
    return {
      arrow: "/releases/our-notes/ui/arrow.png",
      fullscreen: "/releases/our-notes/ui/fullscreen.png",
      chatWindow: "/releases/our-notes/chat/window.png",
      chatBackground: "/releases/our-notes/chat/background.png"
    };
  },
  resolveChatImage(value, kind) {
    return `/releases/our-notes/chat/${kind}/${encodeURIComponent(value)}.png`;
  }
});

const engine = new VegaEngine({
  plugins: [vegaPortableUiPlugin, vegaDefaultShell, assets, vegaHaneokaTheme]
});
```

`assets()` is called during story resource preparation. `resolveSourceAsset()`
maps Unity-style source paths to the host's authorized release. The provider
does not grant the theme access to a filesystem or a license; the application
controls every returned URL. `HANEOKA_THEME_HOST` adds application-owned
settings and transport controls when the host needs them. Its `snapshot()`,
`subscribe()`, `setVolume()`, `setAutoPlayDelaySeconds()`, `seekProgress()`,
and `toggleFullscreen()` methods are the customization boundary for a shared
host toolbar.

## Lifetime

The theme registers only engine-scoped contributions. Dispose the player handle
to remove its UI slots and abort resource preparation; dispose the engine to
remove the theme, release typography and provider registrations, and dispose
the shell controller. Dispose any application-owned host object supplied to the
theme when the application closes.

## License

The source is available under [MPL-2.0](LICENSE). This package ships no game,
Cubism, Live2D, or Spine assets. The application must preserve the license and
attribution terms for every image, font, model, and release resource it serves.
