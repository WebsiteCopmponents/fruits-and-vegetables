export default function AboutPage() {
  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
          Our story
        </p>
        <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
          About La Gracia
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-[#1a1a1a]/70">
          La Gracia is a tote bag brand made for everyday carry — work, market runs,
          weekend trips, and everything in between. We design bags that feel simple,
          last longer, and look considered without trying too hard.
        </p>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-[20px] font-medium text-[#1a1a1a]">What we believe</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#1a1a1a]/65">
              Good design should disappear into your day. Every tote is built with
              thoughtful proportions, durable materials, and details that hold up to
              real use — not just photoshoots.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-medium text-[#1a1a1a]">How we make them</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#1a1a1a]/65">
              From canvas to leather, we choose materials for feel and longevity.
              Small-batch production helps us stay careful with quality and keep
              each collection intentional.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-medium text-[#1a1a1a]">Made for movement</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#1a1a1a]/65">
              Whether you need a structured work tote or a soft weekend bag,
              La Gracia is here for the way you actually move through life.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
