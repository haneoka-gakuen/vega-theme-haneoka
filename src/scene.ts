import { HANEOKA_UI_SCENES, HANEOKA_UI_SPRITES } from "./uiAssets.js";

type Pair = readonly [number, number];
interface SceneText {
  value: string;
  size: number;
  autoSize?: boolean;
  minSize?: number;
  maxSize?: number;
  style: number;
  color: readonly number[];
  characterSpacing: number;
  lineSpacing: number;
  horizontal: number;
  vertical: number;
  font: string;
  material: string;
}
interface SceneNode {
  name: string;
  active: boolean;
  rect: readonly [Pair, Pair, Pair, Pair, Pair];
  scale: Pair;
  rotation?: number;
  opacity?: number;
  children: readonly SceneNode[];
  image?: {
    asset: string;
    color: readonly number[];
    mode: number;
    preserveAspect?: boolean;
    fillCenter?: boolean;
    border: readonly number[];
    size: Pair;
  };
  text?: SceneText;
  gradient?: { angle: number; keys: Record<string, unknown> };
  layout?: {
    axis: "x" | "y";
    padding: readonly number[];
    spacing: number;
    alignment: number;
    controlWidth: boolean;
    controlHeight: boolean;
  };
  fit?: Pair;
  ignoreLayout?: boolean;
}
export type HaneokaSceneData = Readonly<Record<string, readonly SceneNode[]>>;
export interface HaneokaScene {
  readonly root: HTMLElement;
  readonly elements: ReadonlyMap<string, HTMLElement>;
  get(path: string): HTMLElement;
  all(name: string): readonly HTMLElement[];
  instantiate(path: string): HaneokaScene;
  dispose(): void;
}
const pixel = (n: number): string => `${n / 10.8}cqh`;
const color = (c: readonly number[]): string =>
  `rgba(${c
    .slice(0, 3)
    .map((v) => v * 255)
    .join(",")},${c[3] ?? 1})`;
