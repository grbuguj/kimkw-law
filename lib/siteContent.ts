/**
 * 사이트 전체 콘텐츠 단일 소스.
 * 사진(추후 교체), 영업시간/예약 URL(미확정) 등은 아래 TODO 표시 참고.
 * 문구·연락처·경력·리뷰를 모두 여기서 관리한다.
 */

export const office = {
  name: "법무사김관우사무소",
  lawyer: "김관우 법무사",
  phone: "0507-1456-7936",
  phoneHref: "tel:0507-1456-7936",
  address: "경기 김포시 사우중로 17 나동 1층 102호",
  addressShort: "김포 사우중로 17, 나동 1층 102호",
  transit: "김포골드라인 사우역 3번 출구에서 372m",
  // TODO(사용자 제공): 정확한 영업시간 확정값으로 교체
  hours: "평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00 휴게) · 주말·공휴일 휴무",
  // 네이버 플레이스 (place id: 1541065273)
  naverMapUrl: "https://map.naver.com/p/entry/place/1541065273",
} as const;

// 네이버 예약은 단일 진입(플레이스 예약 페이지)으로 통일.
// 사용자가 예약 페이지에서 무료/법률 상품을 직접 선택한다.
const BOOKING_URL =
  "https://map.naver.com/p/entry/place/1541065273?placePath=/ticket";

/** 상담 2종 안내 (버튼은 동일한 네이버 예약 페이지로 연결) */
export const booking = {
  free: {
    label: "무료 상담 예약",
    detail: "15분 · 무료",
    url: BOOKING_URL,
  },
  paid: {
    label: "법률 상담 예약",
    detail: "30분 · 5만원 (수임 시 면제)",
    url: BOOKING_URL,
  },
} as const;

export const hero = {
  headline: "혼자 고민하지 마세요.\n무엇이든 편하게 물어보세요.",
  subhead:
    "법원 30년 · 전 김포 등기소장 · 인천법원 개인회생위원 김관우 법무사가 상담을 확인합니다.",
  inputPlaceholder: "예: 개인회생, 가능할지 궁금해요…",
  // 진입 즉시 보이는 빠른 질문 칩
  quickQuestions: [
    "개인회생, 저도 될까요?",
    "파산이랑 개인회생, 뭐가 달라요?",
    "상담은 무료인가요?",
    "등기 비용이 궁금해요",
  ],
} as const;

export const reviewSummary = {
  count: 32,
  rating: 4.97,
  note: "네이버 리뷰 기준 (김포 법무사 중 압도적)",
} as const;

/** 경력 타임라인 (네이버 기준) */
export const career: { title: string; desc?: string }[] = [
  { title: "법원 30년 근무 후 명예퇴직" },
  { title: "전 김포등기소장" },
  { title: "전 인천법원 개인회생위원" },
  { title: "전 인천법원 부천지원 총무과장" },
  { title: "전 인천법원 민사신청과장" },
  { title: "전 법원행정처 사법등기심의관실" },
];

/** 업무 분야 — 클릭 시 상담창에 자동 입력될 질문(askPrompt) 포함 */
export const practiceAreas: {
  key: string;
  title: string;
  blurb: string;
  emphasis?: boolean;
  askPrompt: string;
}[] = [
  {
    key: "rehab",
    title: "개인회생 · 파산",
    blurb: "빚 때문에 잠 못 이루셨다면. 가장 많이 도와드린 분야입니다.",
    emphasis: true,
    askPrompt: "개인회생을 알아보고 있어요. 제 상황에서 가능할지 봐주실 수 있나요?",
  },
  {
    key: "registry",
    title: "부동산 · 법인 등기",
    blurb: "전 김포등기소장이 직접 챙기는 등기 업무.",
    askPrompt: "부동산 등기 관련해서 절차랑 비용이 궁금해요.",
  },
  {
    key: "inherit",
    title: "상속 · 증여",
    blurb: "갑작스러운 상속, 무엇부터 해야 할지 안내해 드립니다.",
    askPrompt: "상속 관련 절차를 알아보고 있어요. 어디서부터 시작해야 하나요?",
  },
  {
    key: "payment",
    title: "지급명령",
    blurb: "못 받은 돈, 법적으로 받는 절차를 도와드립니다.",
    askPrompt: "받을 돈이 있는데 지급명령이 뭔지, 어떻게 신청하는지 궁금해요.",
  },
  {
    key: "guardian",
    title: "성년후견",
    blurb: "가족의 판단을 대신 지켜드리는 후견 절차.",
    askPrompt: "성년후견 제도가 궁금해요. 어떤 경우에 신청하나요?",
  },
  {
    key: "civil",
    title: "민사 · 가사",
    blurb: "복잡한 분쟁, 차분히 길을 함께 찾습니다.",
    askPrompt: "민사 문제로 고민이 있는데 상담이 가능한지 궁금해요.",
  },
];

/** 대표 후기 (네이버 리뷰 발췌본 — 추후 실제 발췌로 교체 가능) */
export const reviews: { body: string; author: string }[] = [
  {
    body: "개인회생 때문에 막막했는데 처음부터 끝까지 차분하게 설명해 주셔서 마음이 놓였습니다. 다른 데서 못 받던 답을 여기서 받았어요.",
    author: "개인회생 의뢰인",
  },
  {
    body: "전화로 물어본 것도 귀찮아하지 않고 끝까지 친절하게 알려주셨어요. 경력이 괜히 있는 게 아니구나 싶었습니다.",
    author: "등기 의뢰인",
  },
  {
    body: "상속 절차를 하나도 몰랐는데 하나하나 짚어 주셔서 수월하게 끝냈습니다. 믿고 맡길 수 있는 분이에요.",
    author: "상속 의뢰인",
  },
  {
    body: "비용도 솔직하게 말씀해 주시고 무리하게 권하지 않으셔서 신뢰가 갔습니다. 김포에서 법무사 찾으면 여기 추천해요.",
    author: "지급명령 의뢰인",
  },
  {
    body: "겁먹고 갔는데 ‘여기까지 알아보신 것만으로 잘하고 계신 거다’ 하시는 말씀에 위로받았습니다. 사람을 편하게 해주세요.",
    author: "파산 의뢰인",
  },
  {
    body: "법원에서 오래 계셨던 분이라 그런지 설명에 군더더기가 없고 정확합니다. 결과도 만족스러웠어요.",
    author: "민사 의뢰인",
  },
];

export const cta = {
  bookFree: "무료 15분 상담 예약",
  call: "전화하기",
  callShort: "전화",
  bookShort: "예약하기",
} as const;

export const disclaimer =
  "본 상담은 일반적인 법률 정보 제공을 위한 것으로 법률 자문이 아니며, 구체적 사안은 반드시 법무사 상담을 통해 확인하시기 바랍니다.";
