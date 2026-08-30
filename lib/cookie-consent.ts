export type CookieConsentChoice = "all" | "essential" | "rejected";

export const COOKIE_CONSENT_KEY = "lagracia-cookie-consent";
export const COOKIE_CONSENT_EVENT = "lagracia-cookie-consent";

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "all" || value === "essential" || value === "rejected") {
      return value;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { choice } }),
  );
}

export function allowsAnalytics(choice: CookieConsentChoice | null) {
  return choice === "all";
}
