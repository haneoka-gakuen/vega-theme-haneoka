import { bindHaneokaViewport } from "./viewport.js";
import { createAdvTextRenderValue, type VegaDisposable, type VegaUiSlotContext } from "@haneoka/vega/plugin";
import { VEGA_SHELL_CONTROLLER } from "@haneoka/vega/shell";
import { VEGA_RICH_TEXT_SERVICE } from "@haneoka/vega-plugin-richtext";
import { createHaneokaRichTextPresenter } from "./rich-text.js";
import { createHaneokaSdfBinding } from "./typography.js";
import { createHaneokaScene, loadHaneokaScenes, type HaneokaScene } from "./scene.js";
import { mountHaneokaPhone } from "./phone.js";
import { HANEOKA_UI_TEXT, haneokaUiLocale } from "./locale.js";

export const mountHaneokaStoryUi = (host: HTMLElement, context: VegaUiSlotContext): VegaDisposable => {
  const document = host.ownerDocument,
    root = document.createElement("section");
  root.className = "haneoka-story-ui";
  root.setAttribute("aria-live", "polite");
  host.append(root);
  const viewport = bindHaneokaViewport(host, context);
  const richText = createHaneokaRichTextPresenter(
    context.services(VEGA_RICH_TEXT_SERVICE),
    createHaneokaSdfBinding(document, context.resources, context.signal),
  );
  const phone = mountHaneokaPhone(root, context),
    events = new AbortController();
  const centerBackdrop = document.createElement("div");
  centerBackdrop.className = "haneoka-center-talk-backdrop";
  centerBackdrop.hidden = true;
  centerBackdrop.setAttribute("aria-hidden", "true");
  root.insertBefore(centerBackdrop, phoneRoot());
  const loading = document.createElement("div");
  loading.className = "haneoka-loading";
  const loadingLabel = document.createElement("span"),
    progress = document.createElement("progress");
  progress.max = 1;
  loading.append(loadingLabel, progress);
  const error = document.createElement("div");
  error.className = "haneoka-error";
  error.setAttribute("role", "alert");
  root.append(loading, error);
  const shell = context.services(VEGA_SHELL_CONTROLLER);
  let labels = HANEOKA_UI_TEXT[haneokaUiLocale("auto", document)],
    disposed = false;
  const scenes = new Map<string, HaneokaScene>();
  let choiceScenes: HaneokaScene[] = [],
    choiceKey = "";
  const advance = (event: Event) => {
    event.stopPropagation();
    context.player.requestNext();
  };
  let refresh = () => {};
  const subscription = shell?.subscribe((snapshot) => {
    labels = HANEOKA_UI_TEXT[haneokaUiLocale(snapshot.settings.uiLanguage, document)];
    for (const name of ["default", "center", "psych"])
      scenes.get(name)?.root.setAttribute("aria-label", labels.advance);
  });
  void loadHaneokaScenes(document)
    .then((data) => {
      if (disposed || context.signal.aborted) return;
      for (const [key, name] of Object.entries({
        default: "UIDefaultTalkWindow",
        center: "UICenterTalkWindow",
        psych: "UIPsychTalkWindow",
        title: "UIAdvTitleView",
        location: "UIAdvLocationVIew",
        subtitles: "UIAdvSubtitlesView",
        choices: "UIAdvChoiceView",
      })) {
        const scene = createHaneokaScene(document, data, name);
        scene.root.hidden = true;
        scenes.set(key, scene);
        root.insertBefore(scene.root, phoneRoot());
        if (["default", "center", "psych"].includes(key)) {
          scene.root.dataset.window = key;
          scene.root.tabIndex = 0;
          scene.root.setAttribute("role", "button");
          scene.root.setAttribute("aria-label", labels.advance);
          scene.root.style.pointerEvents = "auto";
          scene.root.addEventListener("click", advance, {
            signal: events.signal,
          });
          scene.root.addEventListener(
            "keydown",
            (event) => {
              if (
                !event.repeat &&
                !event.isComposing &&
                !event.ctrlKey &&
                !event.metaKey &&
                (event.key === "Enter" || event.key === " ")
              ) {
                event.preventDefault();
                advance(event);
              }
            },
            { signal: events.signal },
          );
        }
      }
      const title = scenes.get("title")!,
        location = scenes.get("location")!,
        subtitles = scenes.get("subtitles")!,
        choiceContainer = scenes.get("choices")!.get("Choices");
      choiceContainer.replaceChildren();
      let titleKey = "",
        titleUntil = 0,
        locationKey = "",
        locationUntil = 0,
        seekRevision = -1;
      refresh = () => {
        if (disposed) return;
        const state = context.state;
        loading.hidden = !state.loading;
        loadingLabel.textContent = labels.loading;
        progress.value = state.preload.total ? state.preload.done / state.preload.total : 0;
        error.hidden = !state.error;
        error.textContent = state.error || "";
        if (state.seeking) return;
        const restored = seekRevision !== context.player.seekRevision;
        seekRevision = context.player.seekRevision;
        const windowType = /psych/iu.test(state.talk.window)
          ? "psych"
          : /center/iu.test(state.talk.window)
            ? "center"
            : "default";
        for (const key of ["default", "center", "psych"]) {
          const scene = scenes.get(key)!;
          scene.root.hidden =
            !state.talk.enabled ||
            !state.talk.visible ||
            (state.talk.presentation ?? "default") !== "default" ||
            windowType !== key;
          if (scene.root.hidden) continue;
          scene.root.style.translate = `${state.talk.shakeX}px ${state.talk.shakeY}px`;
          const text = scene.get("TalkText");
          text.style.setProperty("--vega-dialogue-font-scale", String(state.talk.fontScale ?? 1));
          text.lang = state.talk.textLang ?? "";
          richText.render(
            text,
            createAdvTextRenderValue(state.talk.displayedText, {
              format: state.talk.textFormat,
              displayMode: state.talk.textDisplayMode,
              language: state.talk.textLang,
            }),
            restored,
            state.talk.text,
          );
          const speaker = scene.all("SpeakerText")[0];
          if (speaker) {
            scene.get("Speaker").hidden = !state.talk.speaker;
            speaker.lang = state.talk.speakerLang ?? "";
            richText.render(speaker, state.talk.speaker, restored);
          }
          for (const indicator of scene.all("TalkNextIndicator"))
            indicator.hidden = !state.talk.textComplete || state.autoPlay || state.fastForward;
          for (const indicator of scene.all("AutoIcon")) indicator.hidden = !state.autoPlay;
          for (const indicator of scene.all("FastIcon")) indicator.hidden = !state.fastForward;
        }
        centerBackdrop.hidden = scenes.get("center")!.root.hidden;
        const now = document.defaultView?.performance.now() ?? Date.now();
        if (!state.title.visible) titleKey = "";
        if (!state.location.visible) locationKey = "";
        if (state.title.visible && (state.title.text !== titleKey || restored)) {
          titleKey = state.title.text;
          titleUntil = now + (state.title.duration > 0 ? state.title.duration * 1000 : 6000);
        }
        if (state.location.visible && (state.location.text !== locationKey || restored)) {
          locationKey = state.location.text;
          locationUntil = now + 2500;
        }
        title.root.hidden = !state.title.visible || !state.title.text || now >= titleUntil;
        location.root.hidden = !state.location.visible || !state.location.text || now >= locationUntil;
        subtitles.root.hidden = !state.subtitles.visible || !state.subtitles.text;
        for (const [scene, name, text, lang] of [
          [title, "TitleText", state.title.text, state.title.lang],
          [location, "LocationText", state.location.text, state.location.lang],
          [subtitles, "SubtitlesText", state.subtitles.text, state.subtitles.lang],
        ] as const) {
          if (!scene.root.hidden) {
            const element = scene.get(name);
            element.lang = lang ?? "";
            richText.render(element, text, restored);
          }
        }
        const signature = JSON.stringify([state.choices.visible, state.choices.items]);
        scenes.get("choices")!.root.hidden = !state.choices.visible;
        if (signature !== choiceKey) {
          choiceKey = signature;
          for (const scene of choiceScenes) {
            richText.releaseWithin(scene.root);
            scene.dispose();
          }
          choiceScenes = [];
          choiceContainer.replaceChildren();
          for (const item of state.choices.visible ? state.choices.items : []) {
            const scene = scenes.get("choices")!.instantiate("Choices/ChoiceItem"),
              button = document.createElement("button");
            button.type = "button";
            button.className = "haneoka-native-choice";
            button.style.height = scene.root.style.height;
            scene.root.style.width = "100%";
            scene.root.style.height = "100%";
            button.disabled = item.enabled === false;
            button.lang = item.lang ?? "";
            button.append(scene.root);
            choiceContainer.append(button);
            choiceScenes.push(scene);
            richText.render(scene.get("UIRubyText"), item.text, true);
            button.addEventListener(
              "click",
              (event) => {
                event.stopPropagation();
                context.player.choose(item.key);
              },
              { signal: events.signal },
            );
          }
        }
      };
      refresh();
    })
    .catch((reason) => {
      if (!disposed) {
        error.hidden = false;
        error.textContent = reason instanceof Error ? reason.message : String(reason);
      }
    });
  function phoneRoot() {
    return root.querySelector(".haneoka-phone");
  }
  let frame = 0;
  const tick = () => {
    if (disposed || context.signal.aborted) return;
    viewport.update();
    refresh();
    frame = document.defaultView?.requestAnimationFrame(tick) ?? 0;
  };
  tick();
  const unsubscribe = context.player.subscribePresentationObserver?.(() => refresh());
  return {
    dispose() {
      disposed = true;
      viewport.dispose();
      document.defaultView?.cancelAnimationFrame(frame);
      events.abort();
      unsubscribe?.();
      if (typeof subscription === "function") void subscription();
      else if (subscription && "dispose" in subscription) void subscription.dispose();
      phone.dispose();
      richText.dispose();
      for (const scene of scenes.values()) scene.dispose();
      for (const scene of choiceScenes) scene.dispose();
      root.remove();
    },
  };
};
