"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global-fruits]", error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong"
      description="We couldn’t load this page. It may be a temporary API or connection issue — try again in a moment."
      digest={error.digest}
      onRetry={() => unstable_retry()}
    />
  );
}
