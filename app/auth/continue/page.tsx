"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CtaButton from "@/components/CtaButton";

export default function AuthContinuePage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete") {
    router.push("/");
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") || "");
    const lastName = String(formData.get("lastName") || "");

    const { error: updateError } = await signUp.update({ firstName, lastName });
    if (updateError) {
      setError(updateError.longMessage || updateError.message || "Could not continue.");
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: async ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          if (url.startsWith("http")) window.location.href = url;
          else router.push(url);
        },
      });
      return;
    }

    setError("Still missing required details. Check your Clerk Dashboard settings.");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-medium tracking-tight text-[#1a1a1a]">
          Complete your profile
        </h1>
        <p className="text-sm text-[#1a1a1a]/60">
          A few more details are needed to finish signing up with Google.
        </p>

        {error ? (
          <p className="rounded-xl bg-[#fef3f2] px-4 py-3 text-[13px] text-[#b42318]">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          {signUp.missingFields.includes("first_name") ? (
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#1a1a1a]/70">
                First name
              </span>
              <input
                name="firstName"
                required
                className="w-full rounded-xl border border-[#1a1a1a]/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
              />
              {errors.fields.firstName ? (
                <span className="mt-2 block text-[13px] text-[#b42318]">
                  {errors.fields.firstName.message}
                </span>
              ) : null}
            </label>
          ) : null}

          {signUp.missingFields.includes("last_name") ? (
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#1a1a1a]/70">
                Last name
              </span>
              <input
                name="lastName"
                required
                className="w-full rounded-xl border border-[#1a1a1a]/12 px-4 py-3.5 text-[15px] outline-none focus:border-black/40"
              />
              {errors.fields.lastName ? (
                <span className="mt-2 block text-[13px] text-[#b42318]">
                  {errors.fields.lastName.message}
                </span>
              ) : null}
            </label>
          ) : null}

          <div id="clerk-captcha" />

          <CtaButton
            type="submit"
            disabled={isLoading}
            className="w-full justify-between text-[15px]"
          >
            {isLoading ? "Please wait…" : "Continue"}
          </CtaButton>
        </form>
      </div>
    </main>
  );
}
