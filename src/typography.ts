import { parseAdvRichText, type AdvRichTextNode } from "@haneoka/vega-plugin-richtext";
import { ADV_COMMAND, iterateAdvCommands, type StoryResourceResolver } from "@haneoka/vega/renderer-kit";
import type { StoryResourcePreparationContext } from "@haneoka/vega/plugin";
import { resolveStoryLocalizedText } from "@haneoka/vega/runtime";
import {
  decodeSdfAtlas,
  SdfTextPainter,
  layoutSdfText,
  type SdfAtlasPixels,
  type SdfFont,
  type SdfMaterial,
  type SdfTextLayout,
  type SdfTextLayoutOptions,
} from "@haneoka/vega-plugin-richtext/sdf";
import {
  HANEOKA_NATIVE_FONT_ASSETS,
  HANEOKA_SDF_ASSETS,
  HANEOKA_SDF_MATERIALS,
  HANEOKA_SDF_SHADER,
} from "./fontAssets.js";
import { haneokaTextLocale } from "./locale.js";

type FontName = keyof typeof HANEOKA_SDF_ASSETS;
type NativeFontName = keyof typeof HANEOKA_NATIVE_FONT_ASSETS;
const BANKS = new WeakMap<object, HaneokaFontBank>();
const decoder = new TextDecoder();
const MAX_CPU_ATLAS_BYTES = 64 * 1024 * 1024;

/** Locale font families and their missing-glyph fallbacks. */
const LANGUAGE_FONT_CHAINS: Readonly<Record<string, readonly FontName[]>> = {
  ja: ["dialogue", "bold", "chat", "symbols", "chinese", "korean"],
  en: ["dialogue", "bold", "chat", "symbols", "chinese", "korean"],
  "zh-hans": ["chinese", "dialogue", "bold", "symbols", "korean"],
  "zh-hant": ["chinese", "dialogue", "bold", "chat", "symbols", "korean"],
  ko: ["korean", "dialogue", "bold", "symbols", "chinese"],
};

const DEFAULT_FONT_CHAIN: readonly FontName[] = ["dialogue", "bold", "chat", "symbols", "chinese", "korean"];

const nativeFontForLanguage = (lang: string): NativeFontName | undefined => {
  switch (normalizeLanguageTag(lang)) {
    case "zh-hans":
    case "zh-hant":
      return "chinese";
    case "ko":
      return "korean";
    default:
      return undefined;
  }
};

const normalizeLanguageTag = (value: string): string => {
  const tag = value.trim().replaceAll("_", "-").toLowerCase();
  if (!tag) return "";
  if (tag === "zh") return "zh-hans";
  if (tag.startsWith("zh-")) {
    const subtags = tag.split("-").slice(1);
    if (subtags.includes("hans")) return "zh-hans";
    if (subtags.includes("hant")) return "zh-hant";
    if (subtags.some((part) => ["tw", "hk", "mo"].includes(part))) return "zh-hant";
    if (subtags.some((part) => ["cn", "sg"].includes(part))) return "zh-hans";
    return "zh-hans";
  }
  return tag.split("-")[0]!;
};

/** Phone font slot 2 uses Noto in Japanese and the locale family elsewhere. */
export const chainForLanguage = (lang: string, phone: boolean): readonly FontName[] => {
  const chain = LANGUAGE_FONT_CHAINS[normalizeLanguageTag(lang)] ?? DEFAULT_FONT_CHAIN;
  return phone && normalizeLanguageTag(lang) === "ja" ? ["chat", ...chain.filter((name) => name !== "chat")] : chain;
};

/** NotoSansJP ships only its Default material natively; other families keep
 * authored outline presets matched by name suffix where the evidence provides one. */
const remapMaterialForLanguage = (
  bank: { readonly materials: Record<string, SdfMaterial> },
  materialName: string,
  lang: string,
  phone = false,
): string => {
  const primary = chainForLanguage(lang, phone)[0]!;
  if (
    (materialName.startsWith(`${primary}:`) || materialName.startsWith(`${primary}-`)) &&
    bank.materials[materialName]
  )
    return materialName;
  const separator = materialName.indexOf(":");
  if (separator >= 0) {
    const preset = materialName.slice(separator + 1);
    const suffixAt = preset.lastIndexOf(" - ");
    const suffix = suffixAt >= 0 ? preset.slice(suffixAt) : preset.endsWith(" SDF Material") ? " SDF Material" : "";
    if (suffix) {
      const candidate = Object.keys(bank.materials).find(
        (key) => key.startsWith(`${primary}:`) && key.endsWith(suffix),
      );
      if (candidate) return candidate;
    }
  } else {
    const alias = materialName.slice(materialName.indexOf("-") + 1);
    const candidate = `${primary}-${alias}`;
    if (bank.materials[candidate]) return candidate;
  }
  return bank.materials[`${primary}-default`] ? `${primary}-default` : "dialogue-default";
};

const nativeLineSpacing = (language: string): number => {
  switch (normalizeLanguageTag(language)) {
    case "en":
      return -100;
    case "zh-hans":
    case "zh-hant":
    case "ko":
      return 5;
    default:
      return 0;
  }
};

interface SdfPrepareResult {
  readonly missing: readonly string[];
  readonly cannotFit: boolean;
  readonly unavailable: boolean;
}

interface SharedRequest<T> {
  readonly controller: AbortController;
  promise: Promise<T>;
  users: number;
  settled: boolean;
}

const abortError = (signal: AbortSignal): unknown =>
  signal.reason ?? new DOMException("The operation was aborted", "AbortError");

