"use client";
import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

function StudentDetailModal({ student, onClose }) {
  if (!student) return null;

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
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1425] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Student Details</h2>
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
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7FF41A] to-[#5eb812] flex items-center justify-center">
              <span className="text-[#0f0a19] font-bold text-2xl">
                {student.firstName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{student.fullName}</h3>
              <p className="text-gray-400 text-sm">{student.email}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-white text-sm break-all">{student.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Phone</p>
                <p className="text-white">{student.phone}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Info */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Enrollment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Total Paid</p>
                <p className="text-[#7FF41A] font-bold text-lg">{formatCurrency(student.totalPaid)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Enrollments</p>
                <p className="text-white font-bold text-lg">{student.enrollments}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">First Enrolled</p>
                <p className="text-white text-sm">{formatDate(student.firstEnrolledAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Last Enrolled</p>
                <p className="text-white text-sm">{formatDate(student.lastEnrolledAt)}</p>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Enrolled Programs</h3>
            <div className="flex flex-wrap gap-2">
              {student.programs?.map((program, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#7FF41A]/10 text-[#7FF41A] text-sm font-medium rounded-lg border border-[#7FF41A]/20"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`mailto:${student.email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </a>
            <a
              href={`https://wa.me/${student.phone?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsContent() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: "", programId: "all" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(filters.programId !== "all" && { programId: filters.programId }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/students?${params}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.data.students);
        setPagination(data.data.pagination);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(1);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage enrolled students</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-[#7FF41A]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Students</p>
          <p className="text-2xl font-bold text-white">{pagination.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1425] border border-white/10 rounded-xl p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, email, or phone..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
            />
          </div>
          <select
            value={filters.programId}
            onChange={(e) => {
              setFilters({ ...filters, programId: e.target.value });
              setTimeout(() => fetchStudents(1), 0);
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

      {/* Students Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-[#7FF41A]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-[#1a1425] border border-white/10 rounded-xl p-5 hover:border-[#7FF41A]/30 transition-colors cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FF41A] to-[#5eb812] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0f0a19] font-bold text-lg">
                    {student.firstName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{student.fullName}</h3>
                  <p className="text-gray-500 text-sm truncate">{student.email}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <p className="text-[#7FF41A] font-semibold text-sm">{formatCurrency(student.totalPaid)}</p>
                      <p className="text-gray-600 text-xs">Total Paid</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{student.enrollments}</p>
                      <p className="text-gray-600 text-xs">Programs</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {student.programs?.slice(0, 2).map((program, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded"
                      >
                        {program}
                      </span>
                    ))}
                    {student.programs?.length > 2 && (
                      <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-xs rounded">
                        +{student.programs.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-gray-500 text-sm">
            Showing {students.length} of {pagination.total} students
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchStudents(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-[#1a1425] border border-white/10 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400 text-sm">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchStudents(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-[#1a1425] border border-white/10 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <AdminLayout>
      <StudentsContent />
    </AdminLayout>
  );
}

