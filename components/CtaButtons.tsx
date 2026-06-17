import { booking, office, cta } from "@/lib/siteContent";

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.1em] w-[1.1em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.1em] w-[1.1em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/**
 * 상황별 CTA: [무료 15분 상담 예약] [전화하기]
 * variant="inline" — 채팅 답변 하단용, "compact" — 좁은 영역용.
 */
export default function CtaButtons({
  variant = "inline",
}: {
  variant?: "inline" | "compact";
}) {
  const size = variant === "compact" ? "text-sm py-2.5 px-4" : "py-3.5 px-5";
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <a
        href={booking.free.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-800 font-semibold text-white shadow-sm transition hover:bg-navy-900 active:scale-[0.99] ${size}`}
      >
        <CalendarIcon />
        {cta.bookFree}
      </a>
      <a
        href={office.phoneHref}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-navy-800 bg-white font-semibold text-navy-800 transition hover:bg-navy-50 active:scale-[0.99] ${size}`}
      >
        <PhoneIcon />
        {cta.call}
      </a>
    </div>
  );
}
