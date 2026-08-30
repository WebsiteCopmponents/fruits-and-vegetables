import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link
          href="/blogs"
          className="text-[14px] font-medium text-accent hover:opacity-70"
        >
          ← Back to blogs
        </Link>

        <p className="mt-6 text-[13px] tracking-wide text-[#1a1a1a]/45">
          {dateLabel}
        </p>
        <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[42px]">
          {post.title}
        </h1>

        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[24px] bg-soft">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width:768px) 100vw, 672px"
            className="object-cover"
          />
        </div>

        <div
          className="blog-content mt-10 text-[17px] leading-relaxed text-[#1a1a1a]/75 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-[24px] [&_h2]:font-medium [&_h2]:text-[#1a1a1a] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[20px] [&_h3]:font-medium [&_h3]:text-[#1a1a1a] [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_img]:my-6 [&_img]:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
