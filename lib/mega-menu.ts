export type MegaMenuLink = {
  slug: string;
  label: string;
  href: string;
};

export type MegaMenuGroup = MegaMenuLink & {
  children: MegaMenuLink[];
};

export const MEGA_TREE: Array<{
  slug: string;
  label: string;
  children: Array<{ slug: string; label: string }>;
}> = [
  {
    slug: "fruit",
    label: "Fruit",
    children: [
      { slug: "seasonal-fruit", label: "Seasonal Fruit" },
      { slug: "exotic-fruit", label: "Exotic Fruit" },
    ],
  },
  {
    slug: "vegetables",
    label: "Vegetables",
    children: [
      { slug: "everyday-veg", label: "Everyday Veg" },
      { slug: "salad", label: "Salad" },
    ],
  },
  {
    slug: "exotic-spices",
    label: "Exotic Spices",
    children: [{ slug: "fresh-spices", label: "Fresh Spices" }],
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

export function getShopFilterTree(): MegaMenuGroup[] {
  return FALLBACK_GROUPS;
}

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
  return FALLBACK_GROUPS;
}
