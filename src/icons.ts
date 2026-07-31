export type HaneokaIconName =
  | "auto"
  | "back"
  | "chevron-down"
  | "chevron-up"
  | "close"
  | "fast"
  | "flow"
  | "fullscreen"
  | "log"
  | "pause"
  | "play"
  | "save"
  | "settings"
  | "skip"
  | "subtitles";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const ICON_PATHS: Readonly<Record<HaneokaIconName, readonly string[]>> =
  Object.freeze({
    auto: ["M8.1 5.2A7.5 7.5 0 1 1 5.2 8", "M4.5 4.5v4h4", "m10 4 5 3-5 3Z"],
    back: ["m15 5-7 7 7 7"],
    "chevron-down": ["m7 9 5 5 5-5"],
    "chevron-up": ["m7 15 5-5 5 5"],
    close: ["m6 6 12 12", "M18 6 6 18"],
    fast: ["m4 6 7 6-7 6Z", "m11 6 7 6-7 6Z"],
    flow: [
      "M7 5h10v4H7z",
      "M4 15h7v4H4z",
      "M13 15h7v4h-7z",
      "M12 9v3m-4 0h8m-8 0v3m8-3v3",
    ],
    fullscreen: ["M8 3H3v5", "M16 3h5v5", "M21 16v5h-5", "M8 21H3v-5"],
    log: ["M5 4h14v12H9l-4 4z", "M8 8h8", "M8 12h6"],
    pause: ["M7 5h3v14H7z", "M14 5h3v14h-3z"],
    play: ["m8 5 11 7-11 7Z"],
    save: ["M5 3h12l2 2v16H5z", "M8 3v6h8V3", "M8 14h8v7H8z"],
    settings: [
      "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
      "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z",
    ],
    skip: ["M5 5v14l9-7z", "M17 5v14"],
    subtitles: [
      "M4 5h16v12H9l-5 3z",
      "M7 9h4",
      "M13 9h4",
      "M7 13h3",
      "M12 13h5",
    ],
  });

export const createHaneokaIcon = (
  document: Document,
  name: HaneokaIconName,
): SVGSVGElement => {
  const icon = document.createElementNS(SVG_NAMESPACE, "svg");
  icon.classList.add("haneoka-icon");
  icon.dataset.icon = name;
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  for (const data of ICON_PATHS[name]) {
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    path.setAttribute("d", data);
    path.setAttribute("vector-effect", "non-scaling-stroke");
    icon.append(path);
  }
  return icon;
};
