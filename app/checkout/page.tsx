"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import CtaButton from "@/components/CtaButton";
import { EmptyState, PageShell } from "@/components/shop/PageShell";
import { formatPrice } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";
import { useAuth } from "@/hooks/auth";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { alertFailure, alertProgress, alertSuccess } from "@/lib/alert";

const shippingOptions = [
  { id: "standard", label: "Standard (3–5 days)", price: 0 },
  { id: "express", label: "Express (1–2 days)", price: 12 },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isOffline, isSlow } = useConnectionStatus();
  const { cart, cartProducts, cartTotal, cartCount, clearCart } = useShopStore();
  const [shipping, setShipping] =
    useState<(typeof shippingOptions)[number]["id"]>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shipCost =
    shippingOptions.find((s) => s.id === shipping)?.price ?? 0;

  const defaultEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isOffline || !navigator.onLine) {
      const msg =
        "You’re offline. Connect to the internet to place your order.";
      setError(msg);
      alertFailure(msg);
      return;
    }

    setSubmitting(true);
    alertProgress("Placing your order…");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") || ""),
          firstName: String(form.get("firstName") || ""),
          lastName: String(form.get("lastName") || ""),
          address: String(form.get("address") || ""),
          city: String(form.get("city") || ""),
          postcode: String(form.get("postcode") || ""),
          shippingMethod: shipping,
          items: cart.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = (await res.json()) as { orderId?: string; error?: string };
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "Could not place order");
      }
      alertSuccess(`Order #${data.orderId} placed successfully`);
      clearCart({ silent: true });
      router.push(`/order/confirmation?order=${encodeURIComponent(data.orderId)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not place order";
      setError(msg);
      alertFailure(msg);
      setSubmitting(false);
    }
  }

  if (cartCount === 0) {
    return (
      <PageShell eyebrow="Checkout" title="Checkout">
        <EmptyState
          title="Nothing to checkout"
          body="Add a tote to your cart first."
          href="/shop"
          cta="Shop totes"
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Checkout"
      title="Checkout"
      description="Enter your details to complete the order."
    >
      <form
        onSubmit={onSubmit}
        className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]"
      >
        <div className="space-y-6">
          <section className="rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">
              Contact
            </h2>
            <label className="mt-4 block">
              <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                Email
              </span>
              <input
                required
                name="email"
                type="email"
                defaultValue={defaultEmail}
                className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
              />
            </label>
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">
              Shipping address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                  First name
                </span>
                <input
                  required
                  name="firstName"
                  defaultValue={user?.firstName || ""}
                  className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                  Last name
                </span>
                <input
                  required
                  name="lastName"
                  defaultValue={user?.lastName || ""}
                  className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                  Address
                </span>
                <input
                  required
                  name="address"
                  className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                  City
                </span>
                <input
                  required
                  name="city"
                  className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] text-[#1a1a1a]/70">
                  Postal code
                </span>
                <input
                  required
                  name="postcode"
                  className="w-full rounded-xl border border-black/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">
              Shipping method
            </h2>
            <div className="mt-4 space-y-3">
              {shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3.5 ${
                    shipping === opt.id
                      ? "border-primary bg-primary/5"
                      : "border-black/10"
                  }`}
                >
                  <span className="flex items-center gap-3 text-[15px] text-[#1a1a1a]">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)}
                      className="accent-primary"
                    />
                    {opt.label}
                  </span>
                  <span className="text-[14px] text-[#1a1a1a]/70">
                    {opt.price === 0 ? "Free" : formatPrice(opt.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">Payment</h2>
            <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
              Order is created in WooCommerce as processing. Collect payment in
              WP Admin or connect a payment gateway next.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
          <h2 className="text-[18px] font-medium text-[#1a1a1a]">Order</h2>
          <ul className="mt-4 space-y-3">
            {cartProducts.map(({ product, qty }) => (
              <li
                key={product.slug}
                className="flex justify-between gap-3 text-[14px] text-[#1a1a1a]/75"
              >
                <span>
                  {product.name} × {qty}
                </span>
                <span>{formatPrice(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-black/8 pt-4 text-[15px]">
            <div className="flex justify-between text-[#1a1a1a]/70">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-[#1a1a1a]/70">
              <span>Shipping</span>
              <span>{shipCost === 0 ? "Free" : formatPrice(shipCost)}</span>
            </div>
            <div className="flex justify-between font-medium text-[#1a1a1a]">
              <span>Total</span>
              <span>{formatPrice(cartTotal + shipCost)}</span>
            </div>
          </div>
          {isOffline ? (
            <p className="mt-4 text-[13px] text-red-600">
              You’re offline — checkout needs a connection.
            </p>
          ) : isSlow ? (
            <p className="mt-4 text-[13px] text-[#8a6a1a]">
              Slow connection detected. Placing the order may take longer —
              please wait for confirmation.
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 text-[13px] text-red-600">{error}</p>
          ) : null}
          <CtaButton
            type="submit"
            disabled={submitting || isOffline}
            className="mt-6 w-full justify-between"
          >
            {submitting ? "Placing order…" : "Place order"}
          </CtaButton>
          <Link
            href="/cart"
            className="mt-3 flex justify-center text-[14px] text-accent hover:opacity-70"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}
