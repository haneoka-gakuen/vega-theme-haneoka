import { HANEOKA_CONTROL_ASSETS } from "./controlAssets.js";

export function createHaneokaMenuEntry(document: Document) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "haneoka-menu-entry";
  // RectTransform: top-right anchor, pivot (1,1), position (-84,-8), 120×120.
  // Keep a 44px hit target while the painted face follows the story viewport.
  Object.assign(button.style, {
    top: "0.740741cqh",
    right: "7.777778cqh",
    width: "max(44px,11.111111cqh)",
    height: "max(44px,11.111111cqh)",
    borderRadius: "0",
  });
  const surface = document.createElement("span");
  surface.className = "haneoka-menu-press";
  Object.assign(surface.style, {
    top: "0",
    right: "0",
    width: "11.111111cqh",
    height: "11.111111cqh",
    borderRadius: "0",
  });
  const face = document.createElement("img");
  face.className = "haneoka-menu-face";
  face.src = HANEOKA_CONTROL_ASSETS.menuFrame;
  face.alt = "";
  face.draggable = false;
  face.width = 120;
  face.height = 120;
  const icon = document.createElement("img");
  icon.src = HANEOKA_CONTROL_ASSETS.menuOpen;
  icon.alt = "";
  icon.draggable = false;
  Object.assign(icon.style, {
    position: "absolute",
    left: "25%",
    top: "25%",
    width: "50%",
    height: "50%",
  });
  surface.append(face, icon);
  button.append(surface);
  return {
    button,
    surface,
    setExpanded(expanded: boolean) {
      icon.src = expanded ? HANEOKA_CONTROL_ASSETS.menuClose : HANEOKA_CONTROL_ASSETS.menuOpen;
    },
  };
}
