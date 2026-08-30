"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters, {
  productMatchesFilters,
  type ShopFilterState,
} from "@/components/shop/ShopFilters";
import ShopFloatingSearch from "@/components/shop/ShopFloatingSearch";
import { getShopFilterTree } from "@/lib/mega-menu";
import { useShopStore } from "@/lib/shop-store";

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    catalog,
    collections,
    catalogReady,
    catalogSource,
    catalogError,
  } = useShopStore();

  const [query, setQuery] = useState("");
  const tree = useMemo(() => getShopFilterTree(), []);

  const filters: ShopFilterState = useMemo(
    () => ({
      collection: searchParams.get("collection"),
      newArrivals: searchParams.get("new") === "1",
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: ShopFilterState) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.collection) params.set("collection", next.collection);
      else params.delete("collection");
      if (next.newArrivals) params.set("new", "1");
      else params.delete("new");
      const qs = params.toString();
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    },
    [router, searchParams],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return catalog.filter((p) => {
      if (!productMatchesFilters(p, filters, tree)) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });
  }, [catalog, filters, query, tree]);

  const activeLabel = useMemo(() => {
    if (!filters.collection) return null;
    for (const group of tree) {
      if (group.slug === filters.collection) return group.label;
      const child = group.children.find((c) => c.slug === filters.collection);
      if (child) return child.label;
    }
    return (
      collections.find(
        (c) => c.toLowerCase().replace(/\s+/g, "-") === filters.collection,
      ) ?? filters.collection
    );
  }, [collections, filters.collection, tree]);

  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 pb-40 md:px-10 md:py-20 md:pb-20 lg:pb-20">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
            Shop
          </p>
          <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
            {activeLabel ?? "Tote bags"}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#1a1a1a]/70">
            {filters.newArrivals
              ? "Fresh arrivals — just in from the studio."
              : "Everyday totes for work, weekends, and everything you carry."}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          <ShopFilters
            tree={tree}
            collectionNames={collections}
            catalog={catalog}
            filters={filters}
            onChange={setFilters}
            className="hidden lg:block lg:sticky lg:top-28 lg:self-start"
          />

          <div className="min-w-0">
            {!catalogReady ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-[22px] bg-surface/80"
                  />
                ))}
              </div>
            ) : catalogError ? (
              <div className="rounded-[24px] border border-red-200 bg-surface p-8 text-[15px] text-red-700">
                Could not load products from WooCommerce. {catalogError}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[24px] border border-black/8 bg-surface p-8 text-[15px] text-[#1a1a1a]/60">
                {query.trim() || filters.collection || filters.newArrivals
                  ? "No products match your search or filter."
                  : "No products yet. Publish a product in WooCommerce and refresh."}
                {catalogSource === "woo" &&
                !query.trim() &&
                !filters.collection &&
                !filters.newArrivals ? (
                  <span className="mt-2 block text-[13px] text-accent">
                    Connected to WooCommerce.
                  </span>
                ) : null}
              </div>
            ) : (
              <>
                <p className="text-[13px] text-[#1a1a1a]/50">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "product" : "products"}
                  {catalogSource === "woo" ? " · from WooCommerce" : ""}
                  {filters.newArrivals ? " · new arrivals" : ""}
                  {query.trim() ? ` · “${query.trim()}”` : ""}
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ShopFloatingSearch
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        tree={tree}
        collectionNames={collections}
        catalog={catalog}
      />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="h-10 w-48 animate-pulse rounded bg-black/5" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-[22px] bg-black/5"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
