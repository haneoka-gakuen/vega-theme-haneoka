/**
 * Asset-free Haneoka presentation. Every image hook defaults to `none`; hosts
 * may point the public custom properties at their own licensed resources.
 */
export const HANEOKA_THEME_CSS = String.raw`
[data-vega-theme="haneoka"] {
  --vega-surface: rgb(248 249 255 / 94%);
  --vega-panel: rgb(255 255 255 / 88%);
  --vega-text: #282c63;
  --vega-muted: #6e7395;
  --vega-accent: #6c70d8;
  --vega-accent-2: #ef8aa7;
  --vega-stage-background: #050713;
  --vega-dialogue-surface: linear-gradient(
    180deg,
    rgb(24 18 41 / 0%) 0%,
    rgb(24 18 41 / 4.39%) 10%,
    rgb(24 18 41 / 10.7%) 20%,
    rgb(24 18 41 / 18.12%) 30%,
    rgb(24 18 41 / 26.36%) 40%,
    rgb(24 18 41 / 34.86%) 50%,
    rgb(24 18 41 / 43.37%) 60%,
    rgb(24 18 41 / 51.88%) 70%,
    rgb(24 18 41 / 59.3%) 80%,
    rgb(24 18 41 / 65.33%) 90%,
    rgb(24 18 41 / 70%) 100%
  );
  --haneoka-font: "A-OTF Shin Go Pro", "Hiragino Kaku Gothic ProN",
    "Yu Gothic", "Noto Sans CJK JP", Inter, ui-sans-serif, system-ui,
    sans-serif;
  --haneoka-game-text: #fff;
  --haneoka-game-shadow: 0 1px 3px rgb(0 0 0 / 95%),
    0 0 6px rgb(0 0 0 / 72%);
  --haneoka-line: rgb(88 102 157 / 18%);
  --haneoka-line-strong: rgb(91 108 180 / 36%);
  --haneoka-shell-page: linear-gradient(
    142deg,
    rgb(250 252 255 / 98%),
    rgb(236 244 251 / 98%) 56%,
    rgb(245 240 250 / 98%)
  );
  --haneoka-shell-geometry:
    radial-gradient(circle at 15% 9%, rgb(112 181 255 / 20%), transparent 29%),
    radial-gradient(circle at 88% 85%, rgb(180 126 201 / 16%), transparent 34%),
    linear-gradient(116deg, transparent 0 61%, rgb(108 112 216 / 4%) 61% 61.2%, transparent 61.2%);
  --haneoka-shell-surface: rgb(255 255 255 / 62%);
  --haneoka-shell-surface-strong: rgb(255 255 255 / 88%);
  --haneoka-shell-text: #252a54;
  --haneoka-shell-muted: rgb(37 42 84 / 60%);
  --haneoka-shell-shadow: 0 1.4cqh 4.8cqh rgb(33 42 83 / 13%);
  --haneoka-danger: #a23e5c;
  --haneoka-control-start: rgb(58 67 119 / 98%);
  --haneoka-control-middle: rgb(76 91 155 / 98%);
  --haneoka-control-end: rgb(60 72 128 / 98%);
  --haneoka-control-active: rgb(77 167 181 / 98%);
  --haneoka-control-text: #fff;

  /* Public, host-overridable resource hooks. No image is bundled here. */
  --haneoka-shell-background-image: none;
  --haneoka-title-mark-image: none;
  --haneoka-save-frame-image: none;
  --haneoka-gallery-frame-image: none;
  --haneoka-chat-window-image: none;
  --haneoka-chat-background-image: none;
  --haneoka-chat-lock-image: none;
  --haneoka-chat-icon-signal-image: none;
  --haneoka-chat-icon-rss-image: none;
  --haneoka-chat-icon-alarm-image: none;
  --haneoka-chat-icon-navi-image: none;
  --haneoka-chat-icon-back-image: none;
  --haneoka-chat-icon-bars-image: none;
  --haneoka-chat-icon-call-image: none;
  --haneoka-chat-icon-battery-frame-image: none;
  --haneoka-chat-composer-plus-image: none;
  --haneoka-chat-composer-photo-image: none;
  --haneoka-chat-composer-picture-image: none;
  --haneoka-chat-composer-smile-image: none;
  --haneoka-chat-composer-microphone-image: none;

  color: var(--vega-text);
  color-scheme: light;
  font-family: var(--haneoka-font);
}

[data-vega-theme="haneoka"][data-vega-color-mode="dark"] {
  --vega-surface: rgb(25 27 52 / 94%);
  --vega-panel: rgb(20 23 45 / 90%);
  --vega-text: #f5f3ff;
  --vega-muted: #b9b9d4;
  --vega-accent: #a9adff;
  --vega-accent-2: #ffacc2;
  --haneoka-line: rgb(218 231 255 / 18%);
  --haneoka-line-strong: rgb(218 231 255 / 34%);
  --haneoka-shell-page: linear-gradient(
    142deg,
    rgb(17 19 39 / 98%),
    rgb(17 30 52 / 98%) 56%,
    rgb(32 21 46 / 98%)
  );
  --haneoka-shell-geometry:
    radial-gradient(circle at 15% 9%, rgb(112 181 255 / 17%), transparent 29%),
    radial-gradient(circle at 88% 85%, rgb(180 126 201 / 17%), transparent 34%),
    linear-gradient(116deg, transparent 0 61%, rgb(169 173 255 / 6%) 61% 61.2%, transparent 61.2%);
  --haneoka-shell-surface: rgb(255 255 255 / 7%);
  --haneoka-shell-surface-strong: rgb(255 255 255 / 12%);
  --haneoka-shell-text: #f7f8ff;
  --haneoka-shell-muted: rgb(240 242 255 / 64%);
  --haneoka-shell-shadow: 0 1.4cqh 4.8cqh rgb(0 5 17 / 34%);
  --haneoka-danger: #ffb1c2;
  color-scheme: dark;
}

[data-vega-theme="haneoka"][data-vega-high-contrast="true"] {
  --haneoka-line: currentColor;
  --haneoka-line-strong: currentColor;
  --haneoka-shell-surface: Canvas;
  --haneoka-shell-surface-strong: Canvas;
  --haneoka-shell-text: CanvasText;
  --haneoka-shell-muted: CanvasText;
}

/* Story presentation ----------------------------------------------------- */

[data-vega-theme="haneoka"] [data-vega-slot="dialogue"] {
  border: 0;
  background: transparent;
  box-shadow: none;
}

[data-vega-theme="haneoka"] .vega-portable-ui {
  position: absolute;
  inset: 0;
  color: var(--haneoka-game-text);
  font-family: var(--haneoka-font);
  text-shadow: var(--haneoka-game-shadow);
  pointer-events: none;
}

[data-vega-theme="haneoka"] .vega-portable-dialogue {
  position: absolute;
  inset: 0;
  border: 0;
  background: transparent;
  color: var(--haneoka-game-text);
  cursor: pointer;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-portable-dialogue::before {
  position: absolute;
  bottom: -6.111111cqh;
  left: 50%;
  width: calc(100% + 74.074074cqh);
  height: 32.962963cqh;
  background: var(--vega-dialogue-surface);
  content: "";
  pointer-events: none;
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .vega-portable-speaker {
  position: absolute;
  bottom: 21.759259cqh;
  left: calc(50% - 56.111111cqh);
  display: flex;
  width: max-content;
  min-width: 18.518519cqh;
  max-width: 74.074074cqh;
  min-height: 5.555556cqh;
  box-sizing: border-box;
  align-items: center;
  overflow: visible;
  padding: 0 9.027778cqh 0 2.256944cqh;
  background: linear-gradient(
    90deg,
    rgb(114 181 255 / 40%),
    rgb(198 255 234 / 27%) 70%,
    transparent
  );
  font-size: clamp(20px, 3.333333cqh, 38px);
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .vega-portable-text {
  position: absolute;
  bottom: .176852cqh;
  left: calc(50% - 54.749074cqh);
  width: 111.111111cqh;
  max-width: calc(100% - 32px);
  min-height: 18.518519cqh;
  overflow: visible;
  color: var(--haneoka-game-text);
  font-size: clamp(20px, 3.333333cqh, 38px);
  font-weight: 400;
  line-height: 1.2;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="center"]::before {
  top: 50%;
  bottom: auto;
  width: 100%;
  height: 18.518519cqh;
  background: rgb(0 0 0 / 49%);
  transform: translate(-50%, -50%);
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="center"] .vega-portable-speaker {
  display: none;
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="center"] .vega-portable-text {
  top: 50%;
  bottom: auto;
  left: 50%;
  display: flex;
  width: min(111.111111cqh, calc(100% - 32px));
  height: 18.518519cqh;
  align-items: center;
  font-size: clamp(22px, 3.703704cqh, 42px);
  transform: translate(-50%, -50%);
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="psych"]::before {
  right: auto;
  bottom: 4.62963cqh;
  width: min(125cqh, 100%);
  height: 28.703704cqh;
  background:
    linear-gradient(90deg, rgb(114 181 255 / 25%), rgb(190 248 236 / 18%) 72%, transparent),
    rgb(19 14 36 / 74%);
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="psych"] .vega-portable-speaker {
  bottom: 26.388889cqh;
  left: calc(50% - 55.277778cqh);
  min-width: 55.555556cqh;
  min-height: 6.944444cqh;
}

[data-vega-theme="haneoka"] .vega-portable-dialogue[data-window="psych"] .vega-portable-text {
  bottom: 5.555556cqh;
  left: calc(50% - 52.5cqh);
  font-size: clamp(22px, 3.703704cqh, 42px);
}

[data-vega-theme="haneoka"] .vega-portable-choices,
[data-vega-theme="haneoka"] .vega-choice-list:not(.UIAdvChoiceView) {
  position: absolute;
  top: calc(50% - 9.259259cqh);
  left: 50%;
  display: grid;
  width: min(64.814815cqh, calc(100% - 32px));
  max-height: 54cqh;
  align-content: center;
  gap: 1.111111cqh;
  overflow: auto;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

[data-vega-theme="haneoka"] .vega-portable-choice,
[data-vega-theme="haneoka"] .vega-choice-list:not(.UIAdvChoiceView) .vega-choice-list__item {
  min-height: max(48px, 8.333333cqh);
  padding: .87963cqh 3.703704cqh;
  border: 1px solid rgb(218 241 255 / 46%);
  border-radius: 4.166667cqh;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 11%), transparent 42%),
    linear-gradient(90deg, rgb(70 71 143 / 91%), rgb(65 126 166 / 88%));
  box-shadow: 0 .740741cqh 2.222222cqh rgb(2 9 22 / 28%);
  color: #fff;
  font: 600 clamp(18px, 3.1cqh, 35px)/1.2 var(--haneoka-font);
  text-align: center;
  text-shadow: var(--haneoka-game-shadow);
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-portable-choice:not(:disabled):hover,
[data-vega-theme="haneoka"] .vega-portable-choice:not(:disabled):focus-visible,
[data-vega-theme="haneoka"] .vega-choice-list__item:not(:disabled):focus-visible {
  border-color: rgb(255 255 255 / 80%);
  outline: 2px solid #a9e4ff;
  outline-offset: 3px;
  filter: brightness(1.1);
}

[data-vega-theme="haneoka"] .vega-portable-choice:disabled,
[data-vega-theme="haneoka"] .vega-choice-list__item:disabled {
  cursor: not-allowed;
  filter: saturate(.35);
  opacity: .5;
}

[data-vega-theme="haneoka"] .vega-portable-title,
[data-vega-theme="haneoka"] .vega-portable-location,
[data-vega-theme="haneoka"] .vega-portable-subtitles {
  position: absolute;
  border: 0;
  color: #fff;
}

[data-vega-theme="haneoka"] .vega-portable-title[hidden],
[data-vega-theme="haneoka"] .vega-portable-location[hidden],
[data-vega-theme="haneoka"] .vega-portable-dialogue[hidden],
[data-vega-theme="haneoka"] .vega-portable-speaker[hidden],
[data-vega-theme="haneoka"] .vega-portable-choices[hidden],
[data-vega-theme="haneoka"] .vega-portable-subtitles[hidden],
[data-vega-theme="haneoka"] .vega-portable-loading[hidden],
[data-vega-theme="haneoka"] .vega-portable-error[hidden],
[data-vega-theme="haneoka"] .haneoka-phone[hidden] {
  display: none !important;
}

[data-vega-theme="haneoka"] .vega-portable-title {
  top: 2.777778cqh;
  left: 0;
  max-width: 100%;
  padding: 1.388889cqh 7.407407cqh;
  background: linear-gradient(
    90deg,
    rgb(114 181 255 / 40%),
    rgb(190 248 236 / 35%) 90%,
    transparent
  );
  font-size: clamp(20px, 3.333333cqh, 38px);
  font-weight: 700;
  animation: haneoka-title var(--haneoka-title-duration, 6000ms) both;
}

[data-vega-theme="haneoka"] .vega-portable-location {
  top: 50%;
  left: 50%;
  display: flex;
  width: min(129.62963cqh, 100%);
  min-height: 5.740741cqh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(131 196 251 / 40%) 20%,
    rgb(181 239 240 / 40%) 80%,
    transparent
  );
  font-size: clamp(20px, 3.333333cqh, 38px);
  font-weight: 700;
  transform: translate(-50%, -50%);
  animation: haneoka-location 2500ms both;
}

[data-vega-theme="haneoka"] .vega-portable-subtitles {
  right: 0;
  bottom: 5.555556cqh;
  left: 0;
  display: flex;
  min-height: 13.055556cqh;
  align-items: center;
  justify-content: center;
  padding: 0 11.111111cqh;
  font-size: clamp(18px, 3.1cqh, 35px);
  text-align: center;
}

[data-vega-theme="haneoka"] .haneoka-rich-text ruby {
  ruby-position: over;
}

[data-vega-theme="haneoka"] .haneoka-rich-text rt {
  font-size: .46em;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 4px rgb(0 0 0 / 85%);
}

[data-vega-theme="haneoka"] .haneoka-rich-size {
  line-height: inherit;
}

@keyframes haneoka-title {
  0%,
  83.333% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(-27.777778cqh);
  }
}

@keyframes haneoka-location {
  0% {
    opacity: 0;
    transform: translate(calc(-50% + 27.777778cqh), -50%);
  }

  12%,
  80% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  100% {
    opacity: 0;
    transform: translate(calc(-50% - 27.777778cqh), -50%);
  }
}

[data-vega-theme="haneoka"] .vega-portable-loading,
[data-vega-theme="haneoka"] .vega-portable-error {
  position: absolute;
  padding: 10px 16px;
  border: 1px solid rgb(218 241 255 / 32%);
  background: rgb(5 14 28 / 84%);
  color: #fff;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-portable-loading {
  top: 50%;
  left: 50%;
  min-width: min(70%, 360px);
  text-align: center;
  transform: translate(-50%, -50%);
}

[data-vega-theme="haneoka"] .vega-portable-loading progress {
  display: block;
  width: 100%;
  margin-top: 8px;
  accent-color: var(--vega-accent);
}

[data-vega-theme="haneoka"] .vega-portable-error {
  top: 24px;
  right: 24px;
  left: 24px;
  border-color: rgb(255 160 166 / 58%);
  color: #ffd7da;
}

[data-vega-theme="haneoka"] .vega-portable-chat {
  position: absolute;
  top: 6%;
  right: 8%;
  bottom: 8%;
  width: min(410px, 84%);
  box-sizing: border-box;
  overflow: auto;
  padding: 18px;
  border: 1px solid var(--haneoka-line);
  border-radius: 18px;
  background: var(--haneoka-shell-surface-strong);
  box-shadow: var(--haneoka-shell-shadow);
  color: var(--haneoka-shell-text);
  text-shadow: none;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-portable-chat h2 {
  margin: 0 0 14px;
  font-size: 16px;
}

[data-vega-theme="haneoka"] .vega-portable-chat-message {
  max-width: 86%;
  margin: 7px 0;
  padding: 8px 11px;
  border: 1px solid var(--haneoka-line);
  border-radius: 12px;
  background: var(--haneoka-shell-surface-strong);
  box-shadow: 0 2px 9px rgb(32 50 75 / 12%);
  white-space: pre-wrap;
}

[data-vega-theme="haneoka"] .vega-portable-chat-message[data-self="true"] {
  margin-left: auto;
  background: color-mix(in srgb, #dff7cf 78%, var(--haneoka-shell-surface-strong));
}

[data-vega-theme="haneoka"] .vega-portable-chat-message b {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
}

/* Native phone/chat surface --------------------------------------------- */

[data-vega-theme="haneoka"] .haneoka-phone {
  position: absolute;
  inset: 0;
  z-index: 44;
  display: grid;
  place-items: start center;
  overflow: hidden;
  color: #051233;
  text-shadow: none;
  pointer-events: none;
}

[data-vega-theme="haneoka"] .haneoka-phone[data-phase="enter"],
[data-vega-theme="haneoka"] .haneoka-phone[data-phase="leave"] {
  will-change: transform;
}

[data-vega-theme="haneoka"] .haneoka-phone__frame {
  position: relative;
  width: min(102.857143cqh, 100cqw);
  max-height: 100cqh;
  aspect-ratio: 36 / 35;
  overflow: hidden;
  border-radius: 8.571429cqh;
  background:
    linear-gradient(145deg, rgb(255 255 255 / 58%), transparent 22%),
    #f3dce9;
  box-shadow:
    0 2.2cqh 5.2cqh rgb(2 7 25 / 38%),
    inset 0 0 0 .6cqh rgb(255 255 255 / 66%);
  container-type: size;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .haneoka-phone[data-mode="incoming"] .haneoka-phone__frame {
  width: min(46.875cqh, 100cqw);
}

[data-vega-theme="haneoka"] .haneoka-phone__frame::after {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--haneoka-chat-overlay-width, 100%);
  height: var(--haneoka-chat-overlay-height, 100%);
  z-index: 20;
  background: var(--haneoka-chat-window-image) center / 100% 100% no-repeat;
  content: "";
  pointer-events: none;
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__screen {
  position: absolute;
  top: var(--haneoka-chat-mask-top, 1.8%);
  left: 50%;
  width: var(--haneoka-chat-mask-width, 96.4%);
  height: var(--haneoka-chat-mask-height, 96.4%);
  overflow: hidden;
  border-radius: 7.4cqh;
  background:
    var(--haneoka-chat-background-image) center / cover no-repeat,
    linear-gradient(180deg, #f8edf3 0 22%, #ececf1 22%);
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__status {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 8;
  display: flex;
  height: 8.8%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 1.5% 8.4% 0;
  background: rgb(250 236 244 / 96%);
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icons {
  display: flex;
  align-items: center;
  gap: .8cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon,
[data-vega-theme="haneoka"] .haneoka-phone__header-icon,
[data-vega-theme="haneoka"] .haneoka-phone__composer-action {
  display: block;
  flex: none;
  background-color: #302629;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon {
  width: 3.6cqh;
  height: 3.6cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon[data-icon="signal"] {
  mask-image: var(--haneoka-chat-icon-signal-image);
  -webkit-mask-image: var(--haneoka-chat-icon-signal-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon[data-icon="rss"] {
  mask-image: var(--haneoka-chat-icon-rss-image);
  -webkit-mask-image: var(--haneoka-chat-icon-rss-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon[data-icon="alarm"] {
  mask-image: var(--haneoka-chat-icon-alarm-image);
  -webkit-mask-image: var(--haneoka-chat-icon-alarm-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icon[data-icon="navi"] {
  mask-image: var(--haneoka-chat-icon-navi-image);
  -webkit-mask-image: var(--haneoka-chat-icon-navi-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__battery {
  position: relative;
  min-width: 8.4cqh;
  padding-right: 4.8cqh;
  font-size: clamp(10px, 2.2cqh, 22px);
  font-weight: 700;
  text-align: right;
}

[data-vega-theme="haneoka"] .haneoka-phone__battery::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 4cqh;
  height: 4cqh;
  background: #302629;
  content: "";
  mask: var(--haneoka-chat-icon-battery-frame-image) center / contain no-repeat;
  transform: translateY(-50%) rotate(90deg);
  -webkit-mask: var(--haneoka-chat-icon-battery-frame-image) center / contain no-repeat;
}

[data-vega-theme="haneoka"] .haneoka-phone__chat,
[data-vega-theme="haneoka"] .haneoka-phone__lock,
[data-vega-theme="haneoka"] .haneoka-phone__incoming {
  position: absolute;
  inset: 0;
}

[data-vega-theme="haneoka"] .haneoka-phone__header {
  position: absolute;
  top: 8.8%;
  right: 0;
  left: 0;
  z-index: 6;
  display: grid;
  height: 12.7%;
  grid-template-columns: 10cqh 1fr 20cqh;
  align-items: center;
  padding: 0 6.6cqh;
  background: rgb(250 236 244 / 96%);
}

[data-vega-theme="haneoka"] .haneoka-phone__title {
  margin: 0;
  overflow: hidden;
  font-size: clamp(16px, 4.8cqh, 46px);
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-actions {
  display: flex;
  justify-content: flex-end;
  gap: 2.2cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon {
  width: 5.8cqh;
  height: 5.8cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="back"] {
  mask-image: var(--haneoka-chat-icon-back-image);
  -webkit-mask-image: var(--haneoka-chat-icon-back-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="call"] {
  mask-image: var(--haneoka-chat-icon-call-image);
  -webkit-mask-image: var(--haneoka-chat-icon-call-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="bars"] {
  mask-image: var(--haneoka-chat-icon-bars-image);
  -webkit-mask-image: var(--haneoka-chat-icon-bars-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__messages,
[data-vega-theme="haneoka"] .haneoka-phone__lock-messages {
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2cqh;
  overflow: hidden;
  padding: 3cqh 4.3cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__messages {
  top: 21.5%;
  bottom: 14.3%;
}

[data-vega-theme="haneoka"] .haneoka-phone__message {
  display: flex;
  width: 100%;
  min-height: 8.6cqh;
  align-items: flex-start;
  gap: 1.2cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] {
  justify-content: flex-end;
}

[data-vega-theme="haneoka"] .haneoka-phone__avatar {
  display: block;
  width: 10cqh;
  height: 10cqh;
  flex: 0 0 10cqh;
  overflow: hidden;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 30%, #fff 0 9%, transparent 10%),
    linear-gradient(145deg, #bacde4, #8da2c3);
}

[data-vega-theme="haneoka"] .haneoka-phone__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-content {
  min-width: 0;
  max-width: 73%;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] .haneoka-phone__message-content {
  display: flex;
  justify-content: flex-end;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-name {
  display: block;
  margin: 0 0 .4cqh 1.2cqh;
  overflow: hidden;
  font-size: clamp(10px, 2.8cqh, 26px);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-row {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 1.2cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__bubble {
  position: relative;
  max-width: 100%;
  min-height: 8.6cqh;
  box-sizing: border-box;
  padding: 1.8cqh 3.5cqh;
  border-radius: 2.2cqh;
  background: #fff;
  font-size: clamp(12px, 3.2cqh, 32px);
  line-height: 1.25;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__bubble::before {
  position: absolute;
  top: 2.1cqh;
  left: -1.35cqh;
  border-top: 1.2cqh solid transparent;
  border-right: 1.7cqh solid #fff;
  border-bottom: 1.2cqh solid transparent;
  content: "";
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] .haneoka-phone__bubble {
  background: #d0feff;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] .haneoka-phone__bubble::before {
  right: -1.35cqh;
  left: auto;
  border-right: 0;
  border-left: 1.7cqh solid #d0feff;
}

[data-vega-theme="haneoka"] .haneoka-phone__read {
  flex: none;
  padding-bottom: .8cqh;
  color: #6a6d79;
  font-size: clamp(9px, 2.5cqh, 24px);
}

[data-vega-theme="haneoka"] .haneoka-phone__stamp {
  display: block;
  max-width: 30cqh;
  max-height: 16cqh;
  object-fit: contain;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 7;
  display: grid;
  height: 14.3%;
  grid-template-columns: repeat(3, 6.4cqh) minmax(0, 1fr) 5.4cqh;
  align-items: center;
  gap: 1.4cqh;
  padding: 0 4.2cqh;
  background: #fff;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action {
  width: 5.4cqh;
  height: 5.4cqh;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="plus"] {
  background-image: var(--haneoka-chat-composer-plus-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="photo"] {
  background-image: var(--haneoka-chat-composer-photo-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="picture"] {
  background-image: var(--haneoka-chat-composer-picture-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="smile"] {
  background-image: var(--haneoka-chat-composer-smile-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="microphone"] {
  background-image: var(--haneoka-chat-composer-microphone-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__typing-shell {
  display: grid;
  min-width: 0;
  min-height: 8.4cqh;
  grid-template-columns: minmax(0, 1fr) 5.4cqh;
  align-items: center;
  padding: 0 1cqh 0 2.8cqh;
  border-radius: 4.2cqh;
  background: #efefef;
}

[data-vega-theme="haneoka"] .haneoka-phone__typing {
  min-width: 0;
  overflow: hidden;
  font-size: clamp(11px, 3cqh, 30px);
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock,
[data-vega-theme="haneoka"] .haneoka-phone__incoming {
  z-index: 5;
  display: none;
}

[data-vega-theme="haneoka"] .haneoka-phone[data-mode="lock"] .haneoka-phone__chat,
[data-vega-theme="haneoka"] .haneoka-phone[data-mode="incoming"] .haneoka-phone__chat {
  display: none;
}

[data-vega-theme="haneoka"] .haneoka-phone[data-mode="lock"] .haneoka-phone__lock,
[data-vega-theme="haneoka"] .haneoka-phone[data-mode="incoming"] .haneoka-phone__incoming {
  display: block;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock {
  padding-top: 16cqh;
  background:
    linear-gradient(180deg, rgb(8 12 32 / 8%), rgb(8 12 32 / 44%)),
    var(--haneoka-chat-lock-image) center / cover no-repeat,
    linear-gradient(145deg, #8795ae, #202945);
  color: #fff;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-time {
  font-size: clamp(34px, 10cqh, 96px);
  font-weight: 300;
  line-height: 1;
  text-align: center;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-label {
  margin-top: 3cqh;
  font-size: clamp(15px, 4.4cqh, 42px);
  font-weight: 700;
  text-align: center;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-messages {
  top: 34cqh;
  bottom: 4cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__notification {
  display: grid;
  min-height: 9cqh;
  grid-template-columns: 8cqh minmax(0, 1fr);
  gap: 2cqh;
  padding: 2cqh;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 2.4cqh;
  background: rgb(245 247 255 / 76%);
  color: #051233;
  backdrop-filter: blur(1.8cqh);
}

[data-vega-theme="haneoka"] .haneoka-phone__notification .haneoka-phone__avatar {
  width: 8cqh;
  height: 8cqh;
  flex-basis: 8cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__notification .haneoka-phone__message-content {
  max-width: none;
}

[data-vega-theme="haneoka"] .haneoka-phone__notification .haneoka-phone__bubble {
  min-height: 0;
  padding: 0;
  background: transparent;
  font-size: clamp(11px, 2.8cqh, 28px);
}

[data-vega-theme="haneoka"] .haneoka-phone__notification .haneoka-phone__bubble::before {
  content: none;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming {
  background:
    radial-gradient(circle at 50% 34%, rgb(107 129 185 / 62%), transparent 28%),
    linear-gradient(160deg, #1d2340, #050711);
  color: #fff;
  text-align: center;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming-name {
  position: absolute;
  top: 48%;
  right: 8%;
  left: 8%;
  margin: 0;
  overflow: hidden;
  font-size: clamp(28px, 7cqh, 68px);
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming-label {
  position: absolute;
  top: 60%;
  right: 8%;
  left: 8%;
  margin: 0;
  font-size: clamp(16px, 4.2cqh, 40px);
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming-pulse {
  position: absolute;
  bottom: 12%;
  left: 50%;
  width: 12cqh;
  height: 12cqh;
  border-radius: 50%;
  background: #55bf78;
  box-shadow: 0 0 0 0 rgb(85 191 120 / 55%);
  transform: translateX(-50%);
  animation: haneoka-phone-call 1.5s ease-out infinite;
}

@keyframes haneoka-phone-call {
  70% {
    box-shadow: 0 0 0 4cqh rgb(85 191 120 / 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(85 191 120 / 0%);
  }
}

/* Full default shell ----------------------------------------------------- */

[data-vega-theme="haneoka"] .vega-shell {
  --vega-shell-page: var(--haneoka-shell-page);
  --vega-shell-page-geometry: var(--haneoka-shell-geometry);
  --vega-shell-surface: var(--haneoka-shell-surface);
  --vega-shell-surface-strong: var(--haneoka-shell-surface-strong);
  --vega-shell-line: var(--haneoka-line);
  --vega-shell-text: var(--haneoka-shell-text);
  --vega-shell-muted: var(--haneoka-shell-muted);
  --vega-shell-accent: var(--vega-accent);
  --vega-shell-accent-soft: #67b6cc;
  --vega-shell-danger: var(--haneoka-danger);
  --vega-shell-shadow: var(--haneoka-shell-shadow);
  position: absolute;
  inset: 0;
  z-index: 100;
  color: var(--haneoka-shell-text);
  color-scheme: inherit;
  font: 400 clamp(12px, 1.481481cqh, 17px)/1.5 var(--haneoka-font);
  pointer-events: none;
}

[data-vega-theme="haneoka"] .vega-ui-slot.vega-shell-host--active {
  z-index: 100 !important;
}

[data-vega-theme="haneoka"] .vega-shell[hidden] {
  display: none;
}

[data-vega-theme="haneoka"] .vega-shell__scrim {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  background-image:
    var(--haneoka-shell-background-image),
    var(--haneoka-shell-geometry),
    var(--haneoka-shell-page);
  background-position: center;
  background-size: cover;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-shell__panel {
  position: absolute;
  inset: 0;
  display: grid;
  min-width: 0;
  grid-template-rows: minmax(62px, 9.259259cqh) minmax(0, 1fr) auto auto;
  overflow: hidden;
  background: transparent;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .vega-shell__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5.092593cqh;
  border-bottom: 1px solid var(--haneoka-line);
  background: linear-gradient(90deg, var(--haneoka-shell-surface-strong), transparent 74%);
}

[data-vega-theme="haneoka"] .vega-shell__heading {
  display: grid;
  gap: .462963cqh;
}

[data-vega-theme="haneoka"] .vega-shell__heading::after {
  width: 12.962963cqh;
  height: 2px;
  background: linear-gradient(90deg, var(--vega-accent), #67b6cc, transparent);
  content: "";
}

[data-vega-theme="haneoka"] .vega-shell h1,
[data-vega-theme="haneoka"] .vega-shell h2 {
  margin: 0;
  color: var(--haneoka-shell-text);
  font-size: clamp(22px, 3.333333cqh, 40px);
  font-weight: 650;
  letter-spacing: .04em;
}

[data-vega-theme="haneoka"] .vega-shell__header > button {
  width: max(42px, 4.444444cqh);
  min-width: 42px;
  height: max(42px, 4.444444cqh);
  min-height: 42px;
  padding: 0;
  border-color: transparent;
  border-radius: 50%;
  background: transparent;
  font-size: clamp(22px, 2.777778cqh, 32px);
}

[data-vega-theme="haneoka"] .vega-shell__content {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 2.222222cqh 5.092593cqh;
  scrollbar-color: var(--vega-accent) transparent;
}

[data-vega-theme="haneoka"] .vega-shell button,
[data-vega-theme="haneoka"] .vega-shell input,
[data-vega-theme="haneoka"] .vega-shell select {
  min-height: max(40px, 3.703704cqh);
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  color: inherit;
  background: var(--haneoka-shell-surface);
  font: inherit;
}

[data-vega-theme="haneoka"] .vega-shell button {
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

[data-vega-theme="haneoka"] .vega-shell button:hover {
  border-color: var(--haneoka-line-strong);
  background: var(--haneoka-shell-surface-strong);
}

[data-vega-theme="haneoka"] .vega-shell button:focus-visible,
[data-vega-theme="haneoka"] .vega-shell input:focus-visible,
[data-vega-theme="haneoka"] .vega-shell select:focus-visible {
  outline: 2px solid var(--vega-accent);
  outline-offset: 2px;
}

[data-vega-theme="haneoka"] .vega-shell button[disabled] {
  cursor: not-allowed;
  opacity: .44;
}

[data-vega-theme="haneoka"] .vega-shell__actions,
[data-vega-theme="haneoka"] .vega-shell__list {
  display: grid;
}

[data-vega-theme="haneoka"] .vega-shell__content > .vega-shell__actions {
  width: min(42.592593cqh, 90%);
  gap: .740741cqh;
  margin: 2.777778cqh auto;
}

[data-vega-theme="haneoka"] .vega-shell__content > .vega-shell__actions > button,
[data-vega-theme="haneoka"] .vega-shell__list > button,
[data-vega-theme="haneoka"] .vega-shell__entry-main {
  position: relative;
  min-height: max(46px, 5.277778cqh);
  padding: 0 2.222222cqh;
  text-align: left;
}

[data-vega-theme="haneoka"] .vega-shell__content > .vega-shell__actions > button:hover,
[data-vega-theme="haneoka"] .vega-shell__list > button:hover,
[data-vega-theme="haneoka"] .vega-shell__entry-main:hover {
  transform: translateX(.277778cqh);
}

[data-vega-theme="haneoka"] .vega-shell__primary {
  border-color: color-mix(in srgb, var(--vega-accent) 48%, transparent) !important;
  background: linear-gradient(90deg, rgb(108 112 216 / 17%), rgb(103 182 204 / 13%)) !important;
}

[data-vega-theme="haneoka"] .vega-shell__danger {
  color: var(--haneoka-danger) !important;
}

[data-vega-theme="haneoka"] .vega-shell__row {
  display: grid;
  min-height: 6.481481cqh;
  grid-template-columns: minmax(150px, 1fr) minmax(180px, 44%);
  align-items: center;
  gap: 2.222222cqh;
  padding: 1.111111cqh 2.222222cqh;
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  background: var(--haneoka-shell-surface);
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="settings"] .vega-shell__content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 1.111111cqh;
}

[data-vega-theme="haneoka"] .vega-shell__row input[type="range"] {
  width: 100%;
  accent-color: var(--vega-accent);
}

[data-vega-theme="haneoka"] .vega-shell__row input[type="checkbox"] {
  width: max(20px, 1.759259cqh);
  min-width: 20px;
  min-height: 20px;
  justify-self: end;
  accent-color: var(--vega-accent);
}

[data-vega-theme="haneoka"] .vega-shell__row select {
  width: 100%;
  padding-inline: 1.111111cqh;
}

[data-vega-theme="haneoka"] .vega-shell__saves {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.388889cqh;
}

[data-vega-theme="haneoka"] .vega-shell__save {
  position: relative;
  display: grid;
  min-width: 0;
  aspect-ratio: 1 / 1.22;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  background-color: var(--haneoka-shell-surface);
  background-image:
    var(--haneoka-save-frame-image),
    linear-gradient(155deg, rgb(112 181 255 / 20%), transparent 42%),
    linear-gradient(330deg, rgb(145 104 190 / 18%), transparent 46%);
  background-position: center;
  background-size: cover;
  box-shadow: var(--haneoka-shell-shadow);
}

[data-vega-theme="haneoka"] .vega-shell__save::before {
  min-height: 9.259259cqh;
  background:
    linear-gradient(145deg, transparent 44%, rgb(255 255 255 / 18%) 44.5% 45%, transparent 45.5%),
    linear-gradient(35deg, rgb(82 105 173 / 24%), rgb(78 159 197 / 18%));
  content: "";
}

[data-vega-theme="haneoka"] .vega-shell__save .vega-shell__entry-main {
  min-height: 7.407407cqh;
  padding: 1.111111cqh;
  border: 0;
  border-top: 1px solid var(--haneoka-line);
  border-radius: 0;
  background: var(--haneoka-shell-surface-strong);
}

[data-vega-theme="haneoka"] .vega-shell__save .vega-shell__entry-main::after {
  content: none;
}

[data-vega-theme="haneoka"] .vega-shell__delete {
  position: absolute;
  top: .740741cqh;
  right: .740741cqh;
  min-height: 30px !important;
  padding: .277778cqh .740741cqh;
  color: var(--haneoka-danger) !important;
  font-size: 11px !important;
}

[data-vega-theme="haneoka"] .vega-shell__backlog {
  display: grid;
  width: min(129.62963cqh, 100%);
  gap: .740741cqh;
  margin: 0 auto;
}

[data-vega-theme="haneoka"] .vega-shell__backlog-entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  background: var(--haneoka-shell-surface);
}

[data-vega-theme="haneoka"] .vega-shell__backlog-entry .vega-shell__entry-main {
  border: 0;
  background: transparent;
}

[data-vega-theme="haneoka"] .vega-shell__backlog-entry audio {
  width: 13.888889cqh;
  height: 3.333333cqh;
  margin-right: 1.666667cqh;
}

[data-vega-theme="haneoka"] .vega-shell__meta {
  display: block;
  margin-top: .277778cqh;
  overflow: hidden;
  color: var(--haneoka-shell-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .vega-shell__empty,
[data-vega-theme="haneoka"] .vega-shell__error {
  margin: 0;
  padding: 2.592593cqh 2.222222cqh;
  color: var(--haneoka-shell-muted);
}

[data-vega-theme="haneoka"] .vega-shell__error {
  min-height: 0;
  padding: .555556cqh 5.092593cqh;
  color: var(--haneoka-danger);
  font-size: 12px;
}

[data-vega-theme="haneoka"] .vega-shell__flow,
[data-vega-theme="haneoka"] .vega-shell__gallery {
  display: grid;
  gap: .740741cqh;
}

[data-vega-theme="haneoka"] .vega-shell__flow {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

[data-vega-theme="haneoka"] .vega-shell__flow-edges {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .555556cqh;
  margin-bottom: 1.111111cqh;
}

[data-vega-theme="haneoka"] .vega-shell__flow-edges > div {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.111111cqh;
  padding: .648148cqh .925926cqh;
  border-left: 2px solid var(--vega-accent);
  background: var(--haneoka-shell-surface);
}

[data-vega-theme="haneoka"] .vega-shell__flow-edges span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .vega-shell__flow-edges small {
  color: var(--haneoka-shell-muted);
  font-size: 10px;
}

[data-vega-theme="haneoka"] .vega-shell__gallery {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

[data-vega-theme="haneoka"] .vega-shell__flow button,
[data-vega-theme="haneoka"] .vega-shell__gallery button {
  min-height: 5.555556cqh;
  padding: 0 1.666667cqh;
  text-align: left;
}

[data-vega-theme="haneoka"] .vega-shell__flow button:not(.is-visited) {
  opacity: .42;
}

[data-vega-theme="haneoka"] .vega-shell__flow button.is-current {
  border-color: var(--vega-accent);
  background: linear-gradient(90deg, rgb(108 112 216 / 18%), rgb(103 182 204 / 12%));
}

[data-vega-theme="haneoka"] .vega-shell__gallery-item {
  display: grid;
  min-width: 0;
  gap: .740741cqh;
  align-content: center;
  padding: .925926cqh;
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  background-color: var(--haneoka-shell-surface);
  background-image: var(--haneoka-gallery-frame-image);
  background-position: center;
  background-size: cover;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-item > strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-item audio {
  width: 100%;
  height: 3.148148cqh;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-open {
  display: grid;
  min-height: 10.740741cqh !important;
  gap: .740741cqh;
  align-content: center;
  overflow: hidden;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-open img {
  width: 100%;
  height: 7.592593cqh;
  object-fit: cover;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-viewer {
  display: grid;
  gap: .740741cqh;
  margin-bottom: 1.111111cqh;
  padding: 1.481481cqh 2.222222cqh;
  border: 1px solid var(--haneoka-line);
  border-radius: .555556cqh;
  background: var(--haneoka-shell-surface-strong);
}

[data-vega-theme="haneoka"] .vega-shell__gallery-viewer[hidden] {
  display: none;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-viewer img {
  width: 100%;
  max-height: 44cqh;
  object-fit: contain;
}

[data-vega-theme="haneoka"] .vega-shell__gallery-viewer button {
  justify-self: start;
  padding-inline: 1.296296cqh;
}

[data-vega-theme="haneoka"] .vega-shell__navigation {
  display: flex;
  min-height: max(64px, 9.259259cqh);
  align-items: stretch;
  gap: .277778cqh;
  overflow-x: auto;
  padding: 0 3.703704cqh;
  border-top: 1px solid var(--haneoka-line);
  background: var(--haneoka-shell-surface-strong);
}

[data-vega-theme="haneoka"] .vega-shell__navigation button {
  position: relative;
  min-width: 10.185185cqh;
  min-height: 100%;
  padding: 0 1.481481cqh;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--haneoka-shell-muted);
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .vega-shell__navigation button::after {
  position: absolute;
  right: 1.481481cqh;
  bottom: 0;
  left: 1.481481cqh;
  height: .277778cqh;
  background: linear-gradient(90deg, var(--vega-accent), #67b6cc);
  content: "";
  opacity: 0;
  transform: scaleX(.35);
  transition: opacity 140ms ease, transform 140ms ease;
}

[data-vega-theme="haneoka"] .vega-shell__navigation button:hover,
[data-vega-theme="haneoka"] .vega-shell__navigation button[aria-current="page"] {
  color: var(--haneoka-shell-text);
}

[data-vega-theme="haneoka"] .vega-shell__navigation button:hover::after,
[data-vega-theme="haneoka"] .vega-shell__navigation button[aria-current="page"]::after {
  opacity: 1;
  transform: scaleX(1);
}

[data-vega-theme="haneoka"] .vega-shell__navigation-title {
  margin-left: auto;
}

[data-vega-theme="haneoka"] .vega-shell__navigation-return {
  color: var(--vega-accent) !important;
  font-weight: 650 !important;
}

/* Title remains spacious and uses a CSS mark when no host art is supplied. */
[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__header {
  position: absolute;
  top: 17%;
  left: 8%;
  display: grid;
  max-width: min(66%, 84cqh);
  padding: 0;
  border: 0;
  background: transparent;
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__heading {
  gap: 1.1cqh;
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__heading::before {
  width: min(54cqh, 58cqw);
  aspect-ratio: 5 / 1;
  background-image:
    var(--haneoka-title-mark-image),
    linear-gradient(135deg, rgb(108 112 216 / 18%), rgb(103 182 204 / 20%) 50%, transparent 50%);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  content: "";
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__heading h1 {
  font-size: clamp(30px, 6.4cqh, 74px);
  letter-spacing: .08em;
  text-wrap: balance;
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__content {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 10% 8%;
}

[data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__content > .vega-shell__actions {
  width: min(34cqh, 42cqw);
  margin: 0;
}

/* Persistent playback dock ---------------------------------------------- */

[data-vega-theme="haneoka"] .vega-default-toolbar,
[data-vega-theme="haneoka"].haneoka-theme-controls-active .vega-default-toolbar {
  display: none !important;
}

[data-vega-theme="haneoka"].haneoka-theme-controls-active {
  --haneoka-controls-dock-height: calc(
    var(--md-comp-runtime-toolbar-height, 48px) + env(safe-area-inset-bottom)
  );
}

[data-vega-theme="haneoka"].haneoka-theme-controls-active .vega-player__stage,
[data-vega-theme="haneoka"].haneoka-theme-controls-active .vega-ui-slot--before-stage,
[data-vega-theme="haneoka"].haneoka-theme-controls-active .vega-ui-slot--stage-overlay,
[data-vega-theme="haneoka"].haneoka-theme-controls-active .vega-ui-slot--dialogue {
  bottom: var(--haneoka-controls-dock-height) !important;
}

[data-vega-theme="haneoka"] .haneoka-controls {
  position: absolute;
  z-index: 75;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--haneoka-controls-dock-height);
  align-items: center;
  gap: var(--md-comp-runtime-toolbar-gap, 2px);
  padding:
    var(--md-comp-runtime-toolbar-padding, 4px)
    max(var(--md-sys-spacing-2, 8px), env(safe-area-inset-right))
    calc(
      var(--md-comp-runtime-toolbar-padding, 4px) +
      env(safe-area-inset-bottom)
    )
    max(var(--md-sys-spacing-2, 8px), env(safe-area-inset-left));
  border: 1px solid var(
    --md-comp-runtime-outline,
    rgb(255 255 255 / 18%)
  );
  border-width: 1px 0 0;
  background: var(--md-comp-runtime-surface-high, rgb(13 16 27 / 94%));
  color: var(
    --md-comp-runtime-on-surface-variant,
    rgb(255 255 255 / 78%)
  );
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .haneoka-controls[hidden] {
  display: none;
}

[data-vega-theme="haneoka"] .haneoka-controls button {
  color: inherit;
}

[data-vega-theme="haneoka"] .haneoka-controls__button {
  display: grid;
  width: var(--md-comp-runtime-control-size, 40px);
  height: var(--md-comp-runtime-control-size, 40px);
  min-height: var(--md-comp-runtime-control-size, 40px);
  box-sizing: border-box;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(
    --md-comp-runtime-primary-container,
    color-mix(in srgb, var(--vega-accent) 22%, transparent)
  );
  box-shadow: none;
  color: var(--md-comp-runtime-on-surface, #fff);
  cursor: pointer;
  transition:
    color 140ms ease,
    background-color 140ms ease,
    transform 140ms ease;
}

[data-vega-theme="haneoka"] .haneoka-controls__button:hover {
  background: color-mix(
    in srgb,
    var(--md-comp-runtime-primary-container, var(--vega-accent)) 86%,
    white
  );
}

[data-vega-theme="haneoka"] .haneoka-controls__button:active {
  transform: scale(.94);
}

[data-vega-theme="haneoka"] .haneoka-controls__button:disabled {
  cursor: not-allowed;
  opacity: .38;
}

[data-vega-theme="haneoka"] .haneoka-controls__button:focus-visible,
[data-vega-theme="haneoka"] .haneoka-controls__progress:focus-visible {
  outline: 2px solid rgb(255 255 255 / 92%);
  outline-offset: 2px;
}

[data-vega-theme="haneoka"] .haneoka-controls__timeline[hidden] {
  display: none;
}

[data-vega-theme="haneoka"] .haneoka-controls__icon {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
}

[data-vega-theme="haneoka"] .haneoka-controls__icon .haneoka-icon {
  width: 100%;
  height: 100%;
}

[data-vega-theme="haneoka"] .haneoka-icon path {
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

[data-vega-theme="haneoka"] .haneoka-controls__label {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-controls__timeline {
  display: flex;
  min-width: 64px;
  height: 40px;
  flex: 1 1 auto;
  align-items: center;
  gap: var(--md-sys-spacing-2, 8px);
  margin-inline: 2px;
}

[data-vega-theme="haneoka"] .haneoka-controls__timeline-name {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-controls__progress {
  width: 100%;
  min-width: 48px;
  height: 32px;
  flex: 1 1 auto;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

[data-vega-theme="haneoka"] .haneoka-controls__progress::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 0;
  background: linear-gradient(
    90deg,
    var(--md-comp-runtime-primary, var(--vega-accent)) 0
      var(--haneoka-controls-progress, 0%),
    var(--md-comp-runtime-outline, rgb(255 255 255 / 24%))
      var(--haneoka-controls-progress, 0%) 100%
  );
}

[data-vega-theme="haneoka"] .haneoka-controls__progress::-webkit-slider-thumb {
  width: 4px;
  height: 20px;
  margin-top: -7px;
  appearance: none;
  border: 0;
  border-radius: var(--md-sys-shape-corner-extra-small, 4px);
  background: var(--md-comp-runtime-primary, var(--vega-accent));
}

[data-vega-theme="haneoka"] .haneoka-controls__progress::-moz-range-track {
  height: 6px;
  border-radius: 0;
  background: var(--md-comp-runtime-outline, rgb(255 255 255 / 24%));
}

[data-vega-theme="haneoka"] .haneoka-controls__progress::-moz-range-progress {
  height: 6px;
  border-radius: 0;
  background: var(--md-comp-runtime-primary, var(--vega-accent));
}

[data-vega-theme="haneoka"] .haneoka-controls__progress::-moz-range-thumb {
  width: 4px;
  height: 20px;
  border: 0;
  border-radius: var(--md-sys-shape-corner-extra-small, 4px);
  background: var(--md-comp-runtime-primary, var(--vega-accent));
}

[data-vega-theme="haneoka"] .haneoka-controls__progress:disabled {
  cursor: default;
}

[data-vega-theme="haneoka"] .haneoka-controls__progress-label {
  min-width: 42px;
  flex: 0 0 auto;
  color: inherit;
  font: var(--md-sys-typescale-label-small-size, 11px) / 1
    var(--md-sys-typescale-label-small-font, sans-serif);
  font-variant-numeric: tabular-nums;
  text-align: center;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-controls__timeline.is-disabled {
  opacity: .38;
}

[data-vega-theme="haneoka"] .haneoka-controls__status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  [data-vega-theme="haneoka"][data-vega-color-mode="system"] {
    --vega-surface: rgb(25 27 52 / 94%);
    --vega-panel: rgb(20 23 45 / 90%);
    --vega-text: #f5f3ff;
    --vega-muted: #b9b9d4;
    --vega-accent: #a9adff;
    --vega-accent-2: #ffacc2;
    --haneoka-line: rgb(218 231 255 / 18%);
    --haneoka-line-strong: rgb(218 231 255 / 34%);
    --haneoka-shell-page: linear-gradient(
      142deg,
      rgb(17 19 39 / 98%),
      rgb(17 30 52 / 98%) 56%,
      rgb(32 21 46 / 98%)
    );
    --haneoka-shell-geometry:
      radial-gradient(circle at 15% 9%, rgb(112 181 255 / 17%), transparent 29%),
      radial-gradient(circle at 88% 85%, rgb(180 126 201 / 17%), transparent 34%);
    --haneoka-shell-surface: rgb(255 255 255 / 7%);
    --haneoka-shell-surface-strong: rgb(255 255 255 / 12%);
    --haneoka-shell-text: #f7f8ff;
    --haneoka-shell-muted: rgb(240 242 255 / 64%);
    --haneoka-shell-shadow: 0 1.4cqh 4.8cqh rgb(0 5 17 / 34%);
    --haneoka-danger: #ffb1c2;
    color-scheme: dark;
  }
}

@container (max-aspect-ratio: 4 / 3) {
  [data-vega-theme="haneoka"] .vega-portable-speaker {
    left: 4cqh;
    max-width: calc(100% - 8cqh);
  }

  [data-vega-theme="haneoka"] .vega-portable-text {
    right: max(16px, 4cqw);
    left: max(16px, 4cqw);
    width: auto;
    max-width: none;
    height: auto;
    font-size: clamp(18px, min(3.333333cqh, 5cqw), 38px);
  }

  [data-vega-theme="haneoka"] .vega-shell__saves,
  [data-vega-theme="haneoka"] .vega-shell__flow,
  [data-vega-theme="haneoka"] .vega-shell__gallery,
  [data-vega-theme="haneoka"] .vega-shell__flow-edges {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-vega-theme="haneoka"] .vega-shell[data-screen="settings"] .vega-shell__content {
    grid-template-columns: 1fr;
  }
}

@container (max-width: 640px) {
  [data-vega-theme="haneoka"].haneoka-theme-controls-active {
    --haneoka-controls-dock-height: calc(
      var(--md-comp-runtime-toolbar-height-touch, 56px) +
      env(safe-area-inset-bottom)
    );
  }

  [data-vega-theme="haneoka"] .vega-shell__header,
  [data-vega-theme="haneoka"] .vega-shell__content {
    padding-right: 18px;
    padding-left: 18px;
  }

  [data-vega-theme="haneoka"] .vega-shell__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  [data-vega-theme="haneoka"] .vega-shell__row input[type="checkbox"] {
    justify-self: start;
  }

  [data-vega-theme="haneoka"] .vega-shell__saves,
  [data-vega-theme="haneoka"] .vega-shell__flow,
  [data-vega-theme="haneoka"] .vega-shell__gallery,
  [data-vega-theme="haneoka"] .vega-shell__flow-edges {
    grid-template-columns: 1fr;
  }

  [data-vega-theme="haneoka"] .vega-shell__backlog-entry {
    grid-template-columns: 1fr;
  }

  [data-vega-theme="haneoka"] .vega-shell__backlog-entry audio {
    width: calc(100% - 32px);
    margin: 0 16px 10px;
  }

  [data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__header {
    top: 12%;
    left: 8%;
    max-width: 84%;
  }

  [data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__content {
    justify-content: center;
    padding: 8%;
  }

  [data-vega-theme="haneoka"] .vega-shell[data-screen="title"] .vega-shell__content > .vega-shell__actions {
    width: min(100%, 320px);
  }

  [data-vega-theme="haneoka"] .haneoka-controls {
    padding-right: max(4px, env(safe-area-inset-right));
    padding-left: max(4px, env(safe-area-inset-left));
  }

  [data-vega-theme="haneoka"] .haneoka-controls__button {
    width: var(--md-comp-runtime-control-size-touch, 40px);
    height: var(--md-comp-runtime-control-size-touch, 40px);
    min-height: var(--md-comp-runtime-control-size-touch, 40px);
  }

  [data-vega-theme="haneoka"] .haneoka-controls__timeline {
    min-width: 36px;
  }

  [data-vega-theme="haneoka"] .haneoka-controls__progress-label {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-vega-theme="haneoka"] *,
  [data-vega-theme="haneoka"] *::before,
  [data-vega-theme="haneoka"] *::after {
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
  }
}

[data-vega-theme="haneoka"][data-vega-reduced-motion="true"] *,
[data-vega-theme="haneoka"][data-vega-reduced-motion="true"] *::before,
[data-vega-theme="haneoka"][data-vega-reduced-motion="true"] *::after {
  scroll-behavior: auto !important;
  transition-duration: .001ms !important;
  animation-duration: .001ms !important;
  animation-iteration-count: 1 !important;
}

@media (forced-colors: active) {
  [data-vega-theme="haneoka"] .haneoka-controls__button,
  [data-vega-theme="haneoka"] .vega-shell button {
    border: 1px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: auto;
  }
}
`;
