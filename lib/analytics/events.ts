/**
 * 익명 이벤트 정의 — 클라이언트·서버 공용.
 * 대화 원문·이름·연락처 등 개인정보는 절대 수집하지 않는다. (주제 '분류값'만 저장)
 */

export const EVENT_TYPES = [
  "page_view",
  "chat_open",
  "chat_start", // 첫 메시지
  "chat_message",
  "diagnosis_open",
  "diagnosis_submit",
  "cta_call",
  "cta_book",
  "map_click",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const TOPICS = [
  "rehab",
  "registry",
  "inherit",
  "payment",
  "guardian",
  "civil",
  "fee",
  "other",
] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABEL: Record<Topic, string> = {
  rehab: "개인회생·파산",
  registry: "부동산·법인 등기",
  inherit: "상속·증여",
  payment: "지급명령",
  guardian: "성년후견",
  civil: "민사·가사",
  fee: "비용 문의",
  other: "기타",
};

export const SOURCES = [
  "direct",
  "naver",
  "google",
  "bing",
  "daum",
  "ai_chatgpt",
  "ai_perplexity",
  "ai_gemini",
  "ai_copilot",
  "ai_claude",
  "sns",
  "other",
] as const;
export type Source = (typeof SOURCES)[number];

export const SOURCE_LABEL: Record<Source, string> = {
  direct: "직접 방문",
  naver: "네이버",
  google: "구글",
  bing: "Bing",
  daum: "다음",
  ai_chatgpt: "ChatGPT",
  ai_perplexity: "Perplexity",
  ai_gemini: "Gemini",
  ai_copilot: "Copilot",
  ai_claude: "Claude",
  sns: "SNS",
  other: "기타",
};

export const LOCATIONS = [
  "consult",
  "profile",
  "areas",
  "reviews",
  "location",
  "sticky",
  "chat_header",
  "chat_inline",
  "other",
] as const;
export type CtaLocation = (typeof LOCATIONS)[number];

export const LOCATION_LABEL: Record<CtaLocation, string> = {
  consult: "첫 화면",
  profile: "법무사 소개",
  areas: "업무 분야",
  reviews: "후기",
  location: "오시는 길",
  sticky: "모바일 하단 바",
  chat_header: "상담창 상단",
  chat_inline: "상담창 답변 아래",
  other: "기타",
};

export type Device = "mobile" | "desktop";

export interface TrackPayload {
  type: EventType;
  vid?: string; // 무작위 방문자 ID (고유 방문자 수 집계용, 개인 식별 불가)
  topic?: Topic;
  source?: Source;
  loc?: CtaLocation;
  device?: Device;
}

const TOPIC_KEYWORDS: [Topic, string[]][] = [
  ["fee", ["비용", "수수료", "얼마", "보수", "가격"]],
  ["rehab", ["회생", "파산", "빚", "채무", "변제", "연체", "대출", "면책", "독촉"]],
  ["inherit", ["상속", "증여", "유언", "한정승인", "상속포기", "돌아가"]],
  ["registry", ["등기", "매매", "소유권", "법인", "근저당", "전세권", "이전"]],
  ["payment", ["지급명령", "못 받", "안 갚", "돈을 안", "받을 돈", "가압류"]],
  ["guardian", ["후견", "치매"]],
  ["civil", ["소송", "민사", "이혼", "가사", "내용증명", "고소"]],
];

/** 사용자 질문을 '주제 분류값'으로만 바꾼다. 원문은 서버로 보내지 않는다. */
export function classifyTopic(text: string): Topic {
  for (const [topic, words] of TOPIC_KEYWORDS) {
    if (words.some((w) => text.includes(w))) return topic;
  }
  return "other";
}

/** 리퍼러·utm으로 유입 경로 판별 (AI 답변 링크 유입을 따로 센다) */
export function detectSource(referrer: string, utmSource?: string | null): Source {
  const s = `${utmSource ?? ""} ${referrer}`.toLowerCase();
  if (!s.trim()) return "direct";
  if (s.includes("chatgpt") || s.includes("openai")) return "ai_chatgpt";
  if (s.includes("perplexity")) return "ai_perplexity";
  if (s.includes("gemini.google") || s.includes("bard.google")) return "ai_gemini";
  if (s.includes("copilot")) return "ai_copilot";
  if (s.includes("claude.ai")) return "ai_claude";
  if (s.includes("naver")) return "naver";
  if (s.includes("google")) return "google";
  if (s.includes("bing")) return "bing";
  if (s.includes("daum") || s.includes("kakao")) return "daum";
  if (/instagram|facebook|threads|youtube|t\.co|twitter|x\.com|band\.us/.test(s))
    return "sns";
  return "other";
}
