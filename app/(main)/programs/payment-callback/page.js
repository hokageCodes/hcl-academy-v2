"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Copy, X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

function formatNaira(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

function OverlayCard({ children, className }) {
  return (
    <div
      className={cn(
        "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#1a1425] shadow-2xl",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <OverlayCard className="p-10 text-center">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-accent-light/20">
        <Loader2 className="size-10 animate-spin text-accent-light" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-white">Verifying payment</h1>
      <p className="mt-2 font-body text-gray-400">
        Please wait while we confirm your transaction…
      </p>
    </OverlayCard>
  );
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const ref = reference || trxref;

    if (!ref) {
      setStatus("error");
      setErrorMessage("No payment reference found");
      return;
    }

    verifyPayment(ref);
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.success && data.data.status === "success") {
        setStatus("success");
        setPaymentData(data.data);
      } else if (data.data?.status === "abandoned") {
        setStatus("failed");
        setErrorMessage("Payment was cancelled or abandoned");
      } else if (data.data?.status === "failed") {
        setStatus("failed");
        setErrorMessage(data.data.message || "Payment failed");
      } else {
        setStatus("failed");
        setErrorMessage(
          data.error || data.data?.message || "Payment verification failed"
        );
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Verification error:", error);
      if (error.name === "AbortError") {
        setStatus("error");
        setErrorMessage(
          "Verification is taking too long. Your payment may still have gone through — check your email or contact support with your Paystack reference."
        );
        return;
      }
      setStatus("error");
      setErrorMessage("Unable to verify payment. Please contact support.");
    }
  };

  const copyReference = async () => {
    if (!paymentData?.reference) return;
    try {
      await navigator.clipboard.writeText(paymentData.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <OverlayCard className="relative">
      {status === "verifying" && (
        <div className="p-10 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-accent-light/20">
            <Loader2 className="size-10 animate-spin text-accent-light" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Verifying payment
          </h1>
          <p className="mt-2 font-body text-gray-400">
            Please wait while we confirm your transaction…
          </p>
        </div>
      )}

      {status === "success" && paymentData && (
        <>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1a1425] px-6 py-4 rounded-t-3xl">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Payment successful
              </h2>
              <p className="text-sm text-gray-500">Enrollment confirmed</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-accent-light/20">
              <Check className="size-6 text-accent-light" strokeWidth={2.5} />
            </div>
          </div>

          <div className="p-6">
            <p className="mb-6 font-body text-gray-400">
              Welcome to HCL Academy, {paymentData.customer?.name?.split(" ")[0] || "there"}.
            </p>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <Row label="Program" value={paymentData.program?.name} />
              <Row
                label="Amount paid"
                value={formatNaira(paymentData.amount)}
                valueClassName="text-accent-light font-bold"
              />
              <Row label="Student" value={paymentData.customer?.name} />
              <Row label="Email" value={paymentData.customer?.email} />
              {paymentData.customer?.phone && (
                <Row label="Phone" value={paymentData.customer.phone} />
              )}
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">
                    {paymentData.reference}
                  </span>
                  <button
                    type="button"
                    onClick={copyReference}
                    className="rounded-lg bg-white/10 p-1.5 text-gray-400 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Copy reference"
                  >
                    {copied ? (
                      <Check className="size-4 text-accent-light" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              {paymentData.paidAt && (
                <Row
                  label="Date"
                  value={new Date(paymentData.paidAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              )}
              {paymentData.channel && (
                <Row label="Payment method" value={paymentData.channel} />
              )}
            </div>

            {paymentData.emailsSent ? (
              <p className="mt-5 text-center font-body text-sm text-gray-500">
                A confirmation email has been sent to{" "}
                <span className="text-white">{paymentData.customer?.email}</span>.
              </p>
            ) : (
              <p className="mt-5 text-center font-body text-sm text-gray-500">
                Save your reference above. Our team will follow up with onboarding
                details.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/programs"
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-accent-light font-heading text-sm font-semibold text-primary transition-colors hover:bg-white"
              >
                View Programs
              </Link>
              <Link
                href="/"
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-white/20 font-heading text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Return Home
              </Link>
            </div>
          </div>
        </>
      )}

      {status === "failed" && (
        <div className="p-10 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-500/20">
            <X className="size-10 text-red-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Payment failed
          </h1>
          <p className="mt-2 font-body text-gray-400">{errorMessage}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/programs"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-accent-light px-8 font-heading text-sm font-semibold text-primary"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-8 font-heading text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="p-10 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/20">
            <AlertCircle className="size-10 text-yellow-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Something went wrong
          </h1>
          <p className="mt-2 font-body text-gray-400">{errorMessage}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-accent-light px-8 font-heading text-sm font-semibold text-primary"
            >
              Contact Support
            </Link>
            <Link
              href="/programs"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-8 font-heading text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to Programs
            </Link>
          </div>
        </div>
      )}
    </OverlayCard>
  );
}

function Row({ label, value, valueClassName }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          "text-right text-sm font-medium text-white",
          valueClassName
        )}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function PaymentCallbackPage() {
  useLockBodyScroll(true);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-callback-title"
    >
      <Suspense fallback={<LoadingState />}>
        <PaymentCallbackContent />
      </Suspense>
    </div>
  );
}
