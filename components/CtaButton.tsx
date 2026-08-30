import Link from "next/link";
import { cn } from "@/lib/utils";

type CtaButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Arrow direction inside the green square. Default: right */
  arrow?: "right" | "left";
  className?: string;
  disabled?: boolean;
};

/**
 * Pill CTA: black body + white circle with arrow on the right.
 */
export default function CtaButton({
  children,
  href,
  onClick,
  type = "button",
  arrow = "right",
  className,
  disabled,
}: CtaButtonProps) {
  const classes = cn(
    "group inline-flex items-center gap-3 rounded-full bg-primary py-1.5 pr-1.5 pl-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-transform duration-300",
          arrow === "left"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        )}
      >
        {arrow === "left" ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}

function ArrowRightIcon() {
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

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 12H5M11 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