const flattenRichText = (nodes: readonly AdvRichTextNode[]): string =>
  nodes
    .map((node) => {
      if (node.type === "text") return node.value;
      if (node.type === "break") return "\n";
      if (node.type === "space") return " ";
      if (node.type === "ruby") return `${node.base}${node.annotation}`;
      return flattenRichText(node.children);
    })
    .join("");

const visibleSourceText = (source: string): string => flattenRichText(parseAdvRichText(source));

export class HaneokaFontBank {
  readonly fonts = new Map<FontName, SdfFont>();
  readonly atlases = new Map<string, SdfAtlasPixels>();
  readonly listeners = new Set<() => void>();
  materials: Record<string, SdfMaterial> = {};
  shader = "";
  private readonly corePending = new Map<
    string,
    SharedRequest<{ shader: string; materials: Record<string, SdfMaterial> }>
  >();
  private readonly fontPending = new Map<string, SharedRequest<SdfFont>>();
  private readonly nativeFontPending = new Map<string, SharedRequest<FontFace>>();
  private readonly nativeFonts = new Map<NativeFontName, FontFace>();
  private readonly atlasPending = new Map<string, SharedRequest<SdfAtlasPixels>>();
  private readonly atlasPins = new Map<string, number>();
  private readonly atlasClock = new Map<string, number>();
  private atlasUseClock = 0;
  private atlasBytes = 0;
  private bindingUsers = 0;
  private pool: { painter: SdfTextPainter; users: number } | undefined;
  private painterUnavailable = false;

  constructor(
    readonly document: Document,
    private readonly resources?: StoryResourceResolver,
  ) {}

