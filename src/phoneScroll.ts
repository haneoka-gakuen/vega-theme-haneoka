/** A phone's native ScrollRect owns the list, independently of story advance. */
export function bindPhoneScroll(viewport: HTMLElement, content: HTMLElement, signal: AbortSignal) {
  const view = viewport.ownerDocument.defaultView;
  let following = true;
  let pointer: { id: number; y: number } | undefined;
  let dragged = false;
  let anchor: { key: string; offset: number } | undefined;
  let frame = 0;
  let disposed = false;
  let interactionAt = -Infinity;
  const now = () => view?.performance.now() ?? Date.now();
  const atEnd = () => viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 2;
  const remember = () => {
    const top = viewport.getBoundingClientRect().top;
    const row = [...content.children].find((row) => row.getBoundingClientRect().bottom > top) as
      HTMLElement | undefined;
    anchor = row?.dataset.messageKey
      ? { key: row.dataset.messageKey, offset: row.getBoundingClientRect().top - top }
      : undefined;
  };
  const settle = () => {
    if (disposed || pointer) return;
    if (following) viewport.scrollTop = viewport.scrollHeight;
    else if (anchor) {
      const row = [...content.children].find((row) => (row as HTMLElement).dataset.messageKey === anchor!.key);
      if (row)
        viewport.scrollTop += row.getBoundingClientRect().top - viewport.getBoundingClientRect().top - anchor.offset;
      remember();
    }
  };
  viewport.addEventListener(
    "scroll",
    () => {
      if (atEnd()) following = true;
      else if (pointer || now() - interactionAt < 600) following = false;
      remember();
    },
    { passive: true, signal },
  );
  viewport.addEventListener(
    "wheel",
    (event) => {
      interactionAt = now();
      if (event.deltaY < 0) following = false;
    },
    { passive: true, signal },
  );
  viewport.addEventListener(
    "pointerdown",
    (event) => {
      pointer = { id: event.pointerId, y: event.clientY };
      dragged = false;
    },
    { passive: true, signal },
  );
  viewport.addEventListener(
    "pointermove",
    (event) => {
      if (pointer?.id === event.pointerId && Math.abs(event.clientY - pointer.y) > 6) {
        dragged = true;
        interactionAt = now();
        following = false;
      }
    },
    { passive: true, signal },
  );
  const releasePointer = (event: PointerEvent) => {
    if (pointer?.id !== event.pointerId) return;
    if (event.type === "pointercancel") dragged = true;
    if (dragged) interactionAt = now();
    pointer = undefined;
    following = event.type === "pointercancel" ? false : atEnd();
    remember();
  };
  viewport.ownerDocument.addEventListener("pointerup", releasePointer, { passive: true, signal });
  viewport.ownerDocument.addEventListener("pointercancel", releasePointer, { passive: true, signal });
  viewport.addEventListener(
    "keydown",
    (event) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        interactionAt = now();
        following = false;
      }
    },
    { signal },
  );
  viewport.addEventListener(
    "click",
    (event) => {
      if (dragged) event.stopPropagation();
    },
    { signal },
  );
  const observer =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver(() => {
          if (disposed || signal.aborted) return;
          if (frame) view?.cancelAnimationFrame(frame);
          frame =
            view?.requestAnimationFrame(() => {
              frame = 0;
              settle();
            }) ?? 0;
        });
  observer?.observe(content);
  return {
    beforeUpdate() {
      if (!following) remember();
      else if (!pointer) interactionAt = -Infinity;
    },
    afterUpdate(reset = false) {
      if (reset) {
        following = true;
        anchor = undefined;
      }
      settle();
    },
    dispose() {
      disposed = true;
      observer?.disconnect();
      if (frame) view?.cancelAnimationFrame(frame);
    },
  };
}
