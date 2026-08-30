"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MS = 4000;

export function useAutoHideMessage(timeoutMs = DEFAULT_MS) {
  const [message, setMessageState] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMessage = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessageState(null);
  }, []);

  const setMessage = useCallback(
    (next: string | null) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setMessageState(next);

      if (next) {
        timerRef.current = setTimeout(() => {
          setMessageState(null);
          timerRef.current = null;
        }, timeoutMs);
      }
    },
    [timeoutMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, setMessage, clearMessage };
}
