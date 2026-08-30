"use client";

import { useEffect, useState } from "react";
import CtaButton from "@/components/CtaButton";
import { useAuth } from "@/hooks/auth";
import { PageShell } from "@/components/shop/PageShell";

type OrderRow = {
  id: string;
  date: string;
  status: string;
  total: string;
  items: string;
};

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch("/api/orders");
        const data = (await res.json()) as {
          orders?: OrderRow[];
          message?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Failed to load orders");
        if (!cancelled) {
          setOrders(data.orders ?? []);
          setMessage(data.message ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  return (
    <PageShell
      eyebrow="Orders"
      title="Your orders"
      description="Track and review past tote purchases."
    >
      {!isLoaded ? (
        <div className="h-40 animate-pulse rounded-[24px] bg-surface/70" />
      ) : !isSignedIn ? (
        <div className="rounded-[24px] border border-black/8 bg-surface p-8 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
          <h2 className="text-[22px] font-medium text-[#1a1a1a]">
            Sign in to view orders
          </h2>
          <p className="mt-3 text-[15px] text-[#1a1a1a]/60">
            Order history is available after you sign in.
          </p>
          <CtaButton href="/auth" className="mt-8">
            Sign in
          </CtaButton>
        </div>
      ) : loading ? (
        <div className="h-40 animate-pulse rounded-[24px] bg-surface/70" />
      ) : error ? (
        <p className="text-[15px] text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-[24px] border border-black/8 bg-surface p-8 text-center shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
          <h2 className="text-[22px] font-medium text-[#1a1a1a]">No orders yet</h2>
          <p className="mt-3 text-[15px] text-[#1a1a1a]/60">
            {message || "When you place an order, it will show up here from WooCommerce."}
          </p>
          <CtaButton href="/shop" className="mt-8">
            Shop totes
          </CtaButton>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[22px] border border-black/8 bg-surface p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium text-[#1a1a1a]">
                    #{order.id}
                  </p>
                  <p className="mt-1 text-[13px] text-[#1a1a1a]/50">
                    {order.date} · {order.items}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-medium text-[#1a1a1a]">
                    {order.total}
                  </p>
                  <p className="mt-1 text-[13px] text-accent">
                    {order.status}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
