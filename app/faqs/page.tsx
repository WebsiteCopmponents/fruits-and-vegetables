"use client";

import ContactOptions from "@/components/ContactOptions";
import { MotionAccordion } from "@/components/MotionAccordion";
import { PageShell } from "@/components/shop/PageShell";
import { faqItems } from "@/lib/faqs";

export default function FaqsPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="FAQs"
      description="Quick answers on materials, shipping, returns, and care."
      narrow
    >
      <MotionAccordion
        items={faqItems.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
        defaultOpenIndex={0}
        gap={12}
      />

      <ContactOptions />
    </PageShell>
  );
}
