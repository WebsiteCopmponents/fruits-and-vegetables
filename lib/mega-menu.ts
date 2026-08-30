import { fetchWooCategories, isWooConfigured } from "@/lib/woo";

export type MegaMenuLink = {
  slug: string;
  label: string;
  href: string;
};

export type MegaMenuGroup = MegaMenuLink & {
  children: MegaMenuLink[];
};

/**
 * Display tree for Shop mega menu + shop filters.
 * Slugs match WooCommerce categories on ship.lagracia.co.uk;
 * labels follow the storefront naming you want shown.
 */
export const MEGA_TREE: Array<{
  slug: string;
  label: string;
  children: Array<{ slug: string; label: string }>;
}> = [
  {
    slug: "tote-bags",
    label: "Tote Bags",
    children: [
      { slug: "kids-tote-bags", label: "Kids Tote Bags" },
      { slug: "coasters", label: "Coasters" },
    ],
  },
  {
    slug: "jute-bags",
    label: "Jute Tote Bags",
    children: [
      { slug: "jute-gift-bags", label: "Jute Wine Gift Bags" },
    ],
  },
];

function shopCollectionHref(slug: string) {
  return `/shop?collection=${encodeURIComponent(slug)}`;
}

function toGroup(group: (typeof MEGA_TREE)[number]): MegaMenuGroup {
  return {
    slug: group.slug,
    label: group.label,
    href: shopCollectionHref(group.slug),
    children: group.children.map((child) => ({
      slug: child.slug,
      label: child.label,
      href: shopCollectionHref(child.slug),
    })),
  };
}

const FALLBACK_GROUPS: MegaMenuGroup[] = MEGA_TREE.map(toGroup);

/** Sync filter tree for the shop page (no network). */
export function getShopFilterTree(): MegaMenuGroup[] {
  return FALLBACK_GROUPS;
}

/** Category slugs included when a filter option is selected (parent includes children). */
export function collectionFilterSlugs(
  slug: string,
  tree: MegaMenuGroup[] = FALLBACK_GROUPS,
): string[] {
  for (const group of tree) {
    if (group.slug === slug) {
      return [group.slug, ...group.children.map((c) => c.slug)];
    }
    if (group.children.some((c) => c.slug === slug)) {
      return [slug];
    }
  }
  return [slug];
}

export async function getMegaMenuCategories(): Promise<MegaMenuGroup[]> {
  if (!isWooConfigured()) return FALLBACK_GROUPS;

  try {
    const cats = await fetchWooCategories({ hideEmpty: false });
    const bySlug = new Map(
      cats
        .filter((c) => c.slug !== "uncategorized")
        .map((c) => [c.slug, c] as const),
    );

    const groups = MEGA_TREE.map((group) => {
      const parent = bySlug.get(group.slug);
      if (!parent) return null;

      const children = group.children
        .map((child) => {
          const found = bySlug.get(child.slug);
          if (!found) return null;
          return {
            slug: found.slug,
            label: child.label,
            href: shopCollectionHref(found.slug),
          };
        })
        .filter((item): item is MegaMenuLink => item !== null);

      return {
        slug: parent.slug,
        label: group.label,
        href: shopCollectionHref(parent.slug),
        children,
      };
    }).filter((item): item is MegaMenuGroup => item !== null);

    return groups.length > 0 ? groups : FALLBACK_GROUPS;
  } catch (err) {
    console.error("[mega-menu]", err);
    return FALLBACK_GROUPS;
  }
}
