"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      const goHome = async ({
        session,
        decorateUrl,
      }: {
        session?: { currentTask?: unknown } | null;
        decorateUrl: (url: string) => string;
      }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.push(url);
      };

      const finalizeSignIn = async () => {
        await signIn.finalize({ navigate: goHome });
      };

      const finalizeSignUp = async () => {
        await signUp.finalize({ navigate: goHome });
      };

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const signInStatus = signIn.status as typeof signIn.status | "complete";
        if (signInStatus === "complete") {
          await finalizeSignIn();
          return;
        }
        router.push("/auth");
        return;
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every((f) => f.strategy === "enterprise_sso")
      ) {
        router.push("/auth");
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        router.push("/auth/continue");
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        router.push("/auth");
        return;
      }

      if (signUp.status === "missing_requirements") {
        router.push("/auth/continue");
        return;
      }

      const sessionId =
        signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;

      if (sessionId) {
        await clerk.setActive({
          session: sessionId,
          navigate: goHome,
        });
        return;
      }

      router.push("/auth");
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm text-[#1a1a1a]/60">Finishing Google sign-in…</p>
      <div id="clerk-captcha" />
    </main>
  );
}
