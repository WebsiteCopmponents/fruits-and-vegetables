import Link from "next/link";
import type { Metadata } from "next";
import ContactOptions from "@/components/ContactOptions";
import CtaButton from "@/components/CtaButton";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Page not found · La Gracia",
  description: "This page doesn’t exist or may have moved.",
};

export default async function NotFound() {
  // Featured section for now — uses the normal product catalog
  const featured = (await getProducts()).slice(0, 4);

  return (
    <main className="relative flex flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgb(var(--theme-primary-rgb) / 0.08), transparent 42%), radial-gradient(circle at 80% 10%, rgb(var(--theme-primary-rgb) / 0.06), transparent 36%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[13px] font-medium tracking-[0.2em] text-accent uppercase">
            Error 404
          </p>

          <p
            className="mt-6 select-none text-[92px] leading-none font-medium tracking-tight text-accent/12 md:text-[140px]"
            aria-hidden
          >
            404
          </p>

          <h1 className="-mt-8 text-[34px] font-medium tracking-tight text-[#1a1a1a] md:-mt-12 md:text-[44px]">
            This page wandered off
          </h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#1a1a1a]/65">
            The link may be broken, or the page may have moved. Let’s get you
            back to something useful.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <CtaButton href="/" arrow="left">
              Back to home
            </CtaButton>
            <CtaButton href="/shop">Browse totes</CtaButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-[#1a1a1a]/55">
            <Link href="/blogs" className="hover:text-accent">
              Journal
            </Link>
            <span aria-hidden>·</span>
            <Link href="/contact" className="hover:text-accent">
              Contact
            </Link>
            <span aria-hidden>·</span>
            <Link href="/faqs" className="hover:text-accent">
              FAQs
            </Link>
          </div>
        </div>

        {featured.length > 0 ? (
          <section className="mx-auto mt-20 max-w-7xl border-t border-black/8 pt-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
                  Featured
                </p>
                <h2 className="mt-2 text-[26px] font-medium tracking-tight text-[#1a1a1a] md:text-[32px]">
                  Keep exploring
                </h2>
                <p className="mt-2 max-w-md text-[15px] text-[#1a1a1a]/60">
                  Everyday totes from the shop while we get you back on track.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-[14px] font-medium text-accent hover:opacity-70"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-16 max-w-3xl rounded-[24px] border border-black/8 bg-surface/80 px-6 py-8 text-left shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:px-8">
          <h2 className="text-[20px] font-medium tracking-tight text-[#1a1a1a]">
            Need a hand finding something?
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#1a1a1a]/60">
            Message us on WhatsApp or email — we’re happy to point you to the
            right tote.
          </p>
          <ContactOptions label="Reach the studio" />
        </section>
      </div>
    </main>
  );
}
