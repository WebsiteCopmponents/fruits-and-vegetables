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
    id: "fruit",
    label: "Fruit",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
    alt: "Fresh mixed fruit",
    objectPosition: "center 22%",
    hotspots: [
      {
        id: "seasonal",
        x: 50,
        y: 22,
        title: "Seasonal picks",
        body: "Apples, berries, and greengages when they are at their best.",
      },
      {
        id: "ripe",
        x: 52,
        y: 48,
        title: "Picked ripe",
        body: "Fruit chosen for flavour this week — not sitting in a warehouse.",
      },
      {
        id: "packs",
        x: 48,
        y: 70,
        title: "Fair pack prices",
        body: "Greengrocer rates in GBP, closer to the crate than the supermarket.",
      },
    ],
  },
  {
    id: "vegetables",
    label: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
    alt: "Fresh mixed vegetables",
    objectPosition: "center center",
    hotspots: [
      {
        id: "scottish",
        x: 50,
        y: 24,
        title: "Scottish staples",
        body: "Carrots, potatoes, and everyday veg from nearby growers.",
      },
      {
        id: "salad",
        x: 64,
        y: 50,
        title: "Salad crate",
        body: "Tomatoes, peppers, cucumber, and spinach for the week.",
      },
      {
        id: "fresh",
        x: 42,
        y: 72,
        title: "Crate-fresh",
        body: "Stocked daily at Gillespie Place so it stays crisp.",
      },
    ],
  },
  {
    id: "spices",
    label: "Spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
    alt: "Fresh spices and herbs",
    objectPosition: "center 28%",
    hotspots: [
      {
        id: "ginger",
        x: 50,
        y: 28,
        title: "Fresh ginger",
        body: "Punchy root for teas, curries, and everyday cooking.",
      },
      {
        id: "chillies",
        x: 48,
        y: 52,
        title: "Fresh chillies",
        body: "A handful of heat — sold loose, not sitting in plastic.",
      },
      {
        id: "herbs",
        x: 55,
        y: 76,
        title: "Garlic & coriander",
        body: "The extras that make a fruit-and-veg shop feel complete.",
      },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80",
    alt: "Fruit and vegetable market crates",
    objectPosition: "center 35%",
    hotspots: [
      {
        id: "deliver",
        x: 54,
        y: 38,
        title: "Home delivery",
        body: "A mixed fruit and veg box for Edinburgh homes.",
      },
      {
        id: "prices",
        x: 48,
        y: 58,
        title: "Scotland prices",
        body: "Shown in GBP — what you would expect at a Tollcross greengrocer.",
      },
      {
        id: "visit",
        x: 50,
        y: 78,
        title: "Gillespie Place",
        body: "Open from 8am at 5 Gillespie Pl, Edinburgh EH10 4HS.",
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
