import CtaButton from "@/components/CtaButton";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  narrow,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div
        className={`mx-auto px-6 py-14 md:px-10 md:py-20 ${
          narrow ? "max-w-3xl" : "max-w-7xl"
        }`}
      >
        <div className={narrow ? "" : "max-w-2xl"}>
          {eyebrow ? (
            <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-[17px] leading-relaxed text-[#1a1a1a]/70">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-surface/80 px-6 py-14 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
      <h2 className="text-[22px] font-medium text-[#1a1a1a]">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#1a1a1a]/60">
        {body}
      </p>
      <CtaButton href={href} className="mt-8">
        {cta}
      </CtaButton>
    </div>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black/8 pt-8">
      <h2 className="text-[20px] font-medium text-[#1a1a1a]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#1a1a1a]/70">
        {children}
      </div>
    </section>
  );
}
