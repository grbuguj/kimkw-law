# 법무사김관우사무소 — AI 상담(클로징) 사이트

김포 "법무사" 네이버 검색 1위 사무소의 **전환 마무리 레이어**.
이미 들어온 방문객을 "김관우 법무사 직접 상담 도우미"로 붙잡아 **무료 15분 상담 예약 / 전화**로 전환시키는 모바일 우선 단일 페이지.

- "AI"는 전면에 내세우지 않음(의도적). 전면 메시지는 "혼자 고민 마세요 + 김관우 법무사 직접 상담".
- 톤: 데일 카네기 인간관계론 기반 차분한 신뢰. 협박·조급함 금지.
- DB·로그·회원·결제 없음. 상담 키 보호용 서버 프록시 1개만 둠.

## 기술 스택
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Anthropic Claude API (`claude-sonnet-4-6`), 서버 라우트에서 스트리밍
- 배포: Vercel

## 로컬 실행
```bash
cp .env.example .env.local      # 그리고 ANTHROPIC_API_KEY 채우기
npm install
npm run dev                     # http://localhost:3000
```
> 키가 없어도 페이지는 뜹니다(채팅 전송 시 안내 문구). 채팅 실제 응답엔 키 필요.

## 구조
```
app/
  layout.tsx            # 메타데이터(SEO), 전역 스타일
  page.tsx              # 단일 페이지 조립
  globals.css           # 네이비/그레이 디자인 토큰
  api/chat/route.ts     # 서버 프록시(키 보호) + Claude 스트리밍
lib/
  siteContent.ts        # ★ 모든 콘텐츠(연락처/경력/리뷰/예약URL/문구) 단일 관리
  systemPrompt.ts       # 상담 도우미 페르소나·톤·4단구조(서버 전용)
  chatClient.ts         # 프론트 스트리밍 fetch 헬퍼
components/             # Consultation(히어로+채팅), 진단폼, 프로필, 업무, 후기, 위치, 하단바 등
```

## 배포 (Vercel)
1. 이 폴더를 GitHub에 푸시 → Vercel에서 Import.
2. **Settings → Environment Variables** 에 `ANTHROPIC_API_KEY` 추가 (코드/깃엔 절대 넣지 않음).
3. 배포 후 도메인을 **네이버 플레이스 "웹사이트" 링크칸에 등록** → 1위 노출에서 사이트로 유입.

## 콘텐츠 교체 체크리스트 (`lib/siteContent.ts` 한 곳에서)
- [ ] `office.hours` — 정확한 영업시간
- [ ] `booking.free.url` / `booking.paid.url` — 네이버 예약 URL 2종
- [ ] 사진: `components/Placeholder` 자리들을 실제 이미지(`next/image`)로 교체
- [ ] `reviews` — 실제 네이버 리뷰 발췌로 교체(선택)
- [ ] `office.naverMapUrl` — 정확한 플레이스 링크(선택)
