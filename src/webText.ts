export const usesWebText = (element: HTMLElement): boolean =>
  element.closest<HTMLElement>("[data-vega-web-text]")?.dataset.vegaWebText === "true";

/** Keep text geometry in its game panel, but expose normal, translatable DOM typography. */
export const HANEOKA_WEB_TEXT_CSS = String.raw`
[data-vega-theme][data-vega-web-text="true"] {
  font-family:var(--app-font, "Roboto Variable", sans-serif);
}
[data-vega-theme][data-vega-web-text="true"] :is([data-text-profile], [data-haneoka-text-content], .vega-shell, .vega-portable-ui),
[data-vega-theme][data-vega-web-text="true"] :is([data-text-profile], .vega-shell, .vega-portable-ui) :where(*) {
  font-family:var(--app-font, "Roboto Variable", sans-serif) !important;
  letter-spacing:normal !important;
  text-shadow:none !important;
  -webkit-text-stroke:0 !important;
}
[data-vega-theme][data-vega-web-text="true"] [data-text-profile] {
  line-height:1.4 !important;
}
`;

const styles = new WeakMap<Document, { element: HTMLStyleElement; users: number }>();
export function acquireWebTextStyle(document: Document): () => void {
  let style = styles.get(document);
  if (!style) {
    const element = document.createElement("style");
    element.textContent = HANEOKA_WEB_TEXT_CSS;
    (document.head ?? document.documentElement).append(element);
    style = { element, users: 0 };
    styles.set(document, style);
  }
  style.users++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--style!.users === 0) {
      style!.element.remove();
      styles.delete(document);
    }
  };
}

export function observeWebText(document: Document, changed: () => void): () => void {
  if (typeof MutationObserver === "undefined") return () => {};
  const observer = new MutationObserver(changed);
  observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-vega-web-text"],
  });
  return () => observer.disconnect();
}
