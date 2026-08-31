import { BUSINESS } from "@/lib/business";

const reviews = [
  {
    name: "Scarlett Butler",
    quote: "Loads of produce, great prices, friendly staff.",
    rating: 5,
  },
  {
    name: "Arran Dinsmore",
    quote: "Really good selection of fresh fruit and veg.",
    rating: 5,
  },
  {
    name: "Ian Robertson",
    quote: "The only place I’ve ever found gorgeous, juicy greengages.",
    rating: 5,
  },
] as const;

export default function ProductReviews({ productName }: { productName: string }) {
  return (
    <section className="mt-16 border-t border-black/8 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
            Reviews
          </p>
          <h2 className="mt-2 text-[24px] font-medium tracking-tight text-[#1a1a1a]">
            What customers say
          </h2>
        </div>
        <p className="text-[14px] text-[#1a1a1a]/50">
          {BUSINESS.rating} from {BUSINESS.reviewCount} Google reviews
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.name}
            className="rounded-[22px] border border-black/8 bg-surface px-5 py-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]"
          >
            <Stars rating={review.rating} />
            <p className="mt-3 text-[15px] leading-relaxed text-[#1a1a1a]/70 italic">
              “{review.quote}”
            </p>
            <p className="mt-4 text-[13px] font-medium text-[#1a1a1a]">
              {review.name}
            </p>
            <p className="mt-0.5 text-[12px] text-[#1a1a1a]/45">
              On {productName} · Google
            </p>
          </article>
        ))}
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
