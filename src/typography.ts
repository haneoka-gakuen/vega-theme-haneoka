import { iterateAdvCommands, type StoryResourceResolver } from "@haneoka/vega/renderer-kit";
import type { StoryResourcePreparationContext } from "@haneoka/vega/plugin";
import { resolveStoryLocalizedText } from "@haneoka/vega/runtime";
import {
  decodeSdfAtlas,
  SdfTextPainter,
  layoutSdfText,
  type SdfAtlasPixels,
  type SdfFont,
  type SdfMaterial,
} from "@haneoka/vega-plugin-richtext/sdf";
import { HANEOKA_SDF_ASSETS, HANEOKA_SDF_MATERIALS, HANEOKA_SDF_SHADER } from "./fontAssets.js";

type FontName = keyof typeof HANEOKA_SDF_ASSETS;
const BANKS = new WeakMap<object, HaneokaFontBank>();
const decoder = new TextDecoder();
const fallbackOrder: readonly FontName[] = ["symbols", "chinese", "korean"];

/**
 * Native LocalizeManager swaps the TMP font asset per language: ja/en keep
 * ShinGoPr6N, zh-Hans uses FZLanTingHei, zh-Hant uses the full NotoSansJP
 * "everything" font (the same asset the chat windows use), and ko uses
 * Pretendard. Falling through the other families afterwards reproduces the
 * embedded-runtime glyph fallback instead of the browser default font.
 */
const LANGUAGE_FONT_CHAINS: Readonly<Record<string, readonly FontName[]>> = {
  ja: ["dialogue", "chat", "symbols", "chinese", "korean"],
  en: ["dialogue", "chat", "symbols", "chinese", "korean"],
  "zh-hans": ["chinese", "dialogue", "symbols", "korean"],
  "zh-hant": ["chat", "dialogue", "chinese", "symbols", "korean"],
  ko: ["korean", "dialogue", "symbols", "chinese"],
};

const normalizeLanguageTag = (value: string): string => {
  const tag = value.trim().toLowerCase();
  if (!tag) return "";
  if (tag.startsWith("zh")) {
    const hans = tag.includes("hans") || tag.includes("cn") || tag.includes("sg") || tag === "zh";
    return hans ? "zh-hans" : "zh-hant";
  }
  const primary = tag.split("-")[0]!;
  return primary;
};

/** The effective language of a text node: its own lang, else the nearest
 * ancestor that declares one (the shell sets lang on talk/subtitle nodes). */
const elementLang = (element: HTMLElement): string => {
  let source: HTMLElement | null = element;
  while (source) {
    const value = (source.lang || "").trim();
    if (value) return value;
    source = source.parentElement;
  }
  return "";
};

export const chainForLanguage = (lang: string, phone: boolean): readonly FontName[] => {
  const chain = LANGUAGE_FONT_CHAINS[normalizeLanguageTag(lang)] ?? LANGUAGE_FONT_CHAINS["ja"]!;
  return phone ? ["chat", ...chain.filter((name) => name !== "chat")] : chain;
};

const primaryFontOfChain = (lang: string): FontName => chainForLanguage(lang, false)[0]!;

/** NotoSansJP ships only its Default material natively; other per-language
 * families keep their authored outline presets matched by name suffix. */
