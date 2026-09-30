import type { SdfAtlasPixels, SdfFont, SdfGlyph, SdfTextLayout } from "@haneoka/vega-plugin-richtext/sdf";

/** Repack only referenced glyph texels; positions, metrics and SDF values stay exact. */
export function compactGlyphAtlases(
  layout: SdfTextLayout,
  source: ReadonlyMap<string, SdfAtlasPixels>,
): { layout: SdfTextLayout; pixels: ReadonlyMap<string, SdfAtlasPixels> } {
  const groups = new Map<string, { font: SdfFont; glyphs: Map<number, SdfGlyph> }>();
  for (const quad of layout.quads) {
    const key = `${quad.font.id}:${quad.glyph.atlas}`;
    let group = groups.get(key);
    if (!group) {
      group = { font: quad.font, glyphs: new Map() };
      groups.set(key, group);
    }
    group.glyphs.set(quad.glyph.index, quad.glyph);
  }
  const pixels = new Map<string, SdfAtlasPixels>();
  let totalBytes = 0;
  const copies = new Map<string, { font: SdfFont; glyphs: ReadonlyMap<number, SdfGlyph> }>();
  for (const [key, group] of groups) {
    const original = source.get(key);
    if (!original) throw new Error(`Font atlas unavailable: ${key}`);
    const glyphs = [...group.glyphs.values()].sort((a, b) => a.index - b.index);
    const padding = group.font.padding;
    const cellWidth = Math.max(...glyphs.map((g) => g.rect[2] + padding * 2));
    const cellHeight = Math.max(...glyphs.map((g) => g.rect[3] + padding * 2));
    const columns = Math.ceil(Math.sqrt(glyphs.length));
    const width = columns * cellWidth;
    const height = Math.ceil(glyphs.length / columns) * cellHeight;
    totalBytes += width * height;
    if (width > 4096 || height > 4096 || totalBytes > 64 * 1024 * 1024)
      throw new RangeError("Glyph subset exceeds the font drawing capacity");
    const alpha = new Uint8Array(width * height);
    const repacked = new Map<number, SdfGlyph>();
    for (const [index, glyph] of glyphs.entries()) {
      const x = (index % columns) * cellWidth;
      const y = Math.floor(index / columns) * cellHeight;
      const [sx, sy, gw, gh] = glyph.rect;
      for (let row = 0; row < gh + padding * 2; row++) {
        const sourceRow = Math.max(0, Math.min(original.height - 1, sy - padding + row));
        for (let column = 0; column < gw + padding * 2; column++) {
          const sourceColumn = Math.max(0, Math.min(original.width - 1, sx - padding + column));
          alpha[(y + row) * width + x + column] = original.alpha[sourceRow * original.width + sourceColumn]!;
        }
      }
      repacked.set(glyph.index, { ...glyph, atlas: 0, rect: [x + padding, y + padding, gw, gh] });
    }
    const font: SdfFont = {
      ...group.font,
      id: `subset:${key}:${glyphs.map((g) => g.index).join(",")}`,
      atlasWidth: width,
      atlasHeight: height,
      glyphs: Object.fromEntries([...repacked].map(([index, glyph]) => [String(index), glyph])),
      atlases: [],
    };
    copies.set(key, { font, glyphs: repacked });
    pixels.set(`${font.id}:0`, { width, height, alpha });
  }
  return {
    layout: {
      ...layout,
      quads: layout.quads.map((quad) => {
        const copy = copies.get(`${quad.font.id}:${quad.glyph.atlas}`)!;
        return { ...quad, font: copy.font, glyph: copy.glyphs.get(quad.glyph.index)! };
      }),
    },
    pixels,
  };
}
