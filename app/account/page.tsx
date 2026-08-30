"use client";

import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { useAuth } from "@/hooks/auth";
import { PageShell } from "@/components/shop/PageShell";

const demoOrders = [
  {
    id: "LG-48291033",
    date: "Mar 12, 2026",
    status: "Delivered",
    total: "$148",
  },
  {
    id: "LG-39120488",
    date: "Feb 3, 2026",
    status: "Shipped",
    total: "$68",
  },
];

export default function AccountPage() {
  const { isLoaded, isSignedIn, user, logout } = useAuth();

  return (
    <PageShell
      eyebrow="Account"
      title="Your account"
      description="Profile, orders, and saved preferences."
    >
      {!isLoaded ? (
        <div className="h-40 animate-pulse rounded-[24px] bg-surface/70" />
      ) : !isSignedIn ? (
        <div className="rounded-[24px] border border-black/8 bg-surface p-8 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
          <h2 className="text-[22px] font-medium text-[#1a1a1a]">
            Sign in to continue
          </h2>
          <p className="mt-3 text-[15px] text-[#1a1a1a]/60">
            Access order history, wishlist sync, and faster checkout.
          </p>
          <CtaButton href="/auth" className="mt-8">
            Sign in / Sign up
          </CtaButton>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <section className="h-fit rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">Profile</h2>
            <p className="mt-4 text-[15px] text-[#1a1a1a]/70">
              {user?.fullName || "La Gracia member"}
            </p>
            <p className="mt-1 text-[14px] text-[#1a1a1a]/50">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/wishlist"
                className="rounded-full border border-black/12 px-4 py-3 text-center text-[14px] font-medium text-[#1a1a1a] hover:bg-black/[0.03]"
              >
                Wishlist
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full border border-black/12 px-4 py-3 text-[14px] font-medium text-[#1a1a1a] hover:bg-black/[0.03]"
              >
                Sign out
              </button>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">
              Order history
            </h2>
            <ul className="mt-5 divide-y divide-black/8">
              {demoOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="text-[15px] font-medium text-[#1a1a1a]">
                      {order.id}
                    </p>
                    <p className="mt-1 text-[13px] text-[#1a1a1a]/50">
                      {order.date} · {order.status}
                    </p>
                  </div>
                  <p className="text-[15px] text-[#1a1a1a]">{order.total}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </PageShell>
  );
}
