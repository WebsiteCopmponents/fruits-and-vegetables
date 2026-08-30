// Replace with your WhatsApp number (country code + number, digits only — no + or spaces)
export const WHATSAPP_NUMBER = "15551234567";

// Phone number for "Order on call" (E.164, digits only, include country code)
export const CALL_NUMBER = "15551234567";

export const EMAIL = "hello@lagracia.com";

export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const MAILTO_URL = `mailto:${EMAIL}`;
export const CALL_URL = `tel:+${CALL_NUMBER}`;

// Common country dialing codes for phone inputs
export const COUNTRY_CODES = [
  { code: "+44", label: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", label: "US", name: "United States", flag: "🇺🇸" },
  { code: "+91", label: "IN", name: "India", flag: "🇮🇳" },
  { code: "+61", label: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+49", label: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+33", label: "FR", name: "France", flag: "🇫🇷" },
  { code: "+65", label: "SG", name: "Singapore", flag: "🇸🇬" },
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];
