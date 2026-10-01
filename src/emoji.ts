import type { SdfFont, SdfGlyph, SdfGlyphQuad } from "@haneoka/vega-plugin-richtext/sdf";
import {
  NATIVE_EMOJI_RECORDS,
  NATIVE_EMOJI_SHEET_HEIGHT,
  NATIVE_EMOJI_SHEET_WIDTH,
  type NativeEmojiRecord,
} from "./emojiData.js";

const TOKEN_START = 0xf0000;
const sequences = NATIVE_EMOJI_RECORDS.map((record) => ({
  record,
  text: String.fromCodePoint(...record[0].split("-").map((part) => parseInt(part, 16))),
}))
  .filter(({ text }) => [...text].length > 1)
  .sort((a, b) => b.text.length - a.text.length);
const byUnicode = new Map<number, NativeEmojiRecord>();
for (const record of NATIVE_EMOJI_RECORDS) if (!byUnicode.has(record[1])) byUnicode.set(record[1], record);
const byName = new Map(NATIVE_EMOJI_RECORDS.map((record) => [record[0], record]));
const token = (record: NativeEmojiRecord): string => String.fromCodePoint(TOKEN_START + record[2]);

/** Match native sequences first. A single character falls back only after the font chain. */
export function encodeNativeEmojiText(
  text: string,
  fonts: readonly SdfFont[],
): { text: string; sourceIndices: number[] } {
  let result = "",
    offset = 0,
    rawIndex = 0;
  const sourceIndices: number[] = [];
  while (offset < text.length) {
    const sequence = sequences.find((entry) => text.startsWith(entry.text, offset));
    const character = String.fromCodePoint(text.codePointAt(offset)!);
    const record =
      sequence?.record ??
      (fonts.some((font) => font.characters[String(character.codePointAt(0))])
        ? undefined
        : byUnicode.get(character.codePointAt(0)!));
    const consumed = sequence?.text ?? character;
    sourceIndices.push(rawIndex);
    result += record ? token(record) : character;
    offset += consumed.length;
    rawIndex += [...consumed].length;
  }
  return { text: result, sourceIndices };
}

/** Retain ADV tags; explicit sprite tags and ruby annotations use the same native table. */
export function encodeNativeEmoji(source: string, fonts: readonly SdfFont[]): string {
  return source
    .split(/(<[^>]*>)/u)
    .map((part) => {
      if (!part.startsWith("<")) return encodeNativeEmojiText(part, fonts).text;
      const sprite = part.match(/^<sprite\s+name\s*=\s*["']?([^"'\s>]+)["']?\s*>$/iu);
      const record = sprite ? byName.get(sprite[1]!.toLowerCase()) : undefined;
      if (record) return token(record);
      return /^<ruby\s*=/iu.test(part) ? encodeNativeEmojiText(part, fonts).text : part;
    })
    .join("");
}

export const isNativeEmojiCharacter = (character: string): boolean => {
  const index = (character.codePointAt(0) ?? 0) - TOKEN_START;
  return index >= 0 && index < NATIVE_EMOJI_RECORDS.length;
};
export const isNativeEmojiQuad = (quad: SdfGlyphQuad): boolean => quad.font.id.startsWith("emoji:");

const spriteFonts = new WeakMap<SdfFont, SdfFont>();
/** TMP sprite face pointSize=0: scale metrics by primary face ascent / sprite height. */
export function nativeEmojiFont(primary: SdfFont): SdfFont {
  const existing = spriteFonts.get(primary);
  if (existing) return existing;
  const characters: Record<string, readonly [number, number]> = {};
  const glyphs: Record<string, SdfGlyph> = {};
  for (const record of NATIVE_EMOJI_RECORDS) {
    const factor = primary.ascent / record[6][1];
    characters[String(TOKEN_START + record[2])] = [record[2], record[3]];
    glyphs[String(record[2])] = {
      index: record[2],
      atlas: 0,
      rect: record[5],
      metrics: record[6].map((value) => value * factor) as unknown as SdfGlyph["metrics"],
      scale: record[4],
    };
  }
  const font: SdfFont = {
    ...primary,
    id: `emoji:${primary.id}`,
    padding: 0,
    normalWeight: 0,
    boldWeight: 0,
    boldSpacing: 0,
    atlasWidth: NATIVE_EMOJI_SHEET_WIDTH,
    atlasHeight: NATIVE_EMOJI_SHEET_HEIGHT,
    characters,
    glyphs,
    atlases: [],
    pairs: {},
  };
  spriteFonts.set(primary, font);
  return font;
}

export async function decodeNativeEmojiSheet(
  document: Document,
  bytes: Uint8Array,
  signal: AbortSignal,
): Promise<HTMLImageElement> {
  if (signal.aborted) throw signal.reason;
  const url = URL.createObjectURL(new Blob([bytes.slice().buffer], { type: "image/png" }));
  const image = document.createElement("img");
  try {
    await new Promise<void>((resolve, reject) => {
      const abort = () => {
        image.removeAttribute("src");
        reject(signal.reason);
      };
      const finish = (error?: Error) => {
        signal.removeEventListener("abort", abort);
        image.onload = null;
        image.onerror = null;
        error ? reject(error) : resolve();
      };
      image.onload = () => finish();
      image.onerror = () => finish(new Error("Native emoji sheet could not be decoded"));
      signal.addEventListener("abort", abort, { once: true });
      image.src = url;
    });
    if (signal.aborted) throw signal.reason;
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** TextMeshPro/Sprite preserves atlas RGB; text color only limits alpha (tintAllSprites=false). */
export function paintNativeEmoji(
  context: CanvasRenderingContext2D,
  sheet: CanvasImageSource,
  quads: readonly SdfGlyphQuad[],
  ratio: number,
  padding: number,
): void {
  for (const quad of quads) {
    const [x, y, width, height] = quad.glyph.rect;
    context.save();
    context.globalAlpha = quad.color[3];
    context.translate((quad.x + padding + quad.width / 2) * ratio, (quad.y + padding + quad.height / 2) * ratio);
    if (quad.rotate) context.rotate((quad.rotate * Math.PI) / 180);
    if (quad.italic) context.transform(1, 0, -0.3, 1, 0, 0);
    context.drawImage(
      sheet,
      x,
      NATIVE_EMOJI_SHEET_HEIGHT - y - height,
      width,
      height,
      (-quad.width * ratio) / 2,
      (-quad.height * ratio) / 2,
      quad.width * ratio,
      quad.height * ratio,
    );
    context.restore();
  }
}
