"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductVariant } from "@/lib/products";

export default function ProductGallery({
  images,
  alt,
  badge,
  variants = [],
}: {
  images: string[];
  alt: string;
  badge?: string;
  variants?: ProductVariant[];
}) {
  const [active, setActive] = useState(0);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const selected = variants.find((v) => v.id === variantId);
  const gallery = images.length > 0 ? images : [];
  const mainSrc = gallery[active] ?? selected?.image ?? gallery[0];

  function pickVariant(variant: ProductVariant) {
    setVariantId(variant.id);
    const index = gallery.indexOf(variant.image);
    if (index >= 0) setActive(index);
  }

  return (
    <div>
      <div className="relative aspect-[4/4] overflow-hidden rounded-[28px] bg-soft">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
        {badge ? (
          <span className="absolute top-4 left-4 rounded-full bg-surface/95 px-3 py-1 text-[12px] font-medium text-accent">
            {badge}
          </span>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {gallery.map((src, i) => {
            const selectedThumb = mainSrc === src;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => {
                  setActive(i);
                  const match = variants.find((v) => v.image === src);
                  if (match) setVariantId(match.id);
                }}
                aria-label={`Show image ${i + 1} of ${gallery.length}`}
                aria-current={selectedThumb}
                className={`relative size-[72px] shrink-0 rounded-[16px] p-[3px] transition-colors ${
                  selectedThumb ? "bg-[#1a1a1a]" : "bg-transparent hover:bg-black/15"
                }`}
              >
                <span className="relative block size-full overflow-hidden rounded-[13px] bg-[#f3f3f3]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {variants.length > 0 ? (
        <div className="mt-5">
          <p className="text-[13px] font-medium text-[#1a1a1a]">
            Pack:{" "}
            <span className="font-normal text-[#1a1a1a]/60">
              {selected?.label}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const on = variant.id === variantId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => pickVariant(variant)}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
                    on
                      ? "bg-[#1a1a1a] text-white"
                      : "border border-black/15 bg-surface text-[#1a1a1a] hover:border-black/30"
                  }`}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
