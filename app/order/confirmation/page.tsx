import CtaButton from "@/components/CtaButton";
import { PageShell } from "@/components/shop/PageShell";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order || "LG-00000000";

  return (
    <PageShell eyebrow="Order" title="Thank you">
      <div className="mx-auto max-w-xl rounded-[24px] border border-black/8 bg-surface px-6 py-12 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:px-10">
        <p className="text-[14px] tracking-wide text-accent uppercase">
          Order confirmed
        </p>
        <h2 className="mt-3 text-[28px] font-medium tracking-tight text-[#1a1a1a]">
          Your tote is on the way
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#1a1a1a]/65">
          We’ve received your order. A confirmation email will arrive shortly.
        </p>
        <p className="mt-6 rounded-full bg-soft px-5 py-3 text-[15px] font-medium text-accent">
          Order number: {orderId}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CtaButton href="/account">View account</CtaButton>
          <CtaButton href="/shop">Continue shopping</CtaButton>
        </div>
      </div>
    </PageShell>
  );
}
