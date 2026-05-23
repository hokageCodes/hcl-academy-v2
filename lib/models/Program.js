import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    icon: { type: String, default: "tools" },
  },
  { _id: false }
);

const ProgramSchema = new mongoose.Schema(
  {
    programId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["development", "design", "ai"],
      required: true,
    },
    tags: { type: [String], default: [] },
    skills: { type: [SkillSchema], default: [] },
    image: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    originalAmount: { type: Number, default: null, min: 0 },
    available: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProgramSchema.index({ category: 1, sortOrder: 1 });

const Program =
  mongoose.models.Program || mongoose.model("Program", ProgramSchema);

export default Program;
