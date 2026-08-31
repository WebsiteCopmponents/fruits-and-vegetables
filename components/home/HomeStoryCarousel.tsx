"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HoverAddToCart from "@/components/home/HoverAddToCart";
import { homeContainerClass } from "@/components/home/homeLayout";
import { formatPrice, type Product } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

const frames = [
  "w-[220px] h-[260px] sm:w-[240px] sm:h-[280px]",
  "w-[260px] h-[360px] sm:w-[280px] sm:h-[400px]",
  "w-[340px] h-[240px] sm:w-[380px] sm:h-[260px]",
  "w-[280px] h-[300px] sm:w-[300px] sm:h-[320px]",
  "w-[240px] h-[340px] sm:w-[260px] sm:h-[380px]",
  "w-[300px] h-[250px] sm:w-[320px] sm:h-[270px]",
] as const;

const preferredSlugs = [
  "scottish-apples",
  "strawberries",
  "scottish-carrots",
  "mango",
  "greengages",
  "fresh-ginger",
] as const;

function pickStoryProducts(catalog: Product[]) {
  if (catalog.length === 0) return [];
  const preferred = preferredSlugs
    .map((slug) => catalog.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];
  const rest = catalog.filter((p) => !preferred.some((x) => x.slug === p.slug));
  return [...preferred, ...rest].slice(0, frames.length);
}

export default function HomeStoryCarousel() {
  const { catalog, catalogReady } = useShopStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const cards = useMemo(() => pickStoryProducts(catalog), [catalog]);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const nextProgress = max <= 0 ? 1 : el.scrollLeft / max;
    setProgress(nextProgress);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [cards.length, updateScrollState]);

  function scrollByDir(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(360, el.clientWidth * 0.7);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className={homeContainerClass}>
        <h2 className="text-center text-[28px] font-medium tracking-tight text-[#1a1a1a] md:text-[36px]">
          Fresh from Gillespie Place
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex items-start gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-6 md:mt-12 lg:px-[max(1.5rem,calc((100vw-1340px)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {!catalogReady
          ? frames.map((frame, i) => (
              <div key={i} className={`shrink-0 animate-pulse rounded-[1.25rem] bg-[#f0f0f0] ${frame}`} />
            ))
          : cards.map((product, i) => (
              <article
                key={product.slug}
                className="group w-max shrink-0 snap-start"
              >
                <div
                  className={`relative overflow-hidden rounded-[1.25rem] bg-[#f0f0f0] ${frames[i] ?? frames[0]}`}
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="absolute inset-0 block"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width:768px) 70vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  {product.badge ? (
                    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-[#1a1a1a] uppercase backdrop-blur-sm">
                      {product.badge}
                    </span>
                  ) : null}
                  <HoverAddToCart slug={product.slug} />
                </div>
                <Link
                  href={`/shop/${product.slug}`}
                  className="mt-3 block max-w-[280px]"
                >
                  <p className="text-[16px] font-semibold tracking-tight text-[#1a1a1a]">
                    {product.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#1a1a1a]/55">
                    {product.collection} · {formatPrice(product.price)}
                  </p>
                </Link>
              </article>
            ))}
      </div>

      <div
        className={`mt-8 flex items-center justify-between gap-6 ${homeContainerClass}`}
      >
        <div
          className="relative h-[3px] w-full max-w-[180px] rounded-full bg-black/10 sm:max-w-[220px]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Carousel progress"
        >
          <div
            className="absolute top-0 h-full w-14 rounded-full bg-[#1a1a1a] transition-[left] duration-150 ease-out"
            style={{
              left: `calc(${progress} * (100% - 3.5rem))`,
            }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-black/15 text-[#1a1a1a] transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Next"
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