const remapMaterialForLanguage = (
  bank: { readonly materials: Record<string, SdfMaterial> },
  materialName: string,
  lang: string,
): string => {
  const primary = primaryFontOfChain(lang);
  if (materialName.startsWith(`${primary}-`)) return materialName;
  const suffix = materialName.split("-").slice(1).join("-");
  if (!suffix) return materialName;
  const candidate = `${primary}-${suffix}`;
  return bank.materials[candidate] ? candidate : `${primary}-default`;
};
export class HaneokaFontBank {
  readonly fonts = new Map<FontName, SdfFont>();
  readonly atlases = new Map<string, SdfAtlasPixels>();
  readonly listeners = new Set<() => void>();
  materials: Record<string, SdfMaterial> = {};
  shader = "";
  private metadata: Promise<void> | undefined;
  private readonly pending = new Map<string, Promise<void>>();
  private pool: { painter: SdfTextPainter; users: number } | undefined;
  acquirePainter(): { painter: SdfTextPainter; release: () => void } {
    if (!this.pool?.painter.isOperational)
      this.pool = {
        painter: new SdfTextPainter(this.document, this.shader),
        users: 0,
      };
    const pool = this.pool;
    pool.users++;
    let released = false;
    return {
      painter: pool.painter,
      release: () => {
        if (released) return;
        released = true;
        if (--pool.users === 0) {
          pool.painter.dispose();
          if (this.pool === pool) this.pool = undefined;
        }
      },
    };
  }
  constructor(
    readonly document: Document,
    private readonly resources?: StoryResourceResolver,
  ) {}
  private async bytes(url: string, signal?: AbortSignal): Promise<Uint8Array> {
    if (this.resources) return this.resources.load(url, signal);
    const response = await fetch(url, { ...(signal ? { signal } : {}) });
    if (!response.ok) throw new Error(`Font resource failed: ${response.status}`);
    return new Uint8Array(await response.arrayBuffer());
  }
  async prepareMetadata(signal?: AbortSignal): Promise<void> {
    this.metadata ??= (async () => {
      const [shader, materials, ...fonts] = await Promise.all([
        this.bytes(HANEOKA_SDF_SHADER, signal),
        this.bytes(HANEOKA_SDF_MATERIALS, signal),
        ...Object.values(HANEOKA_SDF_ASSETS).map((asset) => this.bytes(asset.data, signal)),
      ]);
      this.shader = decoder.decode(shader);
      this.materials = JSON.parse(decoder.decode(materials));
      Object.keys(HANEOKA_SDF_ASSETS).forEach((name, index) => {
        const key = name as FontName,
          font = JSON.parse(decoder.decode(fonts[index])) as SdfFont;
        this.fonts.set(key, {
          ...font,
          atlases: HANEOKA_SDF_ASSETS[key].atlases,
        });
      });
    })().catch((error) => {
      this.metadata = undefined;
      throw error;
    });
    await this.metadata;
  }
  chain(lang: string, phone: boolean): SdfFont[] {
    return chainForLanguage(lang, phone).flatMap((name) => {
      const font = this.fonts.get(name as FontName);
      return font ? [font] : [];
    });
  }
  async prepareText(text: string, lang: string, phone: boolean, signal?: AbortSignal): Promise<void> {
    await this.prepareMetadata(signal);
    const required = new Map<string, { font: SdfFont; atlas: number }>();
    for (const char of text) {
      for (const font of this.chain(lang, phone)) {
        const entry = font.characters[String(char.codePointAt(0))];
        if (!entry) continue;
        const glyph = font.glyphs[String(entry[0])];
        if (glyph)
          required.set(`${font.id}:${glyph.atlas}`, {
            font,
            atlas: glyph.atlas,
          });
        break;
      }
    }
    for (const [key, { font, atlas }] of required) {
      if (this.atlases.has(key)) continue;
      let pending = this.pending.get(key);
      if (!pending) {
        pending = (async () => {
          const source = font.atlases[atlas];
          if (!source) throw new Error(`Font atlas unavailable: ${key}`);
          const pixels = await decodeSdfAtlas(this.document, await this.bytes(source, signal), signal);
          this.atlases.set(key, pixels);
          for (const listener of this.listeners) listener();
        })().finally(() => this.pending.delete(key));
        this.pending.set(key, pending);
      }
      await pending;
    }
  }
  material(key: string): SdfMaterial {
    const value = this.materials[key] ?? this.materials["dialogue-default"];
    if (!value) throw new Error(`Font material unavailable: ${key}`);
    return value;
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
export async function prepareHaneokaFonts(context: StoryResourcePreparationContext): Promise<void> {
  if (!context.document) return;
  const bank = haneokaFontBank(context.document, context.resources),
    resolve = context.resolveLocalizedText ?? resolveStoryLocalizedText;
  let normal = "",
    phone = "";
  for (const command of iterateAdvCommands(context.story.commands ?? [])) {
    const text = [
      command.text,
      command.targetTextNames,
      ...(Array.isArray(command.choices) ? command.choices.map((choice) => choice.text) : []),
    ]
      .map((value) => resolve(value).text)
      .join("");
    if ([36, 37, 38, 39, 65].includes(Number(command.command))) phone += text;
    else normal += text;
  }
  await bank.prepareText(
    normal + "Loading Menu Play Pause Save Settings Auto Skip Log 0123456789",
    "",
    false,
    context.signal,
  );
  if (phone) await bank.prepareText(phone, "", true, context.signal);
}

export interface HaneokaSdfBinding {
  render(element: HTMLElement, text: string, fullText?: string): boolean;
  release(element: HTMLElement): void;
  releaseWithin(root: Node): void;
  dispose(): void;
}
export function createHaneokaSdfBinding(
  document: Document,
  resources: StoryResourceResolver | undefined,
  signal: AbortSignal,
): HaneokaSdfBinding {
  const bank = haneokaFontBank(document, resources);
  let painter: SdfTextPainter | undefined;
  let releasePainter: (() => void) | undefined;
  let failed = false;
  const entries = new Map<
    HTMLElement,
    {
      source: string;
      fullText: string;
      signature: string;
      canvas: HTMLCanvasElement;
      accessible: HTMLElement;
      spacer: HTMLElement;
      position: string;
    }
  >();
  const canvas = document.createElement("canvas"),
    colorContext = canvas.getContext("2d");
  const parseColor = (value: string): readonly [number, number, number, number] => {
    if (!colorContext) return [1, 1, 1, 1];
    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = value;
    colorContext.fillRect(0, 0, 1, 1);
    const c = colorContext.getImageData(0, 0, 1, 1).data;
    return [c[0]! / 255, c[1]! / 255, c[2]! / 255, c[3]! / 255];
  };
  const observer =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver((records) => {
          for (const record of records) {
            const e = entries.get(record.target as HTMLElement);
            if (e) {
              e.signature = "";
              draw(record.target as HTMLElement, e);
            }
          }
        });
  const draw = (element: HTMLElement, entry: NonNullable<ReturnType<typeof entries.get>>): boolean => {
    if (failed || signal.aborted || !element.isConnected || !bank.shader || !element.getClientRects().length)
      return false;
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
    const phone = profile ? profile.font.includes("NotoSans") : !!element.closest(".haneoka-phone"),
      control = !!element.closest(".haneoka-controls"),
      speaker = element.dataset.node === "SpeakerText" || element.classList.contains("vega-portable-speaker");
    const windowType = element.closest("[data-window]")?.getAttribute("data-window") ?? "default";
    const lang = elementLang(element);
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
              : profile?.material.endsWith("SDF Material")
                ? "dialogue-base"
                : control
                  ? "dialogue-base"
                  : outlined
                    ? "dialogue-outline"
                    : windowType === "center"
                      ? "dialogue-center"
                      : "dialogue-default";
    const resolvedMaterialName = phone ? materialName : remapMaterialForLanguage(bank, materialName, lang);
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
    const width = Math.max(1, messageWidth ?? element.clientWidth - paddingX),
      ratio = Math.min(3, Math.max(1, document.defaultView?.devicePixelRatio ?? 1));
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
    ]);
    if (signature === entry.signature && entry.spacer.parentElement === element) return true;
    const options = {
      fonts: bank.chain(lang, phone),
      fontSize,
      ruby: { scale: 0.5, verticalOffset: 1, alignment: "annotation" as const },
      maxWidth: nowrap || control ? Infinity : width,
      characterSpacing: profile?.characterSpacing ?? (phone ? 0 : control ? -6 : 2),
      lineSpacing: profile?.lineSpacing ?? (phone || control ? 0 : speaker ? 0 : -54),
      bold: Number(style.fontWeight) >= 600,
      color: parseColor(style.color),
      align: control
        ? ("left" as const)
        : style.textAlign === "center"
          ? ("center" as const)
          : style.textAlign === "right"
            ? ("right" as const)
            : ("left" as const),
      pixelScale: fontSize / (profile?.size ?? (phone ? 36 : speaker ? 36 : windowType === "default" ? 36 : 40)),
      parseColor,
    };
    let layout = layoutSdfText(entry.fullText, options);
    if (profile?.autoSize && !nowrap && element.clientHeight > 0) {
      const scale = fontSize / profile.size;
      let low = Math.max(0.1, (profile.minSize ?? profile.size) * scale);
      let high = Math.max(low, (profile.maxSize ?? profile.size) * scale);
      const maxHeight =
        element.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0);
      const fits = (value: typeof layout) => value.width <= width + 0.01 && value.height <= maxHeight + 0.01;
      let best = layoutSdfText(entry.fullText, { ...options, fontSize: low });
      for (let step = 0; step < 12 && high - low > 0.05 * scale; step++) {
        const size = (low + high) / 2;
        const candidate = layoutSdfText(entry.fullText, {
          ...options,
          fontSize: size,
        });
        if (fits(candidate)) {
          low = size;
          best = candidate;
        } else high = size;
      }
      const largest = layoutSdfText(entry.fullText, {
        ...options,
        fontSize: high,
      });
      if (fits(largest)) {
        low = high;
        best = largest;
      }
      fontSize = low;
      options.fontSize = fontSize;
      layout = best;
    }
    if (layout.missing.length) return false;
    const absent = layout.quads.some((q) => !bank.atlases.has(`${q.font.id}:${q.glyph.atlas}`));
    if (absent) {
      void bank
        .prepareText(entry.fullText, lang, phone, signal)
        .then(refresh)
        .catch(() => {});
      return false;
    }
    if (!painter) {
      const lease = bank.acquirePainter();
      painter = lease.painter;
      releasePainter = lease.release;
    }
    for (const font of options.fonts)
      font.atlases.forEach((_, index) => {
        const pixels = bank.atlases.get(`${font.id}:${index}`);
        if (pixels) painter!.upload(font, index, pixels);
      });
    const visible = entry.source === entry.fullText ? Infinity : [...layoutSdfText(entry.source, options).text].length;
    const shown = {
      ...layout,
      quads: layout.quads.filter((q) => (q.characterIndex ?? 0) < visible),
    };
    const padding = Math.max(
      4,
      fontSize * 0.35,
      ...shown.quads.flatMap((q) => [
        -q.x,
        -q.y,
        q.x + q.width - Math.max(width, layout.width),
        q.y + q.height - layout.height,
      ]),
    );
    const rendered = painter.paint(
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
    if (!context) return false;
    context.drawImage(rendered, 0, 0);
    target.style.cssText = `display:block;position:absolute;max-width:none;max-height:none;left:${(parseFloat(style.paddingLeft) || 0) - padding}px;top:${-padding}px;width:${rendered.width / ratio}px;height:${rendered.height / ratio}px;pointer-events:none`;
    const flowWidth = nowrap || control || messageRow ? layout.width : width;
    entry.spacer.style.cssText = `display:block;position:relative;flex-shrink:0;width:${flowWidth}px;height:${layout.height}px;max-width:${messageRow ? "none" : "100%"};pointer-events:none`;
    if (style.position === "static") element.style.position = "relative";
    element.dataset.haneokaSdf = "true";
    element.dataset.haneokaSdfAdvance = String(layout.width / fontSize);
    entry.accessible.textContent = layoutSdfText(entry.source, options).text;
    if (entry.spacer.parentElement !== element || entry.accessible.parentElement !== element)
      element.replaceChildren(entry.accessible, entry.spacer);
    entry.spacer.replaceChildren(target);
    target.style.left = `${-padding}px`;
    entry.signature = signature;
    return true;
  };
  const refresh = () => {
    for (const [element, entry] of entries) {
      entry.signature = "";
      try {
        draw(element, entry);
      } catch {
        failed = true;
        releasePainter?.();
        painter = undefined;
      }
    }
  };
  bank.listeners.add(refresh);
  const release = (element: HTMLElement) => {
    observer?.unobserve(element);
    const entry = entries.get(element);
    entry?.spacer.remove();
    entry?.accessible.remove();
    entries.delete(element);
    element.removeAttribute("data-haneoka-sdf");
    element.style.position = entry?.position ?? "";
  };
  return {
    render(element, text, fullText = text) {
      if (/<(?:u|s|strike|mark|sprite)[\s>]/iu.test(text)) return false;
      if (!bank.shader)
        void bank
          .prepareText(fullText, elementLang(element), !!element.closest(".haneoka-phone"), signal)
          .then(refresh)
          .catch(() => {});
      let entry = entries.get(element);
      if (!entry) {
        const accessible = document.createElement("span");
        accessible.style.cssText =
          "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:pre-wrap";
        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        entry = {
          source: text,
          fullText,
          signature: "",
          canvas,
          accessible,
          spacer,
          position: element.style.position,
        };
        entries.set(element, entry);
        observer?.observe(element);
      }
      entry.source = text;
      entry.fullText = fullText;
      let rendered = false;
      try {
        rendered = draw(element, entry);
      } catch (error) {
        failed = true;
        element.dataset.haneokaSdfError = error instanceof Error ? error.message : String(error);
        console.warn("[Haneoka] SDF text rendering failed", error);
        releasePainter?.();
        painter = undefined;
      }
      if (!rendered && element.dataset.haneokaSdf) {
        entry.spacer.remove();
        entry.accessible.remove();
        element.removeAttribute("data-haneoka-sdf");
        element.style.position = entry.position;
        entry.signature = "";
      }
      return rendered;
    },
    release,
    releaseWithin(root) {
      for (const element of [...entries.keys()]) if (element === root || root.contains(element)) release(element);
    },
    dispose() {
      observer?.disconnect();
      bank.listeners.delete(refresh);
      for (const element of [...entries.keys()]) release(element);
      releasePainter?.();
      painter = undefined;
      canvas.width = 1;
      canvas.height = 1;
    },
  };
}
