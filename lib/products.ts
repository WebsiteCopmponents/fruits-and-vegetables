import { isWooConfigured } from "@/lib/woo";

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  collection: string;
  categorySlugs: string[];
  description: string;
  image: string;
  images?: string[];
  badge?: string;
  stockStatus?: "instock" | "outofstock" | "onbackorder" | string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80";

/** Scotland greengrocer-style pack prices in GBP (Aug 2026 UK rates). */
export const demoProducts: Product[] = [
  {
    id: 1001,
    slug: "scottish-apples",
    name: "Apples",
    price: 2.5,
    collection: "Fruit",
    categorySlugs: ["fruit", "seasonal-fruit"],
    description: "Freshly picked 6-pack — crisp and sweet.",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=900&q=80",
    ],
    badge: "Bestseller",
    stockStatus: "instock",
  },
  {
    id: 1002,
    slug: "ripe-bananas",
    name: "Bananas",
    price: 1.8,
    collection: "Fruit",
    categorySlugs: ["fruit", "seasonal-fruit"],
    description: "Ripe bunch, ready to eat this week.",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1003,
    slug: "strawberries",
    name: "Strawberries",
    price: 3.2,
    collection: "Fruit",
    categorySlugs: ["fruit", "seasonal-fruit"],
    description: "400g punnet — juicy and fragrant.",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80",
    badge: "New",
    stockStatus: "instock",
  },
  {
    id: 1004,
    slug: "oranges",
    name: "Oranges",
    price: 2.4,
    collection: "Fruit",
    categorySlugs: ["fruit", "exotic-fruit"],
    description: "4-pack of sweet, easy-peel oranges.",
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1005,
    slug: "greengages",
    name: "Greengages",
    price: 4.5,
    collection: "Fruit",
    categorySlugs: ["fruit", "seasonal-fruit"],
    description: "Seasonal greengages — juicy and hard to find.",
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80",
    badge: "Limited",
    stockStatus: "instock",
  },
  {
    id: 1006,
    slug: "mango",
    name: "Mango",
    price: 1.8,
    collection: "Fruit",
    categorySlugs: ["fruit", "exotic-fruit"],
    description: "Ripe exotic mango, one piece.",
    image:
      "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1007,
    slug: "grapes",
    name: "Grapes",
    price: 2.8,
    collection: "Fruit",
    categorySlugs: ["fruit", "seasonal-fruit"],
    description: "500g of sweet seedless grapes.",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1016,
    slug: "lemons",
    name: "Lemons",
    price: 1.6,
    collection: "Fruit",
    categorySlugs: ["fruit", "exotic-fruit"],
    description: "4-pack of bright, juicy lemons.",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1008,
    slug: "scottish-carrots",
    name: "Carrots",
    price: 1.2,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "everyday-veg"],
    description: "1kg British carrots — fresh from the crate.",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    badge: "Bestseller",
    stockStatus: "instock",
  },
  {
    id: 1009,
    slug: "scottish-potatoes",
    name: "Potatoes",
    price: 2.2,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "everyday-veg"],
    description: "2kg Scottish washed potatoes.",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1010,
    slug: "salad-tomatoes",
    name: "Tomatoes",
    price: 1.8,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "salad"],
    description: "6-pack of ripe salad tomatoes.",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1011,
    slug: "broccoli",
    name: "Broccoli",
    price: 1.4,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "everyday-veg"],
    description: "One fresh head, tight and green.",
    image:
      "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1012,
    slug: "mixed-peppers",
    name: "Peppers",
    price: 2.2,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "salad"],
    description: "Trio of red, yellow, and green peppers.",
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1017,
    slug: "cucumber",
    name: "Cucumber",
    price: 0.9,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "salad"],
    description: "One fresh cucumber — crisp and cool.",
    image:
      "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1018,
    slug: "onions",
    name: "Onions",
    price: 1.1,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "everyday-veg"],
    description: "1kg of brown cooking onions.",
    image:
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1019,
    slug: "spinach",
    name: "Spinach",
    price: 1.5,
    collection: "Vegetables",
    categorySlugs: ["vegetables", "salad"],
    description: "200g bag of fresh baby spinach.",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1013,
    slug: "fresh-ginger",
    name: "Ginger",
    price: 1.2,
    collection: "Exotic Spices",
    categorySlugs: ["exotic-spices", "fresh-spices"],
    description: "Fresh root — punchy and fragrant.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1014,
    slug: "fresh-chillies",
    name: "Chillies",
    price: 1.4,
    collection: "Exotic Spices",
    categorySlugs: ["exotic-spices", "fresh-spices"],
    description: "A handful of fresh red chillies.",
    image:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1020,
    slug: "garlic",
    name: "Garlic",
    price: 0.9,
    collection: "Exotic Spices",
    categorySlugs: ["exotic-spices", "fresh-spices"],
    description: "A bulb of fresh garlic.",
    image:
      "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1021,
    slug: "coriander",
    name: "Coriander",
    price: 0.8,
    collection: "Exotic Spices",
    categorySlugs: ["exotic-spices", "fresh-spices"],
    description: "A fresh bunch of coriander.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    stockStatus: "instock",
  },
  {
    id: 1015,
    slug: "home-delivery-box",
    name: "Delivery box",
    price: 18.5,
    collection: "Home Delivery",
    categorySlugs: ["home-delivery"],
    description: "Mixed fruit and veg box for Edinburgh homes.",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    badge: "New",
    stockStatus: "instock",
  },
];

