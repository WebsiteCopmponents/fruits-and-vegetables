import CtaButton from "@/components/CtaButton";
import { PageShell } from "@/components/shop/PageShell";

export default function AccountPage() {
  return (
    <PageShell
      eyebrow="Account"
      title="Coming soon"
      description="Accounts and order history aren’t available yet. You can still browse, save favorites, and use the demo checkout."
    >
      <div className="mx-auto max-w-xl rounded-[24px] border border-black/8 bg-surface px-6 py-12 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:px-10">
        <p className="text-[14px] tracking-wide text-accent uppercase">
          In the works
        </p>
        <h2 className="mt-3 text-[28px] font-medium tracking-tight text-[#1a1a1a]">
          Thanks for your patience
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#1a1a1a]/65">
          We’re putting the finishing touches on sign-in and checkout. In the
          meantime, explore the collection and keep items in your cart or
          wishlist.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CtaButton href="/shop">Browse shop</CtaButton>
          <CtaButton href="/">Back home</CtaButton>
        </div>
      </div>
    </PageShell>
  );
}
