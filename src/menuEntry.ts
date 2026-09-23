let nextPaintId = 0;

export function createHaneokaMenuEntry(document: Document) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "haneoka-menu-entry";
  button.setAttribute("aria-haspopup", "dialog");

  const surface = document.createElement("span");
  surface.className = "haneoka-menu-press";
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  const id = `haneoka-menu-${++nextPaintId}`;
  svg.setAttribute("viewBox", "0 0 209.5475 60");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("haneoka-menu-face");
  svg.innerHTML = `
    <defs>
      <linearGradient id="${id}-rim" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#aa96d3"/>
        <stop offset=".5" stop-color="#968ac7"/>
        <stop offset="1" stop-color="#8282be"/>
      </linearGradient>
      <linearGradient id="${id}-fill" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#414d7d"/>
        <stop offset=".3" stop-color="#46548f"/>
        <stop offset=".5" stop-color="#4a599b"/>
        <stop offset=".7" stop-color="#4c5ca3"/>
        <stop offset="1" stop-color="#4d5ea8"/>
      </linearGradient>
    </defs>
    <rect width="209.5475" height="60" rx="30" fill="#040834" fill-opacity=".302"/>
    <rect x="2" y="2" width="205.5475" height="56" rx="28" fill="url(#${id}-rim)"/>
    <rect x="4" y="4" width="201.5475" height="52" rx="26" fill="url(#${id}-fill)"/>
    <path d="M 142.2375 25.5 H 160.2375 L 151.2375 35.5 Z" fill="white" stroke="#0b0b57" stroke-opacity=".4" stroke-width="3" stroke-linejoin="round" paint-order="stroke"/>
  `;

  const label = document.createElement("span");
  label.className = "haneoka-menu-label";
  label.textContent = "MENU";
  label.dataset.textAuto = "true";
  label.dataset.textProfile = JSON.stringify({
    size: 25.649999618530273,
    font: "A-OTF-ShinGoPr6N-Regular SDF",
    material: "A-OTF-ShinGoPr6N-Regular - OutlineButtonText",
    characterSpacing: 0,
    lineSpacing: 0,
  });
  surface.append(svg, label);
  button.append(surface);
  return { button, surface, label };
}
