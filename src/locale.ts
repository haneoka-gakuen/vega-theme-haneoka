export type HaneokaUiLocale = "en" | "ja" | "zh-CN" | "zh-TW" | "ko";

export function haneokaUiLocale(language: string, document: Document): HaneokaUiLocale {
  const requested =
    language === "auto" ? document.documentElement.lang || document.defaultView?.navigator.language || "en" : language;
  if (/^zh/iu.test(requested)) return /TW|HK|Hant/iu.test(requested) ? "zh-TW" : "zh-CN";
  if (/^ja/iu.test(requested)) return "ja";
  if (/^ko/iu.test(requested)) return "ko";
  return "en";
}

export const HANEOKA_UI_TEXT = {
  en: {
    advance: "Advance dialogue",
    phone: "Messages",
    advancePhone: "Advance conversation",
    loading: "Loading",
    notifications: "Notification Center",
    incoming: "Incoming call…",
  },
  ja: {
    advance: "会話を進める",
    phone: "メッセージ",
    advancePhone: "会話を進める",
    loading: "読み込み中",
    notifications: "通知センター",
    incoming: "着信中…",
  },
  "zh-CN": {
    advance: "继续对话",
    phone: "消息",
    advancePhone: "继续聊天",
    loading: "正在加载",
    notifications: "通知中心",
    incoming: "来电中…",
  },
  "zh-TW": {
    advance: "繼續對話",
    phone: "訊息",
    advancePhone: "繼續聊天",
    loading: "正在載入",
    notifications: "通知中心",
    incoming: "來電中…",
  },
  ko: {
    advance: "대화 진행",
    phone: "메시지",
    advancePhone: "대화 진행",
    loading: "불러오는 중",
    notifications: "알림 센터",
    incoming: "전화 수신 중…",
  },
} as const;
