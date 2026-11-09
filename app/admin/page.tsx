import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminEnabled, isValidSession } from "@/lib/analytics/auth";
import { loadStats, type Stats } from "@/lib/analytics/stats";
import {
  LOCATION_LABEL,
  SOURCE_LABEL,
  TOPIC_LABEL,
  type Source,
} from "@/lib/analytics/events";
import TrendChart from "@/components/analytics/TrendChart";
import BarList from "@/components/analytics/BarList";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "운영 지표 | 법무사김관우사무소",
  robots: { index: false, follow: false },
};

const PERIODS = [7, 30, 90] as const;

const rate = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-navy-100 bg-white p-4 sm:p-5 ${className}`}>
      <h2 className="mb-3 text-sm font-semibold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

function Delta({ cur, prev }: { cur: number; prev: number }) {
  if (!prev) return <span className="text-[12px] text-muted">이전 기간 데이터 없음</span>;
  const d = Math.round(((cur - prev) / prev) * 100);
  const up = d >= 0;
  return (
    <span className={`text-[12px] font-medium ${up ? "text-emerald-700" : "text-rose-700"}`}>
      {up ? "▲" : "▼"} {Math.abs(d)}% <span className="font-normal text-muted">이전 대비</span>
    </span>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4">
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-navy-900">{value}</p>
      <div className="mt-1 min-h-[18px]">{sub}</div>
    </div>
  );
}

function Login({ error, configured }: { error: boolean; configured: boolean }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-navy-50 px-4">
      <form method="post" action="/api/admin/login" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy-100">
        <h1 className="text-lg font-bold text-navy-900">운영 지표</h1>
        <p className="mt-1 text-sm text-muted">법무사김관우사무소 관리자</p>
        {!configured ? (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            환경변수 <code>ADMIN_PASSWORD</code>(8자 이상)를 설정해야 로그인할 수 있어요.
          </p>
        ) : (
          <>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="비밀번호"
              className="mt-5 w-full rounded-xl border border-navy-200 px-4 py-3 text-base focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200"
            />
            {error && <p className="mt-2 text-sm text-rose-700">비밀번호가 맞지 않아요.</p>}
            <button className="mt-4 w-full rounded-xl bg-navy-800 py-3 font-semibold text-white hover:bg-navy-900">
              들어가기
            </button>
          </>
        )}
      </form>
    </main>
  );
}

function Dashboard({ s }: { s: Stats }) {
  const t = s.totals;
  const contacts = t.cta_call + t.cta_book;
  const aiVisits = s.sources.filter((x) => x.key.startsWith("ai_")).reduce((a, b) => a + b.count, 0);
  const funnel = [
    { label: "방문자", value: t.visitors },
    { label: "상담창 열람", value: t.chat_open },
    { label: "상담 시작", value: t.chat_start },
    { label: "전화·예약 클릭", value: contacts },
  ];
  const fmax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <>
      {!s.enabled && (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Redis가 연결되지 않아 데이터가 쌓이지 않고 있어요. Vercel 대시보드 → Storage(Marketplace) → <b>Upstash Redis</b>를
          프로젝트에 연결하면 자동으로 수집이 시작돼요.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="방문자 (고유)" value={t.visitors.toLocaleString()} sub={<Delta cur={t.visitors} prev={s.prevTotals.visitors} />} />
        <Kpi label="상담 시작" value={t.chat_start.toLocaleString()} sub={<Delta cur={t.chat_start} prev={s.prevTotals.chatStarts} />} />
        <Kpi label="전화·예약 클릭" value={contacts.toLocaleString()} sub={<Delta cur={contacts} prev={s.prevTotals.contacts} />} />
        <Kpi
          label="방문 → 연락 전환율"
          value={`${rate(contacts, t.visitors)}%`}
          sub={<span className="text-[12px] text-muted">전화 {t.cta_call} · 예약 {t.cta_book}</span>}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="일별 추이" className="lg:col-span-2">
          <TrendChart data={s.daily.map((d) => ({ date: d.date, visitors: d.visitors, chatStarts: d.chatStarts }))} />
        </Card>
        <Card title="전환 퍼널">
          <ol className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.label}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="text-ink">{f.label}</span>
                  <span className="tabular-nums text-muted">
                    <strong className="text-navy-900">{f.value}</strong>
                    {i > 0 && <> · {rate(f.value, funnel[i - 1].value)}%</>}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-navy-50">
                  <div className="h-2.5 rounded-full bg-[#3d64a8]" style={{ width: `${Math.max(2, (f.value / fmax) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            진단 폼: 열람 {t.diagnosis_open} · 제출 {t.diagnosis_submit} ({rate(t.diagnosis_submit, t.diagnosis_open)}%)
          </p>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card title="상담 주제">
          <BarList items={s.topics.map((x) => ({ label: TOPIC_LABEL[x.key], value: x.count }))} />
        </Card>
        <Card title={`유입 경로 · AI 유입 ${aiVisits}`}>
          <BarList
            items={s.sources.map((x) => ({
              label: SOURCE_LABEL[x.key as Source],
              value: x.count,
              note: x.key.startsWith("ai_") ? "AI" : undefined,
            }))}
            highlight={(label) => ["ChatGPT", "Perplexity", "Gemini", "Copilot", "Claude"].includes(label)}
          />
        </Card>
        <Card title="전화·예약은 어디서 눌렀나">
          {s.ctaByLoc.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">아직 데이터가 없어요</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[12px] text-muted">
                  <th className="pb-2 font-normal">위치</th>
                  <th className="pb-2 text-right font-normal">전화</th>
                  <th className="pb-2 text-right font-normal">예약</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {s.ctaByLoc.map((r) => (
                  <tr key={r.key}>
                    <td className="py-1.5 text-ink">{LOCATION_LABEL[r.key]}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.call}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.book}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-4 text-[12px] text-muted">
            기기: 모바일 {s.devices.mobile} · PC {s.devices.desktop} ({rate(s.devices.mobile, s.devices.mobile + s.devices.desktop)}% 모바일)
          </p>
        </Card>
      </div>

      <details className="mt-3 rounded-2xl border border-navy-100 bg-white p-4 sm:p-5">
        <summary className="cursor-pointer text-sm font-semibold text-navy-900">일별 표로 보기</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="text-left text-[12px] text-muted">
                <th className="pb-2 font-normal">날짜</th>
                <th className="pb-2 text-right font-normal">방문자</th>
                <th className="pb-2 text-right font-normal">상담 시작</th>
                <th className="pb-2 text-right font-normal">전화</th>
                <th className="pb-2 text-right font-normal">예약</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50 tabular-nums">
              {[...s.daily].reverse().map((d) => (
                <tr key={d.date}>
                  <td className="py-1.5">{d.date}</td>
                  <td className="py-1.5 text-right">{d.visitors}</td>
                  <td className="py-1.5 text-right">{d.chatStarts}</td>
                  <td className="py-1.5 text-right">{d.calls}</td>
                  <td className="py-1.5 text-right">{d.books}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-4 text-center text-[11px] text-muted">
        익명 집계만 저장합니다 · 대화 내용·이름·연락처는 수집하지 않아요 · 한국 시간 기준
      </p>
    </>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return <Login error={sp.error === "1"} configured={adminEnabled()} />;
  }

  const req = Number(sp.days);
  const days = (PERIODS as readonly number[]).includes(req) ? req : 30;
  const stats = await loadStats(days);

  return (
    <main className="min-h-dvh bg-navy-50/60 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="mr-auto">
            <h1 className="text-lg font-bold text-navy-900 sm:text-xl">운영 지표</h1>
            <p className="text-[13px] text-muted">법무사김관우사무소 · 최근 {days}일</p>
          </div>
          <div className="flex items-center gap-1">
          <nav className="flex rounded-xl bg-white p-1 ring-1 ring-navy-100">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/admin?days=${p}`}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ${
                  p === days ? "bg-navy-800 text-white" : "text-navy-700 hover:bg-navy-50"
                }`}
              >
                {p}일
              </Link>
            ))}
          </nav>
          <form method="post" action="/api/admin/logout">
            <button className="rounded-xl px-3 py-2 text-[13px] text-muted hover:bg-white">로그아웃</button>
          </form>
          </div>
        </header>
        <Dashboard s={stats} />
      </div>
    </main>
  );
}
