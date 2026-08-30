import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
          Journal
        </p>
        <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
          Blogs
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#1a1a1a]/70">
          Stories, care guides, and carry tips from the La Gracia studio.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-[15px] text-[#1a1a1a]/55">
            No posts published yet. Add posts in WordPress and they will appear
            here.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group block overflow-hidden rounded-[24px] bg-surface shadow-[0_12px_32px_rgba(26,26,26,0.04)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-soft">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#1a1a1a]/60">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-[14px] font-medium text-accent">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
