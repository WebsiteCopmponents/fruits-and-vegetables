"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import CtaButton from "@/components/CtaButton";
import {
  AmexIcon,
  ApplePayIcon,
  CashPayIcon,
  GooglePayIcon,
  MastercardIcon,
  PaypalIcon,
  VisaIcon,
} from "@/components/PaymentIcons";
import { EmptyState, PageShell } from "@/components/shop/PageShell";
import { BUSINESS } from "@/lib/business";
import { formatPrice } from "@/lib/products";
import { useShopStore } from "@/lib/shop-store";

type PayMethod = "card" | "paypal" | "apple" | "google" | "delivery";
type Fulfillment = "delivery" | "collect";

const DELIVERY_THRESHOLD = 15;
const DELIVERY_FEE = 2.5;

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutClient() {
  const { cartProducts, cartCount, cartTotal, clearCart, ready } =
    useShopStore();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [method, setMethod] = useState<PayMethod>("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Edinburgh");
  const [postcode, setPostcode] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<
    { name: string; qty: number; price: number; image: string }[]
  >([]);
  const [placedTotal, setPlacedTotal] = useState(0);

  const shipping = useMemo(() => {
    if (fulfillment === "collect") return 0;
    return cartTotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  }, [cartTotal, fulfillment]);

  const total = cartTotal + shipping;

  function validate() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return "Add your name, email, and phone.";
    }
    if (fulfillment === "delivery" && (!address.trim() || !postcode.trim())) {
      return "Add a delivery address and postcode.";
    }
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        return "Enter a 16-digit card number. Try 4242 4242 4242 4242.";
      }
      if (expiry.length < 5) return "Enter a card expiry (MM/YY).";
      if (cvc.length < 3) return "Enter a 3-digit CVC.";
      if (!cardName.trim()) return "Enter the name on the card.";
    }
    return null;
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    const issue = validate();
    if (issue) {
      setError(issue);
      return;
    }
    setError(null);
    setPaying(true);
    const snapshot = cartProducts.map(({ product, qty }) => ({
      name: product.name,
      qty,
      price: product.price,
      image: product.image,
    }));
    const snapshotTotal = total;
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    const id = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedItems(snapshot);
    setPlacedTotal(snapshotTotal);
    setOrderId(id);
    clearCart({ silent: true });
    setPaying(false);
  }

  if (!ready) {
    return (
      <PageShell eyebrow="Checkout" title="Checkout">
        <div className="h-40 animate-pulse rounded-[24px] bg-black/5" />
      </PageShell>
    );
  }

  if (orderId) {
    return (
      <PageShell
        eyebrow="Order placed"
        title="Thanks — we’ve got it"
        description="This was a demo checkout. No card was charged."
      >
        <div className="mx-auto max-w-xl rounded-[24px] border border-black/8 bg-surface p-6 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-8">
          <p className="text-[13px] tracking-[0.14em] text-accent uppercase">
            Order {orderId}
          </p>
          <ul className="mt-6 space-y-4">
            {placedItems.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <div className="relative size-14 overflow-hidden rounded-2xl bg-[#f3f3f3]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-[#1a1a1a]">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-[#1a1a1a]/50">×{item.qty}</p>
                </div>
                <p className="text-[14px] font-medium">
                  {formatPrice(item.price * item.qty)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-black/8 pt-4 text-[16px] font-medium">
            <span>Paid</span>
            <span>{formatPrice(placedTotal)}</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton href="/shop" className="justify-between sm:flex-1">
              Shop more
            </CtaButton>
            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-full border border-black/12 px-6 text-[14px] font-medium text-[#1a1a1a]"
            >
              Back home
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (cartCount === 0) {
    return (
      <PageShell
        eyebrow="Checkout"
        title="Checkout"
        description="Add produce first, then come back to pay."
      >
        <EmptyState
          title="Your cart is empty"
          body="Browse the shop and add fruit or veg before checkout."
          href="/shop"
          cta="Shop produce"
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Checkout"
      title="Secure checkout"
      description="Demo payment only — nothing is charged. Edinburgh delivery from Gillespie Place."
    >
      <form
        onSubmit={pay}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="space-y-6">
          <section className="rounded-[24px] border border-black/8 bg-surface p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-6">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">Contact</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
                className="sm:col-span-2"
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <Field
                label="Phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                placeholder={BUSINESS.phoneDisplay}
              />
            </div>
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-6">
            <h2 className="text-[18px] font-medium text-[#1a1a1a]">
              Delivery
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Choice
                active={fulfillment === "delivery"}
                title="Home delivery"
                body="Edinburgh, 1–2 days"
                onClick={() => setFulfillment("delivery")}
              />
              <Choice
                active={fulfillment === "collect"}
                title="Collect in shop"
                body={BUSINESS.addressLine}
                onClick={() => setFulfillment("collect")}
              />
            </div>
            {fulfillment === "delivery" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Address"
                  value={address}
                  onChange={setAddress}
                  autoComplete="street-address"
                  className="sm:col-span-2"
                  placeholder="Street and number"
                />
                <Field
                  label="City"
                  value={city}
                  onChange={setCity}
                  autoComplete="address-level2"
                />
                <Field
                  label="Postcode"
                  value={postcode}
                  onChange={setPostcode}
                  autoComplete="postal-code"
                  placeholder="EH10 4HS"
                />
              </div>
            ) : (
              <p className="mt-4 text-[14px] leading-relaxed text-[#1a1a1a]/60">
                Collect from {BUSINESS.address}. Open from 8am. Call{" "}
                {BUSINESS.phoneDisplay} if you need to check.
              </p>
            )}
          </section>

          <section className="rounded-[24px] border border-black/8 bg-surface p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)] md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-medium text-[#1a1a1a]">
                Payment
              </h2>
              <p className="text-[12px] text-[#1a1a1a]/45">Demo · not charged</p>
            </div>

            <div className="mt-4 grid gap-2">
              <PayChoice
                active={method === "card"}
                title="Card"
                body="Visa, Mastercard, Amex"
                onClick={() => setMethod("card")}
                marks={
                  <>
                    <VisaIcon className={payMarkClass} />
                    <MastercardIcon className={payMarkClass} />
                    <AmexIcon className={payMarkClass} />
                  </>
                }
              />
              <PayChoice
                active={method === "paypal"}
                title="PayPal"
                body="Pay with your PayPal account"
                onClick={() => setMethod("paypal")}
                marks={<PaypalIcon className={payMarkClass} />}
              />
              <PayChoice
                active={method === "apple"}
                title="Apple Pay"
                body="Pay with Apple Pay"
                onClick={() => setMethod("apple")}
                marks={<ApplePayIcon className={payMarkClass} />}
              />
              <PayChoice
                active={method === "google"}
                title="Google Pay"
                body="Pay with Google Pay"
                onClick={() => setMethod("google")}
                marks={<GooglePayIcon className={payMarkClass} />}
              />
              <PayChoice
                active={method === "delivery"}
                title="Pay on delivery"
                body="Cash or card when we arrive"
                onClick={() => setMethod("delivery")}
                marks={<CashPayIcon className={payMarkClass} />}
              />
            </div>

            {method === "card" ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Name on card"
                  value={cardName}
                  onChange={setCardName}
                  autoComplete="cc-name"
                  className="sm:col-span-2"
                />
                <Field
                  label="Card number"
                  value={cardNumber}
                  onChange={(v) => setCardNumber(formatCardNumber(v))}
                  autoComplete="cc-number"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  className="sm:col-span-2"
                />
                <Field
                  label="Expiry"
                  value={expiry}
                  onChange={(v) => setExpiry(formatExpiry(v))}
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  placeholder="MM/YY"
                />
                <Field
                  label="CVC"
                  value={cvc}
                  onChange={(v) => setCvc(v.replace(/\D/g, "").slice(0, 4))}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  placeholder="123"
                />
              </div>
            ) : (
              <p className="mt-4 text-[14px] text-[#1a1a1a]/60">
                {method === "delivery"
                  ? "You’ll pay the driver. No card details needed here."
                  : "This is a demo. Confirming will place a sample order only."}
              </p>
            )}
          </section>
        </div>

        <aside className="rounded-[24px] border border-black/8 bg-surface p-5 shadow-[0_12px_32px_rgba(26,26,26,0.04)] lg:sticky lg:top-28 md:p-6">
          <h2 className="text-[18px] font-medium text-[#1a1a1a]">Your order</h2>
          <ul className="mt-5 space-y-4">
            {cartProducts.map(({ product, qty }) => (
              <li key={product.slug} className="flex items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#f3f3f3]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover object-center h-full w-full rounded-2xl"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-[#1a1a1a]">
                    {product.name}
                  </p>
                  <p className="text-[13px] text-[#1a1a1a]/50">
                    {qty} × {formatPrice(product.price)}
                  </p>
                </div>
                <p className="text-[14px] font-medium text-[#1a1a1a]">
                  {formatPrice(product.price * qty)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-black/8 pt-4 text-[14px]">
            <Row label="Subtotal" value={formatPrice(cartTotal)} />
            <Row
              label={fulfillment === "collect" ? "Collection" : "Delivery"}
              value={
                shipping === 0
                  ? "Free"
                  : formatPrice(shipping)
              }
            />
            {fulfillment === "delivery" && cartTotal < DELIVERY_THRESHOLD ? (
              <p className="text-[12px] text-[#1a1a1a]/45">
                Free delivery over {formatPrice(DELIVERY_THRESHOLD)}.
              </p>
            ) : null}
            <div className="flex justify-between border-t border-black/8 pt-3 text-[16px] font-medium text-[#1a1a1a]">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {error ? (
            <p className="mt-4 text-[13px] text-[#b42318]">{error}</p>
          ) : null}

          <CtaButton
            type="submit"
            disabled={paying}
            className="mt-6 w-full justify-between"
          >
            {paying ? "Processing…" : `Pay ${formatPrice(total)}`}
          </CtaButton>
          <p className="mt-3 text-center text-[12px] leading-relaxed text-[#1a1a1a]/45">
            Dummy checkout for Global Fruits. No real payment is taken.
          </p>
        </aside>
      </form>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-[#1a1a1a]/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/30 focus:border-black/40"
      />
    </label>
  );
}

function Choice({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
        active
          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
          : "border-black/10 bg-white text-[#1a1a1a] hover:border-black/25"
      }`}
    >
      <p className="text-[14px] font-medium">{title}</p>
      <p className={`mt-0.5 text-[12px] ${active ? "text-white/70" : "text-[#1a1a1a]/50"}`}>
        {body}
      </p>
    </button>
  );
}

const payMarkClass =
  "h-6 w-auto overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10 sm:h-7";

function PayChoice({
  active,
  title,
  body,
  onClick,
  marks,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
  marks: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
        active
          ? "border-[#1a1a1a] bg-[#f7f7f7]"
          : "border-black/10 bg-white hover:border-black/25"
      }`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
          active ? "border-[#1a1a1a]" : "border-black/25"
        }`}
      >
        {active ? <span className="size-2 rounded-full bg-[#1a1a1a]" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-[#1a1a1a]">
          {title}
        </span>
        <span className="block text-[12px] text-[#1a1a1a]/50">{body}</span>
      </span>
      <span className="flex shrink-0 flex-wrap items-center justify-end gap-1" aria-hidden>
        {marks}
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#1a1a1a]/70">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
