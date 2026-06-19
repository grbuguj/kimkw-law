"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConversationRow } from "@/lib/supabase";

type ConvSummary = Pick<
  ConversationRow,
  "id" | "session_id" | "messages" | "ip" | "created_at"
>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function firstUserMsg(messages: ConversationRow["messages"]) {
  return messages.find((m) => m.role === "user")?.content ?? "(없음)";
}

// ─── 로그인 화면 ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = async () => {
    const res = await fetch("/api/admin/conversations", {
      headers: { "x-admin-password": pw },
    });
    if (res.ok) {
      onLogin(pw);
    } else {
      setErr(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold text-slate-900">
          관리자 로그인
        </h1>
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          autoFocus
        />
        {err && (
          <p className="mt-2 text-center text-xs text-red-500">
            비밀번호가 틀렸습니다.
          </p>
        )}
        <button
          onClick={submit}
          className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          로그인
        </button>
      </div>
    </div>
  );
}

// ─── 대화 상세 모달 ───────────────────────────────────────────────────────────
function ConvModal({
  conv,
  onClose,
}: {
  conv: ConvSummary;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white shadow-xl sm:rounded-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(conv.created_at)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              IP: {conv.ip ?? "—"} · {conv.messages.length}개 메시지
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 대화 내용 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {conv.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "rounded-br-md bg-slate-900 text-white"
                    : "rounded-bl-md bg-slate-100 text-slate-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 메인 대시보드 ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [pw, setPw] = useState<string | null>(null);
  const [convs, setConvs] = useState<ConvSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ConvSummary | null>(null);

  const fetchConvs = useCallback(async (password: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/conversations", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setConvs(await res.json());
    }
    setLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    setPw(password);
    void fetchConvs(password);
  };

  if (!pw) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 헤더 */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">상담 기록</h1>
            <p className="text-xs text-slate-400 mt-0.5">법무사김관우사무소</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              총 {convs.length}건
            </span>
            <button
              onClick={() => void fetchConvs(pw)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </header>

      {/* 목록 */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          </div>
        ) : convs.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-400">
            아직 상담 기록이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {convs.map((c) => {
              const userCount = c.messages.filter((m) => m.role === "user").length;
              const preview = firstUserMsg(c.messages);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {preview}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(c.created_at)} · IP {c.ip ?? "—"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                      {userCount}문
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {selected && (
        <ConvModal conv={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
