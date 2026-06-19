"use client";

import { booking, office, cta } from "@/lib/siteContent";
import { useConsult } from "./ConsultProvider";

/** 모바일 고정 하단 바: 항상 노출되는 [전화하기] [네이버 예약] */
export default function StickyBar() {
  const { isOpen } = useConsult();
  if (isOpen) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 px-3 py-2.5 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-md gap-2.5">
        <a
          href={office.phoneHref}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-navy-800 py-3 font-semibold text-navy-800 active:scale-[0.99]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
          {cta.call}
        </a>
        <a
          href={booking.free.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[1.3] items-center justify-center gap-1.5 rounded-xl bg-navy-800 py-3 font-semibold text-white active:scale-[0.99]"
        >
          무료 15분 예약
        </a>
      </div>
    </div>
  );
}
