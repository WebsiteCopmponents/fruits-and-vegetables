import {
  fetchWooCategories,
  fetchWooProductBySlug,
  fetchWooProducts,
  isWooConfigured,
  type WooProduct,
} from "@/lib/woo";

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  collection: string;
  /** Woo category slugs (and demo stand-ins) for shop filters */
  categorySlugs: string[];
  description: string;
  image: string;
  images?: string[];
  badge?: string;
  stockStatus?: "instock" | "outofstock" | "onbackorder" | string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80";

/** Demo catalog — only when Woo env vars are missing. */
export const demoProducts: Product[] = [
  {
    id: 1001,
    slug: "everyday-canvas-tote",
    name: "Everyday Canvas Tote",
    price: 68,
    collection: "Canvas",
    categorySlugs: ["canvas", "tote-bags"],
    description: "A soft, roomy canvas tote for daily errands and light work days.",
    image: FALLBACK_IMAGE,
    badge: "Bestseller",
    stockStatus: "instock",
  },
  {
    id: 1002,
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    price: 148,
    collection: "Leather",
    categorySlugs: ["leather", "tote-bags"],
    description: "Clean lines and firm structure for work and meetings.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    badge: "New",
    stockStatus: "instock",
  },
  {
    id: 1003,
    slug: "weekend-market-tote",
    name: "Weekend Market Tote",
    price: 78,
    collection: "Weekend",
    categorySlugs: ["weekend", "tote-bags"],
    description: "Wide opening and sturdy straps for markets and short trips.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1004,
    slug: "mini-crossbody-tote",
    name: "Mini Crossbody Tote",
    price: 58,
    collection: "Mini Bags",
    categorySlugs: ["mini", "kids-tote-bags", "tote-bags"],
    description: "Compact carry with an adjustable strap for hands-free days.",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1005,
    slug: "hand-block-print-quilted-tote",
    name: "Hand Block-Print Quilted Tote",
    price: 88,
    collection: "Weekend",
    categorySlugs: ["weekend", "tote-bags"],
    description:
      "A roomy quilted tote hand block-printed in small floral motifs, finished with striped piping and double straps. Each one is cut from a limited run of fabric, so prints and colorways vary slightly bag to bag.",
    image: "/ETSY/1-DSC_5322.jpg",
    images: [
      "/ETSY/1-DSC_5322.jpg",
      "/ETSY/2-DSC_5335.jpg",
      "/ETSY/3-DSC_5338.jpg",
      "/ETSY/4-DSC_5355.jpg",
      "/ETSY/5-DSC_5364.jpg",
      "/ETSY/6-DSC_5374.jpg",
      "/ETSY/7-DSC_5385.jpg",
      "/ETSY/8-DSC_5393.jpg",
      "/ETSY/9-20260312_120838.jpg",
      "/ETSY/10-20260312_121046.jpg",
      "/ETSY/11-20260312_121357.jpg",
      "/ETSY/12-20260312_121433.jpg",
      "/ETSY/13-20260312_121644.jpg",
      "/ETSY/14-20260312_121647.jpg",
      "/ETSY/15-20260312_121740.jpg",
      "/ETSY/16-20260312_121910.jpg",
      "/ETSY/17-20260312_121925.jpg",
      "/ETSY/18-20260312_122043.jpg",
      "/ETSY/19-20260312_122111.jpg",
      "/ETSY/20-20260312_123215.jpg",
      "/ETSY/21-20260312_123227.jpg",
      "/ETSY/22-20260312_123236.jpg",
      "/ETSY/23-20260312_123340.jpg",
      "/ETSY/24-20260312_123340.jpg",
      "/ETSY/25-20260312_123400.jpg",
      "/ETSY/26-20260312_123508.jpg",
      "/ETSY/27-20260312_123533.jpg",
      "/ETSY/28-20260312_123648.jpg",
      "/ETSY/29-20260312_123700.jpg",
      "/ETSY/30-20260312_123749.jpg",
      "/ETSY/31-20260312_123759.jpg",
      "/ETSY/32-20260312_123912.jpg",
      "/ETSY/33-20260312_123920.jpg",
      "/ETSY/34-20260312_124007.jpg",
      "/ETSY/35-20260312_124134.jpg",
      "/ETSY/36-20260312_124154.jpg",
    ],
    badge: "New",
    stockStatus: "instock",
  },
];

