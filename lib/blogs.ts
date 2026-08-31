export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
};

export const demoBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "whats-in-season-this-week",
    title: "What’s in season this week",
    excerpt:
      "Fresh fruit and veg arriving daily at Gillespie Place — here’s what to pick up.",
    content:
      "<p>Fresh fruit and veg arriving daily at Gillespie Place — here’s what to pick up.</p>",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80",
    date: "2026-03-01",
  },
  {
    id: 2,
    slug: "how-to-store-fresh-produce",
    title: "How to store fresh produce",
    excerpt:
      "Simple fridge and counter tips so your fruit and veg last the week.",
    content:
      "<p>Simple fridge and counter tips so your fruit and veg last the week.</p>",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    date: "2026-02-18",
  },
  {
    id: 3,
    slug: "exotic-spices-from-the-shop",
    title: "Exotic spices from the shop",
    excerpt:
      "From everyday staples to harder-to-find spices — what we keep on the shelves.",
    content:
      "<p>From everyday staples to harder-to-find spices — what we keep on the shelves.</p>",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80",
    date: "2026-02-02",
  },
  {
    id: 4,
    slug: "home-deliveries-in-edinburgh",
    title: "Home deliveries in Edinburgh",
    excerpt:
      "Order a fruit and veg box for home — or find us on Deliveroo.",
    content:
      "<p>Order a fruit and veg box for home — or find us on Deliveroo.</p>",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    date: "2026-01-20",
  },
];

export const blogPosts = demoBlogPosts;

export async function getBlogPosts(limit = 20): Promise<BlogPost[]> {
  return demoBlogPosts.slice(0, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  return demoBlogPosts.find((p) => p.slug === slug);
}
