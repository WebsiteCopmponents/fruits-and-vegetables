"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WHATSAPP_CHAT_URL } from "@/lib/contact";

type MenuUser = {
  fullName?: string | null;
  username?: string | null;
  imageUrl?: string;
  primaryEmailAddress?: { emailAddress: string } | null;
};

function displayName(user: MenuUser | null | undefined) {
  if (!user) return "Account";
  return (
    user.fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Account"
  );
}

export default function AccountMenu({
  user,
  light,
  onLogout,
}: {
  user: MenuUser | null | undefined;
  light: boolean;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const name = displayName(user);
  const email = user?.primaryEmailAddress?.emailAddress;
  const imageUrl = user?.imageUrl;

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex size-11 items-center justify-center overflow-hidden rounded-full transition-colors ${
          light ? "hover:bg-black/5" : "hover:bg-white/10"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-1 ring-white/25"
          />
        ) : (
          <span
            className={`flex size-9 items-center justify-center rounded-full text-[13px] font-medium ${
              light
                ? "bg-soft text-accent"
                : "bg-primary text-white ring-1 ring-white/25"
            }`}
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+12px)] right-0 z-50 w-[min(280px,82vw)]"
        >
          <div className="relative rounded-[24px] bg-surface px-1.5 pb-1.5 pt-1 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            {/* Pointer centered under avatar (avatar ≈ 44px → center at 22px from right) */}
            <span
              className="absolute -top-[6px] right-[20px] block size-3 rotate-45 bg-surface"
              aria-hidden
            />

            <div className="relative px-5 pt-4 pb-3">
              <p className="truncate text-[17px] font-semibold tracking-tight text-[#1a1a1a]">
                {name}
              </p>
              {email ? (
                <p className="mt-1 truncate text-[13px] text-[#1a1a1a]/55">
                  {email}
                </p>
              ) : null}
            </div>

            <div className="relative space-y-0.5 border-t border-black/6 px-1.5 pt-1.5 pb-1">
              <Link
                href="/account"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-3.5 py-2.5 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.04]"
              >
                Account
              </Link>
              <Link
                href="/orders"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-3.5 py-2.5 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.04]"
              >
                Orders
              </Link>
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.04]"
              >
                <span className="text-[#25D366]" aria-hidden>
                  <ChatIcon />
                </span>
                Direct chat
              </a>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="block w-full rounded-2xl px-3.5 py-2.5 text-left text-[15px] font-medium text-[#c23b4a] transition-colors hover:bg-[#c23b4a]/8"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L3 21.5l4.9-.8A9.5 9.5 0 1 0 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
