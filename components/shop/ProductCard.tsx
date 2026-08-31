"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, setQty, cart, toggleWishlist, isWishlisted } =
    useShopStore();
  const qty = cart.find((item) => item.slug === product.slug)?.qty ?? 0;
  const wishlisted = isWishlisted(product.slug);
  const [direction, setDirection] = useState(1);
  const priceLabel = formatPrice(product.price);

  function increase(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    addToCart(product.slug, 1);
  }

  function decrease(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty <= 0) return;
    setDirection(-1);
    setQty(product.slug, qty - 1, { silent: true });
  }

  return (
    <article className="group flex flex-col rounded-[28px] bg-[#f3f3f3] p-5 shadow-[0_8px_28px_rgba(26,26,26,0.04)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-6">
      <div className="relative aspect-[4/4] overflow-hidden rounded-2xl">
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 block rounded-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
            className="object-cover object-center h-full w-full rounded-2xl drop-shadow-[0_18px_28px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:rounded-2xl"
          />
        </Link>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          className="absolute top-0 right-0 z-10 flex size-9 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[22px] leading-none font-semibold tracking-tight text-[#1a1a1a]">
            {product.name}
            <sup className="ml-0.5 align-super text-[11px] font-semibold text-[#1a1a1a]">
              {priceLabel}
            </sup>
          </h2>
          <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-[#8a8a8a]">
            {product.description}
          </p>
        </div>
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="mt-1 flex size-8 shrink-0 items-center justify-center text-[#1a1a1a] transition-transform hover:translate-x-0.5"
        >
          <ArrowIcon />
        </Link>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty <= 0}
            onClick={decrease}
            className="flex size-8 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-black/[0.04] disabled:opacity-30"
          >
            −
          </button>
          <span className="relative flex h-6 w-7 items-center justify-center overflow-hidden text-[15px] font-semibold text-[#1a1a1a] tabular-nums">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={qty}
                custom={direction}
                initial={{ y: direction > 0 ? 14 : -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -14 : 14, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute"
              >
                {qty}
              </motion.span>
            </AnimatePresence>
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={increase}
            className="flex size-8 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-black/[0.04]"
          >
            +
          </button>
        </div>
        <p className="text-[12px] tracking-wide text-[#8a8a8a] uppercase">
          {product.collection}
        </p>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
