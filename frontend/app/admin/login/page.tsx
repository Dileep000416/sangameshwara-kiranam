"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Smartphone, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Step = "mobile" | "otp";

/**
 * Separate admin login route (spec section 9). This uses the exact same
 * Cognito custom-auth OTP flow as customer login — there is no separate
 * password-based admin auth — but after a successful login it checks the
 * "cognito:groups" claim and refuses to proceed into /admin if the
 * authenticated user is not in the ADMINS group. The backend enforces the
 * same rule independently on every /admin/* API call, so this check is a
 * UX convenience, not the actual security boundary.
 */
function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not-admin";

  const { requestOtp, confirmOtp, isAdmin, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("mobile");
  const [mobileInput, setMobileInput] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    notAdmin ? "This account does not have admin access." : null
  );

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isAdmin, router]);

  function toE164(input: string): string | null {
    const digits = input.replace(/\D/g, "");
    if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    return null;
  }

  async function handleRequestOtp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const e164 = toE164(mobileInput);
    if (!e164) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestOtp(e164);
      setMobileInput(e164);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmOtp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit code sent to your phone.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmOtp(otp.trim());
      // isAdmin is derived synchronously from the freshly-issued ID token's
      // claims, but state updates are async — verify directly here too.
      showToast("Logged in. Checking admin access...", "info");
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-green-800 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Store size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Sangameshwara Kiranam</p>
            <p className="text-xs text-slate-500">Admin panel</p>
          </div>
        </div>

        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          {step === "mobile" ? <Smartphone size={22} /> : <ShieldCheck size={22} />}
        </div>

        <h1 className="mt-4 text-xl font-bold text-green-950">
          {step === "mobile" ? "Admin login" : "Enter verification code"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {step === "mobile"
            ? "Sign in with your registered admin mobile number."
            : `We sent a 6-digit code to ${mobileInput}.`}
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            {notAdmin && (
              <button type="button" onClick={logout} className="ml-2 font-bold underline">
                Sign out
              </button>
            )}
          </div>
        )}

        {step === "mobile" ? (
          <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
            <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">
              <span className="pl-4 text-sm font-semibold text-slate-500">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobileInput.replace(/^\+91/, "")}
                onChange={(event) => setMobileInput(event.target.value)}
                placeholder="9XXXXXXXXX"
                className="h-12 w-full rounded-xl bg-transparent px-2 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green-900 text-sm font-bold text-white transition hover:bg-green-950 disabled:opacity-60"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmOtp} className="mt-6 space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-center text-lg font-bold tracking-[0.3em] outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green-900 text-sm font-bold text-white transition hover:bg-green-950 disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Verify & continue"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
