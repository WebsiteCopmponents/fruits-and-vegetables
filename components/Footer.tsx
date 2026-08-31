import Image from "next/image";
import Link from "next/link";
import { PaymentIcons } from "@/components/PaymentIcons";
import { getMegaMenuCategories } from "@/lib/mega-menu";

const storeLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/search", label: "Search" },
  { href: "/account", label: "Account" },
];

const instagramPosts = [
  {
    src: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400&q=80",
    alt: "Fresh apples",
  },
  {
    src: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80",
    alt: "Fresh carrots",
  },
  {
    src: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80",
    alt: "Fresh strawberries",
  },
];

export default async function Footer() {
  const shopGroups = await getMegaMenuCategories();

  const collectionLinks = [
    { href: "/shop", label: "Shop All" },
    ...shopGroups.flatMap((group) => [
      { href: group.href, label: group.label },
      ...group.children.map((child) => ({
        href: child.href,
        label: child.label,
      })),
    ]),
  ].slice(0, 6);

  return (
    <footer className="relative z-10 mt-auto w-full bg-black text-white">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6">
        {/* Newsletter */}
        <div className="grid gap-8 border-b border-white/10 py-12 md:grid-cols-2 md:items-center md:gap-12 md:py-14">
          <h2 className="max-w-md text-[28px] leading-[1.15] font-medium tracking-tight md:text-[36px]">
            Subscribe for updates, tips & exclusive offers
          </h2>

          <div className="w-full md:justify-self-end md:max-w-md">
            <form className="relative">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-full border-0 bg-white py-3.5 pr-14 pl-5 text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40 focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
              >
                <ArrowIcon />
              </button>
            </form>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              By subscribing you agree to receive updates from Global Fruits.
            </p>
          </div>
        </div>

        {/* Link columns + Instagram — Instagram column is wider */}
        <div className="flex flex-col gap-10 border-b border-white/10 py-12 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-1 flex-wrap gap-10 sm:gap-12 lg:gap-14">
            <FooterColumn title="Shop" links={collectionLinks} />
            <FooterColumn title="Store" links={storeLinks} />
          </div>

          <div className="w-full shrink-0 lg:w-[min(100%,580px)] lg:max-w-[62%]">
            <p className="mb-4 text-[15px] font-medium">Follow Us on Instagram</p>
            <div className="flex gap-2.5">
              {instagramPosts.map((post) => (
                <a
                  key={post.src}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-xl bg-white/10"
                >
                  <Image
                    src={post.src}
                    alt={post.alt}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </a>
              ))}
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[13px] text-white/70 transition-colors hover:text-white"
            >
              @globalfruitsedinburgh
            </a>
          </div>
        </div>

        {/* Social + legal */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <SocialButton label="X">
              <XIcon />
            </SocialButton>
            <SocialButton label="Instagram">
              <InstagramIcon />
            </SocialButton>
            <SocialButton label="TikTok">
              <TikTokIcon />
            </SocialButton>
            <SocialButton label="Pinterest">
              <PinterestIcon />
            </SocialButton>
          </div>

          <p className="text-[13px] text-white/65">
            Fruit, vegetables, exotic spices, and home deliveries in Edinburgh.
          </p>
        </div>

        {/* Copyright + payments */}
        <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/50">
            © 2026 Global Fruits Edinburgh Ltd. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-white/80"
              aria-label="Currency and language"
            >
              <span aria-hidden>🇺🇸</span>
              GBP / EN
              <ChevronIcon />
            </button>

            <PaymentIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="min-w-[140px] flex-1 basis-[140px]">
      <p className="mb-4 text-[15px] font-medium">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-[14px] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-xl bg-[#1a1a1a] text-white transition-colors hover:bg-[#2a2a2a]"
    >
      {children}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.4l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.6 7.3a5.8 5.8 0 0 1-3.4-1.1v7.2a5.5 5.5 0 1 1-4.7-5.4v2.5a3 3 0 1 0 2.1 2.9V2.5h2.4c.3 1.6 1.5 3 3.1 3.5v1.3z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6.1 9-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.3.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.8-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2-.5-2.4-1.2l-.7 2.5c-.2.9-.9 2-1.3 2.7.9.3 1.9.4 2.9.4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}
