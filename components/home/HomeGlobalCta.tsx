import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import { homeContainerClass } from "@/components/home/homeLayout";

export default function HomeGlobalCta() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1800&q=80"
          alt="Global Fruits produce"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 animate-[cta-drift_18s_ease-in-out_infinite_alternate]"
          priority={false}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgb(var(--theme-primary-rgb) / 0.88)_0%,rgb(var(--theme-primary-rgb) / 0.55)_45%,rgb(var(--theme-primary-rgb) / 0.72)_100%)]" />
      </div>

      <div
        className={`relative flex min-h-[min(62vh,560px)] flex-col items-start justify-end py-16 md:py-20 ${homeContainerClass}`}
      >
        <p className="text-[13px] font-medium tracking-[0.22em] text-white/75 uppercase animate-[cta-rise_0.8s_ease-out_both]">
          Global Fruits
        </p>
        <h2 className="mt-4 max-w-xl text-[36px] leading-[1.1] font-medium tracking-tight text-white md:text-[48px] animate-[cta-rise_0.9s_ease-out_0.08s_both]">
          Fresh fruit, veg, and spices.
        </h2>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80 animate-[cta-rise_1s_ease-out_0.14s_both]">
          Everyday produce from Gillespie Place — plus exotic spices and home
          deliveries across Edinburgh.
        </p>
        <CtaButton
          href="/shop"
          className="mt-8 animate-[cta-rise_1.05s_ease-out_0.2s_both]"
        >
          Shop produce
        </CtaButton>
      </div>
    </section>
  );
}
