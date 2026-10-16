import type { VegaWebUiSlotContext as VegaUiSlotContext } from "@haneoka/vega/web/ui";

import type { VegaShellTextRenderer } from "@haneoka/vega/shell";
import { createHaneokaSdfBinding } from "./typography.js";
const profile = JSON.stringify({
  size: 28,
  font: "A-OTF-ShinGoPr6N-Regular SDF",
  material: "A-OTF-ShinGoPr6N-Regular SDF Material",
  characterSpacing: 0,
  lineSpacing: 0,
});
export function createHaneokaShellTypography(context: VegaUiSlotContext): VegaShellTextRenderer {
  const binding = createHaneokaSdfBinding(context.root.ownerDocument, context.resources, context.signal);
  return {
    set(element, text) {
      // Shell pages use selectable DOM text. Gameplay labels retain source SDF.
      if (element.closest('.vega-shell')) {
        if (element.textContent !== text) element.textContent = text;
        return;
      }
      if (element.classList.contains("vega-shell__eyebrow")) {
        element.textContent = text;
        return;
      }
      if (["SPAN", "STRONG", "H2"].includes(element.tagName)) element.dataset.textAuto = "true";
      element.dataset.textProfile = profile;
      if (!binding.render(element, text) && element.textContent !== text) element.textContent = text;
    },
    releaseWithin: (root) => binding.releaseWithin(root),
    dispose: () => binding.dispose(),
  };
}
