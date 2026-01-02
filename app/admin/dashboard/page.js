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

function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/payments/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const fetchPayments = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        ...(filters.status !== "all" && { status: filters.status }),
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
    fetchStats();
    fetchPayments();
  }, [fetchStats, fetchPayments]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments(1);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#7FF41A]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#7FF41A]">
              {formatCurrency(stats.overview.totalRevenue)}
            </p>
          </div>

          <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {stats.overview.completedCount}
            </p>
          </div>

          <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.overview.pendingCount}
            </p>
          </div>

          <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">
              {stats.overview.conversionRate}%
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#1a1425] border border-white/10 rounded-xl p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, email, reference..."
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
                <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3 hidden xl:table-cell">Reference</th>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <code className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded font-mono">
                        {payment.reference}
                      </code>
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
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
