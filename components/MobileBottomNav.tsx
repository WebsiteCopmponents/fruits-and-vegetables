"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShopStore } from "@/lib/shop-store";

const tabs = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/shop",
    label: "Shop",
    match: (path: string) => path === "/shop" || path.startsWith("/shop/"),
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    match: (path: string) => path === "/wishlist",
  },
  {
    href: "/account",
    label: "Account",
    match: (path: string) => path === "/account",
  },
] as const;

/** Mobile app-style floating tab bar. Desktop: hidden. */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlist } = useShopStore();
  const wishCount = wishlist.length;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[75] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-[1.75rem] border border-black/6 bg-white/95 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-md"
      >
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const isWish = tab.href === "/wishlist";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 transition-colors ${
                active
                  ? "bg-black text-white rounded-full"
                  : "text-[#1a1a1a]/55 hover:text-[#1a1a1a]"
              }`}
            >
              <span className="relative">
                <TabIcon name={tab.label} active={active} />
                {isWish && wishCount > 0 ? (
                  <span
                    className={`absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      active
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                ) : null}
              </span>
              <span className="truncate text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 2 : 1.6;

  if (name === "Home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.2 : 0}
        />
      </svg>
    );
  }

  if (name === "Shop") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 8h16l-1.2 11.5a1.5 1.5 0 0 1-1.5 1.5H6.7a1.5 1.5 0 0 1-1.5-1.5L4 8z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <path
          d="M8 8V6.5A4 4 0 0 1 12 2.5 4 4 0 0 1 16 6.5V8"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "Wishlist") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20s-7-4.4-9.5-8.2C.7 9.2 1.5 5.8 4.4 4.6c1.8-.7 3.8-.2 5.1 1.2L12 8l2.5-2.2c1.3-1.4 3.3-1.9 5.1-1.2 2.9 1.2 3.7 4.6 1.9 7.2C19 15.6 12 20 12 20z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth={stroke} />
      <path
        d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
