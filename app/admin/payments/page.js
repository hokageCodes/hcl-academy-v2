"use client";
import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const STATUS_COLORS = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  abandoned: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function PaymentDetailModal({ payment, onClose, onVerify, isVerifying }) {
  if (!payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1425] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Payment Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${STATUS_COLORS[payment.status]}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <span className="text-2xl font-bold text-[#7FF41A]">{formatCurrency(payment.amount)}</span>
          </div>

          {/* Re-verify Notice for Pending */}
          {payment.status === "pending" && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Payment Pending Verification</p>
                  <p className="text-yellow-400/70 text-xs mt-1">
                    Click "Re-verify with Paystack" to check if this payment was actually completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Student Info */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Full Name</p>
                <p className="text-white font-medium">{payment.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-white text-sm break-all">{payment.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Phone</p>
                <p className="text-white">{payment.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Program</p>
                <p className="text-white">{payment.programName}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Reference</p>
                <code className="text-[#7FF41A] text-xs font-mono bg-[#7FF41A]/10 px-2 py-1 rounded">
                  {payment.reference}
                </code>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Channel</p>
                <p className="text-white capitalize">{payment.channel || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Created At</p>
                <p className="text-white text-sm">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Paid At</p>
                <p className="text-white text-sm">{formatDate(payment.paidAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Re-verify Button for Pending Payments */}
            {payment.status === "pending" && (
              <button
                onClick={() => onVerify(payment.reference)}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying with Paystack...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-verify with Paystack
                  </>
                )}
              </button>
            )}

            <div className="flex gap-3">
              <a
                href={`mailto:${payment.email}?subject=Regarding your payment - ${payment.reference}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Student
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(payment.reference);
                }}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Ref
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsContent() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: "all", search: "", programId: "all" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const fetchPayments = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.programId !== "all" && { programId: filters.programId }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();

      if (data.success) {
        setPayments(data.data.payments);
        setPagination(data.data.pagination);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch payments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        limit: "1000",
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.programId !== "all" && { programId: filters.programId }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();

      if (data.success) {
        // Create CSV
        const headers = ["Reference", "Name", "Email", "Phone", "Program", "Amount", "Status", "Channel", "Paid At", "Created At"];
        const rows = data.data.payments.map(p => [
          p.reference,
          p.fullName,
          p.email,
          p.phone,
          p.programName,
          p.amount,
          p.status,
          p.channel || "",
          p.paidAt ? new Date(p.paidAt).toISOString() : "",
          new Date(p.createdAt).toISOString(),
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleVerify = async (reference) => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const response = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
      const data = await response.json();

      if (data.success && data.data.status === "success") {
        setVerifyResult({ type: "success", message: "Payment verified and updated to completed!" });
        // Update the payment in our local state
        setPayments(prev => prev.map(p => 
          p.reference === reference 
            ? { ...p, status: "completed", paidAt: data.data.paidAt, channel: data.data.channel }
            : p
        ));
        // Also update selected payment
        setSelectedPayment(prev => 
          prev?.reference === reference 
            ? { ...prev, status: "completed", paidAt: data.data.paidAt, channel: data.data.channel }
            : prev
        );
      } else if (data.data?.status === "abandoned") {
        setVerifyResult({ type: "warning", message: "Payment was abandoned by user" });
        setPayments(prev => prev.map(p => 
          p.reference === reference ? { ...p, status: "abandoned" } : p
        ));
        setSelectedPayment(prev => 
          prev?.reference === reference ? { ...prev, status: "abandoned" } : prev
        );
      } else if (data.data?.status === "failed") {
        setVerifyResult({ type: "error", message: data.data.message || "Payment failed" });
        setPayments(prev => prev.map(p => 
          p.reference === reference ? { ...p, status: "failed" } : p
        ));
        setSelectedPayment(prev => 
          prev?.reference === reference ? { ...prev, status: "failed" } : prev
        );
      } else if (data.data?.status === "pending") {
        setVerifyResult({ type: "info", message: "Payment is still pending on Paystack. User may not have completed payment." });
      } else {
        setVerifyResult({ type: "error", message: data.error || "Verification failed" });
      }
    } catch (err) {
      console.error("Verify error:", err);
      setVerifyResult({ type: "error", message: "Failed to verify payment" });
    } finally {
      setIsVerifying(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all payment transactions</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {isExporting ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1425] border border-white/10 rounded-xl p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, email, phone, or reference..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setTimeout(() => fetchPayments(1), 0);
            }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="abandoned">Abandoned</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={filters.programId}
            onChange={(e) => {
              setFilters({ ...filters, programId: e.target.value });
              setTimeout(() => fetchPayments(1), 0);
            }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none min-w-[180px]"
          >
            <option value="all">All Programs</option>
            <option value="intro-to-web-development">Web Development</option>
            <option value="ui-ux-design-fundamentals">UI/UX Design</option>
            <option value="vibe-coding-essentials">Vibe Coding</option>
          </select>
          <button
            type="submit"
            className="bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-[#1a1425] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3 hidden md:table-cell">Program</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <svg className="animate-spin h-8 w-8 text-[#7FF41A] mx-auto mb-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-500">Loading payments...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">No payments found</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white text-sm font-medium">{payment.fullName}</p>
                        <p className="text-gray-500 text-xs">{payment.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-white text-sm">{payment.programName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#7FF41A] text-sm font-semibold">
                        {formatCurrency(payment.amount)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p className="text-gray-400 text-sm">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-[#7FF41A] hover:text-[#9fff5a] text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              Showing {payments.length} of {pagination.total} payments
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPayments(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/5 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-400 text-sm">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchPayments(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white/5 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verify Result Toast */}
      {verifyResult && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-lg border shadow-lg ${
          verifyResult.type === "success" ? "bg-green-500/20 border-green-500/30 text-green-400" :
          verifyResult.type === "warning" ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" :
          verifyResult.type === "info" ? "bg-blue-500/20 border-blue-500/30 text-blue-400" :
          "bg-red-500/20 border-red-500/30 text-red-400"
        }`}>
          <div className="flex items-center gap-3">
            {verifyResult.type === "success" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : verifyResult.type === "info" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <p className="text-sm font-medium">{verifyResult.message}</p>
            <button 
              onClick={() => setVerifyResult(null)}
              className="ml-auto text-current opacity-70 hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            setVerifyResult(null);
          }}
          onVerify={handleVerify}
          isVerifying={isVerifying}
        />
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <AdminLayout>
      <PaymentsContent />
    </AdminLayout>
  );
}

