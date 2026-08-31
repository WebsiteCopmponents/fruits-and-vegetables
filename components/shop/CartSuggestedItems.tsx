"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Variants,
} from "motion/react";
import { formatPrice } from "@/lib/products";
import type { CartSuggestion } from "@/lib/cart-suggestions";
import { cn } from "@/lib/utils";

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 20, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const rowVariants: Variants = {
  rest: {},
  hover: {},
};

const actionVariants: Variants = {
  rest: { opacity: 0, scale: 0.92, x: 8 },
  hover: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: "spring", stiffness: 380, damping: 20, mass: 0.8 },
  },
};

function SuggestionCard({
  item,
  onAdd,
  onClose,
  cartSlugs,
}: {
  item: CartSuggestion;
  onAdd: (slug: string) => void;
  onClose: () => void;
  cartSlugs: string[];
}) {
  const inCart = cartSlugs.includes(item.slug);

  return (
    <motion.div
      layout
      layoutId={item.id}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={rowVariants}
        initial="rest"
        animate="rest"
        whileHover="hover"
        className={cn(
          "flex items-center gap-3 rounded-2xl border bg-soft px-3 py-3.5",
          "border-[#F5F5F6] transition-colors duration-200",
          "hover:bg-surface hover:shadow-[0_8px_24px_rgba(26,26,26,0.05)]",
        )}
      >
        <Link
          href={`/shop/${item.slug}`}
          onClick={onClose}
          className="relative size-[52px] shrink-0 overflow-hidden rounded-xl bg-soft"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="52px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/shop/${item.slug}`}
            onClick={onClose}
            className="block truncate text-[15px] font-medium leading-tight text-[#1a1a1a] hover:text-accent"
          >
            {item.name}
          </Link>
          <p className="truncate text-[13px] text-[#1a1a1a]/50">
            {item.subtitle}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-[#1a1a1a]/70">
            {formatPrice(item.price)}
          </p>
        </div>

        <motion.div
          variants={actionVariants}
          className="shrink-0 max-sm:!opacity-100 max-sm:!scale-100 max-sm:!translate-x-0"
        >
          <button
            type="button"
            disabled={inCart}
            onClick={() => onAdd(item.slug)}
            className={cn(
              "rounded-full px-3.5 py-2 text-[12px] font-medium whitespace-nowrap transition-colors",
              inCart
                ? "cursor-default bg-soft text-accent"
                : "bg-[#1a1a1a] text-white hover:opacity-90",
            )}
          >
            {inCart ? "In cart" : "Add to cart"}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type Props = {
  onAdd: (slug: string) => void;
  onClose: () => void;
  cartSlugs: string[];
  items: CartSuggestion[];
  loading?: boolean;
  className?: string;
};

export default function CartSuggestedItems({
  onAdd,
  onClose,
  cartSlugs,
  items,
  loading = false,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-3xl border bg-surface p-5",
        "border-[#F5F5F6]",
        className,
      )}
    >
      <h3 className="text-[18px] font-medium tracking-tight text-[#1a1a1a]">
        You may also like
      </h3>
      <p className="mt-1 text-[14px] text-[#1a1a1a]/55">
        Pair your basket with these picks.
      </p>

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] animate-pulse rounded-2xl bg-soft"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-soft px-4 py-5 text-center text-[14px] text-[#1a1a1a]/55">
          No more picks to show right now.
        </p>
      ) : (
        <LayoutGroup>
          <motion.div layout className="mt-4 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <SuggestionCard
                  key={item.id}
                  item={item}
                  onAdd={onAdd}
                  onClose={onClose}
                  cartSlugs={cartSlugs}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}
    </section>
  );
}
