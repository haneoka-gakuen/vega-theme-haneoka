export const HANEOKA_SDF_ASSETS = {
  dialogue: {
    data: new URL("../assets/fonts/dialogue.json", import.meta.url).href,
    atlases: [new URL("../assets/fonts/dialogue-0.png", import.meta.url).href],
  },
  chat: {
    data: new URL("../assets/fonts/chat.json", import.meta.url).href,
    atlases: [new URL("../assets/fonts/chat-0.png", import.meta.url).href],
  },
  symbols: {
    data: new URL("../assets/fonts/symbols.json", import.meta.url).href,
    atlases: [new URL("../assets/fonts/symbols-0.png", import.meta.url).href],
  },
  bold: {
    data: new URL("../assets/fonts/bold.json", import.meta.url).href,
    atlases: [new URL("../assets/fonts/bold-0.png", import.meta.url).href],
  },
  numeric: {
    data: new URL("../assets/fonts/numeric.json", import.meta.url).href,
    atlases: [new URL("../assets/fonts/numeric-0.png", import.meta.url).href],
  },
  chinese: {
    data: new URL("../assets/fonts/chinese.json", import.meta.url).href,
    atlases: [
      new URL("../assets/fonts/chinese-0.png", import.meta.url).href,
      new URL("../assets/fonts/chinese-1.png", import.meta.url).href,
      new URL("../assets/fonts/chinese-2.png", import.meta.url).href,
    ],
  },
  korean: {
    data: new URL("../assets/fonts/korean.json", import.meta.url).href,
    atlases: [
      new URL("../assets/fonts/korean-0.png", import.meta.url).href,
      new URL("../assets/fonts/korean-1.png", import.meta.url).href,
    ],
  },
} as const;
export const HANEOKA_SDF_SHADER = new URL("../assets/fonts/sdf.glsl", import.meta.url).href;
export const HANEOKA_SDF_MATERIALS = new URL("../assets/fonts/materials.json", import.meta.url).href;

/** Original Unity embedded faces used only when a dynamic SDF table misses a glyph. */
export const HANEOKA_NATIVE_FONT_ASSETS = {
  chinese: {
    data: new URL("../assets/fonts/native/haneoka-native-chinese.woff2", import.meta.url).href,
    family: "Haneoka Native Chinese",
  },
  korean: {
    data: new URL("../assets/fonts/native/haneoka-native-korean.woff2", import.meta.url).href,
    family: "Haneoka Native Korean",
  },
} as const;
