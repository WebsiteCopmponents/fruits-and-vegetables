"use client";

import { useSignUp as useClerkSignUp } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { alertFailure, alertProgress, alertSuccess, queueAlert } from "@/lib/alert";
import { useNavigateHome } from "./useNavigateHome";
import { useAutoHideMessage } from "./useAutoHideMessage";

export type SignUpStep = "form" | "verify";

export function useSignUp() {
  const { signUp, errors, fetchStatus } = useClerkSignUp();
  const navigateHome = useNavigateHome();
  const [step, setStep] = useState<SignUpStep>("form");
  const [email, setEmail] = useState("");
  const {
    message: formError,
    setMessage: setFormError,
    clearMessage: clearFormError,
  } = useAutoHideMessage();
  const {
    message: formSuccess,
    setMessage: setFormSuccess,
    clearMessage: clearFormSuccess,
  } = useAutoHideMessage();

  const clearAlerts = useCallback(() => {
    clearFormError();
    clearFormSuccess();
  }, [clearFormError, clearFormSuccess]);

  const sendVerificationCode = useCallback(async () => {
    clearAlerts();
    alertProgress("Sending verification code…");

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      const msg =
        error.longMessage ||
        error.message ||
        "Could not send verification code.";
      setFormError(msg);
      alertFailure(msg);
      return { error };
    }

    setStep("verify");
    const ok = "Verification code sent to your email.";
    setFormSuccess(ok);
    alertSuccess(ok);
    return { error: null };
  }, [signUp, clearAlerts, setFormError, setFormSuccess]);

  const signUpWithPassword = useCallback(
    async (emailAddress: string, password: string) => {
      clearAlerts();
      setEmail(emailAddress);
      alertProgress("Creating your account…");

      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        const msg =
          error.longMessage || error.message || "Could not create account.";
        setFormError(msg);
        alertFailure(msg);
        return { error };
      }

      return sendVerificationCode();
    },
    [signUp, sendVerificationCode, clearAlerts, setFormError],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      clearAlerts();

      const trimmed = code.trim();
      if (!trimmed) {
        const msg = "Enter the verification code from your email.";
        setFormError(msg);
        alertFailure(msg);
        return { error: new Error("empty code") };
      }

      if (trimmed.length > 12 || /[@#$%&*]/.test(trimmed)) {
        const msg =
          "That looks like a password. Enter the 6-digit code from your email.";
        setFormError(msg);
        alertFailure(msg);
        return { error: new Error("invalid otp format") };
      }

      alertProgress("Verifying email…");
      const { error } = await signUp.verifications.verifyEmailCode({
        code: trimmed,
      });

      if (error) {
        const msg =
          error.longMessage || error.message || "Invalid verification code.";
        setFormError(msg);
        alertFailure(msg);
        return { error };
      }

      if (signUp.status === "complete") {
        setFormSuccess("Email verified. Signing you in…");
        alertProgress("Email verified. Signing you in…");
        const result = await signUp.finalize({ navigate: navigateHome });
        if (result.error) {
          const msg =
            result.error.longMessage ||
            result.error.message ||
            "Could not finish sign up.";
          setFormError(msg);
          alertFailure(msg);
        } else {
          queueAlert({
            tone: "success",
            message: "Account ready — you’re signed in",
            duration: 3500,
          });
          alertSuccess("Account ready — you’re signed in");
        }
        return { error: result.error ?? null };
      }

      if (signUp.missingFields.length > 0) {
        const msg = `More info needed: ${signUp.missingFields.join(", ")}.`;
        setFormError(msg);
        alertFailure(msg);
        return { error: null };
      }

      const incomplete = "Email verified, but sign up is not complete yet.";
      setFormError(incomplete);
      alertFailure(incomplete);
      return { error: null };
    },
    [signUp, navigateHome, clearAlerts, setFormError, setFormSuccess],
  );

  const signUpWithGoogle = useCallback(async () => {
    clearAlerts();
    alertProgress("Continuing with Google…");

    const { error } = await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/",
    });

    if (error) {
      const msg =
        error.longMessage ||
        error.message ||
        "Google sign-up failed. Enable Google in the Clerk Dashboard.";
      setFormError(msg);
      alertFailure(msg);
      return { error };
    }

    return { error: null };
  }, [signUp, clearAlerts, setFormError]);

  const resendEmailCode = useCallback(async () => {
    return sendVerificationCode();
  }, [sendVerificationCode]);

  const reset = useCallback(() => {
    clearAlerts();
    setStep("form");
    setEmail("");
  }, [clearAlerts]);

  const needsEmailVerification =
    step === "verify" ||
    (signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0);

  return {
    signUp,
    errors,
    isLoading: fetchStatus === "fetching",
    step: needsEmailVerification ? ("verify" as const) : ("form" as const),
    needsEmailVerification,
    email: email || signUp.emailAddress || "",
    formError:
      formError ||
      errors.fields.captcha?.longMessage ||
      errors.fields.captcha?.message ||
      errors.global?.[0]?.longMessage ||
      errors.global?.[0]?.message ||
      null,
    formSuccess,
    signUpWithPassword,
    signUpWithGoogle,
    sendVerificationCode,
    verifyEmailCode,
    resendEmailCode,
    reset,
  };
}
