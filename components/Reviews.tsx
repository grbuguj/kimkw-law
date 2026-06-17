import { reviews, reviewSummary } from "@/lib/siteContent";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white px-4 py-14">
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            먼저 다녀가신 분들의 이야기
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 text-[15px] text-muted">
            <span className="text-lg font-bold text-sand-600">
              ★ {reviewSummary.rating.toFixed(2)}
            </span>
            <span>· 네이버 리뷰 {reviewSummary.count}건</span>
          </p>
        </div>

        <div className="mt-8 columns-1 gap-4 sm:columns-2">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="mb-4 break-inside-avoid rounded-2xl border border-navy-100 bg-navy-50/50 p-5"
            >
              <div className="text-sand-500" aria-hidden="true">
                ★★★★★
              </div>
              <blockquote className="mt-2 text-[15px] leading-relaxed text-ink">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted">
                — {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
