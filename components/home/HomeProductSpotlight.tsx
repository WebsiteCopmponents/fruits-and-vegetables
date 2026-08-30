"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import CtaButton from "@/components/CtaButton";
import { homeContainerClass } from "@/components/home/homeLayout";
import { formatPrice } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

const sizes = ["Standard", "Large"] as const;
const colors = [
  { id: "natural", label: "Natural", swatch: "#c4a574" },
  { id: "ink", label: "Ink", swatch: "#1a1a1a" },
  { id: "sand", label: "Sand", swatch: "#e8dcc8" },
] as const;

export default function HomeProductSpotlight() {
  const { catalog, addToCart, catalogReady } = useShopStore();
  const product = useMemo(
    () =>
      catalog.find((p) => p.slug === "structured-leather-tote") || catalog[0],
    [catalog],
  );
  const [size, setSize] = useState<(typeof sizes)[number]>("Standard");
  const [color, setColor] = useState<(typeof colors)[number]["id"]>("natural");
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
            La Gracia
          </p>
          <h2 className="mt-2 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
            {product.name}
          </h2>
          <p className="mt-3 text-[20px] text-[#1a1a1a]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-[14px] text-[#1a1a1a]/50">
            <Link href="/contact" className="underline underline-offset-2">
              Shipping
            </Link>{" "}
            calculated at checkout.
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#1a1a1a]/65">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-[13px] font-medium text-[#1a1a1a]">
              Size: <span className="font-normal text-[#1a1a1a]/60">{size}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s) => {
                const on = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
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
            <p className="text-[13px] font-medium text-[#1a1a1a]">
              Color:{" "}
              <span className="font-normal text-[#1a1a1a]/60">
                {colors.find((c) => c.id === color)?.label}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map((c) => {
                const on = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    aria-label={c.label}
                    aria-pressed={on}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors ${
                      on
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                        : "border-black/15 bg-surface text-[#1a1a1a] hover:border-black/30"
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: c.swatch }}
                    />
                    {c.label}
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
        </div>
      </div>
    </section>
  );
}
