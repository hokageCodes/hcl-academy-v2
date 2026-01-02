import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Unique payment reference from Paystack
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Student information
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Program information
    programId: {
      type: String,
      required: true,
    },
    programName: {
      type: String,
      required: true,
    },

    // Payment details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },

    // Payment status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "abandoned", "refunded"],
      default: "pending",
      index: true,
    },

    // Paystack response data
    channel: {
      type: String,
      default: null,
    },
    gatewayResponse: {
      type: String,
      default: null,
    },
    paystackId: {
      type: Number,
      default: null,
    },

    // Timestamps from Paystack
    paidAt: {
      type: Date,
      default: null,
    },

    // Webhook processing
    webhookProcessedAt: {
      type: Date,
      default: null,
    },
    webhookAttempts: {
      type: Number,
      default: 0,
    },

    // Audit trail
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },

    // Admin notes
    adminNotes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
PaymentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for amount in Naira (from kobo)
PaymentSchema.virtual("amountInNaira").get(function () {
  return this.amount / 100;
});

// Index for common queries
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ email: 1, status: 1 });
PaymentSchema.index({ programId: 1, status: 1 });

// Static method to find by reference
PaymentSchema.statics.findByReference = function (reference) {
  return this.findOne({ reference });
};

// Static method to check if reference exists
PaymentSchema.statics.referenceExists = async function (reference) {
  const count = await this.countDocuments({ reference });
  return count > 0;
};

// Instance method to mark as completed
PaymentSchema.methods.markAsCompleted = async function (paystackData) {
  this.status = "completed";
  this.channel = paystackData.channel;
  this.gatewayResponse = paystackData.gateway_response;
  this.paystackId = paystackData.id;
  this.paidAt = new Date(paystackData.paid_at);
  this.webhookProcessedAt = new Date();
  this.webhookAttempts += 1;
  return this.save();
};

// Instance method to mark as failed
PaymentSchema.methods.markAsFailed = async function (reason) {
  this.status = "failed";
  this.gatewayResponse = reason;
  this.webhookProcessedAt = new Date();
  this.webhookAttempts += 1;
  return this.save();
};

// Prevent model recompilation in development
const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;

