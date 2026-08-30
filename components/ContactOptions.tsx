import Link from "next/link";
import { EMAIL, MAILTO_URL, WHATSAPP_CHAT_URL } from "@/lib/contact";

export default function ContactOptions({
  label = "Still need help?",
}: {
  label?: string;
}) {
  return (
    <div className="mt-10">
      <p className="text-[14px] text-[#1a1a1a]/60">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={WHATSAPP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-black/15 bg-surface px-5 py-2.5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:border-primary/40 hover:bg-soft"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>

        <a
          href={MAILTO_URL}
          className="inline-flex items-center gap-2.5 rounded-full border border-black/15 bg-surface px-5 py-2.5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:border-primary/40 hover:bg-soft"
        >
          <MailIcon />
          {EMAIL}
        </a>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2.5 rounded-full border border-black/15 bg-surface px-5 py-2.5 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:border-primary/40 hover:bg-soft"
        >
          Contact form
        </Link>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L3 21.5l4.9-.8A9.5 9.5 0 1 0 12 2.5Z"
        stroke="#25D366"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.8c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .4.4.7 1.1 1.4 1.8 1.8.2.1.3.1.4 0l.5-.4c.2-.1.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .4-1.6.4-2.7 0-6-3-6.4-5.7-.1-.6.1-1.2.3-1.6Z"
        fill="#25D366"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="var(--theme-primary)"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 7.5 12 12.5l7.5-5"
        stroke="var(--theme-primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
