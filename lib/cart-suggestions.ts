import type { Product } from "@/lib/products";

export type CartSuggestion = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  collection?: string;
};

/** Fallback suggestions when the live catalog is empty. */
export const dummyCartSuggestions: CartSuggestion[] = [
  {
    id: "suggest-weekend",
    slug: "weekend-market-tote",
    name: "Weekend Market Tote",
    subtitle: "Weekend · Wide opening",
    collection: "Weekend",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "suggest-leather",
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    subtitle: "Leather · Work-ready",
    collection: "Leather",
    price: 148,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "suggest-mini",
    slug: "mini-crossbody-tote",
    name: "Mini Crossbody Tote",
    subtitle: "Mini Bags · Hands-free",
    collection: "Mini Bags",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=400&q=80",
  },
];

const dummyIdBySlug: Record<string, number> = {
  "weekend-market-tote": 9001,
  "structured-leather-tote": 9002,
  "mini-crossbody-tote": 9003,
};

export function productToSuggestion(product: Product): CartSuggestion {
  const detail = product.description.trim();
  const subtitle = detail
    ? `${product.collection} · ${detail.length > 42 ? `${detail.slice(0, 42)}…` : detail}`
    : product.collection;

  return {
    id: `product-${product.slug}`,
    slug: product.slug,
    name: product.name,
    subtitle,
    price: product.price,
    image: product.image,
    collection: product.collection,
  };
}

export function suggestionToProduct(suggestion: CartSuggestion): Product {
  const collection =
    suggestion.collection ??
    suggestion.subtitle.split("·")[0]?.trim() ??
    "Shop";

  return {
    id: dummyIdBySlug[suggestion.slug] ?? 9099,
    slug: suggestion.slug,
    name: suggestion.name,
    price: suggestion.price,
    collection,
    categorySlugs: [collection.toLowerCase().replace(/\s+/g, "-")],
    description: suggestion.subtitle,
    image: suggestion.image,
    stockStatus: "instock",
  };
}

/** Resolve dummy suggestion products — only needed when catalog is empty. */
export function resolveSuggestionProduct(slug: string): Product | undefined {
  const suggestion = dummyCartSuggestions.find((item) => item.slug === slug);
  return suggestion ? suggestionToProduct(suggestion) : undefined;
}

export function isDummySuggestionSlug(slug: string) {
  return dummyCartSuggestions.some((item) => item.slug === slug);
}

/**
 * Real catalog products first; dummy picks only when catalog has no products.
 */
export function getCartSuggestions(
  catalog: Product[],
  focusSlug: string | null,
  cartSlugs: string[],
  limit = 3,
): CartSuggestion[] {
  if (catalog.length === 0) {
    return dummyCartSuggestions
      .filter((item) => !cartSlugs.includes(item.slug))
      .slice(0, limit);
  }

  const candidates = catalog.filter(
    (product) => !cartSlugs.includes(product.slug),
  );

  if (candidates.length === 0) return [];

  const focus = focusSlug
    ? catalog.find((product) => product.slug === focusSlug)
    : undefined;

  let ordered = candidates;
  if (focus) {
    const sameCollection = candidates.filter(
      (product) => product.collection === focus.collection,
    );
    const other = candidates.filter(
      (product) => product.collection !== focus.collection,
    );
    ordered = [...sameCollection, ...other];
  }

  return ordered.slice(0, limit).map(productToSuggestion);
}
