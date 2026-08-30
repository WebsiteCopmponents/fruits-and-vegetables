"use client";
//File :- components/ShopMegaMenu.tsx
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { MegaMenuGroup } from "@/lib/mega-menu";

const homePages = [
  { href: "/", label: "Home" },
  { href: "/home-v2", label: "Home v2" },
  { href: "/home-v3", label: "Home v3" },
];

const blogs = [
  {
    href: "/blogs/how-to-choose-the-right-tote",
    title: "How to choose the right tote",
    description:
      "Canvas, leather, mini, or oversized — a simple everyday guide.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    alt: "Leather tote bag",
  },
  {
    href: "/blogs/care-tips-for-canvas-bags",
    title: "Care tips for canvas bags",
    description: "Keep your tote looking fresh with easy maintenance habits.",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=80",
    alt: "Woven mini tote bag",
  },
];

export default function ShopMegaMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [groups, setGroups] = useState<MegaMenuGroup[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories?: MegaMenuGroup[] }) => {
        if (!cancelled) setGroups(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={`absolute top-full left-0 z-40 hidden w-full origin-top rounded-b-3xl border-t border-black/5 bg-surface shadow-[0_24px_48px_rgba(26,26,26,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1340px] flex flex-row gap-8 py-10 lg:gap-10 px-8">
        

        {groups.map((group) => (
          <div key={group.slug}>
            <Link
              href={group.href}
              onClick={onClose}
              className="mb-4 block text-[12px] font-medium tracking-[0.14em] text-accent uppercase transition-opacity hover:opacity-70"
            >
              {group.label}
            </Link>
            <ul className="space-y-3">
              <li>
                <Link
                  href={group.href}
                  onClick={onClose}
                  className="text-[15px] font-medium text-[#000] underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  Shop all {group.label}
                </Link>
              </li>
              {group.children.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={child.href}
                    onClick={onClose}
                    className="text-[15px] font-medium text-black transition-opacity hover:opacity-60"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {blogs.map((blog) => (
          <Link
            key={blog.title}
            href={blog.href}
            onClick={onClose}
            className="group block bg-gray-100 p-4 rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-gray-200"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-soft">
              <Image
                src={blog.image}
                alt={blog.alt}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="mt-4 text-[18px] font-bold tracking-tight text-black">
              {blog.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">
              {blog.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
