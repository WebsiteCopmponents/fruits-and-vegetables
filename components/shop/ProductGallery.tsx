"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-soft">
        <Image
          src={gallery[active]}
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
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${gallery.length}`}
              aria-current={i === active}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-[14px] bg-soft ring-2 transition-opacity ${
                i === active
                  ? "ring-primary opacity-100"
                  : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
