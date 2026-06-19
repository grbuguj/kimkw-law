"use client";

import { useState } from "react";
import { useConsult } from "./ConsultProvider";
import { hero } from "@/lib/siteContent";
import Disclaimer from "./Disclaimer";

export default function Consultation() {
  const { send, open } = useConsult();
  const [draft, setDraft] = useState("");

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
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={hero.inputPlaceholder}
              className="min-w-0 flex-1 rounded-xl bg-white px-3 py-3 text-base text-ink placeholder:text-navy-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              className="shrink-0 rounded-xl bg-navy-800 px-5 py-3 font-semibold text-white transition hover:bg-navy-900 active:scale-[0.99]"
            >
              상담 시작
            </button>
          </div>
        </div>

        {/* 빠른 질문 칩 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
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
