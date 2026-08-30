/**
 * WordPress REST client for public blog posts (no auth required).
 */

export type WpRendered = { rendered: string; protected?: boolean };

export type WpFeaturedMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

export type WpPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
};

function wpBaseUrl() {
  const raw = process.env.WP_URL || process.env.WOO_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function isWpConfigured() {
  return wpBaseUrl() !== null;
}

async function wpFetch<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
): Promise<T> {
  const base = wpBaseUrl();
  if (!base) {
    throw new Error("WordPress is not configured. Set WP_URL in .env.local.");
  }

  const url = new URL(`${base}/wp-json/wp/v2${path}`);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WP API ${res.status}: ${body.slice(0, 300) || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchWpPosts(params?: { perPage?: number; search?: string }) {
  return wpFetch<WpPost[]>("/posts", {
    per_page: params?.perPage ?? 20,
    status: "publish",
    _embed: "1",
    search: params?.search,
  });
}

export async function fetchWpPostBySlug(slug: string) {
  const list = await wpFetch<WpPost[]>("/posts", {
    slug,
    status: "publish",
    _embed: "1",
    per_page: 1,
  });
  return list[0] ?? null;
}
