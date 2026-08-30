"use client";

import { useEffect, useState } from "react";

export type ConnectionLevel = "good" | "slow" | "offline";

type NetworkConnection = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function readConnection(): NetworkConnection | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  };
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function levelFromConnection(online: boolean): ConnectionLevel {
  if (!online) return "offline";
  const conn = readConnection();
  if (!conn) return "good";

  const type = (conn.effectiveType || "").toLowerCase();
  if (type === "slow-2g" || type === "2g") return "slow";
  if (typeof conn.rtt === "number" && conn.rtt >= 800) return "slow";
  if (typeof conn.downlink === "number" && conn.downlink > 0 && conn.downlink < 0.5)
    return "slow";
  if (conn.saveData) return "slow";
  return "good";
}

/**
 * Tracks online / slow connections for shoppers on weak networks.
 */
export function useConnectionStatus() {
  const [level, setLevel] = useState<ConnectionLevel>("good");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let probeTimer: ReturnType<typeof setTimeout> | undefined;

    function apply(next: ConnectionLevel) {
      if (!cancelled) setLevel(next);
    }

    function refreshFromBrowser() {
      apply(levelFromConnection(navigator.onLine));
    }

    async function probeLatency() {
      if (!navigator.onLine) {
        apply("offline");
        return;
      }
      const started = performance.now();
      const ctrl = new AbortController();
      const kill = setTimeout(() => ctrl.abort(), 5000);
      try {
        await fetch("/api/commerce/status", {
          method: "GET",
          cache: "no-store",
          signal: ctrl.signal,
        });
        const ms = performance.now() - started;
        if (ms >= 3000) apply("slow");
        else refreshFromBrowser();
      } catch {
        if (!navigator.onLine) apply("offline");
        else apply("slow");
      } finally {
        clearTimeout(kill);
      }
    }

    function scheduleProbe() {
      void probeLatency();
      probeTimer = setTimeout(scheduleProbe, 45000);
    }

    refreshFromBrowser();
    setReady(true);
    scheduleProbe();

    const onOnline = () => {
      refreshFromBrowser();
      void probeLatency();
    };
    const onOffline = () => apply("offline");

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const conn = readConnection();
    const onConnChange = () => refreshFromBrowser();
    conn?.addEventListener?.("change", onConnChange);

    return () => {
      cancelled = true;
      if (probeTimer) clearTimeout(probeTimer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      conn?.removeEventListener?.("change", onConnChange);
    };
  }, []);

  return { level, ready, isOffline: level === "offline", isSlow: level === "slow" };
}
