"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

// Programs data - in a real app, this would come from an API/database
const PROGRAMS_DATA = [
  {
    id: "intro-to-web-development",
    title: "Intro to Web Development",
    description: "Master the foundations of the web. Learn HTML5, CSS3, JavaScript ES6+, and Responsive Design.",
    duration: "8 Weeks",
    price: 50000,
    available: true,
    category: "development",
    skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    id: "ui-ux-design-fundamentals",
    title: "UI/UX Design Fundamentals",
    description: "Learn the basics of user interface and user experience design. Master Figma, wireframing, prototyping.",
    duration: "6 Weeks",
    price: 45000,
    available: false,
    category: "design",
    skills: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
  {
    id: "vibe-coding-essentials",
    title: "Vibe Coding Essentials",
    description: "Speed up your workflow using what you already know in web development. Learn essential patterns and tools.",
    duration: "4 Weeks",
    price: 35000,
    available: false,
    category: "ai",
    skills: ["Web Dev Knowledge", "Patterns", "Tools & Shortcuts"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
];

function ProgramCard({ program, stats, onEdit }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-[#1a1425] border border-white/10 rounded-xl overflow-hidden hover:border-[#7FF41A]/30 transition-colors">
      {/* Image */}
      <div className="relative h-40">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1425] to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              program.available
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            {program.available ? "Active" : "Coming Soon"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white capitalize">
            {program.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2">{program.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{program.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-[#7FF41A] font-bold">{stats?.enrollments || 0}</p>
            <p className="text-gray-500 text-xs">Enrolled</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-white font-bold">{program.duration}</p>
            <p className="text-gray-500 text-xs">Duration</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-white font-bold">{formatCurrency(program.price)}</p>
            <p className="text-gray-500 text-xs">Price</p>
          </div>
        </div>

        {/* Revenue */}
        {stats?.revenue > 0 && (
          <div className="bg-[#7FF41A]/10 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Revenue</span>
              <span className="text-[#7FF41A] font-bold">{formatCurrency(stats.revenue)}</span>
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {program.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(program)}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <a
            href={`/programs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function EditProgramModal({ program, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: program?.title || "",
    description: program?.description || "",
    duration: program?.duration || "",
    price: program?.price || 0,
    available: program?.available || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    onSave({ ...program, ...formData });
    setIsSaving(false);
  };

  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1425] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Edit Program</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Program Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 8 Weeks"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₦)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#7FF41A]/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7FF41A]"></div>
            </label>
            <span className="text-white text-sm">Program Available</span>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-200 text-sm">
                Note: Program changes are simulated. In production, this would update the database and require a page refresh on the public site.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProgramsContent() {
  const [programs, setPrograms] = useState(PROGRAMS_DATA);
  const [programStats, setProgramStats] = useState({});
  const [editingProgram, setEditingProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats for each program
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const statsPromises = programs.map(async (program) => {
          const response = await fetch(`/api/admin/payments?programId=${program.id}&status=completed&limit=1000`);
          const data = await response.json();
          
          if (data.success) {
            const totalRevenue = data.data.payments.reduce((sum, p) => sum + p.amount, 0);
            return {
              id: program.id,
              enrollments: data.data.payments.length,
              revenue: totalRevenue,
            };
          }
          return { id: program.id, enrollments: 0, revenue: 0 };
        });

        const stats = await Promise.all(statsPromises);
        const statsMap = {};
        stats.forEach((s) => {
          statsMap[s.id] = s;
        });
        setProgramStats(statsMap);
      } catch (error) {
        console.error("Failed to fetch program stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [programs]);

  const handleSaveProgram = (updatedProgram) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
    setEditingProgram(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totalEnrollments = Object.values(programStats).reduce((sum, s) => sum + s.enrollments, 0);
  const totalRevenue = Object.values(programStats).reduce((sum, s) => sum + s.revenue, 0);
  const activePrograms = programs.filter((p) => p.available).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Programs</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your academy programs and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-[#7FF41A]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Programs</p>
          <p className="text-2xl font-bold text-white">{programs.length}</p>
        </div>

        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Programs</p>
          <p className="text-2xl font-bold text-green-400">{activePrograms}</p>
        </div>

        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Enrollments</p>
          <p className="text-2xl font-bold text-blue-400">{isLoading ? "..." : totalEnrollments}</p>
        </div>

        <div className="bg-[#1a1425] border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-400">{isLoading ? "..." : formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-[#7FF41A]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              stats={programStats[program.id]}
              onEdit={setEditingProgram}
            />
          ))}
        </div>
      )}

      {/* Edit Program Modal */}
      {editingProgram && (
        <EditProgramModal
          program={editingProgram}
          onClose={() => setEditingProgram(null)}
          onSave={handleSaveProgram}
        />
      )}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <AdminLayout>
      <ProgramsContent />
    </AdminLayout>
  );
}