export const demoCollections = [
  "All",
  "Fruit",
  "Vegetables",
  "Exotic Spices",
  "Home Delivery",
] as const;

export const products = demoProducts;
export const collections = demoCollections;

export type CatalogResult = {
  source: "woo" | "demo";
  products: Product[];
  collections: string[];
};

export async function getCatalog(options?: {
  collection?: string;
  search?: string;
}): Promise<CatalogResult> {
  let list = demoProducts;
  if (options?.collection && options.collection !== "All") {
    const key = options.collection.toLowerCase();
    list = list.filter(
      (p) =>
        p.collection === options.collection ||
        p.collection.toLowerCase() === key ||
        p.categorySlugs.includes(key) ||
        p.categorySlugs.includes(options.collection!),
    );
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

export async function getProducts(options?: {
  collection?: string;
  search?: string;
}): Promise<Product[]> {
  const catalog = await getCatalog(options);
  return catalog.products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return demoProducts.find((p) => p.slug === slug);
}

export async function getCollections(): Promise<string[]> {
  return [...demoCollections];
}

export type CollectionMeta = {
  slug: string;
  name: string;
};

export async function getCollectionMetas(): Promise<CollectionMeta[]> {
  return [
    { slug: "fruit", name: "Fruit" },
    { slug: "vegetables", name: "Vegetables" },
    { slug: "exotic-spices", name: "Exotic Spices" },
    { slug: "home-delivery", name: "Home Delivery" },
    { slug: "seasonal-fruit", name: "Seasonal Fruit" },
    { slug: "exotic-fruit", name: "Exotic Fruit" },
    { slug: "everyday-veg", name: "Everyday Veg" },
    { slug: "salad", name: "Salad" },
    { slug: "fresh-spices", name: "Fresh Spices" },
  ];
}

export async function getProductsByCollectionSlug(
  slug: string,
): Promise<{ name: string; products: Product[] } | null> {
  const metas = await getCollectionMetas();
  const meta = metas.find((m) => m.slug === slug);
  if (!meta) return null;
  const all = await getProducts();
  const productsForSlug = all.filter(
    (p) =>
      p.collection === meta.name ||
      p.categorySlugs.includes(slug) ||
      p.categorySlugs.includes(meta.slug),
  );
  return { name: meta.name, products: productsForSlug };
}

export type ProductVariant = {
  id: string;
  label: string;
  image: string;
};

export function getProductVariants(product: Product): ProductVariant[] {
  const extra =
    product.images?.find((src) => src !== product.image) ?? product.image;

  if (product.collection === "Home Delivery") {
    return [
      { id: "weekly", label: "Weekly box", image: product.image },
      { id: "family", label: "Family box", image: extra },
    ];
  }

  if (product.collection === "Exotic Spices") {
    return [
      { id: "single", label: "Single", image: product.image },
      { id: "kitchen", label: "Kitchen pack", image: extra },
    ];
  }

  return [
    { id: "standard", label: "Standard", image: product.image },
    { id: "family", label: "Family", image: extra },
  ];
}

export function getProductDetail(product: Product) {
  const kind = product.collection.toLowerCase();
  return `${product.description} Packed at Global Fruits, 5 Gillespie Pl in Tollcross. We choose this ${kind} for flavour this week — crisp, fresh, and ready for Edinburgh home delivery in 1–2 days, or collect from the shop from 8am.`;
}

export function formatPrice(price: number) {
  const currency = process.env.NEXT_PUBLIC_STORE_CURRENCY || "GBP";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(price);
}

export { isWooConfigured, FALLBACK_IMAGE };
