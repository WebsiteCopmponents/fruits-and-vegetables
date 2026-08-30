"use client";

import { useShopStore } from "@/lib/shop-store";

/** Slides up from inside an overflow-hidden media frame on group hover. */
export default function HoverAddToCart({ slug }: { slug: string }) {
  const { addToCart } = useShopStore();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
      <div className="bg-gradient-to-t from-black/50 via-black/20 to-transparent px-3 pt-10 pb-3">
        <button
          type="button"
          aria-label="Add to cart"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(slug);
          }}
          className="pointer-events-auto w-full rounded-full bg-white py-2.5 text-[13px] font-medium text-[#1a1a1a] shadow-sm transition-opacity hover:opacity-90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
