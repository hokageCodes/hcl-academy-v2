"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  abandoned: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function AdminDashboardPage() {
  const router = useRouter();
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

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [router]);

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

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

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
  }, [filters, router]);

  useEffect(() => {
    fetchStats();
    fetchPayments();
  }, [fetchStats, fetchPayments]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

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
    <main className="min-h-screen bg-[#0f0a19]">
      {/* Header */}
      <header className="bg-[#1a1425] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Hokage Academy <span className="text-[#7FF41A]">Admin</span>
          </h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-[#7FF41A]">
                {formatCurrency(stats.overview.totalRevenue)}
              </p>
            </div>
            <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.overview.completedCount}
              </p>
            </div>
            <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.overview.pendingCount}
              </p>
            </div>
            <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats.overview.conversionRate}%
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, email, reference..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setTimeout(() => fetchPayments(1), 0);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="abandoned">Abandoned</option>
            </select>
            <button
              type="submit"
              className="bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-semibold px-6 py-2 rounded-lg text-sm"
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
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Program</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-3">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white text-sm font-medium">{payment.fullName}</p>
                          <p className="text-gray-500 text-xs">{payment.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{payment.programName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#7FF41A] text-sm font-semibold">
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[payment.status]}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-400 text-sm">
                          {formatDate(payment.paidAt || payment.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded">
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <p className="text-gray-500 text-sm">
                Showing {payments.length} of {pagination.total} payments
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchPayments(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-white/5 text-white text-sm rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-400 text-sm">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchPayments(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-white/5 text-white text-sm rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

