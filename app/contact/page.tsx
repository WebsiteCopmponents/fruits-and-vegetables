import CtaButton from "@/components/CtaButton";

export default function ContactPage() {
  return (
    <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div>
          <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
            Get in touch
          </p>
          <h1 className="mt-3 text-[36px] font-medium tracking-tight text-[#1a1a1a] md:text-[44px]">
            Contact
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#1a1a1a]/70">
            Questions about an order, a tote, or something else? Send us a note —
            we usually reply within 1–2 business days.
          </p>

          <div className="mt-10 space-y-4 text-[15px] text-[#1a1a1a]/75">
            <p>
              <span className="font-medium text-[#1a1a1a]">Email</span>
              <br />
              hello@lagracia.com
            </p>
            <p>
              <span className="font-medium text-[#1a1a1a]">Hours</span>
              <br />
              Mon–Fri, 9am–6pm
            </p>
          </div>
        </div>

        <form className="space-y-5 rounded-[24px] border border-black/8 bg-surface/80 p-6 shadow-[0_16px_40px_rgba(26,26,26,0.04)] md:p-8">
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-[#1a1a1a]/70">
              Name
            </span>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40 focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-[#1a1a1a]/70">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40 focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-[#1a1a1a]/70">
              Message
            </span>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full resize-y rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40 focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]"
            />
          </label>

          <CtaButton type="submit" className="w-full justify-between">
            Send message
          </CtaButton>
        </form>
      </div>
    </main>
  );
}
