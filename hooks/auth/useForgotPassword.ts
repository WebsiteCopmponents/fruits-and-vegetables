"use client";

import { useSignIn as useClerkSignIn } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { useNavigateHome } from "./useNavigateHome";
import { useAutoHideMessage } from "./useAutoHideMessage";

export function useForgotPassword() {
  const { signIn, errors, fetchStatus } = useClerkSignIn();
  const navigateHome = useNavigateHome();
  const [codeSent, setCodeSent] = useState(false);
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

  const sendResetCode = useCallback(
    async (email: string) => {
      clearAlerts();

      const { error: createError } = await signIn.create({
        identifier: email,
      });
      if (createError) {
        setFormError(
          createError.longMessage ||
            createError.message ||
            "Could not start password reset.",
        );
        return { error: createError };
      }

      const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
      if (sendError) {
        setFormError(
          sendError.longMessage ||
            sendError.message ||
            "Could not send reset code.",
        );
        return { error: sendError };
      }

      setCodeSent(true);
      setFormSuccess("Reset code sent to your email.");
      return { error: null };
    },
    [signIn, clearAlerts, setFormError, setFormSuccess],
  );

  const verifyResetCode = useCallback(
    async (code: string) => {
      clearAlerts();
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
      if (error) {
        setFormError(
          error.longMessage || error.message || "Invalid reset code.",
        );
        return { error };
      }
      setFormSuccess("Code verified. Set your new password.");
      return { error: null };
    },
    [signIn, clearAlerts, setFormError, setFormSuccess],
  );

  const submitNewPassword = useCallback(
    async (password: string) => {
      clearAlerts();

      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (error) {
        setFormError(
          error.longMessage || error.message || "Could not update password.",
        );
        return { error };
      }

      if (signIn.status === "complete") {
        setFormSuccess("Password updated. Signing you in…");
        const result = await signIn.finalize({ navigate: navigateHome });
        if (result.error) {
          setFormError(
            result.error.longMessage ||
              result.error.message ||
              "Could not finish sign in.",
          );
        }
        return { error: result.error ?? null };
      }

      return { error: null };
    },
    [signIn, navigateHome, clearAlerts, setFormError, setFormSuccess],
  );

  const reset = useCallback(() => {
    clearAlerts();
    setCodeSent(false);
    signIn.reset();
  }, [signIn, clearAlerts]);

  return {
    errors,
    isLoading: fetchStatus === "fetching",
    codeSent,
    needsNewPassword: signIn.status === "needs_new_password",
    formError:
      formError ||
      errors.global?.[0]?.longMessage ||
      errors.global?.[0]?.message ||
      null,
    formSuccess,
    sendResetCode,
    verifyResetCode,
    submitNewPassword,
    reset,
  };
}
