"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import ShopMegaMenu from "@/components/ShopMegaMenu";
import { useSearchModalActions } from "@/lib/search-modal";
import { useShopStore } from "@/lib/shop-store";
import type { MegaMenuGroup } from "@/lib/mega-menu";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All", mega: true },
];

export default function Nav() {
  const pathname = usePathname();
  const { openSearch } = useSearchModalActions();
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [megaGroups, setMegaGroups] = useState<MegaMenuGroup[]>([]);
  const [drawerReady, setDrawerReady] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDrawerReady(true);
  }, []);

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
    <div className="sticky top-0 z-50" onMouseLeave={() => closeShop(80)}>
      <header className="relative z-50 border-b border-black/6 bg-white backdrop-blur-md">
        <div className="relative mx-auto grid h-16 max-w-[1340px] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:h-20 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
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
            aria-label="Global Fruits home"
            className="justify-self-start lg:justify-self-center"
          >
            <span className="block text-[17px] font-semibold tracking-tight text-[#1a1a1a] sm:text-[20px]">
              Global Fruits
            </span>
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

            <AccountButton light />
            <WishlistButton light />
            <CartButton light />
          </div>

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
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="relative flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute top-0.5 left-0 h-[1.5px] w-full bg-current" />
                <span className="absolute top-3 left-0 h-[1.5px] w-full bg-current" />
              </span>
            </button>
          </div>
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

      {drawerReady
        ? createPortal(
            <div
              aria-hidden={!open}
              inert={!open}
              className={`fixed inset-0 z-[220] w-full bg-white lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open
                  ? "pointer-events-auto translate-x-0"
                  : "pointer-events-none translate-x-full"
              }`}
            >
              <aside className="relative flex h-dvh w-full flex-col overflow-hidden bg-white pt-[env(safe-area-inset-top)]">
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#EDEDED] px-5">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="text-[20px] leading-none font-semibold tracking-tight text-[#1a1a1a]"
                  >
                    Global Fruits
                  </Link>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => {
                      setOpen(false);
                      setMobileShopOpen(false);
                    }}
                    className="flex size-10 items-center justify-center text-[#1a1a1a]"
                  >
                    <CloseXIcon />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto pt-2">
                  <div className="px-5">
                    <DrawerRow
                      label="Shop"
                      chevron
                      onClick={() => setMobileShopOpen(true)}
                    />
                    <DrawerRow
                      label="Bestsellers"
                      href="/shop?new=1"
                      chevron
                      onNavigate={() => setOpen(false)}
                    />
                    <DrawerRow
                      label="Home delivery"
                      href="/shop?collection=home-delivery"
                      chevron
                      onNavigate={() => setOpen(false)}
                    />
                  </div>

                  <div className="mx-5 h-px bg-[#EDEDED]" />

                  <div className="px-5">
                    <DrawerRow
                      label="Store location"
                      href="/#store-location"
                      onNavigate={() => setOpen(false)}
                    />
                    <DrawerRow
                      label="Reviews"
                      href="/#reviews"
                      onNavigate={() => setOpen(false)}
                    />
                  </div>

                  <div className="mx-5 h-px bg-[#EDEDED]" />

                  <div className="px-5">
                    <DrawerRow
                      label="Account"
                      href="/account"
                      onNavigate={() => setOpen(false)}
                    />
                    <DrawerRow
                      label="Wishlist"
                      href="/wishlist"
                      onNavigate={() => setOpen(false)}
                    />
                  </div>
                </nav>

                <div
                  aria-hidden={!mobileShopOpen}
                  inert={!mobileShopOpen}
                  className={`absolute inset-0 z-10 flex flex-col bg-white pt-[env(safe-area-inset-top)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    mobileShopOpen
                      ? "pointer-events-auto translate-x-0"
                      : "pointer-events-none translate-x-full"
                  }`}
                >
                  <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#EDEDED] px-5">
                    <button
                      type="button"
                      aria-label="Back to menu"
                      onClick={() => setMobileShopOpen(false)}
                      className="flex items-center gap-2 text-[17px] font-medium text-[#1a1a1a]"
                    >
                      <ChevronLeftIcon />
                      Shop
                    </button>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={() => {
                        setOpen(false);
                        setMobileShopOpen(false);
                      }}
                      className="flex size-10 items-center justify-center text-[#1a1a1a]"
                    >
                      <CloseXIcon />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="px-5">
                      <DrawerRow
                        label="Shop all"
                        href="/shop"
                        onNavigate={() => setOpen(false)}
                      />
                      {megaGroups.map((group) => (
                        <div key={group.slug}>
                          <DrawerRow
                            label={group.label}
                            href={group.href}
                            onNavigate={() => setOpen(false)}
                          />
                          {group.children.map((child) => (
                            <DrawerRow
                              key={child.slug}
                              label={child.label}
                              href={child.href}
                              onNavigate={() => setOpen(false)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function DrawerRow({
  label,
  href,
  chevron,
  onClick,
  onNavigate,
}: {
  label: string;
  href?: string;
  chevron?: boolean;
  onClick?: () => void;
  onNavigate?: () => void;
}) {
  const className =
    "flex min-h-[56px] w-full items-center justify-between py-4 text-left text-[17px] font-medium text-[#1a1a1a]";

  const content = (
    <>
      <span>{label}</span>
      {chevron ? <ChevronRightIcon /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function CloseXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        stroke="#C4C4C4"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7.5 2.5L4 6l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountButton({ light }: { light: boolean }) {
  const active = usePathname() === "/account";

  return (
    <Link
      href="/account"
      aria-label="Account"
      className={`flex size-11 items-center justify-center rounded-full transition-colors ${
        light ? "text-black hover:bg-black/5" : "text-white hover:bg-white/10"
      } ${active ? "bg-black/5" : ""}`}
    >
      <UserIcon />
    </Link>
  );
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
