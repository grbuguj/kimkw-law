"use client";

import { useEffect, useRef, useState } from "react";
import { useConsult } from "./ConsultProvider";
import { hero } from "@/lib/siteContent";
import { Bubble, TypingDots } from "./ChatBubbles";
import DiagnosisForm from "./DiagnosisForm";
import CtaButtons from "./CtaButtons";
import Disclaimer from "./Disclaimer";

export default function ChatPanel() {
  const {
    messages,
    status,
    error,
    started,
    showDiagnosis,
    isOpen,
    close,
    send,
  } = useConsult();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 오픈 시 / 새 메시지마다 하단 고정
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, showDiagnosis]);

  // 바디 스크롤 락 + Escape 닫기 + 입력창 포커스
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const submit = () => {
    if (!draft.trim()) return;
    send(draft);
    setDraft("");
  };

  const lastIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const showCta = status === "idle" && lastIsAssistant;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="법률 AI 상담"
      className="animate-fade-up fixed inset-0 z-50 flex h-dvh flex-col bg-white"
    >
      {/* 헤더 */}
      <header className="flex shrink-0 items-center gap-2 border-b border-navy-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-navy-900">
          법률 AI 간편 상담
        </span>
        <span className="hidden text-xs text-muted sm:inline">
          ·법무사김관우사무소 AI
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="상담창 닫기"
          className="ml-auto rounded-full p-2 text-muted transition hover:bg-navy-50 hover:text-navy-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="mx-auto w-full max-w-2xl flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {!started && (
          <div className="space-y-3 py-2">
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

        {showDiagnosis && <DiagnosisForm />}

        {showCta && (
          <div className="animate-fade-up pt-1">
            <p className="mb-2 text-center text-sm text-muted">
              더 정확한 건 직접 들어보시는 게 마음이 편하실 거예요.
            </p>
            <CtaButtons variant="compact" />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
      </div>

      {/* 입력창 */}
      <footer
        className="shrink-0 border-t border-navy-50 p-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder={hero.inputPlaceholder}
              className="max-h-32 flex-1 resize-none rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-ink placeholder:text-navy-300 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim() || status === "streaming"}
              className="shrink-0 rounded-xl bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              보내기
            </button>
          </div>
          <Disclaimer className="mt-2.5 px-0.5" />
        </div>
      </footer>
    </div>
  );
}
