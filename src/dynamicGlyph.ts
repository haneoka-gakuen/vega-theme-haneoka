import type { SdfAtlasPixels, SdfFont } from "@haneoka/vega-plugin-richtext/sdf";

// A missing glyph joins the existing SDF layout and shader. Its bitmap comes
// from the embedded dynamic face; already authored glyphs stay untouched.
const SIZE = 100;
const PADDING = 15;
const FAR = 1e10;

/** Squared Euclidean distance transform, separable over columns and rows. */
const distances = (grid: Float64Array, width: number, height: number): void => {
  const length = Math.max(width, height);
  const input = new Float64Array(length);
  const output = new Float64Array(length);
  const vertices = new Int32Array(length);
  const boundaries = new Float64Array(length + 1);
  const transform = (count: number): void => {
    let last = 0;
    vertices[0] = 0;
    boundaries[0] = -Infinity;
    boundaries[1] = Infinity;
    for (let q = 1; q < count; q++) {
      let intersection: number;
      do {
        const p = vertices[last]!;
        intersection = (input[q]! + q * q - input[p]! - p * p) / (2 * (q - p));
        if (intersection > boundaries[last]!) break;
        last--;
      } while (last >= 0);
      last++;
      vertices[last] = q;
      boundaries[last] = intersection!;
      boundaries[last + 1] = Infinity;
    }
    last = 0;
    for (let q = 0; q < count; q++) {
      while (boundaries[last + 1]! < q) last++;
      const p = vertices[last]!;
      output[q] = (q - p) ** 2 + input[p]!;
    }
  };
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) input[y] = grid[y * width + x]!;
    transform(height);
    for (let y = 0; y < height; y++) grid[y * width + x] = output[y]!;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) input[x] = grid[y * width + x]!;
    transform(width);
    for (let x = 0; x < width; x++) grid[y * width + x] = output[x]!;
  }
};

export function createDynamicGlyph(
  document: Document,
  character: string,
  family: string,
  primary: SdfFont,
  weight = 400,
): { font: SdfFont; pixels: SdfAtlasPixels } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Dynamic font rasterization is unavailable");
  const face = `${weight} ${SIZE}px ${family}`;
  context.font = face;
  const measure = context.measureText(character);
  const left = Math.ceil(measure.actualBoundingBoxLeft);
  const top = Math.ceil(measure.actualBoundingBoxAscent);
  const width = Math.max(1, Math.ceil(measure.actualBoundingBoxRight) + left);
  const height = Math.max(1, Math.ceil(measure.actualBoundingBoxDescent) + top);
  canvas.width = width + 2 * PADDING;
  canvas.height = height + 2 * PADDING;
  context.font = face;
  context.fillStyle = "white";
  context.fillText(character, PADDING + left, PADDING + top);
  const bitmap = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const outer = new Float64Array(canvas.width * canvas.height);
  const inner = new Float64Array(outer.length);
  for (let i = 0; i < outer.length; i++) {
    const alpha = bitmap[i * 4 + 3]! / 255;
    outer[i] = alpha === 1 ? 0 : alpha === 0 ? FAR : Math.max(0, 0.5 - alpha) ** 2;
    inner[i] = alpha === 0 ? 0 : alpha === 1 ? FAR : Math.max(0, alpha - 0.5) ** 2;
  }
  distances(outer, canvas.width, canvas.height);
  distances(inner, canvas.width, canvas.height);
  const alpha = new Uint8Array(outer.length);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = y * canvas.width + x;
      const signed = Math.sqrt(inner[i]!) - Math.sqrt(outer[i]!);
      alpha[(canvas.height - 1 - y) * canvas.width + x] = Math.round(
        Math.max(0, Math.min(255, 127.5 + (signed * 127.5) / (PADDING + 1))),
      );
    }
  }
  const font: SdfFont = {
    ...primary,
    id: `dynamic:${family}:${character.codePointAt(0)}`,
    size: SIZE,
    scale: 1,
    ascent: (primary.ascent * primary.scale * SIZE) / primary.size,
    descent: (primary.descent * primary.scale * SIZE) / primary.size,
    lineHeight: (primary.lineHeight * primary.scale * SIZE) / primary.size,
    padding: PADDING,
    atlasWidth: canvas.width,
    atlasHeight: canvas.height,
    characters: { [String(character.codePointAt(0))]: [0, 1] },
    glyphs: {
      "0": {
        index: 0,
        atlas: 0,
        rect: [PADDING, PADDING, width, height],
        metrics: [width, height, -left, top, measure.width],
        scale: 1,
      },
    },
    pairs: {},
    atlases: [],
  };
  const pixels = { width: canvas.width, height: canvas.height, alpha };
  canvas.width = canvas.height = 1;
  return { font, pixels };
}
