"use client";

import Image from "next/image";
import { useState } from "react";
import { homeContainerClass } from "@/components/home/homeLayout";

type Hotspot = {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
};

type FeatureView = {
  id: string;
  label: string;
  image: string;
  alt: string;
  objectPosition: string;
  hotspots: Hotspot[];
};

const views: FeatureView[] = [
  {
    id: "leather",
    label: "Leather",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1600&q=80",
    alt: "Structured leather tote",
    objectPosition: "center 22%",
    hotspots: [
      {
        id: "straps",
        x: 50,
        y: 18,
        title: "Reinforced straps",
        body: "Double-stitched handles sized for shoulder or hand carry — built for daily load.",
      },
      {
        id: "rim",
        x: 52,
        y: 40,
        title: "Open, easy access",
        body: "A wide mouth so you can find what you need without digging through the bag.",
      },
      {
        id: "body",
        x: 48,
        y: 64,
        title: "Structured body",
        body: "Holds its shape when empty, expands when full — clean lines on the go.",
      },
    ],
  },
  {
    id: "canvas",
    label: "Canvas",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
    alt: "Everyday canvas tote",
    objectPosition: "center center",
    hotspots: [
      {
        id: "handles",
        x: 50,
        y: 20,
        title: "Soft canvas handles",
        body: "Comfortable length for everyday shoulder carry that softens with every wear.",
      },
      {
        id: "pocket",
        x: 64,
        y: 50,
        title: "Exterior pocket",
        body: "Quick-grab storage for phone, keys, or a transit card without opening the tote.",
      },
      {
        id: "canvas-body",
        x: 42,
        y: 70,
        title: "Heavyweight canvas",
        body: "Durable weave that holds up to errands, commute days, and weekend markets.",
      },
    ],
  },
  {
    id: "weekend",
    label: "Weekend",
    image:
      "https://images.unsplash.com/photo-1622560480605-d83b901360c0?auto=format&fit=crop&w=1600&q=80",
    alt: "Weekend market tote",
    objectPosition: "center 28%",
    hotspots: [
      {
        id: "strap",
        x: 50,
        y: 24,
        title: "Sturdy straps",
        body: "Built for markets, errands, and short trips when you need a little extra room.",
      },
      {
        id: "capacity",
        x: 48,
        y: 55,
        title: "Roomy capacity",
        body: "Wide opening and deep body so weekend haul stays organized, not cramped.",
      },
      {
        id: "finish",
        x: 55,
        y: 80,
        title: "Finished edges",
        body: "Clean trim that keeps the tote looking sharp after years of use.",
      },
    ],
  },
  {
    id: "mini",
    label: "Mini",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1600&q=80",
    alt: "Mini crossbody tote",
    objectPosition: "center 35%",
    hotspots: [
      {
        id: "crossbody",
        x: 54,
        y: 42,
        title: "Crossbody strap",
        body: "Hands-free carry with an adjustable length for walking, transit, or travel days.",
      },
      {
        id: "compact",
        x: 48,
        y: 60,
        title: "Compact form",
        body: "Small footprint that still fits the day’s essentials without bulk.",
      },
      {
        id: "hardware",
        x: 50,
        y: 78,
        title: "Quiet hardware",
        body: "Low-profile fittings that won’t snag clothing or shout for attention.",
      },
    ],
  },
];

function HighlightPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="absolute top-[calc(100%+14px)] left-1/2 z-50 w-[min(280px,72vw)] -translate-x-1/2">
      {/* Speech-bubble pill */}
      <div className="relative rounded-[28px] bg-[#FEF9EF] px-6 py-5 shadow-[0_18px_50px_rgba(26,26,26,0.16)]">
        {/* Pointer — top right, pointing up toward the dot */}
        <span
          className="absolute -top-2 right-10 block size-4 rotate-45 bg-[#FEF9EF] shadow-[-2px_-2px_4px_rgba(26,26,26,0.04)]"
          aria-hidden
        />
        <p className="relative text-[17px] font-semibold tracking-tight text-[#1a1a1a]">
          {title}
        </p>
        <p className="relative mt-2 text-[14px] leading-relaxed text-[#1a1a1a]/75">
          {body}
        </p>
      </div>
    </div>
  );
}

export default function HomeFeatures() {
  const [viewId, setViewId] = useState(views[0].id);
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  const view = views.find((v) => v.id === viewId) ?? views[0];

  return (
    <section className="py-6 md:py-10 w-full">
      <div className={`relative `}>
        {/* Full-width image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden  sm:aspect-[16/10] lg:aspect-[21/10]">
          <Image
            key={view.id}
            src={view.image}
            alt={view.alt}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-opacity duration-300"
            style={{ objectPosition: view.objectPosition }}
          />

          {/* Soft vignette so dots + filters read clearly */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--theme-primary-rgb) / 0.28)_0%,transparent_42%)]" />

          {/* Hotspots */}
          <div className="absolute inset-0 z-20">
            {view.hotspots.map((spot) => {
              const isOn = activeSpot === spot.id;

              return (
                <div
                  key={`${view.id}-${spot.id}`}
                  className="absolute"
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setActiveSpot(spot.id)}
                  onMouseLeave={() => setActiveSpot(null)}
                >
                  <button
                    type="button"
                    className="relative flex size-12 items-center justify-center"
                    aria-label={spot.title}
                    aria-expanded={isOn}
                    onClick={() =>
                      setActiveSpot((cur) => (cur === spot.id ? null : spot.id))
                    }
                  >
                    {!isOn && (
                      <span className="absolute size-12 animate-[hotspot-pulse_2.2s_ease-out_infinite] rounded-full bg-white/50" />
                    )}
                    <span
                      className={`relative flex size-5 items-center justify-center rounded-full bg-surface shadow-[0_2px_12px_rgba(0,0,0,0.28)] ring-2 transition-transform ${
                        isOn ? "scale-125 ring-primary" : "ring-white/80"
                      }`}
                    >
                      <span className="size-2.5 rounded-full bg-primary" />
                    </span>
                  </button>

                  {isOn ? (
                    <HighlightPill title={spot.title} body={spot.body} />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Filter options — bottom right */}
          <div className="absolute right-4 bottom-4 z-30 flex gap-2 sm:right-6 sm:bottom-6 sm:gap-3">
            {views.map((item) => {
              const selected = item.id === viewId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setViewId(item.id);
                    setActiveSpot(null);
                  }}
                  aria-pressed={selected}
                  aria-label={item.label}
                  className={`group relative h-16 w-14 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-16 ${
                    selected
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black/20"
                      : "opacity-80 ring-1 ring-white/40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/45 px-1 py-0.5 text-center text-[10px] font-medium text-white sm:text-[11px]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
