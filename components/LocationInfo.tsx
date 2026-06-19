import { booking, office } from "@/lib/siteContent";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3">
      <span className="w-14 shrink-0 text-[13px] font-semibold tracking-wide text-navy-500 sm:w-16">
        {label}
      </span>
      <span className="text-[15px] leading-relaxed text-ink">{children}</span>
    </div>
  );
}

export default function LocationInfo() {
  return (
    <section id="location" className="bg-navy-50 px-4 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-center text-sm font-semibold tracking-wide text-sand-600">
          오시는 길
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          오시는 길 · 상담 안내
        </h2>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8">
          {/* 위치 */}
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[0_1px_2px_rgba(18,33,57,0.04)]">
            <div className="divide-y divide-navy-100">
              <InfoRow label="주소">{office.address}</InfoRow>
              <InfoRow label="교통">{office.transit}</InfoRow>
              <InfoRow label="시간">{office.hours}</InfoRow>
              <InfoRow label="전화">
                <a
                  href={office.phoneHref}
                  className="font-semibold text-navy-700 underline-offset-2 hover:underline"
                >
                  {office.phone}
                </a>
              </InfoRow>
            </div>
            <a
              href={office.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white py-2.5 text-sm font-semibold text-navy-700 transition hover:border-navy-300 hover:bg-navy-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              네이버 지도로 길찾기
            </a>
          </div>

          {/* 예약 2종 */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border-2 border-navy-800 bg-white p-6 shadow-[0_12px_30px_-12px_rgba(18,33,57,0.25)]">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-navy-900">무료 상담</h3>
                <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-0.5 text-sm font-semibold text-sand-600">
                  {booking.free.detail}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                지금 가장 걱정되시는 것만 가볍게 여쭤보세요. 부담 없이.
              </p>
              <a
                href={booking.free.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-navy-800 py-3 font-semibold text-white transition hover:bg-navy-900"
              >
                {booking.free.label}
              </a>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-navy-900">법률 상담</h3>
                <span className="text-sm font-semibold text-muted">
                  {booking.paid.detail}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                서류를 놓고 깊이 있게. 수임으로 이어지면 상담료는 면제됩니다.
              </p>
              <a
                href={booking.paid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border-2 border-navy-800 py-3 font-semibold text-navy-800 transition hover:bg-navy-50"
              >
                {booking.paid.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
