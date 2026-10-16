export interface SceneGradient {
  enabled?: boolean;
  blendMode?: number;
  angle: number;
  keys: Record<string, unknown>;
}

interface SpriteImage {
  color: readonly number[];
  mode: number;
  fillCenter?: boolean;
  border: readonly number[];
}

const interpolate = <T extends { time: number }>(
  list: readonly T[],
  time: number,
  read: (key: T) => number,
): number => {
  const next = list.findIndex((key) => key.time >= time);
  if (next <= 0) return read(next === 0 ? list[0]! : list[list.length - 1]!);
  const a = list[next - 1]!,
    b = list[next]!,
    p = (time - a.time) / (b.time - a.time);
  return read(a) + (read(b) - read(a)) * p;
};

const stops = ({ keys }: SceneGradient) => ({
  colors: Array.from({ length: Number(keys.m_NumColorKeys) }, (_, i) => ({
    time: Number(keys[`ctime${i}`]) / 65535,
    color: keys[`key${i}`] as Record<string, number>,
  })),
  alphas: Array.from({ length: Number(keys.m_NumAlphaKeys) }, (_, i) => ({
    time: Number(keys[`atime${i}`]) / 65535,
    alpha: (keys[`key${i}`] as Record<string, number>).a!,
  })),
});

export function gradientCss(value: SceneGradient): string {
  const { colors, alphas } = stops(value);
  const times = [...new Set([...colors, ...alphas].map((key) => key.time))].sort((a, b) => a - b);
  return `linear-gradient(${90 - value.angle}deg,${times
    .map((time) => {
      const rgb = ["r", "g", "b"].map((key) => interpolate(colors, time, (entry) => entry.color[key]!) * 255);
      return `rgba(${rgb.join(",")},${interpolate(alphas, time, (entry) => entry.alpha)}) ${time * 100}%`;
    })
    .join(",")})`;
}

const slicedPosition = (
  position: number,
  extent: number,
  sourceExtent: number,
  before: number,
  after: number,
): number => {
  const scale = Math.min(1, extent / (before + after || 1));
  const first = before * scale,
    last = after * scale;
  if (position < first) return position / scale;
  if (position >= extent - last) return sourceExtent - (extent - position) / scale;
  return before + ((position - first) * (sourceExtent - before - after)) / (extent - first - last);
};

/** One cached Image preserves the Sprite's RGBA and sliced edges under the vertex gradient. */
export function composeGradientSprite(
  context: CanvasRenderingContext2D,
  source: ImageData,
  image: SpriteImage,
  size: readonly [number, number],
  gradient: SceneGradient,
): ImageData {
  const [width, height] = size;
  const output = context.createImageData(Math.ceil(width), Math.ceil(height));
  const { colors, alphas } = stops(gradient);
  const angle = (gradient.angle * Math.PI) / 180,
    dx = Math.cos(angle),
    dy = -Math.sin(angle);
  const length = Math.abs(width * dx) + Math.abs(height * dy);
  const [top, right, bottom, left] = image.mode === 1 ? image.border : [0, 0, 0, 0];
  const tintAt = (position: number) => [
    ...["r", "g", "b"].map((key) => interpolate(colors, position, (entry) => entry.color[key]!)),
    interpolate(alphas, position, (entry) => entry.alpha),
  ];
  const horizontalTints =
    dy === 0
      ? Array.from({ length: output.width }, (_, x) =>
          tintAt(dx > 0 ? (x + 0.5) / output.width : 1 - (x + 0.5) / output.width),
        )
      : undefined;
  for (let y = 0; y < output.height; y++) {
    const py = ((y + 0.5) * height) / output.height;
    const sy = Math.max(0, Math.min(source.height - 1, slicedPosition(py, height, source.height, top!, bottom!) - 0.5));
    const y0 = Math.floor(sy),
      y1 = Math.min(source.height - 1, y0 + 1),
      fy = sy - y0;
    for (let x = 0; x < output.width; x++) {
      const px = ((x + 0.5) * width) / output.width;
      const sx = Math.max(0, Math.min(source.width - 1, slicedPosition(px, width, source.width, left!, right!) - 0.5));
      const x0 = Math.floor(sx),
        x1 = Math.min(source.width - 1, x0 + 1),
        fx = sx - x0;
      if (
        image.mode === 1 &&
        image.fillCenter === false &&
        sx + 0.5 >= left! &&
        sx + 0.5 < source.width - right! &&
        sy + 0.5 >= top! &&
        sy + 0.5 < source.height - bottom!
      )
        continue;
      const p = Math.max(0, Math.min(1, 0.5 + ((px - width / 2) * dx + (py - height / 2) * dy) / length));
      const tint = horizontalTints?.[x] ?? tintAt(p);
      const a0 = (y0 * source.width + x0) * 4,
        a1 = (y0 * source.width + x1) * 4;
      const b0 = (y1 * source.width + x0) * 4,
        b1 = (y1 * source.width + x1) * 4;
      for (let channel = 0; channel < 4; channel++) {
        const a = source.data[a0 + channel]! * (1 - fx) + source.data[a1 + channel]! * fx;
        const b = source.data[b0 + channel]! * (1 - fx) + source.data[b1 + channel]! * fx;
        output.data[(y * output.width + x) * 4 + channel] =
          (a * (1 - fy) + b * fy) * tint[channel]! * (gradient.blendMode === 1 ? image.color[channel]! : 1);
      }
    }
  }
  return output;
}
