"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CtaButton from "@/components/CtaButton";
import {
  dummyCartSuggestions,
  suggestionToProduct,
} from "@/lib/cart-suggestions";
import { formatPrice, type Product } from "@/lib/products";
import { useSearchModal } from "@/lib/search-modal";

const SUGGESTED_LIMIT = 4;

const SUGGESTED_SEARCHES = ["Leather", "Canvas", "Weekend", "Mini", "Tote"];

const fallbackSuggestedProducts = dummyCartSuggestions.map(suggestionToProduct);

async function fetchProducts(search?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (search?.trim()) params.set("search", search.trim());
  const res = await fetch(`/api/products?${params.toString()}`, { signal });
  const data = (await res.json()) as {
    products?: Product[];
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || "Search failed");
  return data.products ?? [];
}

export default function SearchModal() {
  const { open, closeSearch } = useSearchModal();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Ignore backdrop clicks from the same gesture that opened the modal. */
  const ignoreBackdropClick = useRef(false);

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;
  const visibleProducts = isSearching ? results : suggested;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    ignoreBackdropClick.current = true;
    const unlock = window.setTimeout(() => {
      ignoreBackdropClick.current = false;
    }, 320);

    setQuery("");
    setResults([]);
    setError(null);
    setLoadingSuggested(true);

    const controller = new AbortController();
    fetchProducts(undefined, controller.signal)
      .then((products) => {
        const picks =
          products.length > 0
            ? products.slice(0, SUGGESTED_LIMIT)
            : fallbackSuggestedProducts.slice(0, SUGGESTED_LIMIT);
        setSuggested(picks);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setSuggested(fallbackSuggestedProducts.slice(0, SUGGESTED_LIMIT));
        setError(err instanceof Error ? err.message : "Could not load products");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSuggested(false);
      });

    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
      window.clearTimeout(unlock);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open || !isSearching) {
      setResults([]);
      setLoadingResults(false);
      return;
    }

    setLoadingResults(true);
    setError(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetchProducts(trimmed, controller.signal)
        .then((products) => setResults(products))
        .catch((err) => {
          if (controller.signal.aborted) return;
          setResults([]);
          setError(err instanceof Error ? err.message : "Search failed");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoadingResults(false);
        });
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, trimmed, isSearching]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="search-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => {
              if (ignoreBackdropClick.current) return;
              closeSearch();
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 32,
              mass: 0.9,
            }}
            className="relative z-10 flex max-h-[min(88vh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="border-b border-black/8 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <SearchIcon />
                <input
                  ref={inputRef}
                  id={titleId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search totes, collections, keywords…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent text-[17px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="flex size-8 items-center justify-center rounded-full text-[#1a1a1a]/45 hover:bg-black/[0.04]"
                  >
                    <ClearIcon />
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeSearch}
                  className="flex size-9 items-center justify-center rounded-full border border-black/10 text-[#1a1a1a] hover:bg-black/[0.03]"
                >
                  <ClearIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-medium tracking-tight text-[#1a1a1a]">
                  {isSearching ? "Results" : "Suggested products"}
                </h2>
                {!isSearching ? (
                  <Link
                    href="/shop"
                    onClick={closeSearch}
                    className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-accent hover:opacity-70"
                  >
                    View all
                    <ArrowRightIcon />
                  </Link>
                ) : null}
              </div>

              {!isSearching || visibleProducts.length > 0 || loadingResults ? (
                <SuggestedSearches
                  searches={SUGGESTED_SEARCHES}
                  active={trimmed}
                  onSelect={(term) => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                />
              ) : null}

              {error ? (
                <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
                  {error}
                </p>
              ) : null}

              {loadingSuggested && !isSearching ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[76px] animate-pulse rounded-2xl bg-soft"
                    />
                  ))}
                </div>
              ) : loadingResults && isSearching ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[76px] animate-pulse rounded-2xl bg-soft"
                    />
                  ))}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="rounded-2xl bg-soft px-4 py-8 text-center">
                  <p className="text-[15px] text-[#1a1a1a]/60">
                    {isSearching
                      ? `No products found for “${trimmed}”.`
                      : "No products to suggest yet."}
                  </p>
                  {isSearching ? (
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <SuggestedSearches
                        searches={SUGGESTED_SEARCHES.filter(
                          (term) =>
                            term.toLowerCase() !== trimmed.toLowerCase(),
                        )}
                        active={trimmed}
                        onSelect={(term) => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        align="center"
                      />
                      <CtaButton
                        href="/shop"
                        onClick={closeSearch}
                        className="mt-1"
                      >
                        Browse all totes
                      </CtaButton>
                    </div>
                  ) : null}
                </div>
              ) : (
                <ul className="space-y-2">
                  {visibleProducts.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-2xl border border-[#F5F5F6] bg-soft p-3 transition-colors hover:bg-surface hover:shadow-[0_8px_24px_rgba(26,26,26,0.05)]"
                      >
                        <div className="relative size-[60px] shrink-0 overflow-hidden rounded-xl bg-soft">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium text-[#1a1a1a]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] text-[#1a1a1a]/50">
                            {product.collection}
                          </p>
                          <p className="mt-1 text-[14px] font-medium text-[#1a1a1a]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <span className="shrink-0 text-[#1a1a1a]/35">
                          <ArrowRightIcon />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {isSearching && visibleProducts.length > 0 ? (
                <p className="mt-4 text-[13px] text-[#1a1a1a]/45">
                  {visibleProducts.length}{" "}
                  {visibleProducts.length === 1 ? "result" : "results"} for “
                  {trimmed}”
                </p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function SuggestedSearches({
  searches,
  active,
  onSelect,
  align = "start",
}: {
  searches: string[];
  active: string;
  onSelect: (term: string) => void;
  align?: "start" | "center";
}) {
  if (searches.length === 0) return null;

  return (
    <div
      className={`mb-4 flex flex-wrap gap-2 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {searches.map((term) => {
        const isActive = active.toLowerCase() === term.toLowerCase();
        return (
          <button
            key={term}
            type="button"
            onClick={() => onSelect(term)}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-black/10 text-accent hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {term}
          </button>
        );
      })}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-[#1a1a1a]/45"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClearIcon() {
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
