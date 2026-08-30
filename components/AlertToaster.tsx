"use client";

import { useEffect, useRef, useState } from "react";
import {
  ALERT_EVENT,
  consumeQueuedAlert,
  type AlertPayload,
  type AlertTone,
} from "@/lib/alert";

type VisibleAlert = AlertPayload & { id: number };

export default function AlertToaster() {
  const [alert, setAlert] = useState<VisibleAlert | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    function present(detail: AlertPayload) {
      if (!detail?.message) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      idRef.current += 1;
      const id = idRef.current;
      setAlert({ ...detail, id });

      const duration =
        detail.duration ??
        (detail.tone === "progress"
          ? 0
          : detail.tone === "failure"
            ? 4500
            : 3500);

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          setAlert((current) => (current?.id === id ? null : current));
        }, duration);
      }
    }

    function onAlert(event: Event) {
      present((event as CustomEvent<AlertPayload>).detail);
    }

    window.addEventListener(ALERT_EVENT, onAlert);

    const queued = consumeQueuedAlert();
    if (queued) present(queued);

    return () => {
      window.removeEventListener(ALERT_EVENT, onAlert);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!alert) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4 pb-[env(safe-area-inset-bottom)] max-lg:bottom-[calc(5.25rem+env(safe-area-inset-bottom))] sm:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div
        key={alert.id}
        className="pointer-events-auto flex w-full max-w-[min(480px,calc(100vw-2rem))] animate-[alert-in_0.28s_ease-out] items-center gap-3 rounded-full bg-[#1f1f1f] py-2.5 pr-2.5 pl-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
      >
        <ToneIcon tone={alert.tone} />
        <p className="min-w-0 flex-1 truncate pr-1 text-[14px] font-medium text-white">
          {alert.message}
        </p>
        <span className="h-5 w-px shrink-0 bg-white/15" aria-hidden />
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setAlert(null)}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function ToneIcon({ tone }: { tone: AlertTone }) {
  if (tone === "success") {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#22c55e]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12.5l5 5L19 7"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (tone === "failure") {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ef4444]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 7l10 10M17 7L7 17"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]">
      <span
        className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
        aria-hidden
      />
    </span>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
