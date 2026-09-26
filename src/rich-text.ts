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

export const createHaneokaRichTextPresenter = (
  service: VegaRichTextService | undefined,
  sdf?: HaneokaSdfBinding,
): HaneokaRichTextPresenter => {
  const signatures = new WeakMap<HTMLElement, string>();
  const handles = new Map<HTMLElement, VegaRichTextHandle>();

  const release = (element: HTMLElement): void => {
    handles.get(element)?.dispose();
    handles.delete(element);
    signatures.delete(element);
  };

  return {
    render(element, value, immediate = false, fullText) {
      element.dir = "auto";
      const authoredLanguage = sourceLanguage(value);
      if (authoredLanguage) element.lang = authoredLanguage;
      else if (!element.lang.trim()) {
        element.lang =
          element.parentElement?.closest("[lang]")?.getAttribute("lang") ||
          element.ownerDocument.documentElement.lang ||
          "und";
      }
      const signature = sourceSignature(value);
      const format = value && typeof value === "object" && "format" in value ? value.format : "adv";
      if (sdf && (format === "adv" || format === "text") && sdf.render(element, sourceText(value), fullText)) {
        handles.get(element)?.dispose();
        handles.delete(element);
        signatures.set(element, signature);
        return;
      }
      if (format !== "adv" && format !== "text") sdf?.release(element);
      if (!immediate && signatures.get(element) === signature && (handles.has(element) || !sdf)) return;
      const target = element.querySelector<HTMLElement>(":scope > [data-haneoka-text-content]") ?? element;
      const handle = handles.get(element);
      if (service && handle?.update) {
        try {
          handle.update(value, { defaultFormat: "adv", immediate });
          signatures.set(element, signature);
          return;
        } catch {
          release(element);
        }
      } else {
        release(element);
      }
      if (!service) {
        target.removeAttribute("data-vega-rich-text-error");
        target.removeAttribute("data-vega-rich-text-format");
        target.textContent = sourceText(value);
        signatures.set(element, signature);
        return;
      }
      handles.set(element, service.render(target, value, { defaultFormat: "adv", immediate }));
      signatures.set(element, signature);
    },
    releaseWithin(root) {
      sdf?.releaseWithin(root);
      for (const element of handles.keys()) {
        if (element === root || root.contains(element)) release(element);
      }
    },
    dispose() {
      sdf?.dispose();
      for (const handle of handles.values()) handle.dispose();
      handles.clear();
    },
  };
};
