"use client";

import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { useShopStore } from "@/lib/shop-store";

export default function ProductBuyActions({ slug }: { slug: string }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShopStore();
  const wishlisted = isWishlisted(slug);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <CtaButton onClick={() => addToCart(slug)}>Add to cart</CtaButton>
      <button
        type="button"
        onClick={() => toggleWishlist(slug)}
        className="rounded-full border border-black/15 px-7 py-3.5 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/5"
      >
        {wishlisted ? "Wishlisted" : "Add to wishlist"}
      </button>
      <Link
        href="/contact"
        className="rounded-full border border-black/15 px-7 py-3.5 text-center text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/5"
      >
        Ask a question
      </Link>
    </div>
  );
}