  acquireBinding(): () => void {
    this.bindingUsers++;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.bindingUsers--;
      if (this.bindingUsers === 0) this.clearResources();
    };
  }

  private ensurePainter(): boolean {
    if (this.pool && !this.pool.painter.isOperational) {
      this.pool.painter.dispose();
      this.pool = undefined;
    }
    if (this.pool) return true;
    if (this.painterUnavailable) return false;
    try {
      this.pool = { painter: new SdfTextPainter(this.document, this.shader), users: 0 };
      return true;
    } catch {
      this.painterUnavailable = true;
      return false;
    }
  }

  async preparePainter(signal?: AbortSignal): Promise<boolean> {
    await this.prepareCore(signal);
    if (this.painterUnavailable) return false;
    return this.ensurePainter();
  }

  acquirePainter(): { painter: SdfTextPainter; release: () => void } | undefined {
    if (!this.ensurePainter()) return undefined;
    const pool = this.pool;
    if (!pool) return undefined;
    pool.users++;
    let released = false;
    return {
      painter: pool.painter,
      release: () => {
        if (released) return;
        released = true;
        pool.users--;
        if (pool.users === 0) {
          pool.painter.dispose();
          if (this.pool === pool) this.pool = undefined;
        }
      },
    };
  }

  private async bytes(url: string, signal?: AbortSignal): Promise<Uint8Array> {
    if (this.resources) return this.resources.load(url, signal);
    const response = await fetch(url, signal ? { signal } : undefined);
    if (!response.ok) throw new Error(`Font resource failed: ${response.status}`);
    return new Uint8Array(await response.arrayBuffer());
  }

  private request<T>(
    pending: Map<string, SharedRequest<T>>,
    key: string,
    load: (signal: AbortSignal) => Promise<T>,
    signal?: AbortSignal,
  ): Promise<T> {
    if (signal?.aborted) return Promise.reject(abortError(signal));
    let request = pending.get(key);
    if (request?.controller.signal.aborted && !request.settled) {
      pending.delete(key);
      request = undefined;
    }
    if (!request) {
      const controller = new AbortController();
      request = {
        controller,
        promise: Promise.resolve(undefined as T),
        users: 0,
        settled: false,
      };
      request.promise = Promise.resolve()
        .then(() => load(controller.signal))
        .finally(() => {
          request!.settled = true;
          if (pending.get(key) === request) pending.delete(key);
        });
      pending.set(key, request);
    }
    request.users++;
    return new Promise<T>((resolve, reject) => {
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        request!.users--;
        if (request!.users === 0 && !request!.settled) request!.controller.abort();
        signal?.removeEventListener("abort", onAbort);
      };
      const onAbort = () => {
        release();
        reject(abortError(signal!));
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      request!.promise.then(
        (value) => {
          release();
          if (!signal?.aborted) resolve(value);
        },
        (error) => {
          release();
          reject(error);
        },
      );
      if (signal?.aborted) onAbort();
    });
  }

  private async prepareCore(signal?: AbortSignal): Promise<void> {
    if (this.shader && Object.keys(this.materials).length) return;
    const core = await this.request(
      this.corePending,
      "core",
      async (requestSignal) => {
        const [shader, materials] = await Promise.all([
          this.bytes(HANEOKA_SDF_SHADER, requestSignal),
          this.bytes(HANEOKA_SDF_MATERIALS, requestSignal),
        ]);
        return {
          shader: decoder.decode(shader),
          materials: JSON.parse(decoder.decode(materials)) as Record<string, SdfMaterial>,
        };
      },
      signal,
    );
    this.shader = core.shader;
    this.materials = core.materials;
  }

  private async prepareFont(name: FontName, signal?: AbortSignal): Promise<SdfFont> {
    const loaded = this.fonts.get(name);
    if (loaded) return loaded;
    return this.request(
      this.fontPending,
      name,
      async (requestSignal) => {
        const asset = HANEOKA_SDF_ASSETS[name];
        const font = JSON.parse(decoder.decode(await this.bytes(asset.data, requestSignal))) as SdfFont;
        const complete = { ...font, atlases: asset.atlases };
        if (!requestSignal.aborted) this.fonts.set(name, complete);
        return complete;
      },
      signal,
    );
  }

  private evictCpuAtlases(): void {
    while (this.atlasBytes > MAX_CPU_ATLAS_BYTES) {
      const candidate = [...this.atlases.keys()]
        .filter((key) => !(this.atlasPins.get(key) ?? 0))
        .sort((left, right) => (this.atlasClock.get(left) ?? 0) - (this.atlasClock.get(right) ?? 0))[0];
      if (!candidate) return;
      this.atlasBytes -= this.atlases.get(candidate)?.alpha.byteLength ?? 0;
      this.atlases.delete(candidate);
      this.atlasPins.delete(candidate);
      this.atlasClock.delete(candidate);
    }
  }

  private cacheAtlas(key: string, pixels: SdfAtlasPixels, protectedKeys: ReadonlySet<string>): boolean {
    const existing = this.atlases.get(key);
    if (existing) {
      this.atlasClock.set(key, ++this.atlasUseClock);
      return true;
    }
    const bytes = pixels.alpha.byteLength;
    if (bytes > MAX_CPU_ATLAS_BYTES) return false;
    while (this.atlasBytes + bytes > MAX_CPU_ATLAS_BYTES) {
      const candidate = [...this.atlases.keys()]
        .filter((candidateKey) => !protectedKeys.has(candidateKey))
        .filter((candidateKey) => !(this.atlasPins.get(candidateKey) ?? 0))
        .sort((left, right) => (this.atlasClock.get(left) ?? 0) - (this.atlasClock.get(right) ?? 0))[0];
      if (!candidate) return false;
      this.atlasBytes -= this.atlases.get(candidate)?.alpha.byteLength ?? 0;
      this.atlases.delete(candidate);
      this.atlasPins.delete(candidate);
      this.atlasClock.delete(candidate);
    }
    this.atlases.set(key, pixels);
    this.atlasBytes += bytes;
    this.atlasClock.set(key, ++this.atlasUseClock);
    return true;
  }

  private async prepareAtlas(
    font: SdfFont,
    atlas: number,
    protectedKeys: ReadonlySet<string>,
    signal?: AbortSignal,
  ): Promise<boolean> {
    const key = `${font.id}:${atlas}`;
    if (this.atlases.has(key)) {
      this.atlasClock.set(key, ++this.atlasUseClock);
      return true;
    }
    const source = font.atlases[atlas];
    if (!source) throw new Error(`Font atlas unavailable: ${key}`);
    const pixels = await this.request(
      this.atlasPending,
      key,
      async (requestSignal) => {
        return decodeSdfAtlas(this.document, await this.bytes(source, requestSignal), requestSignal);
      },
      signal,
    );
    return this.cacheAtlas(key, pixels, protectedKeys);
  }

  async prepareText(text: string, lang: string, phone: boolean, signal?: AbortSignal): Promise<SdfPrepareResult> {
    let painterReady = false;
    try {
      painterReady = await this.preparePainter(signal);
    } catch (error) {
      if (signal?.aborted) throw error;
    }
    const unresolved = new Set(
      [...visibleSourceText(text)].filter((character) => !/[\r\n\u200b\u200c\u200d\ufeff]/u.test(character)),
    );
    const required = new Map<string, { font: SdfFont; atlas: number }>();
    for (const name of chainForLanguage(lang, phone)) {
      if (!unresolved.size) break;
      const font = await this.prepareFont(name, signal);
      for (const character of unresolved) {
        const entry = font.characters[String(character.codePointAt(0))];
        const glyph = entry ? font.glyphs[String(entry[0])] : undefined;
        if (!glyph) continue;
        unresolved.delete(character);
        required.set(`${font.id}:${glyph.atlas}`, { font, atlas: glyph.atlas });
      }
    }
    if (!painterReady) {
      for (const listener of this.listeners) listener();
      return { missing: [...unresolved], cannotFit: false, unavailable: true };
    }
    const protectedKeys = new Set(required.keys());
    let cannotFit = false;
    for (const { font, atlas } of required.values()) {
      if (!(await this.prepareAtlas(font, atlas, protectedKeys, signal))) {
        cannotFit = true;
        break;
      }
    }
    for (const listener of this.listeners) listener();
    return { missing: [...unresolved], cannotFit, unavailable: false };
  }

  /** Load the original embedded Unity face only after the static SDF chain misses. */
  async prepareNativeFallback(lang: string, signal?: AbortSignal): Promise<string | undefined> {
    const name = nativeFontForLanguage(lang);
    if (!name || typeof FontFace === "undefined" || !this.document.fonts) return undefined;
    if (signal?.aborted) return undefined;
    const existing = this.nativeFonts.get(name);
    if (existing) return HANEOKA_NATIVE_FONT_ASSETS[name].family;
    await this.request(
      this.nativeFontPending,
      name,
      async (requestSignal) => {
        const asset = HANEOKA_NATIVE_FONT_ASSETS[name];
        const raw = await this.bytes(asset.data, requestSignal);
        const bytes = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer;
        const face = new FontFace(asset.family, bytes, {
          style: "normal",
          weight: name === "korean" ? "600" : "400",
          stretch: "normal",
        });
        await face.load();
        if (!requestSignal.aborted) {
          this.document.fonts.add(face);
          this.nativeFonts.set(name, face);
        }
        return face;
      },
      signal,
    );
    if (signal?.aborted) return undefined;
    return HANEOKA_NATIVE_FONT_ASSETS[name].family;
  }

  chain(lang: string, phone: boolean): SdfFont[] {
    const names = chainForLanguage(lang, phone);
    if (!this.fonts.has(names[0]!)) return [];
    return names.flatMap((name) => {
      const font = this.fonts.get(name);
      return font ? [font] : [];
    });
  }

  hasAtlas(key: string): boolean {
    return this.atlases.has(key);
  }

  atlas(key: string): SdfAtlasPixels | undefined {
    const value = this.atlases.get(key);
    if (value) this.atlasClock.set(key, ++this.atlasUseClock);
    return value;
  }

  pinAtlases(keys: readonly string[]): () => void {
    for (const key of keys) this.atlasPins.set(key, (this.atlasPins.get(key) ?? 0) + 1);
    return () => {
      for (const key of keys) {
        const count = (this.atlasPins.get(key) ?? 0) - 1;
        if (count > 0) this.atlasPins.set(key, count);
        else this.atlasPins.delete(key);
      }
      this.evictCpuAtlases();
    };
  }

  material(key: string): SdfMaterial {
    const value = this.materials[key] ?? this.materials["dialogue-default"];
    if (!value) throw new Error(`Font material unavailable: ${key}`);
    return value;
  }

  private clearResources(): void {
    for (const pending of [
      ...this.corePending.values(),
      ...this.fontPending.values(),
      ...this.nativeFontPending.values(),
      ...this.atlasPending.values(),
    ])
      pending.controller.abort();
    this.corePending.clear();
    this.fontPending.clear();
    for (const face of this.nativeFonts.values()) this.document.fonts.delete(face);
    this.nativeFonts.clear();
    this.nativeFontPending.clear();
    this.atlasPending.clear();
    this.fonts.clear();
    this.atlases.clear();
    this.atlasBytes = 0;
    this.atlasPins.clear();
    this.atlasClock.clear();
    this.shader = "";
    this.materials = {};
    this.painterUnavailable = false;
    if (this.pool?.users === 0) {
      this.pool.painter.dispose();
      this.pool = undefined;
    }
  }
}

