"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  {
    id: "shipping",
    label: "Shipping",
    title: "Shipping",
    body: [
      "Orders ship within 1–2 business days. Standard delivery is typically 3–5 business days. Free shipping applies on qualifying orders.",
      "You’ll receive tracking as soon as your tote leaves the studio.",
    ],
  },
  {
    id: "returns",
    label: "Returns",
    title: "Returns",
    body: [
      "Unworn items may be returned within 30 days in original condition with tags attached.",
      "Start a return from your order confirmation email, or reach out via Contact and we’ll help.",
    ],
  },
  {
    id: "exchanges",
    label: "Exchanges",
    title: "Exchanges",
    body: [
      "Need a different size or color? Return the original and place a new order, or contact us for exchange options when stock allows.",
    ],
  },
  {
    id: "international",
    label: "International",
    title: "International orders",
    body: [
      "We ship to select countries. Duties and taxes may apply at delivery and are the buyer’s responsibility.",
      "International transit times vary by destination — typically 7–14 business days.",
    ],
  },
  {
    id: "damaged",
    label: "Damaged items",
    title: "Damaged or missing items",
    body: [
      "If something arrives damaged or incomplete, contact us within 7 days with your order number and photos.",
      "We’ll arrange a replacement or refund as quickly as possible.",
    ],
  },
] as const;

export default function ShippingReturnsPage() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5],
      },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium tracking-[0.18em] text-accent">
            Policy
          </p>
          <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
            Shipping & returns
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#1a1a1a]/70">
            How orders ship, and how returns work — jump to a section anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Left — table of contents */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="On this page"
              className="flex gap-6 overflow-x-auto border-b border-[#e5e7eb] pb-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-l lg:border-[#e5e7eb] lg:pb-0"
            >
              {sections.map((section) => {
                const isActive = active === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActive(section.id)}
                    className={`relative shrink-0 py-3 text-[15px] transition-colors lg:py-4 lg:pl-5 ${
                      isActive
                        ? "font-medium text-[#1a1a1a] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:-left-px lg:before:w-[2px] lg:before:bg-primary"
                        : "text-[#6b7280] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {section.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-8 hidden lg:block">
              <p className="text-[13px] text-[#9ca3af]">Need help?</p>
              <Link
                href="/contact"
                className="mt-2 inline-flex text-[14px] text-[#6b7280] transition-colors hover:text-accent"
              >
                Contact support →
              </Link>
            </div>
          </aside>

          {/* Right — content */}
          <div className="min-w-0">
            <div className="rounded-[24px] bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-10">
              <div className="divide-y divide-black/8">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 py-8 first:pt-0 last:pb-0"
                  >
                    <h2 className="text-[22px] font-medium tracking-tight text-[#1a1a1a] md:text-[24px]">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#1a1a1a]/70 md:text-[16px]">
                      {section.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-10 border-t border-dashed border-primary/25 pt-8">
                <p className="text-[15px] text-[#1a1a1a]/70">
                  Still have a question about an order?{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-accent underline underline-offset-2"
                  >
                    Get in touch
                  </Link>{" "}
                  or read the{" "}
                  <Link
                    href="/faqs"
                    className="font-medium text-accent underline underline-offset-2"
                  >
                    FAQs
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
