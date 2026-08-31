"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { EmptyState, PageShell } from "@/components/shop/PageShell";
import { useShopStore } from "@/lib/shop-store";

export default function SearchClient() {
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const { catalog } = useShopStore();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }, [q, catalog]);

  return (
    <PageShell
      eyebrow="Search"
      title="Search"
      description="Find fruit, veg, and spices by name or keyword."
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex max-w-xl gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search produce…"
          className="w-full rounded-full border border-black/12 bg-surface px-5 py-3.5 text-[15px] outline-none focus:border-black/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-6 text-[14px] font-medium text-white hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {!q.trim() ? (
          <p className="text-[15px] text-[#1a1a1a]/55">
            Try “apples”, “carrots”, or “ginger”.
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            title="No matches"
            body={`Nothing found for “${q}”. Try another keyword.`}
            href="/shop"
            cta="Browse all"
          />
        ) : (
          <>
            <p className="mb-6 text-[13px] text-[#1a1a1a]/50">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
