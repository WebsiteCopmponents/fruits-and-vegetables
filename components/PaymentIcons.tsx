/** Payment brand marks for footer trust badges. */

type PaymentIconProps = {
  className?: string;
};

export const PAYMENT_METHODS = [
  { id: "visa", label: "Visa", Icon: VisaIcon },
  { id: "mastercard", label: "Mastercard", Icon: MastercardIcon },
  { id: "amex", label: "American Express", Icon: AmexIcon },
  { id: "paypal", label: "PayPal", Icon: PaypalIcon },
  { id: "diners", label: "Diners Club", Icon: DinersIcon },
  { id: "discover", label: "Discover", Icon: DiscoverIcon },
] as const;

export function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {PAYMENT_METHODS.map(({ id, label, Icon }) => (
        <li key={id}>
          <span
            className="inline-flex h-8 items-center justify-center overflow-hidden rounded-[5px] bg-black  shadow-sm ring-1 ring-black/5"
            title={label}
            aria-label={label}
          >
            <Icon className="h-[18px] w-auto" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function VisaIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M21.4 21.2h-2.9l1.8-11h2.9l-1.8 11zm11.6-10.7c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.5 2.5 2.6 3 1.2.6 1.6.9 1.6 1.4 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.1 0 5.1-1.5 5.1-3.8 0-1.3-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.4-2.3zm7.7-.3h-2.2c-.7 0-1.2.2-1.5.9l-5.3 10.1h3.7s.6-1.6.7-2h4.6c.1.5.4 2 .4 2h3.3l-2.7-11zm-5.5 7.1c.3-.7 1.3-3.5 1.3-3.5s.3-.7.4-1.1l.2 1s.6 2.8.7 3.6h-2.6zm-16.9-7.1-3.4 9-.4-1.8c-.6-2.1-2.6-4.3-4.8-5.4l3.1 9.2h3.7l5.6-11h-3.8z"
      />
      <path
        fill="#F9A51A"
        d="M7.2 10.2H3.6L3.5 10.7c2.8.7 4.6 2.4 5.4 4.5l-.8-3.9c-.1-.7-.7-1-.9-1.1z"
      />
    </svg>
  );
}

function MastercardIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#000" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M24 9.7a8 8 0 0 1 0 12.6 8 8 0 0 1 0-12.6z"
      />
    </svg>
  );
}

function AmexIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#2E77BC" />
      <path
        fill="#fff"
        d="M8.5 19.5 11 12h2.6l2.5 7.5h-2.3l-.4-1.3h-2.7l-.4 1.3H8.5zm3.2-2.9h1.7l-.8-2.6-.9 2.6zM18 19.5v-7.5h3.4c1.8 0 3 1 3 2.6 0 1.7-1.3 2.7-3.1 2.7H20v2.2H18zm2-4h1.2c.7 0 1.2-.4 1.2-1s-.5-1-1.2-1H20v2zm7.2 4-1.8-7.5h2.4l1 4.6 1.1-4.6h2.3l-1.9 7.5h-3.1zM32.8 19.5v-7.5H39v1.8h-4.1v1.2h3.8v1.7h-3.8v1.1h4.2v1.7h-6.3z"
      />
    </svg>
  );
}

function PaypalIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path
        fill="#003087"
        d="M18.2 8.5h5.6c3.1 0 4.4 1.6 4.2 3.9-.3 3.1-2.1 4.8-5.1 4.8h-2.1l-.8 4.8h-2.6l2.8-13.5z"
      />
      <path
        fill="#009CDE"
        d="M19.8 11.2h3.5c1.4 0 2.3.6 2.2 1.8-.2 1.6-1.2 2.5-2.7 2.5h-1.5l-.5 3.2h-1.5l1.5-7.5z"
      />
      <path
        fill="#003087"
        d="M28.6 10.2h2.5l-.4 2.3c1-.4 1.8-.5 2.6-.5 2.2 0 3.3 1.2 3 3.1-.4 2.4-1.9 3.7-4.2 3.7-1 0-1.8-.2-2.4-.5l-.5 2.7h-2.5l1.9-10.8zm3.9 3.7c-.4 0-.8.1-1.1.2l-.6 3.3c.3.1.7.2 1.1.2 1.1 0 1.9-.6 2.1-1.7.2-1.1-.3-2-1.5-2z"
      />
    </svg>
  );
}

function DinersIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#0079BE" />
      <circle cx="24" cy="16" r="9" fill="#fff" />
      <path
        fill="#0079BE"
        d="M19.5 16c0-2.8 1.3-5.2 3.2-6.5v13c-1.9-1.3-3.2-3.7-3.2-6.5zm5.8 6.5v-13c1.9 1.3 3.2 3.7 3.2 6.5s-1.3 5.2-3.2 6.5z"
      />
    </svg>
  );
}

function DiscoverIcon({ className }: PaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      width="38"
      height="24"
      aria-hidden
    >
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path
        fill="#F47216"
        d="M0 16c8 0 14.5 7.5 24 7.5S40.5 16 48 16V28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V16z"
      />
      <text
        x="8"
        y="14"
        fill="#1a1a1a"
        fontSize="7"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        letterSpacing="0.4"
      >
        DISCOVER
      </text>
    </svg>
  );
}
