import connectDB from "@/lib/db";
import Program from "@/lib/models/Program";
import { formatNairaFromKobo, koboToNaira } from "@/lib/programs";

export function formatNaira(amountNaira) {
  return `₦${Number(amountNaira).toLocaleString("en-NG")}`;
}

export function toPublicProgram(doc, index = 0) {
  const priceNaira = koboToNaira(doc.amount);
  const originalNaira = doc.originalAmount
    ? koboToNaira(doc.originalAmount)
    : null;

  return {
    id: doc._id?.toString() || index + 1,
    programId: doc.programId,
    category: [doc.category, "all"],
    featured: Boolean(doc.featured),
    title: doc.title,
    desc: doc.description,
    duration: doc.duration,
    tags: doc.tags || [],
    skills: (doc.skills || []).map((s) =>
      typeof s === "string" ? { label: s, icon: "tools" } : s
    ),
    image: doc.image,
    bestSeller: Boolean(doc.bestSeller),
    originalPrice: originalNaira,
    price: formatNaira(priceNaira),
    priceValue: priceNaira,
    available: Boolean(doc.available),
  };
}

export function toAdminProgram(doc) {
  return {
    id: doc.programId,
    programId: doc.programId,
    title: doc.title,
    description: doc.description,
    duration: doc.duration,
    category: doc.category,
    tags: doc.tags || [],
    skills: doc.skills || [],
    image: doc.image,
    price: koboToNaira(doc.amount),
    originalPrice: doc.originalAmount ? koboToNaira(doc.originalAmount) : null,
    amount: doc.amount,
    originalAmount: doc.originalAmount,
    available: Boolean(doc.available),
    featured: Boolean(doc.featured),
    bestSeller: Boolean(doc.bestSeller),
    sortOrder: doc.sortOrder ?? 0,
  };
}

export function toPaystackProgram(doc) {
  return {
    name: doc.title,
    amount: doc.amount,
    originalAmount: doc.originalAmount,
    description: doc.description,
    available: Boolean(doc.available),
  };
}

export async function listProgramsForPublic() {
  await connectDB();
  const docs = await Program.find({})
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();
  return docs.map((doc, i) => toPublicProgram(doc, i));
}

export async function listProgramsForAdmin() {
  await connectDB();
  const docs = await Program.find({})
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();
  return docs.map(toAdminProgram);
}

export async function getProgramByProgramId(programId) {
  await connectDB();
  const doc = await Program.findOne({
    programId: programId.toLowerCase().trim(),
  }).lean();
  return doc;
}

export async function getPublicProgramByProgramId(programId) {
  const doc = await getProgramByProgramId(programId);
  if (!doc) return null;
  return toPublicProgram(doc);
}

export async function getProgramForPayment(programId) {
  const doc = await getProgramByProgramId(programId);
  if (!doc) return null;
  return toPaystackProgram(doc);
}

export async function updateProgram(programId, updates) {
  await connectDB();

  const doc = await Program.findOne({ programId: programId.toLowerCase().trim() });
  if (!doc) return null;

  if (updates.title !== undefined) doc.title = updates.title.trim();
  if (updates.description !== undefined)
    doc.description = updates.description.trim();
  if (updates.duration !== undefined) doc.duration = updates.duration.trim();
  if (updates.category !== undefined) doc.category = updates.category;
  if (updates.tags !== undefined) doc.tags = updates.tags;
  if (updates.skills !== undefined) doc.skills = updates.skills;
  if (updates.image !== undefined) doc.image = updates.image.trim();
  if (updates.available !== undefined) doc.available = Boolean(updates.available);
  if (updates.featured !== undefined) doc.featured = Boolean(updates.featured);
  if (updates.bestSeller !== undefined) doc.bestSeller = Boolean(updates.bestSeller);
  if (updates.sortOrder !== undefined) doc.sortOrder = updates.sortOrder;

  if (updates.price !== undefined) {
    doc.amount = Math.round(Number(updates.price) * 100);
  }
  if (updates.amount !== undefined) {
    doc.amount = Math.round(Number(updates.amount));
  }
  if (updates.originalPrice !== undefined) {
    doc.originalAmount =
      updates.originalPrice === null || updates.originalPrice === ""
        ? null
        : Math.round(Number(updates.originalPrice) * 100);
  }
  if (updates.originalAmount !== undefined) {
    doc.originalAmount =
      updates.originalAmount === null
        ? null
        : Math.round(Number(updates.originalAmount));
  }

  await doc.save();
  return toAdminProgram(doc.toObject());
}

export { formatNairaFromKobo };
