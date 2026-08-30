"use client";

import Link from "next/link";
import { homeContainerClass } from "@/components/home/homeLayout";
import { MotionAccordion } from "@/components/MotionAccordion";
import { faqItems } from "@/lib/faqs";

export default function HomeFaqs() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div
        className={`grid gap-10 py-16 md:grid-cols-[0.9fr_1.2fr] md:gap-16 md:py-24 ${homeContainerClass}`}
      >
        <div>
          <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
            Help
          </p>
          <h2 className="mt-3 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
            FAQs
          </h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-[#1a1a1a]/65">
            Quick answers on materials, shipping, returns, and care — so you can
            choose with confidence.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex text-[14px] font-medium text-accent transition-opacity hover:opacity-70"
          >
            Still have a question? Contact us →
          </Link>
        </div>

        <MotionAccordion
          items={faqItems.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))}
          defaultOpenIndex={0}
          gap={12}
        />
      </div>
    </section>
  );
}
