import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-[radial-gradient(ellipse_at_top,var(--theme-soft)_0%,var(--theme-surface)_55%)]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="h-10 w-48 animate-pulse rounded bg-black/5" />
          </div>
        </main>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
