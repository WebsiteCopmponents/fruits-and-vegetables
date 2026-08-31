"use client";

import { AnimatePresence, motion } from "motion/react";
import { useShopStore } from "@/lib/shop-store";

export default function CartDock() {
  const {
    cartCount,
    cartBarOpen,
    cartPanelOpen,
    hideCartBar,
    openCartPanel,
  } = useShopStore();

  const visible = cartBarOpen && cartCount > 0 && !cartPanelOpen;
  const itemLabel = cartCount === 1 ? "one item" : `${cartCount} items`;

  function openCheckout() {
    hideCartBar();
    openCartPanel();
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center px-3 pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-6"
        >
          <div className="pointer-events-auto w-full max-w-sm rounded-[28px] border border-black/8 bg-white/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <div className="flex items-center gap-2 px-1">
              <p className="min-w-0 flex-1 text-[15px] font-medium tracking-tight text-[#1a1a1a]">
                {itemLabel}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                  onClick={openCheckout}
                  className="relative flex size-11 items-center justify-center rounded-full bg-[#f3f3f3] text-[#1a1a1a]"
                >
                  <CartIcon />
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                </button>

                <button
                  type="button"
                  aria-label="Open cart"
                  onClick={openCheckout}
                  className="flex size-11 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
                >
                  <ArrowIcon />
                </button>

                <button
                  type="button"
                  aria-label="Close cart bar"
                  onClick={hideCartBar}
                  className="flex size-11 items-center justify-center rounded-full bg-[#f3f3f3] text-[#1a1a1a] transition-colors hover:bg-black/[0.08]"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 5h2l1.2 11h11.6l1.5-8H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
