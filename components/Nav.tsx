"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import ShopMegaMenu from "@/components/ShopMegaMenu";
import AccountMenu from "@/components/AccountMenu";
import { isClerkConfigured } from "@/lib/clerk";
import { useSearchModalActions } from "@/lib/search-modal";
import { useShopStore } from "@/lib/shop-store";
import type { MegaMenuGroup } from "@/lib/mega-menu";
//file :- components/Nav.tsx
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop All", mega: true },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const { openSearch } = useSearchModalActions();
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [megaGroups, setMegaGroups] = useState<MegaMenuGroup[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
    setShopOpen(false);
    setMobileShopOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories?: MegaMenuGroup[] }) => {
        if (!cancelled) setMegaGroups(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setMegaGroups([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function openShop() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShopOpen(true);
  }

  function closeShop(delay = 120) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShopOpen(false), delay);
  }

  return (
    <div
      className={`sticky top-0 ${open ? "z-[90]" : "z-50"}`}
      onMouseLeave={() => closeShop(80)}
    >
      <header
        className={`relative border-b border-black/6 bg-white backdrop-blur-md ${
          open ? "z-[100]" : "z-50"
        }`}
      >
        <div
          className={`relative mx-auto grid h-16 max-w-[1340px] items-center gap-3 px-4 sm:px-6 md:h-20 lg:px-8 ${
            open
              ? "grid-cols-1 justify-items-end lg:grid-cols-[1fr_auto_1fr]"
              : "grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]"
          }`}
        >
          {/* Desktop: nav left */}
          <nav className="hidden items-center gap-7 justify-self-start lg:flex">
            {links.map((link) => {
              const active = isActive(link.href) || (link.mega && shopOpen);

              if (link.mega) {
                return (
                  <div
                    key={link.href}
                    className="relative py-6"
                    onMouseEnter={openShop}
                    onFocus={openShop}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 text-sm transition-colors ${
                        active
                          ? "text-black"
                          : "text-gray-800 hover:text-black"
                      }`}
                      aria-expanded={shopOpen}
                      aria-haspopup="true"
                      onClick={() => setShopOpen((v) => !v)}
                    >
                      {link.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden
                        className={`text-gray-400 transition-transform duration-300 ${
                          shopOpen ? "rotate-180 text-black" : "rotate-0"
                        }`}
                      >
                        <path
                          d="M2.5 4.5L6 8l3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-6 text-sm transition-colors ${
                    active
                      ? "text-black"
                      : "text-gray-800 hover:text-black"
                  }`}
                  onMouseEnter={() => closeShop(0)}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute bottom-4 left-0 h-0.5 w-full rounded-full bg-black" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Logo — centered on desktop, left on mobile */}
          <Link
            href="/"
            aria-label="La Gracia home"
            className={`${
              open ? "hidden lg:block" : "justify-self-start"
            } lg:justify-self-center`}
          >
            <Image
              src="/la-gracia-logo.png"
              alt="La Gracia"
              width={160}
              height={40}
              priority
              className="h-9 w-auto object-contain sm:h-10"
            />
          </Link>

          {/* Desktop: search + account + wishlist + cart */}
          <div className="relative z-20 hidden items-center justify-self-end gap-3 lg:flex">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShopOpen(false);
                openSearch();
              }}
              className="flex w-48 cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-left transition-colors hover:bg-gray-200/80 lg:w-64"
              aria-label="Search"
            >
              <span className="shrink-0 text-gray-500" aria-hidden>
                <SearchIcon size={16} />
              </span>
              <span className="truncate text-xs font-normal text-gray-500">
                What are you looking for?
              </span>
            </button>

            <DesktopAccount light />
            <WishlistButton light />
            <CartButton light />
          </div>

          {/* Mobile: our existing controls + drawer */}
          {!open ? (
            <div className="relative z-20 flex items-center justify-self-end gap-1 lg:hidden">
              <button
                type="button"
                aria-label="Search"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShopOpen(false);
                  openSearch();
                }}
                className="flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5"
              >
                <SearchIcon />
              </button>
              <CartButton light />
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={false}
                onClick={() => setOpen(true)}
                className="relative flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5"
              >
                <span className="relative block h-3.5 w-5">
                  <span className="absolute top-0.5 left-0 h-[1.5px] w-full bg-current" />
                  <span className="absolute top-3 left-0 h-[1.5px] w-full bg-current" />
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Close menu"
              aria-expanded={true}
              onClick={() => {
                setOpen(false);
                setMobileShopOpen(false);
              }}
              className="relative z-[110] flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute top-1.5 left-0 h-[1.5px] w-full rotate-45 bg-current" />
                <span className="absolute top-1.5 left-0 h-[1.5px] w-full -rotate-45 bg-current" />
              </span>
            </button>
          )}
        </div>
      </header>

      <div
        onMouseEnter={() => {
          if (shopOpen) openShop();
        }}
      >
        <ShopMegaMenu open={shopOpen} onClose={() => setShopOpen(false)} />
      </div>

      {shopOpen ? (
        <button
          type="button"
          aria-label="Close shop menu"
          className="fixed inset-0 z-30 hidden bg-transparent lg:block"
          onClick={() => setShopOpen(false)}
        />
      ) : null}

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[90] w-full lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <aside
          className={`relative flex h-dvh w-full flex-col overflow-hidden bg-surface pt-[72px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex w-full flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 py-4">
            {links.map((link, i) => {
              const active = isActive(link.href);

              if (link.mega) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    aria-expanded={mobileShopOpen}
                    onClick={() => setMobileShopOpen(true)}
                    className={`flex w-full items-center justify-between rounded-2xl px-2 py-3 text-left text-[28px] font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? "text-accent" : "text-black"
                    } ${
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                    style={{
                      transitionDelay: open ? `${100 + i * 55}ms` : "0ms",
                    }}
                  >
                    {link.label}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4.5 2.5L8 6l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`w-full rounded-2xl px-2 py-3 text-[28px] font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active ? "text-accent" : "text-black hover:text-black/55"
                  } ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{
                    transitionDelay: open ? `${100 + i * 55}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div
            className={`w-full px-6 pb-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "350ms" : "0ms" }}
          >
            <MobileAccount onClose={() => setOpen(false)} />
          </div>

          {/* Second-level shop panel — slides over the main drawer */}
          <div
            aria-hidden={!mobileShopOpen}
            className={`absolute inset-0 z-10 flex flex-col bg-surface pt-[72px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mobileShopOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-black/8 px-5 py-3">
              <button
                type="button"
                aria-label="Back to menu"
                onClick={() => setMobileShopOpen(false)}
                className="flex size-10 items-center justify-center rounded-full text-black hover:bg-black/5"
              >
                <svg width="18" height="18" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M7.5 2.5L4 6l3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="text-[18px] font-medium tracking-tight text-[#1a1a1a]">
                Shop All
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="mb-6 inline-flex text-[15px] font-medium text-[#c45c6a] underline underline-offset-4"
              >
                Shop all products
              </Link>

              <div className="space-y-7">
                {megaGroups.map((group) => (
                  <div key={group.slug}>
                    <Link
                      href={group.href}
                      onClick={() => setOpen(false)}
                      className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
                    >
                      {group.label}
                    </Link>
                    <ul className="mt-3 space-y-3">
                      <li>
                        <Link
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className="block text-[20px] font-medium text-black"
                        >
                          Shop all {group.label}
                        </Link>
                      </li>
                      {group.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block text-[18px] text-black/70"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DesktopAccount({ light }: { light: boolean }) {
  if (!isClerkConfigured()) {
    return (
      <Link
        href="/auth"
        aria-label="Account"
        className={`flex size-11 items-center justify-center rounded-full transition-colors ${
          light ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"
        }`}
      >
        <UserIcon />
      </Link>
    );
  }

  return <DesktopAccountWithClerk light={light} />;
}

function DesktopAccountWithClerk({ light }: { light: boolean }) {
  const { isLoaded, isSignedIn, user, logout } = useAuth();

  if (!isLoaded) return <div className="size-11" />;

  if (isSignedIn) {
    return (
      <AccountMenu user={user} light={light} onLogout={() => void logout()} />
    );
  }

  return (
    <Link
      href="/auth"
      aria-label="Account"
      className={`flex size-11 items-center justify-center rounded-full transition-colors ${
        light ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"
      }`}
    >
      <UserIcon />
    </Link>
  );
}

function MobileAccount({
  onClose,
}: {
  onClose: () => void;
}) {
  if (!isClerkConfigured()) {
    return <MobileAuthActions onClose={onClose} />;
  }

  return <MobileAccountWithClerk onClose={onClose} />;
}

function MobileAuthActions({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/auth"
          onClick={onClose}
          className="flex items-center justify-center rounded-full bg-[#1a1a1a] py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Login
        </Link>
        <Link
          href="/auth?mode=sign-up"
          onClick={onClose}
          className="flex items-center justify-center rounded-full border border-black/15 py-3.5 text-[14px] font-medium text-black transition-colors hover:bg-black/5"
        >
          Sign up
        </Link>
      </div>
      <Link
        href="/contact"
        onClick={onClose}
        className="flex w-full items-center justify-center rounded-full border border-black/15 py-3.5 text-[14px] font-medium text-black transition-colors hover:bg-black/5"
      >
        Contact
      </Link>
    </div>
  );
}

function MobileAccountWithClerk({
  onClose,
}: {
  onClose: () => void;
}) {
  const { isLoaded, isSignedIn, user, logout } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-2xl bg-soft px-3 py-3">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-surface text-[14px] font-medium text-accent">
              {(
                user?.fullName ||
                user?.username ||
                user?.primaryEmailAddress?.emailAddress ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-[#1a1a1a]">
              {user?.fullName ||
                user?.username ||
                user?.primaryEmailAddress?.emailAddress}
            </p>
            {user?.fullName || user?.username ? (
              <p className="truncate text-[12px] text-[#1a1a1a]/50">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center justify-center rounded-full border border-black/15 py-3.5 text-[14px] font-medium text-black transition-colors hover:bg-black/5"
          >
            Account
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              void logout();
            }}
            className="flex items-center justify-center rounded-full border border-black/15 py-3.5 text-[14px] font-medium text-[#e11d48] transition-colors hover:bg-red-50"
          >
            Log out
          </button>
        </div>
        <Link
          href="/contact"
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-full border border-black/15 py-3.5 text-[14px] font-medium text-black transition-colors hover:bg-black/5"
        >
          Contact
        </Link>
      </div>
    );
  }

  return <MobileAuthActions onClose={onClose} />;
}

function WishlistButton({ light }: { light: boolean }) {
  const { wishlist } = useShopStore();
  const count = wishlist.length;
  const active = usePathname() === "/wishlist";

  return (
    <Link
      href="/wishlist"
      aria-label={count > 0 ? `Wishlist, ${count} items` : "Wishlist"}
      className={`relative flex size-11 items-center justify-center rounded-full transition-colors ${
        light ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"
      } ${active ? "bg-black/5" : ""}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20s-7-4.4-9.5-8.2C.7 9.2 1.5 5.8 4.4 4.6c1.8-.7 3.8-.2 5.1 1.2L12 8l2.5-2.2c1.3-1.4 3.3-1.9 5.1-1.2 2.9 1.2 3.7 4.6 1.9 7.2C19 15.6 12 20 12 20z"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={count > 0 ? "currentColor" : "none"}
          stroke="currentColor"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}

function CartButton({ light }: { light: boolean }) {
  const { cartCount, openCartPanel } = useShopStore();

  return (
    <button
      type="button"
      aria-label="Cart"
      onClick={() => openCartPanel()}
      className={`relative flex size-11 items-center justify-center rounded-full transition-colors ${
        light ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"
      }`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3.5 5h2l1.2 11h11.6l1.5-8H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.2" fill="currentColor" />
        <circle cx="17" cy="20" r="1.2" fill="currentColor" />
      </svg>
      {cartCount > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      ) : null}
    </button>
  );
}

function SearchIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
