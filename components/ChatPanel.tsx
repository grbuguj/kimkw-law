"use client";

import { useEffect, useRef, useState } from "react";
import { useConsult } from "./ConsultProvider";
import { booking, cta, disclaimer, hero, office } from "@/lib/siteContent";
import { Bubble, TypingDots } from "./ChatBubbles";
import DiagnosisForm from "./DiagnosisForm";
import { track } from "@/lib/analytics/track";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICON = {
  close: "M18 6 6 18M6 6l12 12",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  chevron: "m9 18 6-6-6-6",
};

/** 답변 아래에 붙는 한 줄짜리 상담 연결 카드 (고정 영역이 아니라 대화 흐름 안에 둔다) */
function InlineCta() {
  return (
    <div
      data-track-loc="chat_inline"
      className="animate-fade-up flex items-center gap-2 rounded-2xl border border-navy-100 bg-white px-3 py-2.5">
      <p className="min-w-0 flex-1 text-[13px] leading-snug text-muted">
        정확한 건{" "}
        <strong className="whitespace-nowrap text-navy-800">직접 상담</strong>
        에서

      </p>
      <a
        href={office.phoneHref}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-navy-800 px-2.5 py-1.5 text-[13px] font-semibold text-navy-800"
      >
        <Icon d={ICON.phone} className="h-3.5 w-3.5" />
        {cta.callShort}
      </a>
      <a
        href={booking.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-navy-800 px-2.5 py-1.5 text-[13px] font-semibold text-white"
      >
        {cta.bookShort}
      </a>
    </div>
  );
}

/** 회생·파산 질문 후 노출되는 진단 '제안' 카드 — 누를 때만 폼이 펼쳐진다 */
function DiagnosisOffer({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="animate-fade-up flex w-full items-center gap-3 rounded-2xl border border-sand-400/70 bg-[#faf6ee] px-4 py-3 text-left transition hover:border-sand-500"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-navy-900">
          1분 개인회생 가능성 진단
        </span>
        <span className="block text-[13px] text-muted">
          소득·채무·연체 기간만 고르면 돼요
        </span>
      </span>
      <Icon d={ICON.chevron} className="h-5 w-5 shrink-0 text-sand-600" />
    </button>
  );
}

export default function ChatPanel() {
  const {
    messages,
    status,
    error,
    started,
    showDiagnosis,
    diagnosisOffered,
    openDiagnosis,
    isOpen,
    close,
    send,
  } = useConsult();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const idle = status === "idle";
  const lastIsAnswer =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content !== "";

  // 오픈 시 / 새 메시지마다 하단 고정
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, showDiagnosis, diagnosisOffered, status]);

  // 바디 스크롤 락 + Escape 닫기 (+ 데스크탑만 입력창 자동 포커스: 모바일은 키보드가 화면을 덮음)
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    if (window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  // 통계: 상담창이 열릴 때 1회
  useEffect(() => {
    if (isOpen) track({ type: "chat_open" });
  }, [isOpen]);

  // 입력창 자동 높이 (최대 4줄 정도)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft]);

  if (!isOpen) return null;

  const submit = () => {
    if (!draft.trim()) return;
    send(draft);
    setDraft("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="법률 AI 상담"
      className="animate-fade-up fixed inset-0 z-50 flex h-dvh flex-col bg-white"
    >
      {/* 헤더 — 전화·예약은 여기 작게 상시 노출 (화면 하단을 차지하지 않음) */}
      <header
        data-track-loc="chat_header"
        className="flex shrink-0 items-center gap-2 border-b border-navy-50 px-3 py-2.5 sm:px-4">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
        <span className="truncate text-sm font-semibold text-navy-900">
          법률 AI 간편 상담
        </span>
        <span className="hidden text-xs text-muted sm:inline">
          · {office.name}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <a
            href={office.phoneHref}
            aria-label="전화하기"
            className="inline-flex items-center gap-1 rounded-full border border-navy-200 px-2.5 py-1.5 text-[13px] font-semibold text-navy-800 transition hover:bg-navy-50"
          >
            <Icon d={ICON.phone} className="h-4 w-4" />
            <span className="hidden sm:inline">{cta.call}</span>
          </a>
          <a
            href={booking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-navy-800 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-navy-900"
          >
            {cta.book}
          </a>
          <button
            type="button"
            onClick={close}
            aria-label="상담창 닫기"
            className="rounded-full p-1.5 text-muted transition hover:bg-navy-50 hover:text-navy-900"
          >
            <Icon d={ICON.close} />
          </button>
        </div>
      </header>

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="mx-auto w-full max-w-2xl flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <p className="text-center text-[11px] leading-relaxed text-navy-300">
          {disclaimer}
        </p>

        {!started && (
          <div className="space-y-3 py-1">
            <Bubble role="assistant">
              안녕하세요. 어떤 일로 마음이 무거우신가요? 편하게 적어주세요. 무엇을
              물으셔도 괜찮습니다.
            </Bubble>
            <div className="flex flex-wrap gap-2 pt-1">
              {hero.quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-sm text-navy-700 transition hover:border-navy-600 hover:bg-navy-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isStreamingLast =
            i === messages.length - 1 &&
            m.role === "assistant" &&
            status === "streaming";
          return (
            <Bubble key={i} role={m.role}>
              {m.content || (isStreamingLast ? <TypingDots /> : null)}
            </Bubble>
          );
        })}

        {/* 답변이 끝난 뒤에만: 진단 제안 → 상담 연결 순서로 */}
        {idle && diagnosisOffered && !showDiagnosis && (
          <DiagnosisOffer onOpen={openDiagnosis} />
        )}
        {showDiagnosis && <DiagnosisForm />}
        {idle && lastIsAnswer && !showDiagnosis && <InlineCta />}

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
      </div>

      {/* 입력창 — 입력만 남겨 화면을 최대한 대화에 쓴다 */}
      <footer
        className="shrink-0 border-t border-navy-50 px-3 pt-2.5"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="궁금한 걸 편하게 적어주세요"
            className="min-w-0 flex-1 resize-none rounded-2xl border border-navy-200 bg-white px-4 py-2.5 text-base leading-6 text-ink placeholder:text-navy-300 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || status === "streaming"}
            aria-label="보내기"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:gap-1.5 sm:rounded-2xl sm:px-5"
          >
            <Icon d={ICON.send} className="h-[18px] w-[18px]" />
            <span className="hidden font-semibold sm:inline">보내기</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
