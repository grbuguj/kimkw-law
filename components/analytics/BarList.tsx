/** 가로 막대 목록 (단일 계열 → 한 색, 값은 텍스트로 항상 표시) */
export default function BarList({
  items,
  empty = "아직 데이터가 없어요",
  highlight,
}: {
  items: { label: string; value: number; note?: string }[];
  empty?: string;
  /** 강조할 항목 라벨 (예: AI 유입) */
  highlight?: (label: string) => boolean;
}) {
  if (items.length === 0) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <ul className="space-y-2.5">
      {items.map((it) => {
        const pct = total ? Math.round((it.value / total) * 100) : 0;
        const hl = highlight?.(it.label);
        return (
          <li key={it.label} title={`${it.label}: ${it.value} (${pct}%)`} className="group">
            <div className="mb-1 flex items-baseline justify-between gap-2 text-[13px]">
              <span className={`truncate ${hl ? "font-semibold text-navy-900" : "text-ink"}`}>
                {it.label}
                {it.note && <span className="ml-1.5 text-[11px] font-normal text-muted">{it.note}</span>}
              </span>
              <span className="shrink-0 tabular-nums text-muted">
                <strong className="font-semibold text-navy-900">{it.value}</strong> · {pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-navy-50">
              <div
                className="h-2 rounded-full transition-opacity group-hover:opacity-80"
                style={{ width: `${Math.max(2, (it.value / max) * 100)}%`, background: hl ? "#a8781f" : "#3d64a8" }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
