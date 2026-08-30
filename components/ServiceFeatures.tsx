import {
  CreditCard,
  MessageCircle,
  Package,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

const features: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Free delivery",
    body: "On orders over $85 in most regions.",
    icon: Package,
  },
  {
    title: "Free returns",
    body: "Up to 30 days to return your items.",
    icon: RotateCcw,
  },
  {
    title: "Payment 100% secured",
    body: "Multiple payment options offered.",
    icon: CreditCard,
  },
  {
    title: "Customer service",
    body: "Monday–Friday: 9AM–4PM",
    icon: MessageCircle,
  },
];

export default function ServiceFeatures() {
  return (
    <section className="relative z-10 border-t border-black/6 bg-[#F3F3F3]">
      <div className="mx-auto grid max-w-[1340px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:py-12">
        {features.map(({ title, body, icon: Icon }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <Icon
              className="size-9 text-[#1a1a1a]"
              strokeWidth={1.5}
              aria-hidden
            />
            <h3 className="mt-4 text-[15px]  tracking-tight text-[#1a1a1a]">
              {title}
            </h3>
            <p className="mt-1.5 max-w-[220px] text-[13px] leading-relaxed text-[#1a1a1a]/55">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