const cache = new WeakMap<Document, Promise<HaneokaSceneData>>();
export async function loadHaneokaScenes(document: Document): Promise<HaneokaSceneData> {
  let promise = cache.get(document);
  if (!promise) {
    promise = fetch(HANEOKA_UI_SCENES)
      .then((response) => {
        if (!response.ok) throw new Error(`UI resource failed: ${response.status}`);
        return response.json() as Promise<HaneokaSceneData>;
      })
      .catch((error) => {
        cache.delete(document);
        throw error;
      });
    cache.set(document, promise);
  }
  return promise;
}
function gradient(value: NonNullable<SceneNode["gradient"]>): string {
  const keys = value.keys;
  const colors = Array.from({ length: Number(keys.m_NumColorKeys) }, (_, i) => ({
    time: Number(keys[`ctime${i}`]) / 65535,
    color: keys[`key${i}`] as Record<string, number>,
  }));
  const alphas = Array.from({ length: Number(keys.m_NumAlphaKeys) }, (_, i) => ({
    time: Number(keys[`atime${i}`]) / 65535,
    alpha: (keys[`key${i}`] as Record<string, number>).a!,
  }));
  const times = [...new Set([...colors, ...alphas].map((k) => k.time))].sort((a, b) => a - b);
  const interpolate = <T extends { time: number }>(
    list: readonly T[],
    time: number,
    read: (key: T) => number,
  ): number => {
    const next = list.findIndex((k) => k.time >= time);
    if (next <= 0) return read(next === 0 ? list[0]! : list[list.length - 1]!);
    const a = list[next - 1]!,
      b = list[next]!,
      p = (time - a.time) / (b.time - a.time);
    return read(a) + (read(b) - read(a)) * p;
  };
  return `linear-gradient(${90 - value.angle}deg,${times.map((time) => `${color([...["r", "g", "b"].map((key) => interpolate(colors, time, (k) => k.color[key]!)), interpolate(alphas, time, (k) => k.alpha)])} ${time * 100}%`).join(",")})`;
}
const tinted = new Map<string, Promise<string>>();
function spriteUrl(document: Document, image: NonNullable<SceneNode["image"]>): Promise<string> {
  const url = HANEOKA_UI_SPRITES[image.asset];
  if (!url) return Promise.reject(new Error(`Unknown UI sprite: ${image.asset}`));
  if (image.color.slice(0, 3).every((c) => Math.abs(c - 1) < 0.00001)) return Promise.resolve(url);
  const key = JSON.stringify([url, image.color.slice(0, 3)]);
  let promise = tinted.get(key);
  if (promise) return promise;
  promise = new Promise<string>((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");
        context.drawImage(img, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < pixels.data.length; i += 4)
          for (let c = 0; c < 3; c++) pixels.data[i + c] = Math.round(pixels.data[i + c]! * image.color[c]!);
        context.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error(`Unable to load UI sprite: ${image.asset}`));
    img.src = url;
  }).catch((error) => {
    tinted.delete(key);
    throw error;
  });
  tinted.set(key, promise);
  return promise;
}
export function createHaneokaScene(document: Document, data: HaneokaSceneData, name: string): HaneokaScene {
  const definition = data[name];
  if (!definition) throw new Error(`Unknown UI scene: ${name}`);
  const root = document.createElement("div");
  root.className = "haneoka-scene";
  root.dataset.scene = name;
  root.style.cssText = "position:absolute;inset:0;pointer-events:none";
  const elements = new Map<string, HTMLElement>();
  const definitions = new Map<string, SceneNode>();
  let disposed = false;
  const build = (definition: SceneNode, parent: HTMLElement, path: string, parentDefinition?: SceneNode): void => {
    const element = document.createElement("div");
    element.className = "haneoka-scene-node";
    element.dataset.node = definition.name;
    element.hidden = !definition.active;
    elements.set(path, element);
    definitions.set(path, definition);
    parent.append(element);
    const [min, max, pos, size, pivot] = definition.rect;
    const style = element.style;
    style.position = "absolute";
    style.boxSizing = "border-box";
    if (definition.opacity !== undefined) style.opacity = String(definition.opacity);
    style.width = max[0] === min[0] ? pixel(size[0]) : `calc(${(max[0] - min[0]) * 100}% + ${pixel(size[0])})`;
    style.height = max[1] === min[1] ? pixel(size[1]) : `calc(${(max[1] - min[1]) * 100}% + ${pixel(size[1])})`;
    style.left = `calc(${(min[0] + (max[0] - min[0]) * pivot[0]) * 100}% + ${pixel(pos[0])})`;
    style.top = `calc(${(1 - min[1] - (max[1] - min[1]) * pivot[1]) * 100}% - ${pixel(pos[1])})`;
    style.transform = `translate(${-pivot[0] * 100}%,${-(1 - pivot[1]) * 100}%) rotate(${-Number(definition.rotation || 0)}deg) scale(${definition.scale[0]},${definition.scale[1]})`;
    style.transformOrigin = `${pivot[0] * 100}% ${(1 - pivot[1]) * 100}%`;
    if (parentDefinition?.layout && !definition.ignoreLayout) {
      style.position = "relative";
      style.left = "auto";
      style.top = "auto";
      style.transform = "none";
      style.flexShrink = "0";
      if (parentDefinition.layout.controlWidth) {
        style.width = "max-content";
        element.dataset.textAuto = "true";
      }
      if (parentDefinition.layout.controlHeight) style.height = "max-content";
    }
    if (definition.fit?.[0] === 2) {
      style.width = "max-content";
      element.dataset.textAuto = "true";
    }
    if (definition.fit?.[1] === 2) style.height = "max-content";
    if (definition.layout) {
      const layout = definition.layout;
      style.display = "flex";
      style.flexDirection = layout.axis === "x" ? "row" : "column";
      style.gap = pixel(layout.spacing);
      style.padding = layout.padding.map(pixel).join(" ");
      const horizontal = ["flex-start", "center", "flex-end"][layout.alignment % 3]!,
        vertical = ["flex-start", "center", "flex-end"][Math.floor(layout.alignment / 3)]!;
      style.alignItems = layout.axis === "x" ? vertical : horizontal;
      style.justifyContent = layout.axis === "x" ? horizontal : vertical;
    }
    if (definition.image) {
      const image = definition.image;
      style.opacity = String(image.color[3]);
      void spriteUrl(document, image)
        .then((url) => {
          if (disposed || definition.gradient) return;
          if (image.mode === 1 && image.border.some((n) => n > 0)) {
            style.borderStyle = "solid";
            style.borderColor = "transparent";
            style.borderWidth = image.border.map(pixel).join(" ");
            style.borderImageSource = `url(${JSON.stringify(url)})`;
            style.borderImageSlice = `${image.border.join(" ")}${image.fillCenter === false ? "" : " fill"}`;
            style.borderImageWidth = "1";
          } else {
            style.backgroundImage = `url(${JSON.stringify(url)})`;
            style.backgroundSize = image.preserveAspect ? "contain" : "100% 100%";
            style.backgroundPosition = "center";
            style.backgroundRepeat = "no-repeat";
          }
        })
        .catch((error) => {
          element.dataset.resourceError = String(error);
        });
    }
    if (definition.gradient) {
      style.backgroundImage = gradient(definition.gradient);
      style.opacity = "1";
    }
    if (definition.text) {
      const text = definition.text;
      element.dataset.textProfile = JSON.stringify(text);
      style.fontSize =
        definition.name === "TalkText" || definition.name === "UIRubtEmojiText"
          ? `calc(${pixel(text.size)} * var(--vega-text-size, 1) * var(--vega-dialogue-font-scale, 1))`
          : pixel(text.size);
      style.fontWeight = text.style & 1 ? "700" : "400";
      style.fontStyle = text.style & 2 ? "italic" : "normal";
      style.color = color(text.color);
      style.textAlign = text.horizontal === 2 ? "center" : text.horizontal === 4 ? "right" : "left";
      style.whiteSpace = "pre-wrap";
      style.display = "flex";
      style.flexDirection = "column";
      style.justifyContent = text.vertical === 512 ? "center" : text.vertical === 1024 ? "flex-end" : "flex-start";
      style.lineHeight = "normal";
      element.textContent = text.value;
    }
    for (const child of definition.children) build(child, element, `${path}/${child.name}`, definition);
  };
  for (const node of definition) build(node, root, node.name);
  return {
    root,
    elements,
    get(path) {
      const exact = elements.get(path);
      if (exact) return exact;
      const found = [...elements].filter(([key]) => key.endsWith("/" + path));
      if (found.length !== 1) throw new Error(`UI element is not unique: ${name}/${path}`);
      return found[0]![1];
    },
    all(name) {
      return [...elements.values()].filter((el) => el.dataset.node === name);
    },
    instantiate(path) {
      const node = definitions.get(path) ?? [...definitions].find(([key]) => key.endsWith("/" + path))?.[1];
      if (!node) throw new Error(`UI template is unavailable: ${path}`);
      const instance = createHaneokaScene(document, { [node.name]: [{ ...node, active: true }] }, node.name);
      instance.root.style.cssText = `position:relative;flex-shrink:0;width:${pixel(node.rect[3][0])};height:${pixel(node.rect[3][1])};pointer-events:none`;
      const child = instance.get(node.name);
      Object.assign(child.style, {
        inset: "0",
        width: "100%",
        height: "100%",
        transform: "none",
      });
      return instance;
    },
    dispose() {
      disposed = true;
      root.remove();
      elements.clear();
      definitions.clear();
    },
  };
}
