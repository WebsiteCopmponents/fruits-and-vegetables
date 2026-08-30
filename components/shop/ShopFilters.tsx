"use client";

import { useState } from "react";
import {
  collectionFilterSlugs,
  getShopFilterTree,
  type MegaMenuGroup,
} from "@/lib/mega-menu";
import type { Product } from "@/lib/products";

export type ShopFilterState = {
  collection: string | null;
  newArrivals: boolean;
};

type Props = {
  tree?: MegaMenuGroup[];
  collectionNames?: string[];
  catalog: Product[];
  filters: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  className?: string;
};

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productMatchesFilters(
  product: Product,
  filters: ShopFilterState,
  tree: MegaMenuGroup[] = getShopFilterTree(),
) {
  if (filters.newArrivals) {
    const isNew =
      product.badge === "New" ||
      /new/i.test(product.badge ?? "") ||
      /new/i.test(product.name);
    if (!isNew) return false;
  }

  if (!filters.collection) return true;

  const slugs = collectionFilterSlugs(filters.collection, tree);
  if (product.categorySlugs?.some((s) => slugs.includes(s))) return true;

  const nameSlug = slugifyName(product.collection);
  return slugs.includes(nameSlug) || product.collection === filters.collection;
}

export default function ShopFilters({
  tree = getShopFilterTree(),
  collectionNames = [],
  catalog,
  filters,
  onChange,
  className = "",
}: Props) {
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const treeSlugs = new Set(
    tree.flatMap((g) => [g.slug, ...g.children.map((c) => c.slug)]),
  );

  const extraCollections = collectionNames
    .filter((name) => name !== "All")
    .map((name) => ({ name, slug: slugifyName(name) }))
    .filter((item) => !treeSlugs.has(item.slug));

  function countForSlug(slug: string | null) {
    return catalog.filter((p) =>
      productMatchesFilters(
        p,
        { collection: slug, newArrivals: filters.newArrivals },
        tree,
      ),
    ).length;
  }

  return (
    <aside className={className}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-medium tracking-[0.18em] text-accent uppercase">
          Filters
        </p>
        {filters.collection || filters.newArrivals ? (
          <button
            type="button"
            onClick={() => onChange({ collection: null, newArrivals: false })}
            className="text-[13px] font-medium text-[#1a1a1a]/55 transition-colors hover:text-[#1a1a1a]"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Collections accordion */}
      <div className="mt-6 border-b border-black/8 pb-5">
        <button
          type="button"
          aria-expanded={collectionsOpen}
          onClick={() => setCollectionsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="text-[15px] font-medium text-[#1a1a1a]">
            Collections
          </span>
          <Chevron open={collectionsOpen} />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            collectionsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="mt-3 space-y-0.5">
              <li>
                <FilterLink
                  label="All"
                  count={countForSlug(null)}
                  active={!filters.collection}
                  onClick={() =>
                    onChange({ ...filters, collection: null })
                  }
                />
              </li>
              {tree.map((group) => (
                <li key={group.slug}>
                  <FilterLink
                    label={group.label}
                    count={countForSlug(group.slug)}
                    active={filters.collection === group.slug}
                    onClick={() =>
                      onChange({ ...filters, collection: group.slug })
                    }
                  />
                  {group.children.length > 0 ? (
                    <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-black/8 pl-3">
                      {group.children.map((child) => (
                        <li key={child.slug}>
                          <FilterLink
                            label={child.label}
                            count={countForSlug(child.slug)}
                            active={filters.collection === child.slug}
                            onClick={() =>
                              onChange({
                                ...filters,
                                collection: child.slug,
                              })
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              {extraCollections.map((item) => (
                <li key={item.slug}>
                  <FilterLink
                    label={item.name}
                    count={countForSlug(item.slug)}
                    active={filters.collection === item.slug}
                    onClick={() =>
                      onChange({ ...filters, collection: item.slug })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* New arrivals */}
      <div className="pt-5">
        <p className="text-[15px] font-medium text-[#1a1a1a]">New arrivals</p>
        <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-black/8 bg-surface px-4 py-3.5 transition-colors hover:bg-black/[0.02]">
          <span className="text-[14px] text-[#1a1a1a]">
            Show new arrivals only
          </span>
          <input
            type="checkbox"
            checked={filters.newArrivals}
            onChange={(e) =>
              onChange({ ...filters, newArrivals: e.target.checked })
            }
            className="size-4 accent-[var(--theme-primary,#1a1a1a)]"
          />
        </label>
      </div>
    </aside>
  );
}

function FilterLink({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-[14px] transition-colors ${
        active
          ? "bg-soft font-medium text-accent"
          : "text-[#1a1a1a]/75 hover:bg-black/[0.03] hover:text-[#1a1a1a]"
      }`}
    >
      <span>{label}</span>
      <span className="text-[12px] tabular-nums text-[#1a1a1a]/40">
        {count}
      </span>
    </button>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`text-[#1a1a1a]/45 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
