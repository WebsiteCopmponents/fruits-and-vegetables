"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigateHome() {
  const router = useRouter();

  return useCallback(
    async ({
      session,
      decorateUrl,
    }: {
      session?: { currentTask?: unknown } | null;
      decorateUrl: (url: string) => string;
    }) => {
      if (session?.currentTask) return;

      const url = decorateUrl("/");
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    },
    [router],
  );
}
