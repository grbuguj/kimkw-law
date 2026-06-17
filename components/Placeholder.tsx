/**
 * 실제 사진 확보 전 임시 자리. 추후 next/image 로 교체.
 * label 로 어떤 사진이 들어갈 자리인지 표시한다.
 */
export default function Placeholder({
  label,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`flex ${ratio} items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-navy-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-1.5 px-3 text-center text-navy-300">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="text-xs font-medium">{label}</span>
      </div>
    </div>
  );
}
