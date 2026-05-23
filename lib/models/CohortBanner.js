import mongoose from "mongoose";

const CohortBannerSchema = new mongoose.Schema(
  {
    bannerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    active: { type: Boolean, default: true },
    showInNavbar: { type: Boolean, default: true },
    showInCohortsHero: { type: Boolean, default: true },
    eyebrow: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    highlights: { type: [String], default: [] },
    duration: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    feeNaira: { type: Number, required: true, min: 0 },
    whatsapp: { type: String, default: "", trim: true },
    whatsappUrl: { type: String, default: "", trim: true },
    flyerImage: { type: String, required: true, trim: true },
    applyPath: { type: String, default: "/programs", trim: true },
    navHeadline: { type: String, default: "", trim: true },
    navSubline: { type: String, default: "", trim: true },
    navCta: { type: String, default: "See details", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CohortBannerSchema.index({ active: 1, sortOrder: 1 });

const CohortBanner =
  mongoose.models.CohortBanner ||
  mongoose.model("CohortBanner", CohortBannerSchema);

export default CohortBanner;
