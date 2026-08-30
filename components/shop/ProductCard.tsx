"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShopStore();
  const wishlisted = isWishlisted(product.slug);

  return (
    <article className="group overflow-hidden rounded-[22px] bg-surface shadow-[0_12px_32px_rgba(26,26,26,0.04)] transition-transform duration-300 hover:-translate-y-0.5">
      <div className="relative aspect-[4/5] overflow-hidden bg-soft">
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        {product.badge ? (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-medium tracking-wide text-accent">
            {product.badge}
          </span>
        ) : null}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.slug);
            }}
            className="flex size-10 items-center justify-center rounded-full bg-surface/95 text-[#1a1a1a] shadow-sm transition-colors hover:bg-surface"
          >
            <HeartIcon filled={wishlisted} />
          </button>

          <button
            type="button"
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.slug);
            }}
            className="flex size-10 items-center justify-center rounded-full bg-surface/95 text-[#1a1a1a] shadow-sm transition-colors hover:bg-surface"
          >
            <CartIcon />
          </button>
        </div>
      </div>

      <Link href={`/shop/${product.slug}`} className="block p-4">
        <p className="text-[12px] tracking-wide text-accent/80 uppercase">
          {product.collection}
        </p>
        <h2 className="mt-1 text-[16px] font-medium text-[#1a1a1a]">
          {product.name}
        </h2>
        <p className="mt-1 text-[15px] text-[#1a1a1a]/70">
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
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

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 5h2l1.2 11h11.6l1.5-8H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
