"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import CtaButton from "@/components/CtaButton";
import CartSuggestedItems from "@/components/shop/CartSuggestedItems";
import { getCartSuggestions } from "@/lib/cart-suggestions";
import { formatPrice, type Product } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

const PANEL_BG = "#F5F5F6";
const CARD_BORDER = "#F5F5F6";

function stockLabel(status?: string) {
  if (status === "outofstock") return "Out of stock";
  if (status === "onbackorder") return "Available on backorder";
  return "In stock";
}

function expectedDeliveryRange() {
  const start = new Date();
  const end = new Date();
  start.setDate(start.getDate() + 3);
  end.setDate(end.getDate() + 5);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function productDetailRows(product: Product) {
  const collection = product.collection.toLowerCase();
  const origin = product.slug.includes("scottish")
    ? "Scotland"
    : "Selected for Edinburgh";
  const type = collection.includes("fruit")
    ? "Fresh fruit"
    : collection.includes("veg")
      ? "Fresh vegetables"
      : product.collection;

  return [
    {
      label: "Origin",
      value: origin,
    },
    {
      label: "Type",
      value: type,
    },
    {
      label: "Collection",
      value: product.collection,
    },
    {
      label: "Description",
      value: product.description,
    },
  ];
}

function CartDetailsAccordion({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = useState(0);
  const rows = productDetailRows(product);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContentH(el.scrollHeight));
    ro.observe(el);
    setContentH(el.scrollHeight);
    return () => ro.disconnect();
  }, [product.slug]);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#F5F5F6] bg-soft">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[#1a1a1a]">
          Product details
        </span>
        <motion.span
          aria-hidden
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="inline-flex size-7 items-center justify-center text-[#1a1a1a]/45"
        >
          <ChevronIcon />
        </motion.span>
      </button>

      <motion.div
        animate={{ height: open ? contentH : 0, opacity: open ? 1 : 0 }}
        initial={false}
        transition={{
          height: { type: "spring", stiffness: 340, damping: 34, mass: 0.9 },
          opacity: { duration: 0.18 },
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="space-y-3 border-t border-[#F5F5F6] px-4 pt-3 pb-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f3f3f3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="360px"
              className="object-cover object-center h-full w-full rounded-3xl"
            />
          </div>
          {rows.map((row) => (
            <div key={row.label} className="flex gap-4 text-[13px] leading-relaxed">
              <span className="w-28 shrink-0 text-[#1a1a1a]/45">{row.label}</span>
              <span className="min-w-0 text-[#1a1a1a]/75">{row.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CartProductCard({
  item,
  highlighted = false,
  onRemove,
  onClose,
}: {
  item: { product: Product; qty: number };
  highlighted?: boolean;
  onRemove: () => void;
  onClose: () => void;
}) {
  const { setQty } = useShopStore();
  const { product, qty } = item;
  const inStock = product.stockStatus !== "outofstock";
  const [direction, setDirection] = useState(1);

  function decrease() {
    setDirection(-1);
    setQty(product.slug, qty - 1, { silent: true });
  }

  function increase() {
    setDirection(1);
    setQty(product.slug, qty + 1, { silent: true });
  }

  return (
    <div
      className={`rounded-3xl border bg-surface p-5 ${
        highlighted ? "ring-2 ring-primary/15" : ""
      }`}
      style={{ borderColor: CARD_BORDER }}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/shop/${product.slug}`}
          onClick={onClose}
          className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl bg-[#f3f3f3]"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="72px"
            className="object-cover object-center h-full w-full rounded-2xl"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/shop/${product.slug}`}
            onClick={onClose}
            className="text-[18px] font-medium leading-snug tracking-tight text-[#1a1a1a] hover:text-accent"
          >
            {product.name}
          </Link>
          <p className="mt-2 text-[20px] font-medium text-[#1a1a1a]">
            {formatPrice(product.price)}
          </p>
        </div>
        <button
          type="button"
          aria-label="Remove from cart"
          onClick={onRemove}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#1a1a1a]/40 transition-colors hover:bg-soft hover:text-[#1a1a1a]"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-[13px]">
          <span
            className={`inline-flex size-1.5 rounded-full ${
              inStock ? "bg-primary" : "bg-[#e11d48]"
            }`}
          />
          <span className="font-medium text-[#1a1a1a]">
            {stockLabel(product.stockStatus)}
          </span>
          {inStock ? (
            <span className="text-[#1a1a1a]/45">· Ships in 1–2 business days</span>
          ) : null}
        </div>
        <p className="text-[13px] text-[#1a1a1a]/55">
          Expected delivery:{" "}
          <span className="font-medium text-[#1a1a1a]/75">
            {expectedDeliveryRange()}
          </span>
        </p>
      </div>

      <CartDetailsAccordion product={product} />

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F5F5F6] pt-4">
        <div className="inline-flex items-center rounded-full border border-[#F5F5F6] bg-soft">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={decrease}
            className="flex size-9 items-center justify-center text-[#1a1a1a]"
          >
            −
          </button>
          <span className="relative flex h-6 w-7 items-center justify-center overflow-hidden text-[14px] font-medium text-[#1a1a1a] tabular-nums">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={qty}
                custom={direction}
                initial={{ y: direction > 0 ? 14 : -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -14 : 14, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute"
              >
                {qty}
              </motion.span>
            </AnimatePresence>
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={increase}
            className="flex size-9 items-center justify-center text-[#1a1a1a]"
          >
            +
          </button>
        </div>
        <p className="text-[15px] font-medium text-[#1a1a1a]">
          {formatPrice(product.price * qty)}
        </p>
      </div>
    </div>
  );
}

export default function CartSidePanel() {
  const {
    cartPanelOpen,
    cartPanelProductSlug,
    closeCartPanel,
    cartProducts,
    cartCount,
    cartTotal,
    catalog,
    catalogReady,
    addToCart,
    removeFromCart,
  } = useShopStore();

  const cartSlugs = useMemo(
    () => cartProducts.map((item) => item.product.slug),
    [cartProducts],
  );

  const orderedCartItems = useMemo(() => {
    if (!cartPanelProductSlug) return cartProducts;
    const focus = cartProducts.find(
      (item) => item.product.slug === cartPanelProductSlug,
    );
    if (!focus) return cartProducts;
    return [
      focus,
      ...cartProducts.filter((item) => item.product.slug !== cartPanelProductSlug),
    ];
  }, [cartPanelProductSlug, cartProducts]);

  const suggestions = useMemo(
    () =>
      getCartSuggestions(catalog, cartPanelProductSlug, cartSlugs, 3),
    [catalog, cartPanelProductSlug, cartSlugs],
  );

  useEffect(() => {
    if (!cartPanelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCartPanel();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [cartPanelOpen, closeCartPanel]);

  return (
    <AnimatePresence>
      {cartPanelOpen ? (
        <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true">
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCartPanel}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          <button
            type="button"
            aria-label="Close"
            onClick={closeCartPanel}
            className="absolute top-5 right-[max(1rem,calc(100%-440px+1.25rem))] z-[96] flex size-10 items-center justify-center rounded-full bg-surface text-[#1a1a1a] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors hover:bg-soft max-md:right-5"
          >
            <CloseIcon />
          </button>

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.12)]"
            style={{ backgroundColor: PANEL_BG }}
          >
            <div className="px-6 pt-7 pb-4">
              <h2 className="text-[28px] font-medium tracking-tight text-[#1a1a1a]">
                Cart
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-5">
              {orderedCartItems.length > 0 ? (
                <div className="space-y-4">
                  {orderedCartItems.map((item) => (
                    <CartProductCard
                      key={item.product.slug}
                      item={item}
                      highlighted={item.product.slug === cartPanelProductSlug}
                      onRemove={() => removeFromCart(item.product.slug)}
                      onClose={closeCartPanel}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-3xl border bg-surface px-5 py-10 text-center"
                  style={{ borderColor: CARD_BORDER }}
                >
                  <p className="text-[15px] text-[#1a1a1a]/60">
                    Your cart is empty.
                  </p>
                  <CtaButton
                    href="/shop"
                    onClick={closeCartPanel}
                    className="mt-4"
                  >
                    Browse produce
                  </CtaButton>
                </div>
              )}

              {orderedCartItems.length > 0 ? (
                <CartSuggestedItems
                  className="mt-6"
                  items={suggestions}
                  loading={!catalogReady}
                  onAdd={addToCart}
                  onClose={closeCartPanel}
                  cartSlugs={cartSlugs}
                />
              ) : null}
            </div>

            <div className="border-t border-[#EBEBEC] bg-surface px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[22px] font-medium leading-none tracking-tight text-[#1a1a1a] sm:text-[24px]">
                    {formatPrice(cartTotal)}
                  </p>
                  <p className="mt-1.5 text-[13px] text-[#1a1a1a]/50">
                    Subtotal · {cartCount}{" "}
                    {cartCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <CtaButton
                  href="/checkout"
                  onClick={closeCartPanel}
                  className="shrink-0 pl-4 text-[13px] sm:text-[14px]"
                >
                  Checkout
                </CtaButton>
              </div>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 4 14h6M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
