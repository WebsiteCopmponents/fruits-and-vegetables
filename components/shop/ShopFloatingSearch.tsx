"use client";

import { useEffect, useRef, useState } from "react";
import ShopFilters, {
  type ShopFilterState,
} from "@/components/shop/ShopFilters";
import type { MegaMenuGroup } from "@/lib/mega-menu";
import type { Product } from "@/lib/products";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  filters: ShopFilterState;
  onFiltersChange: (next: ShopFilterState) => void;
  tree: MegaMenuGroup[];
  collectionNames: string[];
  catalog: Product[];
};

export default function ShopFloatingSearch({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  tree,
  collectionNames,
  catalog,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFilterOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const filterActive = Boolean(filters.collection || filters.newArrivals);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-2.5 animate-[alert-in_0.18s_ease-out]">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-surface px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search products"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onQueryChange("");
                  inputRef.current?.focus();
                }}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[#1a1a1a]/45 hover:bg-black/5 hover:text-[#1a1a1a]"
              >
                <ClearIcon />
              </button>
            ) : null}
          </label>

          <button
            type="button"
            aria-label="Filter products"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen(true)}
            className={`relative flex size-[50px] shrink-0 items-center justify-center rounded-full bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors ${
              filterActive ? "text-accent" : "text-[#1a1a1a]"
            }`}
          >
            <FilterIcon />
            {filterActive ? (
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            ) : null}
          </button>
        </div>
      </div>

      {filterOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFilterOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          <div className="relative z-10 max-h-[80vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.28)] animate-[alert-in_0.18s_ease-out]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/6 bg-surface px-5 pt-5 pb-3">
              <div>
                <p className="text-[12px] font-medium tracking-[0.16em] text-accent uppercase">
                  Filter
                </p>
                <h2 className="mt-1 text-[20px] font-medium text-[#1a1a1a]">
                  Refine products
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setFilterOpen(false)}
                className="flex size-9 items-center justify-center rounded-full border border-black/8 text-[#1a1a1a]"
              >
                <ClearIcon />
              </button>
            </div>

            <div className="px-5 py-4">
              <ShopFilters
                tree={tree}
                collectionNames={collectionNames}
                catalog={catalog}
                filters={filters}
                onChange={(next) => {
                  onFiltersChange(next);
                }}
              />
            </div>

            <div className="sticky bottom-0 border-t border-black/6 bg-surface px-5 py-4">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-full bg-primary py-3 text-[14px] font-medium text-white"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M7 12h10M10 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8" cy="7" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="17" r="2" fill="white" stroke="currentColor" strokeWidth="1.8" />
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
