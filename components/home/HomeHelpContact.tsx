import ContactOptions from "@/components/ContactOptions";
import { homeContainerClass } from "@/components/home/homeLayout";

export default function HomeHelpContact() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className={homeContainerClass}>
        <div className="mx-auto max-w-3xl rounded-[24px] border border-black/8 bg-surface/80 px-6 py-8 text-left shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:px-8">
          <h2 className="text-[20px] font-medium tracking-tight text-[#1a1a1a]">
            Need a hand finding something?
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#1a1a1a]/60">
            Message us on WhatsApp or email — we’re happy to point you to the
            right fruit or veg.
          </p>
          <ContactOptions label="Reach the shop" />
        </div>
      </div>
    </section>
  );
}
