import type { VegaRichTextHandle, VegaRichTextService } from "@haneoka/vega-plugin-richtext";
import type { HaneokaSdfBinding } from "./typography.js";

export interface HaneokaRichTextPresenter {
  render(element: HTMLElement, value: unknown, immediate?: boolean, fullText?: string): void;
  releaseWithin(root: Node): void;
  dispose(): void;
}

const sourceText = (value: unknown): string => {
  if (value && typeof value === "object" && "source" in value && typeof value.source === "string") {
    return value.source;
  }
  return typeof value === "string" ? value : value == null ? "" : String(value);
};

const sourceSignature = (value: unknown): string => {
  if (value && typeof value === "object" && "source" in value && typeof value.source === "string") {
    const source = value as {
      readonly displayMode?: unknown;
      readonly format?: unknown;
      readonly language?: unknown;
      readonly source: string;
    };
    return JSON.stringify([source.format, source.source, source.displayMode, source.language]);
  }
  return JSON.stringify(["adv", sourceText(value)]);
};

const sourceLanguage = (value: unknown): string => {
  if (value && typeof value === "object" && "language" in value && typeof value.language === "string") {
    return value.language;
  }
  return "";
};

const textTarget = (element: HTMLElement): HTMLElement => {
  const existing = element.querySelector<HTMLElement>(":scope > [data-haneoka-text-content]");
  if (existing) return existing;
  const target = element.ownerDocument.createElement("span");
  target.dataset.haneokaTextContent = "true";
  target.style.display = "contents";
  while (element.firstChild) target.append(element.firstChild);
  element.append(target);
  return target;
};

export const createHaneokaRichTextPresenter = (
  service: VegaRichTextService | undefined,
  sdf?: HaneokaSdfBinding,
): HaneokaRichTextPresenter => {
  const signatures = new WeakMap<HTMLElement, string>();
  const handles = new Map<HTMLElement, VegaRichTextHandle>();
  const languageOverrides = new Map<HTMLElement, { previous: string | null; applied: string }>();

  const restoreLanguage = (element: HTMLElement): void => {
    const override = languageOverrides.get(element);
    if (!override) return;
    if (element.lang === override.applied) {
      if (override.previous === null) element.removeAttribute("lang");
      else element.lang = override.previous;
    }
    languageOverrides.delete(element);
  };

  const releaseDomHandle = (element: HTMLElement): void => {
    element
      .querySelector<HTMLElement>(":scope > [data-haneoka-text-content]")
      ?.removeAttribute("data-haneoka-rich-text-owned");
    handles.get(element)?.dispose();
    handles.delete(element);
    signatures.delete(element);
  };

  const release = (element: HTMLElement): void => {
    sdf?.release(element);
    releaseDomHandle(element);
    restoreLanguage(element);
  };

  return {
    render(element, value, immediate = false, fullText) {
      element.dir = "auto";
      const authoredLanguage = sourceLanguage(value);
      if (authoredLanguage) {
        const previous = languageOverrides.get(element);
        languageOverrides.set(element, {
          previous: previous && element.lang === previous.applied ? previous.previous : element.getAttribute("lang"),
          applied: authoredLanguage,
        });
        element.lang = authoredLanguage;
      } else restoreLanguage(element);
      const signature = sourceSignature(value);
      const format = value && typeof value === "object" && "format" in value ? value.format : "adv";
      const target = textTarget(element);
      let sdfRendered = false;
      try {
        sdfRendered = Boolean(
          sdf && (format === "adv" || format === "text") && sdf.render(element, sourceText(value), fullText),
        );
      } catch {
        sdf?.release(element);
      }
      if (sdfRendered) {
        try {
          if (!immediate && signatures.get(element) === signature && (handles.has(element) || !service)) return;
          const handle = handles.get(element);
          if (handle?.update) handle.update(value, { defaultFormat: "adv", immediate });
          else if (service) {
            target.dataset.haneokaRichTextOwned = "true";
            handles.set(element, service.render(target, value, { defaultFormat: "adv", immediate }));
          } else target.textContent = sourceText(value);
          signatures.set(element, signature);
          return;
        } catch {
          release(element);
        }
      }
      if (format !== "adv" && format !== "text") sdf?.release(element);
      if (!immediate && signatures.get(element) === signature && (handles.has(element) || !sdf)) return;
      const handle = handles.get(element);
      if (service && handle?.update) {
        try {
          handle.update(value, { defaultFormat: "adv", immediate });
          signatures.set(element, signature);
          return;
        } catch {
          releaseDomHandle(element);
        }
      } else {
        releaseDomHandle(element);
      }
      if (!service) {
        target.removeAttribute("data-vega-rich-text-error");
        target.removeAttribute("data-vega-rich-text-format");
        target.textContent = sourceText(value);
        signatures.set(element, signature);
        return;
      }
      target.dataset.haneokaRichTextOwned = "true";
      handles.set(element, service.render(target, value, { defaultFormat: "adv", immediate }));
      signatures.set(element, signature);
    },
    releaseWithin(root) {
      sdf?.releaseWithin(root);
      for (const element of handles.keys()) {
        if (element === root || root.contains(element)) release(element);
      }
      for (const element of languageOverrides.keys()) {
        if (element === root || root.contains(element)) restoreLanguage(element);
      }
    },
    dispose() {
      sdf?.dispose();
      for (const handle of handles.values()) handle.dispose();
      handles.clear();
      for (const element of languageOverrides.keys()) restoreLanguage(element);
    },
  };
};
