export type AlertTone = "success" | "failure" | "progress";

export type AlertPayload = {
  tone: AlertTone;
  message: string;
  /** Auto-dismiss ms. Progress stays until replaced unless set. */
  duration?: number;
};

export const ALERT_EVENT = "lagracia-alert";
const PENDING_KEY = "lagracia-pending-alert";

/** Fire a toast from anywhere (cart, wishlist, checkout, auth, etc.). */
export function showAlert(payload: AlertPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ALERT_EVENT, { detail: payload }));
}

/** Queue a toast for the next page load (e.g. after logout redirect). */
export function queueAlert(payload: AlertPayload) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function consumeQueuedAlert(): AlertPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_KEY);
    return JSON.parse(raw) as AlertPayload;
  } catch {
    return null;
  }
}

export function alertSuccess(message: string, duration = 3500) {
  showAlert({ tone: "success", message, duration });
}

export function alertFailure(message: string, duration = 4500) {
  showAlert({ tone: "failure", message, duration });
}

export function alertProgress(message: string) {
  showAlert({ tone: "progress", message, duration: 0 });
}
