"use client";

import { practiceAreas } from "@/lib/siteContent";
import { useConsult } from "./ConsultProvider";

export default function PracticeAreas() {
  const { ask } = useConsult();

  return (
    <section id="areas" className="bg-navy-50 px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">
          이런 일들을 도와드립니다
        </h2>
        <p className="mt-2 text-center text-[15px] text-muted">
          궁금한 분야를 누르시면, 바로 상담창에서 여쭤봐 드려요.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {practiceAreas.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => ask(a.askPrompt)}
              className={`group flex flex-col items-start gap-1 rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                a.emphasis
                  ? "border-sand-400 ring-1 ring-sand-400/40"
                  : "border-navy-100"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <h3 className="text-lg font-bold text-navy-900">{a.title}</h3>
                {a.emphasis && (
                  <span className="rounded-full bg-sand-500 px-2 py-0.5 text-xs font-semibold text-white">
                    가장 많이 도와드린 분야
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-muted">{a.blurb}</p>
              <span className="mt-1.5 text-sm font-semibold text-navy-600 group-hover:text-navy-800">
                이 분야 물어보기 →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
