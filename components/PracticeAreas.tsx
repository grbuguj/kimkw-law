"use client";

import { practiceAreas } from "@/lib/siteContent";
import { useConsult } from "./ConsultProvider";

export default function PracticeAreas() {
  const { ask } = useConsult();

  return (
    <section id="areas" className="bg-navy-50 px-4 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-center text-sm font-semibold tracking-wide text-sand-600">
          상담 분야
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          이런 일들을 도와드립니다
        </h2>
        <p className="mt-3 text-center text-[15px] text-muted">
          궁금한 분야를 누르시면, 바로 상담창에서 여쭤봐 드려요.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {practiceAreas.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => ask(a.askPrompt)}
              className={`group flex flex-col items-start gap-1.5 rounded-2xl border p-5 text-left shadow-[0_1px_2px_rgba(18,33,57,0.04)] transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-[0_8px_24px_-8px_rgba(18,33,57,0.18)] sm:p-6 ${
                a.emphasis
                  ? "border-sand-400 bg-[#faf6ee] ring-1 ring-sand-400/60"
                  : "border-navy-100 bg-white"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <h3 className="text-lg font-bold tracking-tight text-navy-900">
                  {a.title}
                </h3>
                {a.emphasis && (
                  <span className="shrink-0 rounded-full bg-sand-500 px-2 py-0.5 text-xs font-semibold text-white">
                    가장 많이 도와드린 분야
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-muted">{a.blurb}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-navy-600 group-hover:text-navy-800">
                이 분야 물어보기
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
