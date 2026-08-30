"use client";

import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { isClerkConfigured } from "@/lib/clerk";
import {
  alertFailure,
  alertProgress,
  queueAlert,
} from "@/lib/alert";

export function useAuth() {
  const { isLoaded, isSignedIn, userId, sessionId } = useClerkAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const configured = isClerkConfigured();

  const logout = useCallback(async () => {
    if (!configured) return;
    alertProgress("Signing you out…");
    try {
      // Survive the redirect home so the success toast still appears
      queueAlert({
        tone: "success",
        message: "Signed out successfully",
        duration: 3500,
      });
      await signOut({ redirectUrl: "/" });
      router.refresh();
    } catch {
      alertFailure("Couldn’t sign out. Please try again.");
    }
  }, [configured, signOut, router]);

  if (!configured) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      user: null,
      logout,
    };
  }

  return {
    isLoaded,
    isSignedIn: !!isSignedIn,
    userId,
    sessionId,
    user,
    logout,
  };
}
