import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { homeContainerClass } from "@/components/home/homeLayout";

const items = [
  {
    href: "/shop/strawberries",
    name: "Strawberries",
    price: "£3.20",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh strawberries",
    tone: "bg-[#c4b4a4]",
  },
  {
    href: "/shop/scottish-carrots",
    name: "Carrots",
    price: "£1.20",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh carrots",
    tone: "bg-[#8a9484]",
  },
] as const;

export default function HomeHotItem() {
  const [left, right] = items;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className={homeContainerClass}>
        <div className="grid items-start gap-10 lg:grid-cols-3 lg:gap-8 xl:gap-12">
          <HotCard item={left} className="lg:order-1" />

          <div className="order-first flex flex-col items-center px-2 text-center lg:order-2 lg:pt-16 xl:pt-24">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-[#1a1a1a] uppercase">
              Hot Item
            </p>
            <h2 className="mt-5 max-w-[16ch] text-[32px] leading-[1.15] font-medium tracking-tight text-[#1a1a1a] md:text-[40px] lg:text-[44px]">
              Fresh fruit and veg, priced for Edinburgh.
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#1a1a1a]/70">
              Strawberries, carrots, and more from the crates — greengrocer
              prices in GBP.
            </p>
            <CtaButton href="/shop" className="mt-8">
              Shop Now
            </CtaButton>
          </div>

          <HotCard item={right} className="lg:order-3 lg:mt-20 xl:mt-28" />
        </div>
      </div>
    </section>
  );
}

function HotCard({
  item,
  className = "",
}: {
  item: (typeof items)[number];
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative block overflow-hidden rounded-[2rem] ${item.tone} ${className}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width:1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/20 p-2.5 backdrop-blur-md sm:gap-3.5 sm:p-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white/30 sm:size-14">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-white sm:text-[15px]">
                {item.name}
              </p>
              <p className="mt-0.5 text-[13px] text-white/85">{item.price}</p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#1a1a1a] transition-opacity group-hover:opacity-90">
              Shop
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
