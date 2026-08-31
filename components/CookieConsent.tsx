"use client";

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
            Essential cookies keep your cart working. Optional cookies help us
            improve the site. You can accept all, keep essential only, or reject
            optional cookies.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <CtaButton
            onClick={() => choose("all")}
            className="w-full justify-between"
          >
            Accept all
          </CtaButton>
          <button
            type="button"
            onClick={() => choose("essential")}
            className="flex h-11 w-full items-center justify-center rounded-full border border-black/12 px-5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="flex h-11 w-full items-center justify-center rounded-full border border-black/12 px-5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
          >
            Reject all
          </button>
        </div>
      </div>
    </div>
  );
}
