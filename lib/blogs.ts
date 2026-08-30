import {
  fetchWpPostBySlug,
  fetchWpPosts,
  isWpConfigured,
  type WpPost,
} from "@/lib/wordpress";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80";

/** Demo posts when WP_URL is not set. */
export const demoBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-choose-the-right-tote",
    title: "How to choose the right tote",
    excerpt:
      "Canvas, leather, mini, or oversized — a simple guide for everyday carry.",
    content:
      "<p>Canvas, leather, mini, or oversized — a simple guide for everyday carry from the La Gracia studio.</p>",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    date: "2026-03-01",
  },
  {
    id: 2,
    slug: "care-tips-for-canvas-bags",
    title: "Care tips for canvas bags",
    excerpt: "Keep your tote looking fresh with a few easy maintenance habits.",
    content:
      "<p>Keep your tote looking fresh with a few easy maintenance habits.</p>",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    date: "2026-02-18",
  },
  {
    id: 3,
    slug: "packing-a-weekend-tote",
    title: "Packing a weekend tote",
    excerpt:
      "What actually fits — and what to leave behind — for short getaways.",
    content:
      "<p>What actually fits — and what to leave behind — for short getaways.</p>",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    date: "2026-02-02",
  },
  {
    id: 4,
    slug: "why-structure-matters",
    title: "Why structure matters",
    excerpt:
      "The difference between a bag that holds its shape and one that doesn’t.",
    content:
      "<p>The difference between a bag that holds its shape and one that doesn’t.</p>",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=80",
    date: "2026-01-20",
  },
];

/** @deprecated Prefer getBlogPosts() */
export const blogPosts = demoBlogPosts;

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(Number.parseInt(h, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html: string) {
  return decodeEntities(
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function featuredImage(post: WpPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url ||
    FALLBACK_IMAGE
  );
}

export function mapWpPost(post: WpPost): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    image: featuredImage(post),
    date: post.date,
  };
}

export async function getBlogPosts(limit = 20): Promise<BlogPost[]> {
  if (!isWpConfigured()) return demoBlogPosts.slice(0, limit);

  try {
    const posts = await fetchWpPosts({ perPage: limit });
    if (posts.length === 0) return [];
    return posts.map(mapWpPost);
  } catch (err) {
    console.error("[blogs]", err);
    return demoBlogPosts.slice(0, limit);
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (!isWpConfigured()) {
    return demoBlogPosts.find((p) => p.slug === slug);
  }

  try {
    const post = await fetchWpPostBySlug(slug);
    return post ? mapWpPost(post) : undefined;
  } catch (err) {
    console.error("[blogs]", err);
    return demoBlogPosts.find((p) => p.slug === slug);
  }
}

export { isWpConfigured };