/**
 * Warm the exact SDF resources used by authored text while the episode is
 * still in its blocking preload phase. The UI slot is mounted before that
 * phase, so doing this on the theme resource preparer means its first
 * typewriter frame can paint through the same SDF material as the settled
 * paragraph instead of briefly exposing the DOM fallback.
 */
export async function prepareHaneokaFonts(context: StoryResourcePreparationContext): Promise<void> {
  if (!context.document) return;
  const bank = haneokaFontBank(context.document, context.resources);
  const resolve = context.resolveLocalizedText ?? resolveStoryLocalizedText;
  const defaultLanguage = haneokaTextLocale("", context.document);
  const normal: Array<{ text: string; language: string }> = [];
  const phone: Array<{ text: string; language: string }> = [];
  const seen = new Set<string>();
  const add = (value: unknown, isPhone: boolean): void => {
    const resolved = resolve(value);
    const text = String(resolved.text || "");
    if (!text) return;
    const language = resolved.lang || defaultLanguage;
    const key = `${isPhone ? "phone" : "normal"}\u0000${language}\u0000${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    (isPhone ? phone : normal).push({ text, language });
  };
  const phoneCommands = new Set<number>([
    ADV_COMMAND.ChatWindow,
    ADV_COMMAND.ChatTalk,
    ADV_COMMAND.ChatStamp,
    ADV_COMMAND.ChatTyping,
  ]);
  for (const command of iterateAdvCommands(context.story.commands ?? [])) {
    const isPhone = phoneCommands.has(Number(command.command));
    add(command.text, isPhone);
    for (const segment of command.textSegments ?? []) add(segment, isPhone);
    if (Array.isArray(command.targetTextNames)) for (const name of command.targetTextNames) add(name, isPhone);
    if (Array.isArray(command.targets))
      for (const target of command.targets) {
        if (target && typeof target === "object") add(target.name, isPhone);
      }
    for (const choice of command.choices ?? []) add(choice.text, isPhone);
  }

  // Shell labels are painted by the same binding and are not part of the
  // episode command stream. Keep this small fixed set independent of any
  // host/game font catalogue.
  add("Loading Menu Play Pause Save Settings Auto Skip Log 0123456789", false);
  for (const entry of normal) {
    const result = await bank.prepareText(entry.text, entry.language, false, context.signal);
    if (result.missing.length) await bank.prepareNativeFallback(entry.language, context.signal);
  }
  for (const entry of phone) {
    const result = await bank.prepareText(entry.text, entry.language, true, context.signal);
    if (result.missing.length) await bank.prepareNativeFallback(entry.language, context.signal);
  }
}

export const haneokaFontBank = (document: Document, resources?: StoryResourceResolver): HaneokaFontBank => {
  const key = resources ?? document;
  let bank = BANKS.get(key);
  if (!bank) {
    bank = new HaneokaFontBank(document, resources);
    BANKS.set(key, bank);
  }
  return bank;
};

export interface HaneokaSdfBinding {
  render(element: HTMLElement, text: string, fullText?: string): boolean;
  release(element: HTMLElement): void;
  releaseWithin(root: Node): void;
  dispose(): void;
}

interface BindingEntry {
  source: string;
  fullText: string;
  signature: string;
  requestSignature: string;
  preparedSignature: string;
  requestRevision: number;
  unsupportedSignature: string;
  nativeFallbackAttemptedSignature: string;
  nativeFallbackSignature: string;
  nativeFallbackFamily: string;
  retryAt: number;
  preparing: Promise<void> | undefined;
  prepareController: AbortController | undefined;
  capacitySignature: string;
  canvas: HTMLCanvasElement;
  accessible: HTMLElement;
  accessibleStyle: string;
  spacer: HTMLElement;
  position: string;
  display: string;
  visibility: string;
}

const contentElement = (element: HTMLElement): HTMLElement => {
  const content = element.querySelector<HTMLElement>(":scope > [data-haneoka-text-content]");
  if (content) return content;
  const wrapper = element.ownerDocument.createElement("span");
  wrapper.dataset.haneokaTextContent = "true";
  wrapper.style.display = "contents";
  while (element.firstChild) wrapper.append(element.firstChild);
  element.append(wrapper);
  return wrapper;
};

const phoneRole = (element: HTMLElement): boolean =>
  element.dataset.textProfile ? element.dataset.textProfile.includes("NotoSans") : !!element.closest(".haneoka-phone");

const atlasKeys = (layout: SdfTextLayout): readonly string[] => [
  ...new Set(layout.quads.map((quad) => `${quad.font.id}:${quad.glyph.atlas}`)),
];

export function createHaneokaSdfBinding(
  document: Document,
  resources: StoryResourceResolver | undefined,
  signal: AbortSignal,
): HaneokaSdfBinding {
  const bank = haneokaFontBank(document, resources);
  const releaseBank = bank.acquireBinding();
  const entries = new Map<HTMLElement, BindingEntry>();
  const lifetime = new AbortController();
  const abortLifetime = () => {
    lifetime.abort(signal.reason);
    for (const entry of entries.values()) {
      entry.requestRevision++;
      entry.prepareController?.abort(signal.reason);
      entry.prepareController = undefined;
      entry.preparing = undefined;
    }
  };
  if (signal.aborted) abortLifetime();
  else signal.addEventListener("abort", abortLifetime, { once: true });
  let painter: SdfTextPainter | undefined;
  let releasePainter: (() => void) | undefined;
  let painterRetryAt = 0;
  let disposed = false;
  const colorCanvas = document.createElement("canvas");
  const colorContext = colorCanvas.getContext("2d");
  const parseColor = (value: string): readonly [number, number, number, number] => {
    if (!colorContext) return [1, 1, 1, 1];
    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = value;
    colorContext.fillRect(0, 0, 1, 1);
    const c = colorContext.getImageData(0, 0, 1, 1).data;
    return [c[0]! / 255, c[1]! / 255, c[2]! / 255, c[3]! / 255];
  };

  const showFallback = (element: HTMLElement, entry: BindingEntry): void => {
    entry.spacer.remove();
    entry.accessible.style.display = entry.display;
    entry.accessible.style.visibility = entry.visibility;
    entry.accessible.style.cssText = entry.accessibleStyle;
    entry.canvas.removeAttribute("aria-hidden");
    element.removeAttribute("data-haneoka-sdf");
    element.removeAttribute("data-haneoka-sdf-advance");
    element.style.position = entry.position;
    if (entry.nativeFallbackFamily && entry.nativeFallbackSignature === entry.requestSignature) {
      element.dataset.haneokaNativeFontFallback = "true";
      element.style.setProperty("--haneoka-native-font-family", JSON.stringify(entry.nativeFallbackFamily));
      const language = fontLanguage(element);
      const font = bank.fonts.get(chainForLanguage(language, phoneRole(element))[0]!);
      if (font && element.dataset.textProfile && element.closest(".haneoka-story-ui")) {
        element.style.setProperty(
          "--haneoka-native-line-height",
          `${Math.max(0, (font.lineHeight * font.scale) / font.size + nativeLineSpacing(language) * 0.01)}em`,
        );
      } else element.style.removeProperty("--haneoka-native-line-height");
    } else {
      delete element.dataset.haneokaNativeFontFallback;
      element.style.removeProperty("--haneoka-native-font-family");
      element.style.removeProperty("--haneoka-native-line-height");
    }
    entry.signature = "";
  };

  const markSdfFailure = (entry: BindingEntry): void => {
    if (!entry.requestSignature) return;
    entry.preparedSignature = "";
    entry.unsupportedSignature = entry.requestSignature;
  };

  const releasePainterLease = (): void => {
    releasePainter?.();
    releasePainter = undefined;
    painter = undefined;
  };

  const draw = (element: HTMLElement, entry: BindingEntry): boolean => {
    if (disposed || lifetime.signal.aborted || !element.isConnected || !element.getClientRects().length) return false;
    if (!bank.shader) return false;
    entry.accessible = contentElement(element);
    if (!entry.accessible.hasAttribute("data-haneoka-rich-text-owned"))
      entry.accessible.textContent = visibleSourceText(entry.source);
    const style = document.defaultView?.getComputedStyle(element);
    if (!style || style.direction === "rtl") return false;
    const profile = element.dataset.textProfile
      ? (JSON.parse(element.dataset.textProfile) as {
          size: number;
          autoSize?: boolean;
          minSize?: number;
          maxSize?: number;
          font: string;
          material: string;
          characterSpacing: number;
          lineSpacing: number;
        })
      : undefined;
    let fontSize = parseFloat(style.fontSize) || 16;
    const phone = phoneRole(element);
    const control = !!element.closest(".haneoka-controls");
    const speaker = element.dataset.node === "SpeakerText" || element.classList.contains("vega-portable-speaker");
    const windowType = element.closest("[data-window]")?.getAttribute("data-window") ?? "default";
    const lang = fontLanguage(element);
    const outlined =
      (speaker && windowType === "default") ||
      element.classList.contains("haneoka-location") ||
      element.classList.contains("haneoka-subtitles");
    const exactMaterial = profile ? `${phone ? "chat" : "dialogue"}:${profile.material}` : "";
    const materialName =
      exactMaterial && bank.materials[exactMaterial]
        ? exactMaterial
        : phone
          ? "chat-default"
          : profile?.material.includes("OutlineAdvCommon")
            ? "dialogue-outline"
            : profile?.material.includes("OutlineLightGray")
              ? "dialogue-center"
              : profile?.material.includes("OutlineButtonText")
                ? "dialogue-outline"
                : profile?.material.endsWith("SDF Material")
                  ? "dialogue-base"
                  : control
                    ? "dialogue-base"
                    : outlined
                      ? "dialogue-outline"
                      : windowType === "center"
                        ? "dialogue-center"
                        : "dialogue-default";
    const resolvedMaterialName = remapMaterialForLanguage(bank, materialName, lang, phone);
    const paddingX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    const nowrap = style.whiteSpace === "nowrap" || element.dataset.textAuto === "true";
    const messageRow = element.classList.contains("haneoka-phone__message-text")
      ? element.closest<HTMLElement>(".haneoka-phone__message")
      : null;
    const phoneScale = fontSize / (profile?.size ?? 24);
    const ownMessage = messageRow?.dataset.self === "true";
    const messageWidth = messageRow
      ? messageRow.clientWidth * (ownMessage ? 1 : 0.7723) -
        (ownMessage ? 60 + (messageRow.querySelector(".haneoka-phone__read") ? 64 : 0) : 65) * phoneScale
      : undefined;
    const width = Math.max(1, messageWidth ?? element.clientWidth - paddingX);
    const ratio = Math.min(3, Math.max(1, document.defaultView?.devicePixelRatio ?? 1));
    const signature = JSON.stringify([
      entry.source,
      entry.fullText,
      width,
      profile?.autoSize ? element.clientHeight : 0,
      fontSize,
      style.color,
      style.fontWeight,
      style.textAlign,
      ratio,
      resolvedMaterialName,
      lang,
      profile?.characterSpacing,
      profile && element.closest(".haneoka-story-ui") ? nativeLineSpacing(lang) : profile?.lineSpacing,
    ]);
    if (entry.nativeFallbackFamily && entry.nativeFallbackSignature === entry.requestSignature) return false;
    if (signature === entry.signature && entry.spacer.parentElement === element) return true;
    if (signature === entry.capacitySignature) return false;
    const fonts = bank.chain(lang, phone);
    if (!fonts.length) {
      entry.preparedSignature = "";
      return false;
    }
    let options: SdfTextLayoutOptions = {
      fonts,
      fontSize,
      ruby: { scale: 0.5, verticalOffset: 1, alignment: "annotation" },
      maxWidth: nowrap || control ? Infinity : width,
      characterSpacing: profile?.characterSpacing ?? (speaker ? 2 : 0),
      lineSpacing:
        profile && element.closest(".haneoka-story-ui") ? nativeLineSpacing(lang) : (profile?.lineSpacing ?? 0),
      bold: Number(style.fontWeight) >= 600,
      color: parseColor(style.color),
      align: control
        ? "left"
        : style.textAlign === "center"
          ? "center"
          : style.textAlign === "right"
            ? "right"
            : "left",
      pixelScale: fontSize / (profile?.size ?? (phone ? 36 : speaker ? 36 : windowType === "default" ? 36 : 40)),
      parseColor,
    };
    const layoutFor = (text: string, size = fontSize): SdfTextLayout =>
      layoutSdfText(text, { ...options, fontSize: size });
    let layout = layoutFor(entry.fullText);
    if (layout.missing.length) return false;
    if (profile?.autoSize && !nowrap && element.clientHeight > 0) {
      const scale = fontSize / profile.size;
      let low = Math.max(0.1, (profile.minSize ?? profile.size) * scale);
      let high = Math.max(low, (profile.maxSize ?? profile.size) * scale);
      const maxHeight =
        element.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0);
      const fits = (value: SdfTextLayout) => value.width <= width + 0.01 && value.height <= maxHeight + 0.01;
      let best = layoutFor(entry.fullText, low);
      for (let step = 0; step < 12 && high - low > 0.05 * scale; step++) {
        const size = (low + high) / 2;
        const candidate = layoutFor(entry.fullText, size);
        if (fits(candidate)) {
          low = size;
          best = candidate;
        } else high = size;
      }
      const largest = layoutFor(entry.fullText, high);
      if (fits(largest)) {
        low = high;
        best = largest;
      }
      fontSize = low;
      options = { ...options, fontSize };
      layout = best;
    }
    const visibleText = layoutSdfText(entry.source, options).text;
    const visibleLength = [...visibleText].length;
    const shown = {
      ...layout,
      quads: layout.quads.filter((quad) => (quad.characterIndex ?? 0) < visibleLength),
      ...(layout.marks ? { marks: layout.marks.filter((mark) => (mark.characterIndex ?? 0) < visibleLength) } : {}),
    };
    const keys = atlasKeys(shown);
    if (keys.some((key) => !bank.hasAtlas(key))) {
      entry.preparedSignature = "";
      return false;
    }
    const pixels = new Map<string, SdfAtlasPixels>();
    for (const key of keys) {
      const value = bank.atlas(key);
      if (!value) return false;
      pixels.set(key, value);
    }
    const releaseCpu = bank.pinAtlases(keys);
    try {
      if (!painter?.isOperational) {
        if (painterRetryAt > Date.now()) return false;
        releasePainterLease();
        const lease = bank.acquirePainter();
        if (!lease) {
          markSdfFailure(entry);
          return false;
        }
        painter = lease.painter;
        releasePainter = lease.release;
        painterRetryAt = 0;
      }
      const padding = Math.max(
        4,
        fontSize * 0.35,
        ...shown.quads.flatMap((quad) => [
          -quad.x,
          -quad.y,
          quad.x + quad.width - Math.max(width, layout.width),
          quad.y + quad.height - layout.height,
        ]),
      );
      if (
        !painter!.canPaint(
          nowrap || control || messageRow ? layout.width : width,
          Math.max(1, layout.height),
          ratio,
          padding,
        )
      ) {
        entry.capacitySignature = signature;
        markSdfFailure(entry);
        return false;
      }
      if (!painter!.prepareAtlases(keys, pixels)) {
        entry.capacitySignature = signature;
        markSdfFailure(entry);
        return false;
      }
      try {
        for (const quad of shown.quads) {
          const key = `${quad.font.id}:${quad.glyph.atlas}`;
          const atlas = pixels.get(key);
          if (!atlas) throw new Error(`SDF atlas is not ready: ${key}`);
          painter!.upload(quad.font, quad.glyph.atlas, atlas);
        }
        const rendered = painter!.paint(
          shown,
          bank.material(resolvedMaterialName),
          nowrap || control || messageRow ? layout.width : width,
          Math.max(1, layout.height),
          ratio,
          padding,
        );
        const target = entry.canvas;
        target.width = rendered.width;
        target.height = rendered.height;
        const context = target.getContext("2d");
        if (!context) throw new Error("SDF fallback canvas is unavailable");
        context.clearRect(0, 0, target.width, target.height);
        context.drawImage(rendered, 0, 0);
        target.setAttribute("aria-hidden", "true");
        target.style.cssText = `display:block;position:absolute;max-width:none;max-height:none;left:${(parseFloat(style.paddingLeft) || 0) - padding}px;top:${-padding}px;width:${rendered.width / ratio}px;height:${rendered.height / ratio}px;pointer-events:none`;
        const flowWidth = nowrap || control || messageRow ? layout.width : width;
        entry.spacer.style.cssText = `display:block;position:relative;flex-shrink:0;width:${flowWidth}px;height:${layout.height}px;max-width:${messageRow ? "none" : "100%"};pointer-events:none`;
        if (style.position === "static") element.style.position = "relative";
        entry.accessible.style.cssText = `${entry.accessibleStyle};display:block;position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;`;
        delete element.dataset.haneokaNativeFontFallback;
        element.style.removeProperty("--haneoka-native-font-family");
        element.style.removeProperty("--haneoka-native-line-height");
        element.dataset.haneokaSdf = "true";
        element.dataset.haneokaSdfAdvance = String(layout.width / Math.max(1, fontSize));
        if (entry.spacer.parentElement !== element) element.append(entry.spacer);
        entry.spacer.replaceChildren(target);
        entry.signature = signature;
        entry.capacitySignature = "";
        return true;
      } finally {
        painter?.unpin(keys);
      }
    } finally {
      releaseCpu();
    }
  };

  const observer =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver((records) => {
          for (const record of records) {
            const element = record.target as HTMLElement;
            const entry = entries.get(element);
            if (!entry) continue;
            entry.signature = "";
            if (entry.capacitySignature) {
              entry.capacitySignature = "";
              entry.unsupportedSignature = "";
            }
            try {
              if (!draw(element, entry)) {
                showFallback(element, entry);
                schedulePrepare(element, entry);
              }
            } catch {
              showFallback(element, entry);
              markSdfFailure(entry);
              painterRetryAt = Date.now() + 1000;
              releasePainterLease();
              schedulePrepare(element, entry);
            }
          }
        });

  const schedulePrepare = (element: HTMLElement, entry: BindingEntry): void => {
    if (disposed || lifetime.signal.aborted || !entry.source) return;
    const phone = phoneRole(element);
    const language = normalizeLanguageTag(fontLanguage(element));
    const role = phone ? "phone" : "default";
    const requestSignature = JSON.stringify([entry.fullText, language, role]);
    if (entry.requestSignature !== requestSignature) {
      if (entry.requestSignature) {
        entry.requestRevision++;
        entry.prepareController?.abort();
        entry.prepareController = undefined;
        entry.preparing = undefined;
      }
      entry.requestSignature = requestSignature;
      entry.preparedSignature = "";
      entry.unsupportedSignature = "";
      entry.nativeFallbackAttemptedSignature = "";
      entry.nativeFallbackSignature = "";
      entry.nativeFallbackFamily = "";
      entry.retryAt = 0;
    }
    const nativeEligible = !!nativeFontForLanguage(language);
    const unsupported = entry.unsupportedSignature === requestSignature;
    if (
      (unsupported && (!nativeEligible || entry.nativeFallbackAttemptedSignature === requestSignature)) ||
      entry.retryAt > Date.now() ||
      (entry.preparedSignature === requestSignature && !unsupported) ||
      entry.preparing
    )
      return;
    const revision = entry.requestRevision;
    const controller = new AbortController();
    entry.prepareController = controller;
    const ensureNativeFallback = async (): Promise<void> => {
      if (
        entries.get(element) !== entry ||
        revision !== entry.requestRevision ||
        controller.signal.aborted ||
        lifetime.signal.aborted
      )
        return;
      if (!nativeEligible || entry.nativeFallbackAttemptedSignature === requestSignature) return;
      entry.nativeFallbackAttemptedSignature = requestSignature;
      try {
        const family = await bank.prepareNativeFallback(language, controller.signal);
        if (
          entries.get(element) !== entry ||
          revision !== entry.requestRevision ||
          controller.signal.aborted ||
          lifetime.signal.aborted
        )
          return;
        entry.nativeFallbackFamily = family ?? "";
        entry.nativeFallbackSignature = family ? requestSignature : "";
      } catch {
        // A native-face load is one attempt per full-text request. A failed
        // attempt must not turn every animation frame into another request.
      }
    };
    let preparation: Promise<void>;
    preparation = bank
      .prepareText(entry.fullText, language, phone, controller.signal)
      .then(async ({ missing, cannotFit, unavailable }) => {
        if (
          entries.get(element) !== entry ||
          revision !== entry.requestRevision ||
          controller.signal.aborted ||
          lifetime.signal.aborted
        )
          return;
        const failed =
          entry.unsupportedSignature === requestSignature || missing.length > 0 || cannotFit || unavailable;
        if (failed) await ensureNativeFallback();
        if (entries.get(element) !== entry || revision !== entry.requestRevision || controller.signal.aborted) return;
        entry.unsupportedSignature = failed ? requestSignature : "";
        entry.preparedSignature = failed ? "" : requestSignature;
        entry.retryAt = 0;
      })
      .catch(async () => {
        if (
          entries.get(element) === entry &&
          revision === entry.requestRevision &&
          !controller.signal.aborted &&
          !lifetime.signal.aborted
        ) {
          markSdfFailure(entry);
          await ensureNativeFallback();
        }
      })
      .finally(() => {
        if (entry.preparing === preparation) entry.preparing = undefined;
        if (
          !disposed &&
          entries.get(element) === entry &&
          revision === entry.requestRevision &&
          !controller.signal.aborted
        ) {
          try {
            if (!draw(element, entry)) {
              showFallback(element, entry);
              schedulePrepare(element, entry);
            }
          } catch {
            showFallback(element, entry);
            markSdfFailure(entry);
            painterRetryAt = Date.now() + 1000;
            releasePainterLease();
            schedulePrepare(element, entry);
          }
        }
      });
    entry.preparing = preparation;
  };

  const refresh = (): void => {
    for (const [element, entry] of entries) {
      try {
        if (!draw(element, entry)) {
          showFallback(element, entry);
          schedulePrepare(element, entry);
        }
      } catch {
        showFallback(element, entry);
        markSdfFailure(entry);
        painterRetryAt = Date.now() + 1000;
        releasePainterLease();
        schedulePrepare(element, entry);
      }
    }
  };
  bank.listeners.add(refresh);

  const release = (element: HTMLElement): void => {
    const entry = entries.get(element);
    if (!entry) return;
    entry.requestRevision++;
    entry.prepareController?.abort();
    entry.prepareController = undefined;
    entry.preparing = undefined;
    observer?.unobserve(element);
    entry.nativeFallbackAttemptedSignature = "";
    entry.nativeFallbackSignature = "";
    entry.nativeFallbackFamily = "";
    showFallback(element, entry);
    delete element.dataset.haneokaNativeFontFallback;
    element.style.removeProperty("--haneoka-native-font-family");
    element.style.removeProperty("--haneoka-native-line-height");
    entry.canvas.width = 1;
    entry.canvas.height = 1;
    entries.delete(element);
    if (!entries.size) releasePainterLease();
  };

  return {
    render(element, text, fullText = text) {
      if (disposed || lifetime.signal.aborted) return false;
      if (!text) {
        release(element);
        return false;
      }
      let entry = entries.get(element);
      if (!entry) {
        entry = {
          source: text,
          fullText,
          signature: "",
          requestSignature: "",
          preparedSignature: "",
          requestRevision: 0,
          unsupportedSignature: "",
          nativeFallbackAttemptedSignature: "",
          nativeFallbackSignature: "",
          nativeFallbackFamily: "",
          retryAt: 0,
          preparing: undefined,
          prepareController: undefined,
          capacitySignature: "",
          canvas: document.createElement("canvas"),
          accessible: contentElement(element),
          accessibleStyle: "",
          spacer: document.createElement("span"),
          position: element.style.position,
          display: "",
          visibility: "",
        };
        entry.display = entry.accessible.style.display;
        entry.visibility = entry.accessible.style.visibility;
        entries.set(element, entry);
        observer?.observe(element);
      } else if (entry.fullText !== fullText) {
        entry.source = text;
        entry.fullText = fullText;
        entry.signature = "";
        entry.requestSignature = "";
        entry.preparedSignature = "";
        entry.unsupportedSignature = "";
        entry.nativeFallbackAttemptedSignature = "";
        entry.nativeFallbackSignature = "";
        entry.nativeFallbackFamily = "";
        entry.retryAt = 0;
        entry.capacitySignature = "";
        entry.prepareController?.abort();
        entry.prepareController = undefined;
        entry.preparing = undefined;
        entry.requestRevision++;
        entry.accessible = contentElement(element);
      } else if (entry.source !== text) {
        entry.source = text;
        entry.signature = "";
        entry.accessible = contentElement(element);
      }
      if (!entry.accessibleStyle) entry.accessibleStyle = entry.accessible.style.cssText;
      schedulePrepare(element, entry);
      try {
        const rendered = draw(element, entry);
        if (!rendered) {
          showFallback(element, entry);
          schedulePrepare(element, entry);
        }
        return rendered;
      } catch {
        showFallback(element, entry);
        markSdfFailure(entry);
        painterRetryAt = Date.now() + 1000;
        releasePainterLease();
        schedulePrepare(element, entry);
        return false;
      }
    },
    release,
    releaseWithin(root) {
      for (const element of [...entries.keys()]) if (element === root || root.contains(element)) release(element);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      signal.removeEventListener("abort", abortLifetime);
      lifetime.abort();
      observer?.disconnect();
      bank.listeners.delete(refresh);
      for (const element of [...entries.keys()]) release(element);
      releasePainterLease();
      colorCanvas.width = 1;
      colorCanvas.height = 1;
      releaseBank();
    },
  };
}

const elementLang = (element: HTMLElement): string => {
  let source: HTMLElement | null = element;
  while (source) {
    const value = (source.lang || "").trim();
    if (value) return value;
    source = source.parentElement;
  }
  return element.ownerDocument.documentElement.lang || element.ownerDocument.defaultView?.navigator.language || "";
};

const fontLanguage = (element: HTMLElement): string =>
  element.closest<HTMLElement>(".haneoka-story-ui")?.lang || elementLang(element);
