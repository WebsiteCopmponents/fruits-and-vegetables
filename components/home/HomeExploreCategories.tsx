"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HoverAddToCart from "@/components/home/HoverAddToCart";
import { homeContainerClass } from "@/components/home/homeLayout";
import { formatPrice, type Product } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

const tabs = ["Canvas", "Leather"] as const;

function matchesTab(product: Product, tab: (typeof tabs)[number]) {
  const hay = `${product.collection} ${product.name}`.toLowerCase();
  if (tab === "Canvas") {
    return hay.includes("canvas") || (!hay.includes("leather") && !hay.includes("mini"));
  }
  return hay.includes("leather");
}

export default function HomeExploreCategories() {
  const { catalog, catalogReady } = useShopStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Canvas");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const cards = useMemo(() => {
    const filtered = catalog.filter((p) => matchesTab(p, tab));
    return (filtered.length > 0 ? filtered : catalog).slice(0, 8);
  }, [catalog, tab]);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 0 : el.scrollLeft / max);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [tab, cards.length, updateScrollState]);

  function scrollByDir(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-category-card]");
    const amount =
      card instanceof HTMLElement ? card.offsetWidth + 16 : 220;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section className="relative -mt-10 rounded-t-3xl bg-[#F0EBFF] pt-10 pb-14 shadow-[0_-20px_60px_rgba(0,0,0,0.18)] md:-mt-12 md:pt-12 md:pb-16">
      <div className={homeContainerClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[26px] font-semibold tracking-tight text-[#1a1a1a] md:text-[32px]">
            Explore Categories
          </h2>

          <div className="flex items-center gap-1 rounded-full bg-white p-1">
            {tabs.map((item) => {
              const active = item === tab;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-black text-white shadow-sm"
                      : "text-[#1a1a1a]/55 hover:text-[#1a1a1a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex gap-4 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-6 lg:px-[max(1.5rem,calc((100vw-1340px)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {!catalogReady
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                data-category-card
                className="w-[160px] shrink-0 sm:w-[280px]"
              >
                <div className="aspect-[4/5] animate-pulse rounded-3xl bg-white/70" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-white/70" />
              </div>
            ))
          : cards.map((product) => (
              <article
                key={product.slug}
                data-category-card
                className="group w-[160px] shrink-0 sm:w-[280px]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f3f3f3]">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="absolute inset-0 block"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="280px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <HoverAddToCart slug={product.slug} />
                </div>
                <Link href={`/shop/${product.slug}`} className="mt-3 block">
                  <p className="text-[15px] font-medium tracking-tight text-[#1a1a1a]">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#1a1a1a]/55">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </article>
            ))}
      </div>

      <div
        className={`mt-8 flex items-center justify-between gap-6 ${homeContainerClass}`}
      >
        <div
          className="relative h-[3px] w-full max-w-[160px] rounded-full bg-black/10 sm:max-w-[200px]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Categories progress"
        >
          <div
            className="absolute top-0 h-full w-12 rounded-full bg-[#1a1a1a] transition-[left] duration-150 ease-out"
            style={{ left: `calc(${progress} * (100% - 3rem))` }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Previous categories"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Next categories"
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
            className="flex size-11 items-center justify-center rounded-full border border-black/15 text-[#1a1a1a] transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </section>
  );
}
