import type { VegaUiSlotContext } from "@haneoka/vega/plugin";

export function bindHaneokaViewport(host: HTMLElement, context: VegaUiSlotContext) {
  const previous = host.style.cssText;
  let signature = "";
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/u.test(navigator.userAgent);
  return {
    update() {
      const viewport = context.state.viewport;
      if (!viewport || viewport.width <= 1 || viewport.height <= 1) return;
      let { x, y, width, height } = viewport;
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) return;
      // iOS WebKit: the element-based Fullscreen API is unavailable; the
      // visual viewport is the only reliable frame. Snap to it so the
      // player fills the visible area without the toolbar offset.
      if (isIOS && typeof window !== "undefined" && window.visualViewport) {
        const vv = window.visualViewport;
        const left = vv.offsetLeft;
        const top = vv.offsetTop;
        x = left;
        y = top;
        width = vv.width;
        height = vv.height;
      }
      const next = [x, y, width, height].join(",");
      if (next === signature) return;
      signature = next;
      Object.assign(host.style, {
        inset: "auto",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        containerType: "size",
      });
    },
    dispose() {
      host.style.cssText = previous;
    },
  };
}
