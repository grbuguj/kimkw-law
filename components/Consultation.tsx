"use client";

import { useEffect, useRef, useState } from "react";
import { useConsult } from "./ConsultProvider";
import { hero } from "@/lib/siteContent";
import Disclaimer from "./Disclaimer";

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.05em] w-[1.05em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

export default function Consultation() {
  const { send, open } = useConsult();
  const [draft, setDraft] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 데스크탑에서만 진입 시 입력창 자동 포커스 (모바일은 키보드 튀어오름 방지)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  // 예시 질문을 타이프라이터로 순환 노출 (사용자가 입력 시작하면 중단)
  useEffect(() => {
    if (draft) return;
    const examples = hero.quickQuestions;
    let qi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = examples[qi];
      if (!deleting) {
        ci++;
        setPlaceholder(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        setPlaceholder(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          qi = (qi + 1) % examples.length;
        }
      }
      timer = setTimeout(tick, deleting ? 35 : 70);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [draft]);

  const submit = () => {
    const text = draft.trim();
    if (!text) {
      open();
      return;
    }
    send(text);
    setDraft("");
  };

  return (
    <section
      id="consult"
      className="bg-gradient-to-b from-navy-900 to-navy-800 px-4 pb-14 pt-16 sm:pt-24"
    >
      <div className="mx-auto w-full max-w-2xl">
        {/* 헤드라인 */}
        <div className="mb-8 text-center">
          <h1 className="whitespace-pre-line font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-navy-100">
            {hero.subhead}
          </p>
        </div>

        {/* 입력 진입점 */}
        <div className="rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={`${placeholder || hero.inputPlaceholder}`}
              className="min-w-0 flex-1 rounded-xl bg-white px-3 py-3 text-base text-ink placeholder:text-navy-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-900 active:scale-[0.99]"
            >
              <SendIcon />
              물어보기
            </button>
          </div>
        </div>

        {/* 안심 문구 */}
        <p className="mt-4 text-center text-[13px] leading-relaxed text-navy-200/90">
          무료예요. 이름·연락처 없이, 가볍게 한마디만 적어보셔도 괜찮습니다.
        </p>

        {/* 빠른 질문 칩 */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {hero.quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm text-white transition hover:bg-white/20"
            >
              {q}
            </button>
          ))}
        </div>

        <Disclaimer className="mt-5 text-center text-navy-200/80" />
      </div>
    </section>
  );
}
