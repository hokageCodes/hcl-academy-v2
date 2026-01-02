"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="bg-[#1a1425] border border-white/10 rounded-3xl p-10 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#7FF41A]/20 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-[#7FF41A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
      <p className="text-gray-400">Please wait...</p>
    </div>
  );
}

// Main payment callback content (uses useSearchParams)
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
    try {
      const response = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
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
        setErrorMessage(data.error || data.data?.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
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
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = paymentData.reference;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed:", e);
      }
      document.body.removeChild(textArea);
    }
  };

  const generateEmailLink = () => {
    if (!paymentData) return "";

    const email = "hokage@hokagecreativelabs.com";
    const subject = encodeURIComponent(`Payment Confirmation - ${paymentData.reference}`);
    
    const body = encodeURIComponent(
`Hello Hokage Academy Team,

I have successfully completed my payment and would like to confirm my enrollment.

=== PAYMENT RECEIPT ===

Reference Number: ${paymentData.reference}
Program: ${paymentData.program?.name || "N/A"}
Amount Paid: ₦${paymentData.amount?.toLocaleString() || "N/A"}
Payment Date: ${paymentData.paidAt ? new Date(paymentData.paidAt).toLocaleString() : "N/A"}
Payment Channel: ${paymentData.channel || "N/A"}

=== STUDENT DETAILS ===

Name: ${paymentData.customer?.name || "N/A"}
Email: ${paymentData.customer?.email || "N/A"}

========================

Please let me know the next steps for onboarding.

Thank you!`
    );

    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Verifying State */}
      {status === "verifying" && (
        <div className="bg-[#1a1425] border border-white/10 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#7FF41A]/20 flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-[#7FF41A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verifying Payment</h1>
          <p className="text-gray-400">Please wait while we confirm your payment...</p>
        </div>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="bg-[#1a1425] border border-[#7FF41A]/30 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#7FF41A]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-6">Welcome to Hokage Academy. Your enrollment is confirmed.</p>
          
          {paymentData && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Program</span>
                  <span className="text-white text-sm font-medium">{paymentData.program?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Amount Paid</span>
                  <span className="text-[#7FF41A] text-sm font-bold">₦{paymentData.amount?.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Reference</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-mono">{paymentData.reference}</span>
                    <button
                      onClick={copyReference}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group relative"
                      title="Copy reference"
                    >
                      {copied ? (
                        <svg className="w-4 h-4 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#7FF41A] text-[#0f0a19] text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="text-white text-sm">{paymentData.customer?.email}</span>
                </div>
                
                {paymentData.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="text-white text-sm">{new Date(paymentData.paidAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <a
            href={generateEmailLink()}
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Receipt via Email
          </a>

          <p className="text-gray-500 text-sm mb-6">
            A confirmation email has been sent to your inbox. Check your spam folder if you don't see it.
          </p>

          <div className="flex items-center justify-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4">
              Return to Home
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/programs" className="text-[#7FF41A] hover:text-[#9fff5a] text-sm font-medium transition-colors underline underline-offset-4">
              View More Programs
            </Link>
          </div>
        </div>
      )}

      {/* Failed State */}
      {status === "failed" && (
        <div className="bg-[#1a1425] border border-red-500/30 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-6">{errorMessage}</p>
          
          <div className="flex items-center justify-center gap-6">
            <Link href="/programs" className="text-[#7FF41A] hover:text-[#9fff5a] text-sm font-medium transition-colors underline underline-offset-4">
              Try Again
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4">
              Contact Support
            </Link>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="bg-[#1a1425] border border-yellow-500/30 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h1>
          <p className="text-gray-400 mb-6">{errorMessage}</p>
          
          <div className="flex items-center justify-center gap-6">
            <Link href="/contact" className="text-[#7FF41A] hover:text-[#9fff5a] text-sm font-medium transition-colors underline underline-offset-4">
              Contact Support
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/programs" className="text-gray-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4">
              Back to Programs
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// Main page component with Suspense boundary
export default function PaymentCallbackPage() {
  return (
    <main className="min-h-screen bg-[#0f0a19] flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#7FF41A]/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <Suspense fallback={<LoadingState />}>
          <PaymentCallbackContent />
        </Suspense>
      </div>
    </main>
  );
}

