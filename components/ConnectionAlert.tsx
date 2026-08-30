"use client";

import { useEffect, useState } from "react";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

const DISMISS_KEY = "lagracia-connection-alert-dismissed";

export default function ConnectionAlert() {
  const { level, ready } = useConnectionStatus();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (level === "good") {
      setDismissed(true);
      try {
        sessionStorage.removeItem(DISMISS_KEY);
      } catch {
        /* ignore */
      }
      return;
    }
    try {
      const stored = sessionStorage.getItem(DISMISS_KEY);
      setDismissed(stored === level);
    } catch {
      setDismissed(false);
    }
  }, [level, ready]);

  if (!ready || level === "good" || dismissed) return null;

  const offline = level === "offline";

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, level);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-lg:pb-[calc(5.25rem+env(safe-area-inset-bottom))]"
    >
      <div
        className={`pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-[22px] px-4 py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] ${
          offline
            ? "bg-[#1a1a1a] text-white"
            : "bg-[#FEF9EF] text-[#1a1a1a] ring-1 ring-black/5"
        }`}
      >
        <span
          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
            offline ? "bg-white/15" : "bg-primary/10"
          }`}
          aria-hidden
        >
          {offline ? <OfflineIcon /> : <SlowIcon />}
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-semibold tracking-tight">
            {offline ? "You’re offline" : "Your internet seems slow"}
          </p>
          <p
            className={`mt-1 text-[13px] leading-relaxed ${
              offline ? "text-white/70" : "text-[#1a1a1a]/65"
            }`}
          >
            {offline
              ? "Wishlist and cart stay on this device. Checkout and payment need a connection — try again when you’re back online."
              : "Shopping may feel delayed. You can keep browsing; wait for a stronger signal before checkout or payment."}
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss connection alert"
          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[18px] leading-none transition-opacity hover:opacity-70 ${
            offline ? "text-white/80" : "text-[#1a1a1a]/50"
          }`}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function SlowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12h3M19 12h3M12 2v3M12 19v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function OfflineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 8.5c3.5-3.2 8-4.8 12.5-4.5M5.5 12c2.4-2 5.3-3 8.3-2.9M9 15.5c1.2-.9 2.6-1.3 4-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}
