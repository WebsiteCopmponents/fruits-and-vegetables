import { NextResponse } from "next/server";
import { isWooConfigured } from "@/lib/woo";
import { isWpConfigured } from "@/lib/wordpress";
import { getCatalog } from "@/lib/products";
import { getBlogPosts } from "@/lib/blogs";

export const dynamic = "force-dynamic";

/** Quick connection check — no secrets returned. */
export async function GET() {
  const wooConfigured = isWooConfigured();
  const wpConfigured = isWpConfigured();

  let products = {
    ok: false as boolean,
    count: 0,
    sample: null as null | { id: number; slug: string; name: string },
    error: null as string | null,
  };

  let posts = {
    ok: false as boolean,
    count: 0,
    error: null as string | null,
  };

  if (wooConfigured) {
    try {
      const catalog = await getCatalog();
      products = {
        ok: catalog.source === "woo",
        count: catalog.products.length,
        sample: catalog.products[0]
          ? {
              id: catalog.products[0].id,
              slug: catalog.products[0].slug,
              name: catalog.products[0].name,
            }
          : null,
        error: null,
      };
    } catch (err) {
      products.error = err instanceof Error ? err.message : "Woo fetch failed";
    }
  }

  if (wpConfigured) {
    try {
      const list = await getBlogPosts(5);
      posts = { ok: true, count: list.length, error: null };
    } catch (err) {
      posts.error = err instanceof Error ? err.message : "WP fetch failed";
    }
  }

  return NextResponse.json({
    woo: { configured: wooConfigured, ...products },
    wordpress: { configured: wpConfigured, ...posts },
  });
}
