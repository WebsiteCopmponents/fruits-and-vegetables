"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import CtaButton from "@/components/CtaButton";
import ProductTrustList from "@/components/shop/ProductTrustList";
import { homeContainerClass } from "@/components/home/homeLayout";
import { formatPrice } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

const packs = ["6-pack", "Family"] as const;

export default function HomeProductSpotlight() {
  const { catalog, addToCart, catalogReady } = useShopStore();
  const product = useMemo(
    () =>
      catalog.find((p) => p.slug === "scottish-apples") || catalog[0],
    [catalog],
  );
  const [pack, setPack] = useState<(typeof packs)[number]>("6-pack");
  const [qty, setQty] = useState(1);

  if (!catalogReady || !product) {
    return (
      <section className="bg-surface">
        <div className={`py-14 md:py-20 ${homeContainerClass}`}>
          <div className="aspect-[4/5] max-w-xl animate-pulse rounded-[1.75rem] bg-[#f3f5f4]" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface">
      <div
        className={`grid items-start gap-10 py-14 md:grid-cols-2 md:gap-14 md:py-20 lg:gap-20 ${homeContainerClass}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[#f3f5f4] md:sticky md:top-28">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="md:pt-4 px-6">
          <p className="text-[12px] font-medium tracking-[0.2em] text-[#1a1a1a]/45 uppercase">
            Global Fruits
          </p>
          <h2 className="mt-2 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
            {product.name}
          </h2>
          <p className="mt-3 text-[20px] text-[#1a1a1a]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-[14px] text-[#1a1a1a]/50">
            Edinburgh home delivery available.
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#1a1a1a]/65">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-[13px] font-medium text-[#1a1a1a]">
              Pack: <span className="font-normal text-[#1a1a1a]/60">{pack}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {packs.map((s) => {
                const on = pack === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPack(s)}
                    className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
                      on
                        ? "bg-[#1a1a1a] text-white"
                        : "border border-black/15 bg-surface text-[#1a1a1a] hover:border-black/30"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[13px] font-medium text-[#1a1a1a]">Quantity</p>
            <div className="mt-3 inline-flex items-center rounded-full border border-black/15">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex size-11 items-center justify-center text-[18px] text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
              >
                −
              </button>
              <span className="min-w-10 text-center text-[14px] font-medium text-[#1a1a1a]">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="flex size-11 items-center justify-center text-[18px] text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => addToCart(product.slug, qty)}
              className="flex h-12 w-full items-center justify-center rounded-full border border-[#1a1a1a] bg-surface text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
            >
              Add to cart
            </button>
            <CtaButton
              href={`/shop/${product.slug}`}
              className="w-full flex justify-center"
            >
              Buy now
            </CtaButton>
          </div>

          <p className="mt-4 text-center text-[13px] text-[#1a1a1a]/45">
            <Link
              href={`/shop/${product.slug}`}
              className="underline underline-offset-2 hover:text-[#1a1a1a]/70"
            >
              View full details
            </Link>
          </p>

          <ProductTrustList className="mt-8" />
        </div>
      </div>
    </section>
  );
}
