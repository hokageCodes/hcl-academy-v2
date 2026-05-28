"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const PENDING_BANK_TRANSFER_STORAGE_KEY = "hcl_pending_bank_transfer_v1";
const PENDING_BANK_TRANSFER_TTL_MS = 48 * 60 * 60 * 1000;

function formatNaira(amount) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function PaymentModal({ isOpen, onClose, program }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    transferReference: "",
    proofUrl: "",
    proofNote: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bankTransferInfo, setBankTransferInfo] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [transferSubmitted, setTransferSubmitted] = useState(false);
  const [restoredPendingTransfer, setRestoredPendingTransfer] = useState(false);

  const clearPendingBankTransfer = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PENDING_BANK_TRANSFER_STORAGE_KEY);
  }, []);

  const persistPendingBankTransfer = useCallback((info) => {
    if (typeof window === "undefined" || !info?.reference || !program?.programId) return;
    const payload = {
      reference: info.reference,
      bankDetails: info.bankDetails,
      programId: program.programId,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(
      PENDING_BANK_TRANSFER_STORAGE_KEY,
      JSON.stringify(payload)
    );
  }, [program?.programId]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const defaultFormData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        transferReference: "",
        proofUrl: "",
        proofNote: "",
      };
      setFormData(defaultFormData);
      setErrors({});
      setSubmitError("");
      setCopiedField("");
      setTransferSubmitted(false);
      setRestoredPendingTransfer(false);

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(PENDING_BANK_TRANSFER_STORAGE_KEY);
          if (!raw) {
            setBankTransferInfo(null);
            return;
          }
          const parsed = JSON.parse(raw);
          const isExpired =
            !parsed?.savedAt || Date.now() - parsed.savedAt > PENDING_BANK_TRANSFER_TTL_MS;
          const wrongProgram = parsed?.programId !== program?.programId;
          const invalid = !parsed?.reference || !parsed?.bankDetails;
          if (isExpired || wrongProgram || invalid) {
            clearPendingBankTransfer();
            setBankTransferInfo(null);
            return;
          }
          setBankTransferInfo({
            reference: parsed.reference,
            bankDetails: parsed.bankDetails,
          });
          setRestoredPendingTransfer(true);
        } catch {
          clearPendingBankTransfer();
          setBankTransferInfo(null);
        }
      } else {
        setBankTransferInfo(null);
      }
    }
  }, [isOpen, program?.programId, clearPendingBankTransfer]);

  useLockBodyScroll(isOpen);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name contains invalid characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name contains invalid characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Nigerian format)
    const cleanPhone = formData.phone.replace(/\s/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+234|234|0)[789][01]\d{8}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid Nigerian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/payments/bank-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\s/g, ""),
          programId: program.programId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (data.success && data.data.reference) {
        setBankTransferInfo(data.data);
        setRestoredPendingTransfer(false);
        persistPendingBankTransfer(data.data);
        setIsSubmitting(false);
      } else {
        throw new Error(data.error || "Invalid response from server");
      }
    } catch (error) {
      // Avoid logging payment details in the browser console
      setSubmitError(error.message || "An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (value, field) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1800);
    } catch {
      setSubmitError("Could not copy. Please copy manually.");
    }
  };

  const handleProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 8 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      setSubmitError("Receipt must be an image file.");
      return;
    }
    if (file.size > maxSize) {
      setSubmitError("Receipt image must be 8MB or less.");
      return;
    }

    setIsUploadingProof(true);
    setSubmitError("");

    try {
      const sigResponse = await fetch("/api/uploads/receipt-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const sigData = await sigResponse.json();
      if (!sigResponse.ok || !sigData.success) {
        throw new Error(sigData.error || "Failed to prepare upload");
      }

      const { cloudName, apiKey, folder, timestamp, signature } = sigData.data;

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", apiKey);
      uploadForm.append("folder", folder);
      uploadForm.append("timestamp", String(timestamp));
      uploadForm.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(uploadData.error?.message || "Upload failed");
      }

      setFormData((prev) => ({ ...prev, proofUrl: uploadData.secure_url }));
    } catch (error) {
      setSubmitError(error.message || "Could not upload receipt");
    } finally {
      setIsUploadingProof(false);
      e.target.value = "";
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!bankTransferInfo?.reference) return;
    if (!formData.transferReference?.trim()) {
      setSubmitError("Please enter your transfer reference.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/payments/bank-transfer/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: bankTransferInfo.reference,
          transferReference: formData.transferReference.trim(),
          proofUrl: formData.proofUrl.trim(),
          proofNote: formData.proofNote.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not submit transfer proof");
      }
      if (data.data?.emailWarning) {
        setSubmitError(data.data.emailWarning);
      }
      setTransferSubmitted(true);
      clearPendingBankTransfer();
    } catch (error) {
      setSubmitError(error.message || "Could not submit transfer proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!bankTransferInfo?.reference) return;
    setFormData((prev) => {
      if (prev.transferReference?.trim()) return prev;
      return { ...prev, transferReference: bankTransferInfo.reference };
    });
  }, [bankTransferInfo]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#1a1425] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Enroll Now</h2>
            <p className="text-gray-500 text-sm">{program?.title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Program Info */}
          <div className="bg-[#7FF41A]/10 border border-[#7FF41A]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7FF41A] text-sm font-medium">Program Fee</p>
                <div className="flex items-baseline gap-2">
                  {program?.originalPrice && (
                    <p className="text-gray-500 text-lg line-through">
                      {formatNaira(program.originalPrice)}
                    </p>
                  )}
                  <p className="text-white text-2xl font-bold">{program?.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white font-semibold">{program?.duration}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            </div>
          )}

          {bankTransferInfo ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#7FF41A]/30 bg-[#7FF41A]/10 p-4">
                <p className="text-sm font-semibold text-[#7FF41A]">
                  Enrollment received
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  Transfer the exact amount below and include your reference when sending proof.
                </p>
              </div>
              {restoredPendingTransfer && (
                <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
                  <p className="text-xs text-blue-200">
                    Restored your pending transfer details so you can continue proof submission.
                  </p>
                </div>
              )}
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="text-gray-400">Bank</p>
                <p className="font-semibold text-white">{bankTransferInfo.bankDetails.bankName}</p>
                <p className="text-gray-400">Account Name</p>
                <p className="font-semibold text-white">{bankTransferInfo.bankDetails.accountName}</p>
                <p className="text-gray-400">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-lg font-bold text-[#7FF41A]">
                    {bankTransferInfo.bankDetails.accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        bankTransferInfo.bankDetails.accountNumber,
                        "accountNumber"
                      )
                    }
                    className="rounded-md bg-white/10 p-1.5 text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Copy account number"
                  >
                    {copiedField === "accountNumber" ? (
                      <svg className="h-4 w-4 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-gray-400">Reference</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white">{bankTransferInfo.reference}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankTransferInfo.reference, "reference")}
                    className="rounded-md bg-white/10 p-1.5 text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Copy reference"
                  >
                    {copiedField === "reference" ? (
                      <svg className="h-4 w-4 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {transferSubmitted ? (
                <>
                  <p className="text-xs text-gray-300">
                    Submitted. You and admin have been emailed. We are now verifying your transfer.
                  </p>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-[#7FF41A] text-[#0f0a19] hover:bg-[#6ad815]"
                  >
                    Done
                  </Button>
                </>
              ) : (
                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="transferReference" className="block text-sm font-medium text-gray-300 mb-2">
                      Transfer Narration / Receipt Ref <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="transferReference"
                      name="transferReference"
                      value={formData.transferReference || ""}
                      onChange={handleChange}
                      placeholder="Uses your HCL ref by default; edit if your bank gave a different one"
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      We prefilled your HCL reference. If your bank generated a different narration/reference, replace it here.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="proofUrl" className="block text-sm font-medium text-gray-300 mb-2">
                      Receipt proof (optional)
                    </label>
                    <div className="mb-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProofUpload}
                          disabled={isSubmitting || isUploadingProof}
                        />
                        {isUploadingProof ? "Uploading receipt..." : "Upload receipt image"}
                      </label>
                    </div>
                    <input
                      type="url"
                      id="proofUrl"
                      name="proofUrl"
                      value={formData.proofUrl}
                      onChange={handleChange}
                      placeholder="Uploaded URL appears here (or paste manually)"
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="proofNote" className="block text-sm font-medium text-gray-300 mb-2">
                      Proof note (optional)
                    </label>
                    <textarea
                      id="proofNote"
                      name="proofNote"
                      rows={3}
                      value={formData.proofNote}
                      onChange={handleChange}
                      placeholder="Sender name, transfer time, bank used..."
                      disabled={isSubmitting}
                      className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    After transfer, submit this to trigger verification emails.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#7FF41A] text-[#0f0a19] hover:bg-[#6ad815]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit transfer proof"}
                  </Button>
                </form>
              )}
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                    errors.firstName 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                      : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                    errors.lastName 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                      : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={isSubmitting}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                  errors.email 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                    : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08012345678"
                disabled={isSubmitting}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                  errors.phone 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                    : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>
              )}
              <p className="mt-1 text-gray-500 text-xs">Nigerian phone number format</p>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <svg className="w-5 h-5 text-[#7FF41A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-400 text-xs">
                Step 1: get bank details. Step 2: after transfer, submit your transfer reference and proof.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Bank Details
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </Button>
          </form>
          )}

          {/* Payment Methods */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-gray-500 text-xs mb-3">Accepted payment methods</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-300 text-xs bg-white/10 px-3 py-1 rounded-full">Bank Transfer (active)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
