"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";
import { marcel, viktor } from "./fonts";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global-fruits:global]", error);
  }, [error]);

  return (
    <html lang="en" className={`${marcel.variable} ${viktor.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <title>Something went wrong · Global Fruits</title>
        <ErrorState
          title="Something went wrong"
          description="A critical error stopped the page from loading. Try again, or head home and continue shopping."
          digest={error.digest}
          onRetry={() => unstable_retry()}
        />
      </body>
    </html>
  );
}
