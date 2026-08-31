import Image from "next/image";
import { getBlogPosts } from "@/lib/blogs";
import { homeContainerClass } from "@/components/home/homeLayout";

export default async function HomeBlogs() {
  const featured = (await getBlogPosts(3)).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-surface">
      <div className={`py-16 md:py-24 ${homeContainerClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
              Journal
            </p>
            <h2 className="mt-3 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
              Blogs
            </h2>
            <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#1a1a1a]/65">
              Season notes, storage tips, and what’s arriving at Gillespie Place.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {featured.map((post, i) => (
            <article
              key={post.slug}
              className="group block  rounded-[24px] border border-black/8 bg-surface/80 p-4 text-left shadow-[0_12px_32px_rgba(26,26,26,0.04)] "
              style={{
                animation: `cta-rise 0.85s ease-out ${0.06 * i}s both`,
              }}
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-soft">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-5 text-[20px] font-medium tracking-tight text-[#1a1a1a] transition-colors group-hover:text-accent">
                {post.title}
              </h3>
            
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
