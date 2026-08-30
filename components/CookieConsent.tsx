"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CtaButton from "@/components/CtaButton";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readCookieConsent() === null) {
      setVisible(true);
    }
  }, []);

  function choose(choice: CookieConsentChoice) {
    writeCookieConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[110] p-3 sm:p-5 max-lg:pb-[calc(5.25rem+env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-[24px] border border-black/8 bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-6">
        <div>
          <p
            id="cookie-consent-title"
            className="text-[17px] font-medium tracking-tight text-[#1a1a1a]"
          >
            We use cookies
          </p>
          <p
            id="cookie-consent-desc"
            className="mt-2 text-[14px] leading-relaxed text-[#1a1a1a]/65"
          >
            Essential cookies keep your cart and session working. Optional
            cookies help us improve the site. You can accept all, keep essential
            only, or reject optional cookies. See our{" "}
            <Link
              href="/privacy"
              className="font-medium text-accent underline underline-offset-2 hover:opacity-70"
            >
              Privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="order-3 h-11 rounded-full border border-black/12 px-5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03] sm:order-1"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => choose("essential")}
            className="order-2 h-11 rounded-full border border-black/12 px-5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
          >
            Essential only
          </button>
          <CtaButton
            onClick={() => choose("all")}
            className="order-1 h-auto sm:order-3"
          >
            Accept all
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
