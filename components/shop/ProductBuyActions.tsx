"use client";

import { useRouter } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import { useShopStore } from "@/lib/shop-store";

export default function ProductBuyActions({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useShopStore();
  const wishlisted = isWishlisted(slug);

  function buyNow() {
    addToCart(slug, 1);
    router.push("/checkout");
  }

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(slug)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black/15 text-[#1a1a1a] transition-colors hover:bg-black/5"
        >
          <HeartIcon filled={wishlisted} />
        </button>
        <a
          href="mailto:hello@globalfruitsedinburgh.co.uk"
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-black/15 px-6 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/5"
        >
          Ask a question
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <CtaButton
          onClick={() => addToCart(slug)}
          className="w-full justify-between sm:flex-1"
        >
          Add to cart
        </CtaButton>
        <button
          type="button"
          onClick={buyNow}
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-[#1a1a1a] bg-[#1a1a1a] px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-9.5-8.2C.7 9.2 1.5 5.8 4.4 4.6c1.8-.7 3.8-.2 5.1 1.2L12 8l2.5-2.2c1.3-1.4 3.3-1.9 5.1-1.2 2.9 1.2 3.7 4.6 1.9 7.2C19 15.6 12 20 12 20z"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={filled ? "#e11d48" : "none"}
        stroke={filled ? "#e11d48" : "currentColor"}
      />
    </svg>
  );
}
