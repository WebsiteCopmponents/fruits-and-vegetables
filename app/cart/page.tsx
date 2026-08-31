"use client";

import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { EmptyState, PageShell } from "@/components/shop/PageShell";
import { formatPrice } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

export default function CartPage() {
  const { cartProducts, cartTotal, setQty, removeFromCart, cartCount } =
    useShopStore();

  return (
    <PageShell
      eyebrow="Cart"
      title="Cart"
      description="Review your produce before checkout."
    >
      {cartCount === 0 ? (
        <EmptyState
          title="Your cart is empty"
          body="Browse the shop and add produce when you’re ready."
          href="/shop"
          cta="Shop produce"
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            {cartProducts.map(({ product, qty }) => (
              <div
                key={product.slug}
                className="flex gap-4 rounded-[22px] border border-black/8 bg-surface p-4 shadow-[0_12px_32px_rgba(26,26,26,0.04)]"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-soft sm:size-28"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="text-[16px] font-medium text-[#1a1a1a] hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-[14px] text-[#1a1a1a]/55">
                      {product.collection}
                    </p>
                    <p className="mt-2 text-[15px] text-[#1a1a1a]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-black/12">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQty(product.slug, qty - 1)}
                        className="flex size-9 items-center justify-center text-[#1a1a1a]"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-[14px]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQty(product.slug, qty + 1)}
                        className="flex size-9 items-center justify-center text-[#1a1a1a]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.slug)}
                      className="text-[13px] text-[#1a1a1a]/50 underline underline-offset-2 hover:text-[#1a1a1a]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="hidden text-[15px] font-medium text-[#1a1a1a] sm:block">
                  {formatPrice(product.price * qty)}
                </p>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)]">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">Summary</h2>
            <div className="mt-5 space-y-3 text-[15px]">
              <div className="flex justify-between text-[#1a1a1a]/70">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[#1a1a1a]/70">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-black/8 pt-3 text-[16px] font-medium text-[#1a1a1a]">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <CtaButton href="/checkout" className="mt-6 w-full justify-between">
              Checkout
            </CtaButton>
            <Link
              href="/shop"
              className="mt-3 flex h-11 w-full items-center justify-center text-[14px] font-medium text-accent hover:opacity-70"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
