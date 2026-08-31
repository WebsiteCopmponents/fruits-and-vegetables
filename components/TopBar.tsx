"use client";

//File :- components/TopBar.tsx
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const MESSAGES = [
  "Home deliveries available",
  "Fruit · Vegetables · Exotic spices",
  "5 Gillespie Pl, Edinburgh EH10 4HS",
];

const AUTO_MS = 4000;
const COUNT = MESSAGES.length;

const slide = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
  }),
};

export default function TopBar() {
  const pathname = usePathname();
  const dark = pathname === "/home-v2" || pathname === "/home-v3";
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setIndex((current) => (current + dir + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [go, paused]);

  return (
    <div
      className={`relative z-50 flex h-10 w-full items-center justify-center ${
        dark ? "bg-primary" : "bg-surface"
      }`}
    >
      <div
        className="flex items-center gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          aria-label="Previous announcement"
          onClick={() => go(-1)}
          className={`flex size-6 items-center justify-center opacity-70 transition-opacity hover:opacity-100 ${
            dark ? "text-white" : "text-[#000]"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M8.5 2.5L4 7l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className="relative flex h-5 min-w-[240px] max-w-[min(72vw,420px)] items-center justify-center overflow-hidden"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.p
              key={index}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`text-center text-[13px] font-medium tracking-wide whitespace-nowrap underline decoration-1 underline-offset-[3px] ${
                dark ? "text-white" : "text-[#000]"
              }`}
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Next announcement"
          onClick={() => go(1)}
          className={`flex size-6 items-center justify-center opacity-70 transition-opacity hover:opacity-100 ${
            dark ? "text-white" : "text-[#000]"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M5.5 2.5L10 7l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
