import { career, office, reviewSummary } from "@/lib/siteContent";
import Photo from "./Photo";

function Stars() {
  return (
    <span className="text-sand-500" aria-hidden="true">
      {"★★★★★"}
    </span>
  );
}

export default function LawyerProfile() {
  return (
    <section id="profile" className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-center text-sm font-semibold tracking-wide text-sand-600">
          김포에서 가장 오래, 가장 가까이
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {office.lawyer}가 직접 상담합니다
        </h2>

        <div className="mt-8 grid items-start gap-6 sm:grid-cols-[0.9fr_1.1fr]">
          <Photo
            src="/lawyer.jpg"
            alt="김관우 법무사"
            label="김관우 법무사 사진"
            ratio="aspect-[3/4]"
          />

          <div>
            <p className="text-[15px] leading-relaxed text-ink">
              30년간 법원 안에서 사건을 보아온 사람과, 밖에서만 본 사람은
              다릅니다. 저는 개인회생을 <strong>심사하던 자리</strong>에
              있었습니다. 그래서 무엇이 받아들여지고 무엇이 어려운지를 압니다.
            </p>
            <p className="mt-3 hidden text-[15px] leading-relaxed text-ink sm:block">
              겁먹지 않으셔도 됩니다. 여기까지 알아보신 것만으로 이미 잘하고
              계신 겁니다. 나머지는 제가 함께 보겠습니다.
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 sm:block sm:space-y-2.5">
              {career.map((c) => (
                <li key={c.title} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-500 sm:mt-2" />
                  <span className="text-[13px] text-navy-800 sm:text-[15px]">
                    {c.title}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-navy-50 px-4 py-3">
              <div className="text-2xl font-bold text-navy-900">
                {reviewSummary.rating.toFixed(2)}
              </div>
              <div>
                <Stars />
                <p className="text-sm text-muted">
                  네이버 리뷰 {reviewSummary.count}건 · 김포 법무사 중 압도적
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Photo src="/office.jpg" alt="사무소 외관" label="사무소 외관" />
          <Photo src="/card.jpg" alt="법무사 김관우 명함" label="명함" />
          <Photo
            src="/office-detail.jpg"
            alt="사무소 상패 및 상담실"
            label="상패 / 상담실"
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </div>
    </section>
  );
}
