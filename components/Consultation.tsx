"use client";

import { useEffect, useRef, useState } from "react";
import { useConsult } from "./ConsultProvider";
import { hero } from "@/lib/siteContent";
import DiagnosisForm from "./DiagnosisForm";
import CtaButtons from "./CtaButtons";
import Disclaimer from "./Disclaimer";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-navy-300" />
      <span
        className="typing-dot h-2 w-2 rounded-full bg-navy-300"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="typing-dot h-2 w-2 rounded-full bg-navy-300"
        style={{ animationDelay: "0.4s" }}
      />
    </span>
  );
}

function Bubble({ role, children }: { role: string; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-navy-800 text-white"
            : "rounded-bl-md bg-navy-50 text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Consultation() {
  const {
    messages,
    status,
    error,
    started,
    showDiagnosis,
    send,
  } = useConsult();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, started, showDiagnosis]);

  const submit = () => {
    if (!draft.trim()) return;
    send(draft);
    setDraft("");
  };

  const lastIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const showCta = status === "idle" && lastIsAssistant;

  return (
    <section
      id="consult"
      className="bg-gradient-to-b from-navy-900 to-navy-800 px-4 pb-10 pt-12 sm:pt-16"
    >
      <div className="mx-auto w-full max-w-2xl">
        {/* 헤드라인 */}
        <div className="mb-6 text-center">
          <h1 className="whitespace-pre-line text-2xl font-bold leading-snug text-white sm:text-3xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-100">
            {hero.subhead}
          </p>
        </div>

        {/* 채팅 카드 */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="flex items-center gap-2 border-b border-navy-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-navy-900">
              법률 AI 간편 상담
            </span>
            <span className="text-xs text-muted">·법무사김관우사무소 AI</span>
          </div>

          {/* 메시지 영역 */}
          <div
            ref={scrollRef}
            className={`space-y-3 overflow-y-auto px-4 py-4 ${
              started ? "max-h-[46vh] min-h-[160px]" : ""
            }`}
          >
            {!started && (
              <div className="py-2">
                <Bubble role="assistant">
                  안녕하세요. 어떤 일로 마음이 무거우신가요? 편하게 적어주세요.
                  무엇을 물으셔도 괜찮습니다.
                </Bubble>
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

          {/* 빠른 질문 칩 (대화 시작 전) */}
          {!started && (
            <div className="flex flex-wrap gap-2 px-4 pb-1">
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
          )}

          {/* 입력창 */}
          <div className="border-t border-navy-50 p-3">
            <div className="flex items-end gap-2">
              <textarea
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
        </div>
      </div>
    </section>
  );
}
