import type {
  VegaRichTextHandle,
  VegaRichTextService,
} from "@haneoka/vega-plugin-richtext";

export interface HaneokaRichTextPresenter {
  render(element: HTMLElement, value: unknown): void;
  releaseWithin(root: Node): void;
  dispose(): void;
}

const sourceText = (value: unknown): string => {
  if (
    value &&
    typeof value === "object" &&
    "source" in value &&
    typeof value.source === "string"
  ) {
    return value.source;
  }
  return typeof value === "string" ? value : value == null ? "" : String(value);
};

const sourceSignature = (value: unknown): string => {
  if (
    value &&
    typeof value === "object" &&
    "source" in value &&
    typeof value.source === "string"
  ) {
    const source = value as {
      readonly displayMode?: unknown;
      readonly format?: unknown;
      readonly language?: unknown;
      readonly source: string;
    };
    return JSON.stringify([
      source.format,
      source.source,
      source.displayMode,
      source.language,
    ]);
  }
  return JSON.stringify(["adv", sourceText(value)]);
};

export const createHaneokaRichTextPresenter = (
  service: VegaRichTextService | undefined,
): HaneokaRichTextPresenter => {
  const signatures = new WeakMap<HTMLElement, string>();
  const handles = new Map<HTMLElement, VegaRichTextHandle>();

  const release = (element: HTMLElement): void => {
    handles.get(element)?.dispose();
    handles.delete(element);
  };

  return {
    render(element, value) {
      const signature = sourceSignature(value);
      if (signatures.get(element) === signature) return;
      signatures.set(element, signature);
      release(element);
      if (!service) {
        element.removeAttribute("data-vega-rich-text-error");
        element.removeAttribute("data-vega-rich-text-format");
        element.textContent = sourceText(value);
        return;
      }
      handles.set(
        element,
        service.render(element, value, { defaultFormat: "adv" }),
      );
    },
    releaseWithin(root) {
      for (const element of handles.keys()) {
        if (element === root || root.contains(element)) release(element);
      }
    },
    dispose() {
      for (const handle of handles.values()) handle.dispose();
      handles.clear();
    },
  };
};
