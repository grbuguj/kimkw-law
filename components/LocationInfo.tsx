import { booking, office } from "@/lib/siteContent";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-2.5">
      <span className="w-16 shrink-0 text-sm font-semibold text-navy-600">
        {label}
      </span>
      <span className="text-[15px] leading-relaxed text-ink">{children}</span>
    </div>
  );
}

export default function LocationInfo() {
  return (
    <section id="location" className="bg-navy-50 px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-navy-900 sm:text-3xl">
          오시는 길 · 상담 안내
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* 위치 */}
          <div className="rounded-2xl border border-navy-100 bg-white p-5">
            <div className="divide-y divide-navy-50">
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
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border-2 border-navy-200 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
            >
              네이버 지도로 길찾기
            </a>
          </div>

          {/* 예약 2종 */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border-2 border-navy-800 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-navy-900">무료 상담</h3>
                <span className="text-sm font-semibold text-sand-600">
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

            <div className="rounded-2xl border border-navy-100 bg-white p-5">
              <div className="flex items-baseline justify-between">
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
