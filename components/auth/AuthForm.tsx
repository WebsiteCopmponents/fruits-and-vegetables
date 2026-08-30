"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import { useAuth, useForgotPassword, useSignIn, useSignUp } from "@/hooks/auth";

type Mode = "sign-in" | "sign-up" | "forgot";

export default function AuthForm() {
  const { isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    const next = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
    setMode((current) => (current === "forgot" ? current : next));
  }, [searchParams]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <p className="text-sm tracking-wide text-[#1a1a1a]/70">Loading…</p>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-[#1a1a1a]">You’re signed in</p>
        <p className="text-sm text-[#1a1a1a]/60">Welcome back to La Gracia.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-10 text-center">
        <Image
          src="/la-gracia-logo.png"
          alt="La Gracia"
          width={160}
          height={40}
          className="mx-auto mb-5 h-10 w-auto object-contain"
          priority
        />
        <h1 className="text-[32px] font-medium leading-tight tracking-tight text-[#1a1a1a]">
          {mode === "sign-in" && "Welcome back"}
          {mode === "sign-up" && "Join La Gracia"}
          {mode === "forgot" && "Reset password"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#1a1a1a]/60">
          {mode === "sign-in" && "Sign in to your account to continue shopping."}
          {mode === "sign-up" && "Create an account for a smoother checkout."}
          {mode === "forgot" && "We’ll email you a code to set a new password."}
        </p>
      </div>

      {mode !== "forgot" && (
        <div className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-[#1a1a1a]/5 p-1">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded-full py-2.5 text-[14px] font-medium transition-colors ${
              mode === "sign-in"
                ? "bg-surface text-[#1a1a1a] shadow-sm"
                : "text-[#1a1a1a]/55 hover:text-[#1a1a1a]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded-full py-2.5 text-[14px] font-medium transition-colors ${
              mode === "sign-up"
                ? "bg-surface text-[#1a1a1a] shadow-sm"
                : "text-[#1a1a1a]/55 hover:text-[#1a1a1a]"
            }`}
          >
            Sign up
          </button>
        </div>
      )}

      {mode === "sign-in" && (
        <SignInForm
          onForgot={() => setMode("forgot")}
          onSignUp={() => setMode("sign-up")}
        />
      )}
      {mode === "sign-up" && (
        <SignUpForm onSignIn={() => setMode("sign-in")} />
      )}
      {mode === "forgot" && (
        <ForgotForm onBack={() => setMode("sign-in")} />
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#1a1a1a]/12 bg-surface/80 py-3.5 pl-4 text-[15px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] placeholder:text-[#1a1a1a]/35 focus:border-black/40 focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]";

function Field({
  label,
  name,
  type,
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium tracking-wide text-[#1a1a1a]/70">
        {label}
      </span>
      <div className="relative">
        <input
          name={name}
          type={inputType}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${inputClass} ${isPassword ? "pr-12" : "pr-4"}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#1a1a1a]/55 transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {error ? <AutoHideText message={error} /> : null}
    </label>
  );
}

/** Controlled OTP field — blocks password-manager autofill */
function CodeField({
  label,
  error,
}: {
  label: string;
  error?: string;
}) {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setCode("");
  }, []);

  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium tracking-wide text-[#1a1a1a]/70">
        {label}
      </span>
      <input
        name="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={8}
        required
        value={code}
        placeholder="6-digit code"
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-1p-ignore="true"
        data-lpignore="true"
        data-form-type="other"
        readOnly={!unlocked}
        onFocus={() => setUnlocked(true)}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
        className={`${inputClass} pr-4 tracking-[0.35em]`}
      />
      {error ? <AutoHideText message={error} /> : null}
    </label>
  );
}

function AutoHideText({ message }: { message: string }) {
  const [visible, setVisible] = useState(message);

  useEffect(() => {
    setVisible(message);
    const timer = setTimeout(() => setVisible(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;
  return <span className="mt-2 block text-[13px] text-[#b42318]">{visible}</span>;
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12.5C3.7 8.1 8 5 13 5s9.3 3.1 11 7.5C22.3 16.9 18 20 13 20S3.7 16.9 2 12.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.7a2.5 2.5 0 003.5 3.5M9.9 5.1A10.4 10.4 0 0112 5c5 0 9.3 3.1 11 7.5a11.6 11.6 0 01-4.2 5.1M6.7 6.7A11.5 11.5 0 001 12.5C2.7 16.9 7 20 12 20c1.7 0 3.3-.4 4.7-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubmitButton({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <CtaButton
      type="submit"
      disabled={loading}
      className="mt-2 w-full justify-between text-[15px]"
    >
      {loading ? "Please wait…" : children}
    </CtaButton>
  );
}

function TextLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[14px] text-[#1a1a1a]/65 underline decoration-[#1a1a1a]/25 underline-offset-4 transition-colors hover:text-[#1a1a1a] hover:decoration-[#1a1a1a]/60"
    >
      {children}
    </button>
  );
}

function FormAlert({
  message,
  variant = "error",
}: {
  message?: string | null;
  variant?: "error" | "success";
}) {
  const [visible, setVisible] = useState<string | null>(null);

  useEffect(() => {
    setVisible(message ?? null);
    if (!message) return;

    const timer = setTimeout(() => setVisible(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  const styles =
    variant === "success"
      ? "bg-[#ecfdf3] text-[#027a48]"
      : "bg-[#fef3f2] text-[#b42318]";

  return (
    <p className={`rounded-xl px-4 py-3 text-[13px] ${styles}`}>{visible}</p>
  );
}

function GoogleButton({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-[#1a1a1a]/12 bg-surface py-3.5 text-[15px] font-medium text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/[0.03] disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        />
      </svg>
      {label}
    </button>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#1a1a1a]/10" />
      <span className="text-[12px] tracking-wide text-[#1a1a1a]/40 uppercase">or</span>
      <div className="h-px flex-1 bg-[#1a1a1a]/10" />
    </div>
  );
}

function SignInForm({
  onForgot,
  onSignUp,
}: {
  onForgot: () => void;
  onSignUp: () => void;
}) {
  const {
    errors,
    isLoading,
    needsVerification,
    formError,
    formSuccess,
    signInWithPassword,
    signInWithGoogle,
    verifyEmailCode,
    resendEmailCode,
    reset,
  } = useSignIn();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await signInWithPassword(
      String(formData.get("email") || ""),
      String(formData.get("password") || ""),
    );
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await verifyEmailCode(String(formData.get("otp") || ""));
  }

  if (needsVerification) {
    return (
      <form
        key="signin-verify"
        onSubmit={onVerify}
        className="space-y-5"
        autoComplete="off"
      >
        <p className="text-[14px] leading-relaxed text-[#1a1a1a]/60">
          Enter the verification code we sent to your email.
        </p>
        <FormAlert message={formError} />
        <FormAlert message={formSuccess} variant="success" />
        <CodeField label="Verification code" error={errors.fields.code?.message} />
        <SubmitButton loading={isLoading}>Verify email</SubmitButton>
        <div className="flex items-center justify-between pt-1">
          <TextLink onClick={() => resendEmailCode()}>Resend code</TextLink>
          <TextLink onClick={reset}>Start over</TextLink>
        </div>
      </form>
    );
  }

  return (
    <form key="signin-form" onSubmit={onSubmit} className="space-y-5">
      <FormAlert message={formError} />
      <FormAlert message={formSuccess} variant="success" />
      <GoogleButton
        label="Continue with Google"
        loading={isLoading}
        onClick={() => signInWithGoogle()}
      />
      <OrDivider />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={errors.fields.identifier?.message}
        autoComplete="email"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="Your password"
        error={errors.fields.password?.message}
        autoComplete="current-password"
      />
      <div className="flex justify-end">
        <TextLink onClick={onForgot}>Forgot password?</TextLink>
      </div>
      <SubmitButton loading={isLoading}>Sign in</SubmitButton>
      <p className="pt-2 text-center text-[14px] text-[#1a1a1a]/55">
        New here?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="font-medium text-[#1a1a1a] underline underline-offset-4"
        >
          Create an account
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ onSignIn }: { onSignIn: () => void }) {
  const {
    errors,
    isLoading,
    needsEmailVerification,
    email,
    formError,
    formSuccess,
    signUpWithPassword,
    signUpWithGoogle,
    verifyEmailCode,
    resendEmailCode,
    reset,
  } = useSignUp();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await signUpWithPassword(
      String(formData.get("email") || ""),
      String(formData.get("password") || ""),
    );
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await verifyEmailCode(String(formData.get("otp") || ""));
  }

  if (needsEmailVerification) {
    return (
      <form
        key="signup-verify"
        onSubmit={onVerify}
        className="space-y-5"
        autoComplete="off"
      >
        <p className="text-[14px] leading-relaxed text-[#1a1a1a]/60">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[#1a1a1a]">{email || "your email"}</span>.
          Check your inbox (and spam).
        </p>
        <FormAlert message={formError} />
        <FormAlert message={formSuccess} variant="success" />
        <CodeField label="Verification code" error={errors.fields.code?.message} />
        <SubmitButton loading={isLoading}>Verify email</SubmitButton>
        <div className="flex items-center justify-between pt-1">
          <TextLink onClick={() => resendEmailCode()}>Resend code</TextLink>
          <TextLink onClick={reset}>Start over</TextLink>
        </div>
      </form>
    );
  }

  return (
    <form key="signup-form" onSubmit={onSubmit} className="space-y-5">
      <FormAlert message={formError} />
      <FormAlert message={formSuccess} variant="success" />
      <GoogleButton
        label="Continue with Google"
        loading={isLoading}
        onClick={() => signUpWithGoogle()}
      />
      <OrDivider />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={errors.fields.emailAddress?.message}
        autoComplete="email"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="Create a password"
        error={errors.fields.password?.message}
        autoComplete="new-password"
      />
      <div id="clerk-captcha" className="min-h-8" />
      <SubmitButton loading={isLoading}>Create account</SubmitButton>
      <p className="pt-2 text-center text-[14px] text-[#1a1a1a]/55">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignIn}
          className="font-medium text-[#1a1a1a] underline underline-offset-4"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const {
    errors,
    isLoading,
    codeSent,
    needsNewPassword,
    formError,
    formSuccess,
    sendResetCode,
    verifyResetCode,
    submitNewPassword,
    reset,
  } = useForgotPassword();

  async function onSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await sendResetCode(String(formData.get("email") || ""));
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await verifyResetCode(String(formData.get("otp") || ""));
  }

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submitNewPassword(String(formData.get("password") || ""));
  }

  if (needsNewPassword) {
    return (
      <form key="forgot-password" onSubmit={onPassword} className="space-y-5">
        <FormAlert message={formError} />
        <FormAlert message={formSuccess} variant="success" />
        <Field
          label="New password"
          name="password"
          type="password"
          placeholder="Choose a new password"
          error={errors.fields.password?.message}
          autoComplete="new-password"
        />
        <SubmitButton loading={isLoading}>Update password</SubmitButton>
      </form>
    );
  }

  if (codeSent) {
    return (
      <form
        key="forgot-verify"
        onSubmit={onVerify}
        className="space-y-5"
        autoComplete="off"
      >
        <p className="text-[14px] leading-relaxed text-[#1a1a1a]/60">
          Enter the reset code from your email.
        </p>
        <FormAlert message={formError} />
        <FormAlert message={formSuccess} variant="success" />
        <CodeField label="Reset code" error={errors.fields.code?.message} />
        <SubmitButton loading={isLoading}>Verify code</SubmitButton>
        <div className="pt-1">
          <TextLink onClick={reset}>Start over</TextLink>
        </div>
      </form>
    );
  }

  return (
    <form key="forgot-email" onSubmit={onSend} className="space-y-5">
      <FormAlert message={formError} />
      <FormAlert message={formSuccess} variant="success" />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={errors.fields.identifier?.message}
        autoComplete="email"
      />
      <SubmitButton loading={isLoading}>Send reset code</SubmitButton>
      <p className="pt-2 text-center">
        <TextLink onClick={onBack}>Back to sign in</TextLink>
      </p>
    </form>
  );
}
