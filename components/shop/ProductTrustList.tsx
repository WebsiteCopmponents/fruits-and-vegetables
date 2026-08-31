import { Award, Headphones, Package, Truck, type LucideIcon } from "lucide-react";

const points: { icon: LucideIcon; text: string }[] = [
  {
    icon: Truck,
    text: "In stock! Packed same day — Edinburgh delivery in 1–2 days.",
  },
  {
    icon: Headphones,
    text: "Questions? Call the shop on 0131 228 4429",
  },
  {
    icon: Award,
    text: "100% freshness guarantee on delivery",
  },
  {
    icon: Package,
    text: "Home delivery across Edinburgh — free over £15",
  },
];

export default function ProductTrustList({ className = "" }: { className?: string }) {
  return (
    <ul className={`rounded-2xl bg-[#EFEFEF] p-2 ${className}`}>
      {points.map(({ icon: Icon, text }, i) => (
        <li
          key={text}
          className={`flex items-center gap-4 px-4 py-3.5 text-[14px] leading-snug text-[#1a1a1a] ${
            i % 2 === 0 ? "rounded-xl bg-white" : ""
          }`}
        >
          <Icon
            className="size-5 shrink-0 text-[#1a1a1a]"
            strokeWidth={1.5}
            aria-hidden
          />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
