"use client";

import { useEffect, useRef, useState } from "react";

export interface TrendPoint {
  date: string;
  visitors: number;
  chatStarts: number;
}

// 검증된 2색 (validate_palette: CVD ΔE 22.9, 대비 3:1 이상)
const C_VISITORS = "#3d64a8";
const C_CHATS = "#a8781f";

const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

function niceMax(v: number) {
  if (v <= 5) return 5;
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
}

/** 일별 방문자·상담 시작 추이 (한 축, 2계열) + 십자선 툴팁 */
export default function TrendChart({ data }: { data: TrendPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  // 실제 너비로 그려서 모바일에서도 글자가 작아지지 않게 (viewBox 축소 방지)
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 500 ? 200 : 240;
  const n = data.length;
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.visitors, d.chatStarts))));
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / max) * ih;
  const path = (key: "visitors" | "chatStarts") =>
    data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join("");
  const ticks = [0, max / 2, max];
  const labelEvery = Math.max(1, Math.ceil(n / (W < 500 ? 4 : 6)));
  const h = hover !== null ? data[hover] : null;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - r.left) / r.width) * iw;
    setHover(Math.max(0, Math.min(n - 1, Math.round((rel / iw) * (n - 1)))));
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded" style={{ background: C_VISITORS }} />
          방문자
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded" style={{ background: C_CHATS }} />
          상담 시작
        </span>
      </div>
      <div ref={boxRef} className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="일별 방문자와 상담 시작 추이">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e8edf4" />
              <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#7e8a9b">
                {Math.round(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#7e8a9b">
                {d.date.slice(5).replace("-", "/")}
              </text>
            ) : null,
          )}
          <path d={path("visitors")} fill="none" stroke={C_VISITORS} strokeWidth="2" strokeLinejoin="round" />
          <path d={path("chatStarts")} fill="none" stroke={C_CHATS} strokeWidth="2" strokeLinejoin="round" />
          {h && hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} stroke="#adc0db" strokeDasharray="3 3" />
              {(["visitors", "chatStarts"] as const).map((k) => (
                <circle key={k} cx={x(hover)} cy={y(h[k])} r="4.5" fill={k === "visitors" ? C_VISITORS : C_CHATS} stroke="#fff" strokeWidth="2" />
              ))}
            </g>
          )}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-1 rounded-lg border border-navy-100 bg-white px-3 py-2 text-[12px] shadow-md"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: hover > n / 2 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
            }}
          >
            <p className="mb-1 font-semibold text-navy-900">{h.date}</p>
            <p className="text-ink">방문자 <strong>{h.visitors}</strong></p>
            <p className="text-ink">상담 시작 <strong>{h.chatStarts}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
