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

export const dummyCartSuggestions: CartSuggestion[] = [
  {
    id: "suggest-apples",
    slug: "scottish-apples",
    name: "Apples",
    subtitle: "Fruit · 6-pack",
    collection: "Fruit",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "suggest-carrots",
    slug: "scottish-carrots",
    name: "Carrots",
    subtitle: "Vegetables · 1kg",
    collection: "Vegetables",
    price: 1.2,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "suggest-strawberries",
    slug: "strawberries",
    name: "Strawberries",
    subtitle: "Fruit · 400g punnet",
    collection: "Fruit",
    price: 3.2,
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80",
  },
];

const dummyIdBySlug: Record<string, number> = {
  "scottish-apples": 9001,
  "scottish-carrots": 9002,
  strawberries: 9003,
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

export function resolveSuggestionProduct(slug: string): Product | undefined {
  const suggestion = dummyCartSuggestions.find((item) => item.slug === slug);
  return suggestion ? suggestionToProduct(suggestion) : undefined;
}

export function isDummySuggestionSlug(slug: string) {
  return dummyCartSuggestions.some((item) => item.slug === slug);
}

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
