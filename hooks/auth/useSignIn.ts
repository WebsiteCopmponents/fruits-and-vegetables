"use client";

import { useSignIn as useClerkSignIn } from "@clerk/nextjs";
import { useCallback } from "react";
import { alertFailure, alertProgress, alertSuccess, queueAlert } from "@/lib/alert";
import { useNavigateHome } from "./useNavigateHome";
import { useAutoHideMessage } from "./useAutoHideMessage";

export function useSignIn() {
  const { signIn, errors, fetchStatus } = useClerkSignIn();
  const navigateHome = useNavigateHome();
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

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      clearAlerts();
      alertProgress("Signing you in…");

      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        const msg =
          error.longMessage || error.message || "Could not sign in.";
        setFormError(msg);
        alertFailure(msg);
        return { error };
      }

      if (signIn.status === "complete") {
        const result = await signIn.finalize({ navigate: navigateHome });
        if (result.error) {
          const msg =
            result.error.longMessage ||
            result.error.message ||
            "Could not finish sign in.";
          setFormError(msg);
          alertFailure(msg);
        } else {
          queueAlert({
            tone: "success",
            message: "Welcome back — you’re signed in",
            duration: 3500,
          });
          alertSuccess("Welcome back — you’re signed in");
        }
        return { error: result.error ?? null };
      }

      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailCodeFactor) {
          const { error: mfaError } = await signIn.mfa.sendEmailCode();
          if (mfaError) {
            const msg =
              mfaError.longMessage ||
              mfaError.message ||
              "Could not send verification code.";
            setFormError(msg);
            alertFailure(msg);
            return { error: mfaError };
          }
          const ok = "Verification code sent to your email.";
          setFormSuccess(ok);
          alertSuccess(ok);
        }
      }

      return { error: null };
    },
    [signIn, navigateHome, clearAlerts, setFormError, setFormSuccess],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      clearAlerts();
      alertProgress("Verifying code…");
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        const msg =
          error.longMessage || error.message || "Invalid verification code.";
        setFormError(msg);
        alertFailure(msg);
        return { error };
      }

      if (signIn.status === "complete") {
        const result = await signIn.finalize({ navigate: navigateHome });
        if (result.error) {
          const msg =
            result.error.longMessage ||
            result.error.message ||
            "Could not finish sign in.";
          setFormError(msg);
          alertFailure(msg);
        } else {
          queueAlert({
            tone: "success",
            message: "Welcome back — you’re signed in",
            duration: 3500,
          });
          alertSuccess("Welcome back — you’re signed in");
        }
        return { error: result.error ?? null };
      }

      return { error: null };
    },
    [signIn, navigateHome, clearAlerts, setFormError],
  );

  const resendEmailCode = useCallback(async () => {
    clearAlerts();
    alertProgress("Sending code…");
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      const msg =
        error.longMessage || error.message || "Could not resend code.";
      setFormError(msg);
      alertFailure(msg);
      return { error };
    }
    const ok = "Verification code resent.";
    setFormSuccess(ok);
    alertSuccess(ok);
    return { error: null };
  }, [signIn, clearAlerts, setFormError, setFormSuccess]);

  const signInWithGoogle = useCallback(async () => {
    clearAlerts();
    alertProgress("Continuing with Google…");

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/",
    });

    if (error) {
      const msg =
        error.longMessage ||
        error.message ||
        "Google sign-in failed. Enable Google in the Clerk Dashboard.";
      setFormError(msg);
      alertFailure(msg);
      return { error };
    }

    return { error: null };
  }, [signIn, clearAlerts, setFormError]);

  const reset = useCallback(() => {
    clearAlerts();
    signIn.reset();
  }, [signIn, clearAlerts]);

  return {
    signIn,
    errors,
    isLoading: fetchStatus === "fetching",
    needsVerification: signIn.status === "needs_client_trust",
    formError:
      formError ||
      errors.global?.[0]?.longMessage ||
      errors.global?.[0]?.message ||
      null,
    formSuccess,
    signInWithPassword,
    signInWithGoogle,
    verifyEmailCode,
    resendEmailCode,
    reset,
  };
}
