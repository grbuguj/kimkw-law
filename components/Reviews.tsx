import { reviews, reviewSummary } from "@/lib/siteContent";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-sand-600">
            네이버 후기
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            먼저 다녀가신 분들의 이야기
          </h2>
          <p className="mt-3 inline-flex items-center gap-2 text-[15px]">
            <span className="text-xl font-bold text-sand-600">
              ★ {reviewSummary.rating.toFixed(2)}
            </span>
            <span className="text-muted">
              · 네이버 리뷰 {reviewSummary.count}건
            </span>
          </p>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:block sm:columns-2 sm:gap-5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="w-[82%] shrink-0 snap-start rounded-2xl border border-navy-100/70 bg-navy-50/40 p-5 sm:mb-5 sm:w-auto sm:shrink sm:break-inside-avoid sm:p-6"
            >
              <span
                className="block font-serif text-3xl leading-none text-navy-200"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <div
                className="mt-1 text-[15px] tracking-[0.15em] text-sand-500"
                aria-hidden="true"
              >
                ★★★★★
              </div>
              <blockquote className="mt-2 text-[15px] leading-relaxed text-ink">
                {r.body}
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2 text-sm font-medium text-navy-700">
                <span className="h-px w-4 bg-sand-400" aria-hidden="true" />
                {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
