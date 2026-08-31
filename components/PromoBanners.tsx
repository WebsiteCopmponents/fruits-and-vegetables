"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import CtaButton from "@/components/CtaButton";
import { CALL_URL, COUNTRY_CODES, type CountryCode } from "@/lib/contact";
import { alertFailure, alertProgress, alertSuccess } from "@/lib/alert";

type BannerKind = "entry" | "exit";

type BannerConfig = {
  eyebrow: string;
  heading: string;
  paragraph: string;
  submitLabel: string;
  image: string;
  imageAlt: string;
};

const CONFIG: Record<BannerKind, BannerConfig> = {
  entry: {
    eyebrow: "Welcome to Global Fruits",
    heading: "Get 10% off your first box",
    paragraph:
      "Join our list for weekly produce, exotic spices, and home-delivery offers. Drop your details and we’ll be in touch.",
    submitLabel: "Claim my offer",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Fresh fruit at Global Fruits",
  },
  exit: {
    eyebrow: "Wait — before you go",
    heading: "Not ready to checkout?",
    paragraph:
      "Leave your email or phone and we’ll hold your favourites, share offers, or call you back to complete your order.",
    submitLabel: "Keep me posted",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Fresh vegetables at Global Fruits",
  },
};

const ENTRY_KEY = "global-fruits-entry-banner-seen";
const EXIT_KEY = "global-fruits-exit-banner-seen";
const ENTRY_DELAY = 1400;
const DESKTOP_MQ = "(min-width: 768px)";

function isDesktop() {
  return (
    typeof window !== "undefined" && window.matchMedia(DESKTOP_MQ).matches
  );
}

export default function PromoBanners() {
  const [active, setActive] = useState<BannerKind | null>(null);

  // Entry banner — all viewports, once per session, after a short delay
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(ENTRY_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;

    const timer = setTimeout(() => {
      setActive((current) => {
        if (current) return current;
        try {
          sessionStorage.setItem(ENTRY_KEY, "1");
        } catch {
          /* ignore */
        }
        return "entry";
      });
    }, ENTRY_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Exit intent — desktop only
  useEffect(() => {
    function onMouseOut(e: MouseEvent) {
      if (!isDesktop()) return;
      if (e.relatedTarget || e.clientY > 4) return;
      let seen = false;
      try {
        seen = sessionStorage.getItem(EXIT_KEY) === "1";
      } catch {
        /* ignore */
      }
      if (seen) return;

      setActive((current) => {
        if (current) return current;
        try {
          sessionStorage.setItem(EXIT_KEY, "1");
        } catch {
          /* ignore */
        }
        return "exit";
      });
    }

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  // Lock scroll + escape to close
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  if (!active) return null;

  return (
    <PromoModal kind={active} onClose={() => setActive(null)} />
  );
}

function PromoModal({
  kind,
  onClose,
}: {
  kind: BannerKind;
  onClose: () => void;
}) {
  const config = CONFIG[kind];
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    if (!email && !phone) {
      alertFailure("Add an email or phone number to continue.");
      return;
    }

    setSubmitting(true);
    alertProgress("Sending your details…");

    // No backend yet — simulate success. Wire to WP/DB/CRM later.
    await new Promise((r) => setTimeout(r, 500));

    alertSuccess("Thanks! We’ll be in touch shortly.");
    setSubmitting(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={config.heading}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div
        className="relative z-10 w-full max-w-4xl overflow-visible rounded-[24px] bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-[alert-in_0.18s_ease-out] sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 flex size-10 items-center justify-center rounded-full border border-black/8 bg-surface text-[#1a1a1a] shadow-sm transition-colors hover:bg-[#f6f6f6] sm:top-4 sm:right-4 sm:size-9"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left — copy + form */}
          <div className="relative z-10 overflow-visible p-5 pt-12 sm:p-9 sm:pt-9">
            <p className="text-[11px] font-medium tracking-[0.18em] text-accent uppercase sm:text-[12px]">
              {config.eyebrow}
            </p>
            <h2 className="mt-2 text-[24px] leading-tight font-medium tracking-tight text-[#1a1a1a] sm:mt-3 sm:text-[32px]">
              {config.heading}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#1a1a1a]/65 sm:mt-3 sm:text-[15px]">
              {config.paragraph}
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[#1a1a1a]/70 sm:mb-2">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/12 px-3.5 py-3 text-[15px] outline-none focus:border-black/40 focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)] sm:px-4 sm:py-3.5"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[#1a1a1a]/70 sm:mb-2">
                  Phone
                </span>
                <div className="flex rounded-xl border border-black/12 bg-surface transition-shadow focus-within:border-black/40 focus-within:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]">
                  <CountrySelect value={country} onChange={setCountry} />
                  <span className="my-2.5 w-px bg-black/10" aria-hidden />
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="7123 456789"
                    className="w-full min-w-0 rounded-r-xl bg-transparent px-3.5 py-3 text-[15px] outline-none sm:px-4 sm:py-3.5"
                  />
                </div>
              </label>

              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:gap-3">
                <CtaButton
                  type="submit"
                  disabled={submitting}
                  className="flex-1 justify-between text-[13px] sm:text-[14px]"
                >
                  {submitting ? "Sending…" : config.submitLabel}
                </CtaButton>
                <a
                  href={CALL_URL}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-[13px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03] sm:py-3.5 sm:text-[14px]"
                >
                  <PhoneIcon />
                  Order on call
                </a>
              </div>
            </form>

            <p className="mt-3 text-[11px] leading-relaxed text-[#1a1a1a]/45 sm:mt-4 sm:text-[12px]">
              We’ll only use your details to contact you about Global Fruits. No spam.
            </p>
          </div>

          {/* Right — full image */}
          <div className="relative hidden min-h-[420px] overflow-hidden rounded-r-[28px] md:block">
            <Image
              src={config.image}
              alt={config.imageAlt}
              fill
              sizes="(max-width:768px) 0px, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Country code"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex h-full items-center gap-2 rounded-l-xl px-3.5 py-3.5 text-[15px] text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
      >
        <span className="text-[18px] leading-none" aria-hidden>
          {value.flag}
        </span>
        <span className="font-medium">{value.code}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={`text-[#1a1a1a]/45 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Country codes"
          className="absolute bottom-[calc(100%+8px)] left-0 z-50 max-h-64 w-64 animate-[alert-in_0.18s_ease-out] overflow-y-auto rounded-2xl border border-black/6 bg-surface p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
        >
          {COUNTRY_CODES.map((c) => {
            const selected = c.code === value.code;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${
                    selected
                      ? "bg-soft text-accent"
                      : "text-[#1a1a1a] hover:bg-black/[0.04]"
                  }`}
                >
                  <span className="text-[18px] leading-none" aria-hidden>
                    {c.flag}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span
                    className={`shrink-0 text-[13px] font-medium ${
                      selected ? "text-accent" : "text-[#1a1a1a]/50"
                    }`}
                  >
                    {c.code}
                  </span>
                  {selected ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="shrink-0 text-accent"
                    >
                      <path
                        d="M5 12.5l5 5L19 7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C11.3 21 3 12.7 3 5.1A1.5 1.5 0 0 1 4.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
