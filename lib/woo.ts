/**
 * WooCommerce REST API client (server-only).
 * Keys stay on the server — call via lib/products or /api/* routes.
 */

export type WooImage = {
  id: number;
  src: string;
  alt: string;
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count?: number;
};

export type WooTag = {
  id: number;
  name: string;
  slug: string;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: string;
  categories: WooCategory[];
  tags: WooTag[];
  images: WooImage[];
  featured: boolean;
};

export type WooOrderLineItem = {
  product_id: number;
  quantity: number;
  name?: string;
  total?: string;
};

export type WooOrder = {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    total: string;
  }>;
};

export type CreateOrderInput = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country?: string;
  shippingMethod: "standard" | "express";
  shippingTotal: number;
  lineItems: Array<{ product_id: number; quantity: number }>;
  clerkUserId?: string;
};

function wooConfig() {
  const baseUrl = process.env.WOO_URL?.replace(/\/$/, "");
  const key = process.env.WOO_CONSUMER_KEY;
  const secret = process.env.WOO_CONSUMER_SECRET;
  if (!baseUrl || !key || !secret) return null;
  return { baseUrl, key, secret };
}

export function isWooConfigured() {
  return wooConfig() !== null;
}

async function wooFetch<T>(
  path: string,
  init?: RequestInit & { searchParams?: Record<string, string | number | undefined> },
): Promise<T> {
  const config = wooConfig();
  if (!config) {
    throw new Error("WooCommerce is not configured. Set WOO_URL, WOO_CONSUMER_KEY, and WOO_CONSUMER_SECRET.");
  }

  const url = new URL(`${config.baseUrl}/wp-json/wc/v3${path}`);
  url.searchParams.set("consumer_key", config.key);
  url.searchParams.set("consumer_secret", config.secret);
  if (init?.searchParams) {
    for (const [k, v] of Object.entries(init.searchParams)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const { searchParams: _sp, ...fetchInit } = init ?? {};
  const method = (fetchInit.method ?? "GET").toUpperCase();
  const noStore = fetchInit.cache === "no-store" || method !== "GET";
  const res = await fetch(url.toString(), {
    ...fetchInit,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(fetchInit.headers ?? {}),
    },
    ...(noStore ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Woo API ${res.status}: ${body.slice(0, 300) || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchWooProducts(params?: {
  category?: number;
  search?: string;
  perPage?: number;
}) {
  return wooFetch<WooProduct[]>("/products", {
    searchParams: {
      status: "publish",
      per_page: params?.perPage ?? 100,
      category: params?.category,
      search: params?.search,
    },
  });
}

export async function fetchWooProductBySlug(slug: string) {
  const list = await wooFetch<WooProduct[]>("/products", {
    searchParams: { slug, status: "publish", per_page: 1 },
  });
  return list[0] ?? null;
}

export async function fetchWooCategories(options?: { hideEmpty?: boolean }) {
  return wooFetch<WooCategory[]>("/products/categories", {
    searchParams: {
      per_page: 100,
      hide_empty: options?.hideEmpty === false ? 0 : 1,
    },
  });
}

export async function fetchWooCustomerByEmail(email: string) {
  const customers = await wooFetch<Array<{ id: number; email: string }>>("/customers", {
    searchParams: { email, per_page: 1 },
    cache: "no-store",
  });
  return customers[0] ?? null;
}

export async function fetchWooOrdersByEmail(email: string) {
  const customer = await fetchWooCustomerByEmail(email);
  if (customer) {
    return wooFetch<WooOrder[]>("/orders", {
      searchParams: { customer: customer.id, per_page: 50, orderby: "date", order: "desc" },
      cache: "no-store",
    });
  }

  // Fallback: search orders (matches billing fields including email)
  return wooFetch<WooOrder[]>("/orders", {
    searchParams: { search: email, per_page: 50, orderby: "date", order: "desc" },
    cache: "no-store",
  });
}

export async function createWooOrder(input: CreateOrderInput) {
  const shippingTitle =
    input.shippingMethod === "express" ? "Express (1–2 days)" : "Standard (3–5 days)";

  return wooFetch<WooOrder>("/orders", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify({
      payment_method: "cod",
      payment_method_title: "Paid on Global Fruits checkout",
      set_paid: false,
      status: "processing",
      billing: {
        first_name: input.firstName,
        last_name: input.lastName,
        address_1: input.address,
        city: input.city,
        postcode: input.postcode,
        country: input.country ?? "US",
        email: input.email,
      },
      shipping: {
        first_name: input.firstName,
        last_name: input.lastName,
        address_1: input.address,
        city: input.city,
        postcode: input.postcode,
        country: input.country ?? "US",
      },
      line_items: input.lineItems,
      shipping_lines: [
        {
          method_id: input.shippingMethod,
          method_title: shippingTitle,
          total: input.shippingTotal.toFixed(2),
        },
      ],
      meta_data: [
        ...(input.clerkUserId
          ? [{ key: "clerk_user_id", value: input.clerkUserId }]
          : []),
        { key: "source", value: "global-fruits-next" },
      ],
    }),
  });
}
