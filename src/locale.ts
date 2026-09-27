export type HaneokaUiLocale = "en" | "ja" | "zh-CN" | "zh-TW" | "ko";

export type HaneokaTextLocale = "en" | "ja" | "zh-Hans" | "zh-Hant" | "ko";

const languageSource = (language: string, document: Document): string => {
  const requested = language.trim().replaceAll("_", "-");
  if (requested && requested.toLowerCase() !== "auto") return requested;
  return document.documentElement.lang || document.defaultView?.navigator.language || "en";
};

/** Resolve authored text language first, then the host document language. */
export function haneokaTextLocale(language: string | undefined, document: Document): HaneokaTextLocale {
  const requested = languageSource(language ?? "", document);
  if (/^ja(?:-|$)/iu.test(requested)) return "ja";
  if (/^ko(?:-|$)/iu.test(requested)) return "ko";
  if (/^zh(?:-|$)/iu.test(requested)) {
    const subtags = requested.toLowerCase().split("-");
    if (subtags.includes("hant")) return "zh-Hant";
    if (subtags.includes("hans")) return "zh-Hans";
    return subtags.some((tag) => ["tw", "hk", "mo"].includes(tag)) ? "zh-Hant" : "zh-Hans";
  }
  return "en";
}

export function haneokaUiLocale(language: string, document: Document): HaneokaUiLocale {
  const locale = haneokaTextLocale(language, document);
  if (locale === "zh-Hant") return "zh-TW";
  if (locale === "ja") return "ja";
  if (locale === "ko") return "ko";
  return locale === "zh-Hans" ? "zh-CN" : "en";
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

export const HANEOKA_QUICKBAR_TEXT = {
  en: [
    "Menu",
    "Auto",
    "Skip",
    "Log",
    "Q.Save",
    "Load",
    "Hide",
    "Skip video",
    "Saved",
    "Subtitles",
    "Fullscreen",
    "Continuous",
    "Leave story",
    "Fast",
    "More",
    "Bottom progress bar",
  ],
  ja: [
    "メニュー",
    "オート",
    "スキップ",
    "ログ",
    "Q.セーブ",
    "ロード",
    "非表示",
    "動画スキップ",
    "セーブしました",
    "字幕",
    "全画面",
    "連続再生",
    "中断",
    "早送り",
    "その他",
    "下部の進行バー",
  ],
  "zh-CN": [
    "菜单",
    "自动",
    "跳过",
    "回看",
    "快存",
    "读档",
    "隐藏",
    "跳过视频",
    "已快速保存",
    "字幕",
    "全屏",
    "连续播放",
    "退出剧情",
    "快进",
    "更多",
    "底部进度条",
  ],
  "zh-TW": [
    "選單",
    "自動",
    "跳過",
    "回看",
    "快存",
    "讀檔",
    "隱藏",
    "跳過影片",
    "已快速儲存",
    "字幕",
    "全螢幕",
    "連續播放",
    "離開劇情",
    "快轉",
    "更多",
    "底部進度條",
  ],
  ko: [
    "메뉴",
    "자동",
    "스킵",
    "로그",
    "빠른 저장",
    "불러오기",
    "숨기기",
    "영상 건너뛰기",
    "저장 완료",
    "자막",
    "전체 화면",
    "연속 재생",
    "스토리 나가기",
    "빨리 감기",
    "더 보기",
    "하단 진행 표시줄",
  ],
} as const;

export const HANEOKA_PROGRESS_TEXT = {
  en: ["Story progress", "Play", "Pause", "Replay"],
  ja: ["シナリオ進行", "再生", "一時停止", "もう一度"],
  "zh-CN": ["剧情进度", "播放", "暂停", "重新播放"],
  "zh-TW": ["劇情進度", "播放", "暫停", "重新播放"],
  ko: ["이야기 진행", "재생", "일시 정지", "다시 재생"],
} as const;
