"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeContainerClass } from "@/components/home/homeLayout";

const AUTO_MS = 6000;

const slides = [
  {
    eyebrow: "New campaign",
    title: "Softness in\nComfort",
    cta: "Shop Collection",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=2000&q=80",
    alt: "La Gracia leather tote campaign",
  },
  {
    eyebrow: "New arrivals",
    title: "Carry less.\nCarry better.",
    cta: "Shop Collection",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2000&q=80",
    alt: "La Gracia canvas tote campaign",
  },
] as const;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const count = slides.length;
  const slide = slides[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((current) => (current + dir + count) % count);
      setProgress(0);
    },
    [count],
  );

  useEffect(() => {
    setProgress(0);
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(1, elapsed / AUTO_MS);
      setProgress(next);
      if (next >= 1) {
        setIndex((current) => (current + 1) % count);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, count]);

  return (
    <>
      {/* Fixed pinned hero — page content scrolls over this */}
      <section className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100svh] overflow-hidden bg-[#5f6f5a] text-white">
        {slides.map((item, i) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.05)_100%)]" />
          </div>
        ))}

        <div
          className={`pointer-events-auto relative z-10 flex h-full flex-col justify-center py-20 md:py-24 ${homeContainerClass} px-4 sm:px-6 lg:px-8`}
        >
          <div className="max-w-xl">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-white uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line text-[42px] leading-[1.05] font-medium tracking-tight text-white md:text-[56px] lg:text-[64px]">
              {slide.title}
            </h1>

            <Link
              href={slide.href}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-5 text-[14px] font-medium text-[#1a1a1a] transition-opacity hover:opacity-90"
            >
              <span>{slide.cta}</span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <ChevronRight className="size-4" strokeWidth={2} />
              </span>
            </Link>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-8 md:pb-10 ${homeContainerClass} px-4 sm:px-6 lg:px-8`}
        >
          <div className="pointer-events-auto flex items-center justify-end gap-4">
            <p className="text-[13px] font-medium tracking-wide text-white tabular-nums">
              {index + 1}/{count}
            </p>

            <div
              className="h-px w-16 overflow-hidden bg-white/35 sm:w-24"
              aria-hidden
            >
              <div
                className="h-full bg-white transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(-1)}
                className="flex size-9 items-center justify-center text-white transition-opacity hover:opacity-70"
              >
                <ChevronLeft className="size-5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(1)}
                className="flex size-9 items-center justify-center text-white transition-opacity hover:opacity-70"
              >
                <ChevronRight className="size-5" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer so following sections start after one viewport */}
      <div className="h-[100svh]" aria-hidden />
    </>
  );
}
