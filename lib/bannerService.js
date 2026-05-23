import connectDB from "@/lib/db";
import CohortBanner from "@/lib/models/CohortBanner";

export function formatFeeLabel(feeNaira) {
  return `₦${Number(feeNaira).toLocaleString("en-NG")}`;
}

export function toPublicBanner(doc) {
  const feeLabel = formatFeeLabel(doc.feeNaira);
  const detailPath = `/cohorts/${doc.bannerId}`;

  return {
    id: doc._id?.toString(),
    bannerId: doc.bannerId,
    active: Boolean(doc.active),
    showInNavbar: Boolean(doc.showInNavbar),
    showInCohortsHero: Boolean(doc.showInCohortsHero),
    eyebrow: doc.eyebrow,
    title: doc.title,
    tagline: doc.tagline,
    highlights: doc.highlights || [],
    duration: doc.duration,
    format: doc.format,
    feeNaira: doc.feeNaira,
    feeLabel,
    whatsapp: doc.whatsapp || "",
    whatsappUrl: doc.whatsappUrl || "",
    flyerImage: doc.flyerImage,
    detailPath,
    applyPath: doc.applyPath || "/programs",
    navHeadline: doc.navHeadline?.trim() || doc.tagline,
    navSubline:
      doc.navSubline?.trim() ||
      `${doc.duration} · ${doc.format} · ${feeLabel}`,
    navCta: doc.navCta?.trim() || "See details",
    sortOrder: doc.sortOrder ?? 0,
  };
}

export function toAdminBanner(doc) {
  const pub = toPublicBanner(doc);
  return {
    ...pub,
    highlightsText: (doc.highlights || []).join("\n"),
  };
}

function activeFilter(placement) {
  const base = { active: true };
  if (placement === "navbar") return { ...base, showInNavbar: true };
  if (placement === "cohortsHero") return { ...base, showInCohortsHero: true };
  return base;
}

export async function listPublicBanners(placement) {
  await connectDB();
  const docs = await CohortBanner.find(activeFilter(placement))
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();
  return docs.map(toPublicBanner);
}

export async function listBannersForAdmin() {
  await connectDB();
  const docs = await CohortBanner.find({})
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();
  return docs.map(toAdminBanner);
}

export async function getBannerByBannerId(bannerId) {
  await connectDB();
  const doc = await CohortBanner.findOne({
    bannerId: bannerId.toLowerCase().trim(),
    active: true,
  }).lean();
  if (!doc) return null;
  return toPublicBanner(doc);
}

export async function createBanner(data) {
  await connectDB();
  const bannerId = data.bannerId.toLowerCase().trim().replace(/\s+/g, "-");
  const existing = await CohortBanner.findOne({ bannerId });
  if (existing) return { error: "banner_id_exists" };

  const highlights = parseHighlights(data.highlights, data.highlightsText);

  const doc = await CohortBanner.create({
    bannerId,
    active: Boolean(data.active ?? true),
    showInNavbar: Boolean(data.showInNavbar ?? true),
    showInCohortsHero: Boolean(data.showInCohortsHero ?? true),
    eyebrow: data.eyebrow.trim(),
    title: data.title.trim(),
    tagline: data.tagline.trim(),
    highlights,
    duration: data.duration.trim(),
    format: data.format.trim(),
    feeNaira: Math.round(Number(data.feeNaira)),
    whatsapp: data.whatsapp?.trim() || "",
    whatsappUrl: data.whatsappUrl?.trim() || "",
    flyerImage: data.flyerImage.trim(),
    applyPath: data.applyPath?.trim() || "/programs",
    navHeadline: data.navHeadline?.trim() || "",
    navSubline: data.navSubline?.trim() || "",
    navCta: data.navCta?.trim() || "See details",
    sortOrder: Number(data.sortOrder) || 0,
  });

  return { banner: toAdminBanner(doc.toObject()) };
}

export async function updateBanner(bannerId, updates) {
  await connectDB();
  const doc = await CohortBanner.findOne({
    bannerId: bannerId.toLowerCase().trim(),
  });
  if (!doc) return null;

  if (updates.active !== undefined) doc.active = Boolean(updates.active);
  if (updates.showInNavbar !== undefined)
    doc.showInNavbar = Boolean(updates.showInNavbar);
  if (updates.showInCohortsHero !== undefined)
    doc.showInCohortsHero = Boolean(updates.showInCohortsHero);
  if (updates.eyebrow !== undefined) doc.eyebrow = updates.eyebrow.trim();
  if (updates.title !== undefined) doc.title = updates.title.trim();
  if (updates.tagline !== undefined) doc.tagline = updates.tagline.trim();
  if (updates.duration !== undefined) doc.duration = updates.duration.trim();
  if (updates.format !== undefined) doc.format = updates.format.trim();
  if (updates.feeNaira !== undefined)
    doc.feeNaira = Math.round(Number(updates.feeNaira));
  if (updates.whatsapp !== undefined) doc.whatsapp = updates.whatsapp.trim();
  if (updates.whatsappUrl !== undefined)
    doc.whatsappUrl = updates.whatsappUrl.trim();
  if (updates.flyerImage !== undefined)
    doc.flyerImage = updates.flyerImage.trim();
  if (updates.applyPath !== undefined) doc.applyPath = updates.applyPath.trim();
  if (updates.navHeadline !== undefined)
    doc.navHeadline = updates.navHeadline.trim();
  if (updates.navSubline !== undefined)
    doc.navSubline = updates.navSubline.trim();
  if (updates.navCta !== undefined) doc.navCta = updates.navCta.trim();
  if (updates.sortOrder !== undefined) doc.sortOrder = Number(updates.sortOrder);

  if (updates.highlights !== undefined || updates.highlightsText !== undefined) {
    doc.highlights = parseHighlights(updates.highlights, updates.highlightsText);
  }

  await doc.save();
  return toAdminBanner(doc.toObject());
}

export async function deleteBanner(bannerId) {
  await connectDB();
  const result = await CohortBanner.deleteOne({
    bannerId: bannerId.toLowerCase().trim(),
  });
  return result.deletedCount > 0;
}

function parseHighlights(highlights, highlightsText) {
  if (Array.isArray(highlights)) {
    return highlights.map((h) => String(h).trim()).filter(Boolean);
  }
  if (typeof highlightsText === "string") {
    return highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}
