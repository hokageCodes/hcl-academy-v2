"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const emptyForm = {
  bannerId: "",
  eyebrow: "",
  title: "",
  tagline: "",
  highlightsText: "",
  duration: "",
  format: "",
  feeNaira: "",
  whatsapp: "",
  whatsappUrl: "",
  flyerImage: "",
  applyPath: "/programs",
  navHeadline: "",
  navSubline: "",
  navCta: "See details",
  active: true,
  showInNavbar: true,
  showInCohortsHero: true,
  sortOrder: 0,
};

function BannerFormModal({ banner, onClose, onSave, isCreating }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (banner) {
      setForm({
        bannerId: banner.bannerId,
        eyebrow: banner.eyebrow,
        title: banner.title,
        tagline: banner.tagline,
        highlightsText: banner.highlightsText || banner.highlights?.join("\n") || "",
        duration: banner.duration,
        format: banner.format,
        feeNaira: String(banner.feeNaira),
        whatsapp: banner.whatsapp || "",
        whatsappUrl: banner.whatsappUrl || "",
        flyerImage: banner.flyerImage,
        applyPath: banner.applyPath || "/programs",
        navHeadline: banner.navHeadline || "",
        navSubline: banner.navSubline || "",
        navCta: banner.navCta || "See details",
        active: banner.active,
        showInNavbar: banner.showInNavbar,
        showInCohortsHero: banner.showInCohortsHero,
        sortOrder: banner.sortOrder ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [banner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      feeNaira: Number(form.feeNaira),
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const url = isCreating
        ? "/api/admin/banners"
        : `/api/admin/banners/${banner.bannerId}`;
      const res = await fetch(url, {
        method: isCreating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save");
        return;
      }
      onSave(data.data.banner);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#7FF41A]/50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1425]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isCreating ? "New cohort banner" : "Edit banner"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6 space-y-4">
          {isCreating && (
            <div>
              <label className="mb-1 block text-sm text-gray-400">Banner ID (URL slug)</label>
              <input
                className={inputClass}
                value={form.bannerId}
                onChange={(e) => setForm({ ...form, bannerId: e.target.value })}
                placeholder="2026"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Page: /cohorts/[bannerId]</p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Eyebrow</label>
              <input className={inputClass} value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Fee (NGN)</label>
              <input type="number" className={inputClass} value={form.feeNaira} onChange={(e) => setForm({ ...form, feeNaira: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Title</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Tagline</label>
            <input className={inputClass} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Highlights (one per line)</label>
            <textarea rows={5} className={`${inputClass} resize-none`} value={form.highlightsText} onChange={(e) => setForm({ ...form, highlightsText: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Duration</label>
              <input className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Format</label>
              <input className={inputClass} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Flyer image URL</label>
            <input className={inputClass} value={form.flyerImage} onChange={(e) => setForm({ ...form, flyerImage: e.target.value })} placeholder="/cohorts/web-dev-bootcamp-2026.png" required />
            {form.flyerImage && (
              <img src={form.flyerImage} alt="" className="mt-2 h-24 rounded-lg object-cover" />
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">WhatsApp number</label>
              <input className={inputClass} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">WhatsApp link</label>
              <input className={inputClass} value={form.whatsappUrl} onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })} placeholder="https://wa.me/234..." />
            </div>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-sm font-semibold text-[#7FF41A]">Navbar announcement</p>
            <div className="space-y-3">
              <input className={inputClass} placeholder="Nav headline (defaults to tagline)" value={form.navHeadline} onChange={(e) => setForm({ ...form, navHeadline: e.target.value })} />
              <input className={inputClass} placeholder="Nav subline" value={form.navSubline} onChange={(e) => setForm({ ...form, navSubline: e.target.value })} />
              <input className={inputClass} placeholder="Nav CTA" value={form.navCta} onChange={(e) => setForm({ ...form, navCta: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={form.showInNavbar} onChange={(e) => setForm({ ...form, showInNavbar: e.target.checked })} />
              Navbar promo
            </label>
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={form.showInCohortsHero} onChange={(e) => setForm({ ...form, showInCohortsHero: e.target.checked })} />
              Cohorts hero
            </label>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-white/5 py-3 text-white">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-[#7FF41A] py-3 font-semibold text-[#0f0a19] disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BannersContent() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners", { credentials: "same-origin" });
      const data = await res.json();
      if (data.success) setBanners(data.data.banners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (bannerId) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${bannerId}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cohort banners</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Controls the navbar announcement and /cohorts hero carousel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-lg bg-[#7FF41A] px-5 py-2.5 font-semibold text-[#0f0a19]"
        >
          Add banner
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-400">No banners yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {banners.map((b) => (
            <div key={b.bannerId} className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1425]">
              <div className="relative h-36">
                <img src={b.flyerImage} alt="" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1425] to-transparent" />
                <span className={`absolute left-3 top-3 rounded-full px-2 py-1 text-xs font-medium ${b.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {b.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">{b.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{b.tagline}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {b.showInNavbar && "Navbar · "}
                  {b.showInCohortsHero && "Cohorts hero · "}
                  /cohorts/{b.bannerId}
                </p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setEditing(b)} className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-white hover:bg-white/10">
                    Edit
                  </button>
                  <a href={`/cohorts/${b.bannerId}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                    View
                  </a>
                  <button type="button" onClick={() => handleDelete(b.bannerId)} className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <BannerFormModal
          banner={creating ? null : editing}
          isCreating={creating}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={() => {
            setEditing(null);
            setCreating(false);
            load();
          }}
        />
      )}
    </div>
  );
}

export default function AdminBannersPage() {
  return (
    <AdminLayout>
      <BannersContent />
    </AdminLayout>
  );
}
