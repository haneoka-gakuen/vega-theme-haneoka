import type { VegaUiSlotContext } from "@haneoka/vega/plugin";

export function bindHaneokaViewport(host: HTMLElement, context: VegaUiSlotContext) {
  const previous = host.style.cssText;
  let signature = "";
  return {
    update() {
      const viewport = context.state.viewport;
      if (!viewport || viewport.width <= 1 || viewport.height <= 1) return;
      const values = [viewport.x, viewport.y, viewport.width, viewport.height];
      if (!values.every(Number.isFinite)) return;
      const next = values.join(",");
      if (next === signature) return;
      signature = next;
      Object.assign(host.style, {
        inset: "auto",
        left: `${viewport.x}px`,
        top: `${viewport.y}px`,
        width: `${viewport.width}px`,
        height: `${viewport.height}px`,
        containerType: "size",
      });
    },
    dispose() {
      host.style.cssText = previous;
    },
  };
}
