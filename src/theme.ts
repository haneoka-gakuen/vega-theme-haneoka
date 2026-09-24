export const HANEOKA_THEME_CSS = String.raw`
[data-vega-theme="haneoka"] {
  --vega-adv-pixel: .092592593cqh;
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

[data-vega-theme="haneoka"] .haneoka-story-ui { position:absolute; inset:0; pointer-events:none; color:white; font-family:var(--haneoka-font); }
[data-vega-theme="haneoka"] .haneoka-center-talk-backdrop {position:absolute;inset:0;background:rgba(0,0,0,.4);pointer-events:none}
[data-vega-theme="haneoka"] .haneoka-scene [hidden],
[data-vega-theme="haneoka"] .haneoka-story-ui>[hidden] {display:none!important}
[data-vega-theme="haneoka"] .haneoka-native-controls {position:absolute;inset:0;pointer-events:none}
[data-vega-theme="haneoka"] .haneoka-native-controls[hidden] {display:none!important}
[data-vega-theme="haneoka"] .haneoka-controls-status {position:absolute;top:10%;left:10%;right:30%;color:white;font-size:2cqh}
[data-vega-theme="haneoka"] .haneoka-scene-node { background-repeat:no-repeat; pointer-events:none; }
[data-vega-theme="haneoka"] .haneoka-native-choice {position:relative;flex-shrink:0;width:100%;border:0;padding:0;background:transparent;color:inherit;pointer-events:auto;cursor:pointer}
[data-vega-theme="haneoka"] .haneoka-native-choice:disabled {opacity:.45;cursor:default}
[data-vega-theme="haneoka"] .haneoka-native-choice:focus-visible {outline:2px solid white;outline-offset:4px}
[data-vega-theme="haneoka"] .haneoka-loading {position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2cqh;background:#0c0d18bb;pointer-events:auto;font-size:2cqh}
[data-vega-theme="haneoka"] .haneoka-loading progress {width:30cqh;height:.5cqh;accent-color:#7ca8ce}
[data-vega-theme="haneoka"] .haneoka-error {position:absolute;inset:30% 15%;background:#1b182ae8;padding:3cqh;overflow:auto;color:#fff;pointer-events:auto}

/* Native phone/chat surface --------------------------------------------- */

[data-vega-theme="haneoka"] .haneoka-phone {
  font-family: "Noto Sans JP", "Noto Sans JP Variable", "Noto Sans CJK JP", sans-serif;
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
  width: min(66.666667cqh, var(--haneoka-chat-incoming-root-width-width, 93.75cqw));
  aspect-ratio: 36 / 35;
  overflow: visible;
  container-type: size;
  pointer-events: auto;
}

[data-vega-theme="haneoka"] .haneoka-phone[data-mode="incoming"] .haneoka-phone__frame {
  width: min(
    var(--haneoka-chat-incoming-root-width-height, 46.875cqh),
    var(--haneoka-chat-incoming-root-width-width, 93.75cqw)
  );
}

[data-vega-theme="haneoka"] .haneoka-phone__frame::after {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--haneoka-chat-overlay-width, 106.666667%);
  height: var(--haneoka-chat-overlay-height, 219.428571%);
  z-index: 20;
  background: var(--haneoka-chat-window-image) center / 100% 100% no-repeat;
  content: "";
  pointer-events: none;
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__screen {
  position: absolute;
  top: var(--haneoka-chat-mask-top, 4.285714%);
  left: calc(50% + var(--haneoka-chat-mask-offset-x, 0%));
  width: var(--haneoka-chat-mask-width, 97.256182%);
  height: var(--haneoka-chat-mask-height, 210.05875%);
  z-index: 1;
  overflow: hidden;
  border-radius: 9cqh;
  background:
    var(--haneoka-chat-background-image) center / 109.676% 104.46% no-repeat,
    var(--haneoka-chat-background-fallback-image) center / 109.676% 104.46% no-repeat,
    #ececf1;
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 6;
  height: 22.857143cqh;
  background: #faecf4;
}

[data-vega-theme="haneoka"] .haneoka-phone__status {
  position: absolute;
  inset: 0;
  z-index: 1;
}

[data-vega-theme="haneoka"] .haneoka-phone__status-icons {
  position: absolute;
  top: 6.226786cqh;
  left: calc(50% - 41.252857cqh);
  display: flex;
  width: 23.64857cqh;
  height: 5.832186cqh;
  align-items: center;
  justify-content: space-between;
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
  width: 4.571429cqh;
  height: 4.571429cqh;
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
  position: absolute;
  top: 2cqh;
  right: calc(50% - 41.285714cqh);
  display: block;
  width: 14.285714cqh;
  height: 14.285714cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__battery-text {
  position: absolute;
  top: 3.571429cqh;
  left: -7.142857cqh;
  display: flex;
  width: 9.778314cqh;
  height: 7.142857cqh;
  align-items: center;
  justify-content: flex-end;
  color: #051233;
  font-size: 2.957143cqh;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__battery-gauge {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 11.428571cqh;
  height: 11.428571cqh;
  transform: translate(-50%, -50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__battery-frame {
  position: absolute;
  inset: 0;
  display: block;
  background: #302629;
  mask: var(--haneoka-chat-icon-battery-frame-image) center / contain no-repeat;
  transform: rotate(-90deg);
  -webkit-mask: var(--haneoka-chat-icon-battery-frame-image) center / contain no-repeat;
}

[data-vega-theme="haneoka"] .haneoka-phone__battery-fill {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 3.375643cqh;
  height: 7.444586cqh;
  transform: translate(calc(-50% - .263643cqh), -50%) rotate(-90deg);
}

[data-vega-theme="haneoka"] .haneoka-phone__battery-fill::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--haneoka-chat-battery-level, 100%);
  background: #9fe747;
  content: "";
}

[data-vega-theme="haneoka"] .haneoka-phone__chat,
[data-vega-theme="haneoka"] .haneoka-phone__lock,
[data-vega-theme="haneoka"] .haneoka-phone__incoming {
  position: absolute;
  inset: 0;
}

[data-vega-theme="haneoka"] .haneoka-phone__title {
  position: absolute;
  top: 15.142857cqh;
  left: 50%;
  display: flex;
  width: 57.142857cqh;
  height: 7.142857cqh;
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow: hidden;
  color: #051233;
  font-size: 4.928571cqh;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-actions {
  display: contents;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon {
  position: absolute;
  top: 15.428571cqh;
  width: 6.857143cqh;
  height: 6.857143cqh;
  z-index: 2;
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="back"] {
  left: 7.142857cqh;
  mask-image: var(--haneoka-chat-icon-back-image);
  -webkit-mask-image: var(--haneoka-chat-icon-back-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="call"] {
  right: 15.857143cqh;
  mask-image: var(--haneoka-chat-icon-call-image);
  -webkit-mask-image: var(--haneoka-chat-icon-call-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__header-icon[data-icon="bars"] {
  right: 7.142857cqh;
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
  gap: .714286cqh;
  box-sizing: border-box;
  overflow: hidden;
  padding: 4.285714cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__messages {
  top: 22.857143cqh;
  height: 71.428571cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__message {
  display: flex;
  width: 100%;
  min-height: 9cqh;
  align-items: flex-start;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] {
  justify-content: flex-end;
}

[data-vega-theme="haneoka"] .haneoka-phone__avatar {
  display: block;
  width: 12cqh;
  height: 12cqh;
  flex: 0 0 12cqh;
  overflow: hidden;
  border-radius: 50%;
  background: transparent;
}

[data-vega-theme="haneoka"] .haneoka-phone__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-content {
  min-width: 0;
  max-width: 77.23%;
  box-sizing: border-box;
  padding-left: .714286cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] .haneoka-phone__message-content {
  display: flex;
  justify-content: flex-end;
  max-width: 100%;
  padding-left: 0;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-name {
  display: block;
  margin: 0;
  overflow: hidden;
  color: #051233;
  font-size: 2.857143cqh;
  font-weight: 700;
  line-height: 4.571429cqh;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-row {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

[data-vega-theme="haneoka"] .haneoka-phone__bubble {
  position: relative;
  z-index: 0;
  max-width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 9cqh;
  box-sizing: border-box;
  padding: .781429cqh 4.285714cqh;
  background: transparent;
  color: #051233;
  font-size: 3.428571cqh;
  isolation: isolate;
  line-height: 1.2;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__message-text {
  min-width: 0;
  padding-block: 1.042857cqh 1.428571cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-messages .haneoka-phone__message[data-self="false"] .haneoka-phone__message-content {
  width: 70.414286cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-messages .haneoka-phone__message[data-self="false"] .haneoka-phone__bubble {
  width: 100%;
  min-height: 12.008571cqh;
  padding-block: 0;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-messages .haneoka-phone__bubble > .haneoka-phone__message-name {
  height: 4.571429cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__bubble::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 4.5cqh;
  background: #fff;
  content: "";
  mask-border: var(--haneoka-chat-text-box-image) 63 fill / 4.5cqh / 0 stretch;
  -webkit-mask-box-image: var(--haneoka-chat-text-box-image) 63 fill / 4.5cqh / 0 stretch;
}

[data-vega-theme="haneoka"] .haneoka-phone__message[data-self="true"] .haneoka-phone__bubble::before {
  background: #d0feff;
}

[data-vega-theme="haneoka"] .haneoka-phone__read {
  flex: none;
  width: 9.142857cqh;
  padding-bottom: .4cqh;
  color: #6a6d79;
  font-size: 2.857143cqh;
  text-align: right;
}

[data-vega-theme="haneoka"] .haneoka-phone__stamp {
  display: block;
  max-width: 34.285714cqh;
  max-height: 29.285714cqh;
  object-fit: contain;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer {
  position: absolute;
  top: 82.857143cqh;
  right: 0;
  left: 0;
  z-index: 7;
  display: block;
  height: 14.285714cqh;
  background: #fff;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action {
  position: absolute;
  bottom: 2.942857cqh;
  width: 5.942857cqh;
  height: 5.828571cqh;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="plus"] {
  left: calc(50% - 44.114286cqh);
  background-image: var(--haneoka-chat-composer-plus-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="photo"] {
  left: calc(50% - 34.114286cqh);
  background-image: var(--haneoka-chat-composer-photo-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="picture"] {
  left: calc(50% - 24.257143cqh);
  background-image: var(--haneoka-chat-composer-picture-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="smile"] {
  top: 2.085714cqh;
  right: 1.714286cqh;
  bottom: auto;
  width: 4.914286cqh;
  height: 4.914286cqh;
  background-image: var(--haneoka-chat-composer-smile-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__composer-action[data-icon="microphone"] {
  right: 5.114286cqh;
  bottom: 2.542857cqh;
  width: 4.342857cqh;
  height: 6.057143cqh;
  background-image: var(--haneoka-chat-composer-microphone-image);
}

[data-vega-theme="haneoka"] .haneoka-phone__typing-shell {
  position: absolute;
  top: 1.428571cqh;
  left: 34.285714cqh;
  display: block;
  width: 70.414286cqh;
  min-height: 9cqh;
  box-sizing: border-box;
  padding: 0 8.571429cqh 0 4.285714cqh;
  border-radius: 4.5cqh;
  background: #efefef;
}

[data-vega-theme="haneoka"] .haneoka-phone__typing {
  display: flex;
  min-width: 0;
  min-height: 9cqh;
  align-items: center;
  overflow: hidden;
  color: #051233;
  font-size: 3.428571cqh;
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
  overflow: hidden;
  background: #000;
  color: #fff;
}

[data-vega-theme="haneoka"] .haneoka-phone__lock::before {
  content: "";
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 109.676%;
  height: 104.46%;
  background: var(--haneoka-chat-lock-image, linear-gradient(#fff, #fff)) center / 100% 100% no-repeat;
  content: "";
  filter: brightness(.273585);
  transform: translate(-50%, calc(-50% - 2.857143cqh));
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-label {
  position: absolute;
  top: 26.285714cqh;
  left: 50%;
  z-index: 1;
  width: 71.428571cqh;
  height: 7.142857cqh;
  color: #fff;
  font-size: 5.714286cqh;
  font-weight: 700;
  line-height: 1;
  text-align: left;
  transform: translateX(-50%);
}

[data-vega-theme="haneoka"] .haneoka-phone__lock-messages {
  top: 37.142857cqh;
  z-index: 1;
  height: 57.142857cqh;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming {
  background: #000;
  color: #fff;
  text-align: center;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming-name {
  position: absolute;
  top: 50cqh;
  left: 50%;
  display: flex;
  width: 71.428571cqh;
  height: 11.428571cqh;
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow: hidden;
  font-size: 6.9cqh;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
}

[data-vega-theme="haneoka"] .haneoka-phone__incoming-label {
  position: absolute;
  top: 64.285714cqh;
  left: 50%;
  display: flex;
  width: 71.428571cqh;
  height: 7.142857cqh;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 4.285714cqh;
  font-weight: 700;
  line-height: 1;
  transform: translateX(-50%);
}


[data-vega-theme="haneoka"] .vega-shell {--vega-shell-accent:#a3b4f0;--vega-shell-accent-soft:#91dacc;font-family:var(--haneoka-font);}
[data-vega-theme="haneoka"][data-vega-color-mode="light"] .vega-shell {--vega-shell-accent:#586bb3;--vega-shell-accent-soft:#307f86;}
[data-vega-theme="haneoka"] .vega-default-toolbar{display:none!important}
[data-vega-theme="haneoka"] .haneoka-controls{position:absolute;inset:0;pointer-events:none;z-index:75;color:#fff;font-family:var(--haneoka-font);}
[data-vega-theme="haneoka"] .haneoka-controls[hidden], [data-vega-theme="haneoka"] .haneoka-controls [hidden]{display:none!important}
[data-vega-theme="haneoka"] .haneoka-controls button{font:400 clamp(12px,2.15cqh,20px)/1.2 var(--haneoka-font);color:inherit;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:12px;box-sizing:border-box;}
[data-vega-theme="haneoka"] .haneoka-menu-entry{position:absolute;top:0;right:.946875cqh;width:max(44px,24.754398cqh);height:max(44px,13.185185cqh);padding:0;border:0;margin:0;border-radius:999px;background:transparent;color:white;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
[data-vega-theme="haneoka"] .haneoka-menu-press{position:absolute;right:2.675926cqh;top:3.666667cqh;width:19.402546cqh;height:5.555556cqh;pointer-events:none;transform-origin:50% 50%;border-radius:999px}
[data-vega-theme="haneoka"] .haneoka-menu-face{display:block;position:absolute;inset:0;width:100%;height:100%;overflow:visible}
[data-vega-theme="haneoka"] .haneoka-menu-label{position:absolute;left:4.232541cqh;top:0;height:100%;display:flex;flex-direction:column;justify-content:center;white-space:nowrap;line-height:normal;font-size:2.375cqh;font-weight:700}
[data-vega-theme="haneoka"] .haneoka-controls .haneoka-menu-entry:focus-visible{outline:none}
[data-vega-theme="haneoka"] .haneoka-menu-entry:focus-visible .haneoka-menu-press{outline:2px solid #acdacf;outline-offset:3px}
[data-vega-theme="haneoka"] .haneoka-control-label{white-space:nowrap;display:block}
[data-vega-theme="haneoka"] .haneoka-quickbar{position:absolute;right:max(3.6cqh,12px);bottom:calc(62px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:0;max-width:calc(100% - 24px);overflow-x:auto;scrollbar-width:none;pointer-events:auto;padding:3px 7px;border:1px solid #bbccec24;border-radius:3px;background:#111a2d7a;backdrop-filter:blur(5px);opacity:0;transition:opacity .18s;pointer-events:none;}
[data-vega-theme="haneoka"][data-vega-transport-visible] .haneoka-quickbar,[data-vega-theme="haneoka"] .haneoka-quickbar:is(:hover,:focus-within){opacity:1;pointer-events:auto}
[data-vega-theme="haneoka"] .haneoka-quickbar>button{min-height:30px;border:0;border-radius:2px;background:transparent;padding:4px 12px;font-size:clamp(11px,1.85cqh,17px);color:#edf3ffdb;pointer-events:inherit}
[data-vega-theme="haneoka"] .haneoka-quickbar>button+button::before{content:"";position:absolute;margin-left:-24px;height:10px;width:1px;background:#cadbff24;pointer-events:none}
[data-vega-theme="haneoka"] .haneoka-quickbar>button:hover,[data-vega-theme="haneoka"] .haneoka-quickbar>button[aria-pressed="true"]{color:#b5eee3;background:#abd1db12}
[data-vega-theme="haneoka"] .haneoka-controls :focus-visible{outline:2px solid #acdacf;outline-offset:3px}
[data-vega-theme="haneoka"] .haneoka-control-toast{position:absolute;bottom:15cqh;left:50%;transform:translateX(-50%);max-width:75%;background:#17253bea;border:1px solid #91b9d560;border-radius:3px;padding:10px 20px;color:#fff;font-size:clamp(12px,2cqh,18px)}
[data-vega-theme="haneoka"] .haneoka-video-skip{position:absolute;right:4cqh;bottom:12cqh;border:1px solid #becdff70;border-radius:3px;background:#162139b3;padding:10px 18px}
[data-vega-theme="haneoka"][data-vega-ui-hidden=true] .haneoka-controls,[data-vega-theme="haneoka"][data-vega-ui-hidden=true] .haneoka-progress{visibility:hidden}
@container(max-width:540px){[data-vega-theme="haneoka"] .haneoka-quickbar>button{padding:5px 8px;font-size:11px}[data-vega-theme="haneoka"] .haneoka-quickbar{right:12px;bottom:calc(62px + env(safe-area-inset-bottom,0px))}}
@media(prefers-reduced-motion:reduce){[data-vega-theme="haneoka"] .haneoka-quickbar{transition:none}}
[data-vega-theme="haneoka"] .haneoka-progress {
  position: absolute; z-index: 76; inset: auto 0 0; height: 48px; box-sizing: content-box;
  display: flex; align-items: center; gap: 12px; padding: 8px max(20px, env(safe-area-inset-right)) max(4px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  color: #fff; font: 12px/1.4 var(--haneoka-font); background: linear-gradient(transparent, #101328b8);
  pointer-events: auto; opacity: 0; transition: opacity 180ms ease;
}
[data-vega-theme="haneoka"] .haneoka-progress[hidden] { display: none; }
[data-vega-theme="haneoka"] .haneoka-progress:is([data-visible], :hover, :focus-within) { opacity: 1; }
[data-vega-theme="haneoka"] .haneoka-progress button {
  display: grid; place-items: center; flex: 0 0 36px; width: 36px; height: 36px;
  border: 1px solid #ffffff70; border-radius: 50%; background: #20204050; color: inherit; cursor: pointer;
}
[data-vega-theme="haneoka"] .haneoka-progress .haneoka-icon { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.6; fill: none; }
[data-vega-theme="haneoka"] .haneoka-progress input {
  appearance: none; flex: 1; min-width: 0; height: 28px; padding: 0; margin: 0; cursor: pointer;
  background: linear-gradient(to right, #e2d9ff var(--haneoka-progress), #ffffff50 var(--haneoka-progress)) center / 100% 3px no-repeat;
  touch-action: pan-y;
}
[data-vega-theme="haneoka"] .haneoka-progress input::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; background: #9e8cff; box-shadow: 0 0 8px #17122880; }
[data-vega-theme="haneoka"] .haneoka-progress input::-moz-range-thumb { width: 8px; height: 8px; border-radius: 50%; border: 2px solid #fff; background: #9e8cff; }
[data-vega-theme="haneoka"] .haneoka-progress input::-moz-range-track { background: transparent; }
[data-vega-theme="haneoka"] .haneoka-progress :focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
[data-vega-theme="haneoka"] .haneoka-progress :disabled { opacity: .4; cursor: default; }
[data-vega-theme="haneoka"] .haneoka-progress output { min-width: 7ch; text-align: right; font-variant-numeric: tabular-nums; }
[data-vega-theme="haneoka"] .haneoka-progress__status { position: absolute; bottom: 100%; right: 20px; max-width: 70%; }
@media (prefers-reduced-motion: reduce) { [data-vega-theme="haneoka"] .haneoka-progress { transition: none; } }
`;
