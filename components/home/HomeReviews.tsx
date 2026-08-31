import { homeContainerClass } from "@/components/home/homeLayout";
import { BUSINESS, BUSINESS_REVIEWS } from "@/lib/business";

export default function HomeReviews() {
  return (
    <section id="reviews" className="bg-white py-16 md:py-24">
      <div className={homeContainerClass}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium tracking-[0.18em] text-[#1a1a1a]/45 uppercase">
            {BUSINESS.reviewSource}
          </p>
          <h2 className="mt-3 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
            {BUSINESS.rating} from {BUSINESS.reviewCount} Google reviews
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {BUSINESS_REVIEWS.map((review) => (
            <article
              key={review.name}
              className="rounded-[24px] border border-black/8 bg-surface/80 px-6 py-8 text-left shadow-[0_12px_32px_rgba(26,26,26,0.04)]"
            >
              <Stars rating={review.rating} />
              <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-[#1a1a1a]">
                {review.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#1a1a1a]/55 italic">
                “{review.quote}”
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/8 pt-4">
                <p className="text-[14px] font-semibold text-[#1a1a1a]">
                  {review.name}
                </p>
                <p className="shrink-0 text-[12px] font-semibold text-[#2f6b4f]">
                  {review.source}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className={i < rating ? "text-[#E8B923]" : "text-black/15"}
        >
          <path
            d="M12 2.5l2.6 6.2 6.7.6-5.1 4.4 1.5 6.5L12 16.8 6.3 20.2l1.5-6.5-5.1-4.4 6.7-.6L12 2.5z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}
