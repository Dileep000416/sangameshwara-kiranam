"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Smartphone } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Step = "mobile" | "otp";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { requestOtp, confirmOtp } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("mobile");
  const [mobileInput, setMobileInput] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestOtp(e164);
      setMobileInput(e164);
      setStep("otp");
      showToast("An OTP has been sent to your mobile number.", "success");
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
      showToast("Logged in successfully.", "success");
      router.push(redirectTo);
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            {step === "mobile" ? <Smartphone size={26} /> : <ShieldCheck size={26} />}
          </div>

          <h1 className="mt-5 text-2xl font-bold text-green-950">
            {step === "mobile" ? "Login or create an account" : "Enter verification code"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {step === "mobile"
              ? "We'll send you a one-time password to verify your mobile number. No password needed."
              : `We sent a 6-digit code to ${mobileInput}.`}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "mobile" ? (
            <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
              <div>
                <label htmlFor="mobile" className="mb-1.5 block text-sm font-semibold text-slate-900">
                  Mobile number
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">
                  <span className="pl-4 text-sm font-semibold text-slate-500">+91</span>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={mobileInput.replace(/^\+91/, "")}
                    onChange={(event) => setMobileInput(event.target.value)}
                    placeholder="9XXXXXXXXX"
                    className="h-12 w-full rounded-xl bg-transparent px-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-green-800 text-sm font-bold text-white transition hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmOtp} className="mt-6 space-y-4">
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-semibold text-slate-900">
                  6-digit code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-lg font-bold tracking-[0.3em] text-slate-900 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-green-800 text-sm font-bold text-white transition hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify & continue"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("mobile");
                  setOtp("");
                  setError(null);
                }}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