export const demoCollections = [
  "All",
  "Canvas",
  "Leather",
  "Weekend",
  "Mini Bags",
] as const;

export const products = demoProducts;
export const collections = demoCollections;

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapWooProduct(p: WooProduct): Product {
  const primary = p.categories.find((c) => c.slug !== "uncategorized");
  const collection = primary?.name ?? "Shop";
  const image = p.images[0]?.src || FALLBACK_IMAGE;
  const description =
    stripHtml(p.short_description) ||
    stripHtml(p.description) ||
    "Everyday tote from La Gracia.";

  let badge: string | undefined;
  if (p.stock_status === "outofstock") badge = "Sold out";
  else if (p.on_sale) badge = "Sale";
  else if (p.featured) badge = "Bestseller";
  else if (p.tags.some((t) => /new/i.test(t.name))) badge = "New";
  else if (p.tags.some((t) => /limited/i.test(t.name))) badge = "Limited";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number.parseFloat(p.price || p.regular_price || "0") || 0,
    collection,
    categorySlugs: p.categories
      .map((c) => c.slug)
      .filter((s) => s !== "uncategorized"),
    description,
    image,
    badge,
    stockStatus: p.stock_status,
  };
}

export type CatalogResult = {
  source: "woo" | "demo";
  products: Product[];
  collections: string[];
};

export async function getCatalog(options?: {
  collection?: string;
  search?: string;
}): Promise<CatalogResult> {
  if (!isWooConfigured()) {
    let list = demoProducts;
    if (options?.collection && options.collection !== "All") {
      list = list.filter((p) => p.collection === options.collection);
    }
    if (options?.search) {
      const term = options.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.collection.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }
    return {
      source: "demo",
      products: list,
      collections: [...demoCollections],
    };
  }

  const [raw, cats] = await Promise.all([
    fetchWooProducts({
      search: options?.search,
      perPage: 100,
    }),
    fetchWooCategories(),
  ]).catch((err) => {
    console.error("[catalog]", err);
    return [null, null] as const;
  });

  if (!raw || !cats) {
    return {
      source: "demo",
      products: demoProducts,
      collections: [...demoCollections],
    };
  }

  let list = raw.map(mapWooProduct);
  if (options?.collection && options.collection !== "All") {
    list = list.filter((p) => p.collection === options.collection);
  }

  const names = cats
    .filter((c) => c.slug !== "uncategorized")
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));

  return {
    source: "woo",
    products: list,
    collections: ["All", ...names],
  };
}

export async function getProducts(options?: {
  collection?: string;
  search?: string;
}): Promise<Product[]> {
  const catalog = await getCatalog(options);
  return catalog.products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isWooConfigured()) {
    return demoProducts.find((p) => p.slug === slug);
  }
  try {
    const raw = await fetchWooProductBySlug(slug);
    return raw ? mapWooProduct(raw) : undefined;
  } catch (err) {
    console.error("[product]", err);
    return demoProducts.find((p) => p.slug === slug);
  }
}

export async function getCollections(): Promise<string[]> {
  const catalog = await getCatalog();
  return catalog.collections;
}

export type CollectionMeta = {
  slug: string;
  name: string;
};

export async function getCollectionMetas(): Promise<CollectionMeta[]> {
  if (!isWooConfigured()) {
    return [
      { slug: "canvas", name: "Canvas" },
      { slug: "leather", name: "Leather" },
      { slug: "weekend", name: "Weekend" },
      { slug: "mini", name: "Mini Bags" },
    ];
  }
  try {
    const cats = await fetchWooCategories({ hideEmpty: false });
    return cats
      .filter((c) => c.slug !== "uncategorized")
      .map((c) => ({ slug: c.slug, name: c.name }));
  } catch (err) {
    console.error("[collections]", err);
    return [
      { slug: "canvas", name: "Canvas" },
      { slug: "leather", name: "Leather" },
      { slug: "weekend", name: "Weekend" },
      { slug: "mini", name: "Mini Bags" },
    ];
  }
}

export async function getProductsByCollectionSlug(
  slug: string,
): Promise<{ name: string; products: Product[] } | null> {
  const metas = await getCollectionMetas();
  const meta = metas.find((m) => m.slug === slug);
  if (!meta) return null;
  const all = await getProducts({ collection: meta.name });
  return { name: meta.name, products: all };
}

export function formatPrice(price: number) {
  const currency = process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(price);
}

export { isWooConfigured };
