"use client";

import { useState } from "react";
import { streamChat } from "@/lib/chatClient";

const PROVIDERS = [
  { id: "gemini", name: "Google Gemini", model: "gemini-2.5-flash" },
  { id: "groq", name: "Groq · Qwen3", model: "qwen/qwen3-32b" },
] as const;

const PRESETS = [
  "개인회생 가능한지 궁금해요. 월급은 250만원이고 빚이 6천만원이에요.",
  "파산이랑 개인회생이 뭐가 달라요?",
  "상속 절차를 하나도 모르겠어요. 어디서부터 시작하나요?",
  "상담은 무료인가요?",
];

interface ColState {
  text: string;
  loading: boolean;
  error: string | null;
  ms: number | null;
}

const empty: ColState = { text: "", loading: false, error: null, ms: null };

export default function ComparePage() {
  const [q, setQ] = useState("");
  const [cols, setCols] = useState<Record<string, ColState>>({
    gemini: { ...empty },
    groq: { ...empty },
  });
  const [running, setRunning] = useState(false);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || running) return;
    setRunning(true);
    setCols({ gemini: { ...empty, loading: true }, groq: { ...empty, loading: true } });

    await Promise.all(
      PROVIDERS.map(async (p) => {
        const start = performance.now();
        try {
          await streamChat(
            [{ role: "user", content: text }],
            (chunk) =>
              setCols((prev) => ({
                ...prev,
                [p.id]: { ...prev[p.id], text: prev[p.id].text + chunk },
              })),
            { provider: p.id },
          );
          setCols((prev) => ({
            ...prev,
            [p.id]: {
              ...prev[p.id],
              loading: false,
              ms: Math.round(performance.now() - start),
            },
          }));
        } catch (err) {
          setCols((prev) => ({
            ...prev,
            [p.id]: {
              ...prev[p.id],
              loading: false,
              error: err instanceof Error ? err.message : "오류",
            },
          }));
        }
      }),
    );
    setRunning(false);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">
          무료 AI 비교 — Gemini vs Groq
        </h1>
        <p className="mt-1 text-sm text-muted">
          같은 질문을 두 모델에 동시에 보냅니다. 한국어 자연스러움·톤·속도를 보고
          고르세요. (이 페이지는 비교용 — 확정 후 제거)
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask(q);
          }}
          rows={2}
          placeholder="질문을 입력하고 비교해 보세요 (⌘/Ctrl+Enter)"
          className="flex-1 resize-none rounded-xl border border-navy-200 px-4 py-3 text-base focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200"
        />
        <button
          type="button"
          onClick={() => ask(q)}
          disabled={!q.trim() || running}
          className="shrink-0 rounded-xl bg-navy-800 px-6 py-3 font-semibold text-white transition hover:bg-navy-900 disabled:opacity-50"
        >
          {running ? "비교 중…" : "비교하기"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setQ(p);
              ask(p);
            }}
            disabled={running}
            className="rounded-full border border-navy-200 px-3 py-1.5 text-sm text-navy-700 hover:bg-navy-50 disabled:opacity-50"
          >
            {p.length > 24 ? p.slice(0, 24) + "…" : p}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {PROVIDERS.map((p) => {
          const c = cols[p.id];
          return (
            <section
              key={p.id}
              className="flex min-h-[240px] flex-col rounded-2xl border border-navy-100 bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-navy-900">{p.name}</h2>
                  <p className="text-xs text-muted">{p.model}</p>
                </div>
                {c.ms != null && (
                  <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs text-navy-700">
                    {(c.ms / 1000).toFixed(1)}초
                  </span>
                )}
              </div>
              <div className="flex-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
                {c.error ? (
                  <span className="text-rose-600">⚠️ {c.error}</span>
                ) : c.text ? (
                  c.text
                ) : c.loading ? (
                  <span className="text-muted">생각 중…</span>
                ) : (
                  <span className="text-navy-300">여기에 답변이 표시됩니다.</span>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
