import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f5f5f5_0%,var(--theme-surface)_45%,var(--theme-surface)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#bdd1e9]/45 blur-3xl"
      />
      <div className="relative w-full max-w-[420px] rounded-[28px] border border-white/70 bg-surface/70 px-8 py-10 shadow-[0_20px_60px_rgba(26,26,26,0.06)] backdrop-blur-sm sm:px-10">
        <Suspense
          fallback={
            <div className="flex min-h-[420px] items-center justify-center">
              <p className="text-sm tracking-wide text-[#1a1a1a]/70">Loading…</p>
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
