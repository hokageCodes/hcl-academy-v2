import connectDB from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { sendPaymentConfirmationEmails } from "@/lib/email";
import { logError } from "@/lib/logger";

/**
 * Send confirmation emails once per payment (idempotent).
 */
export async function notifyPaymentCompleted(payment, { force = false } = {}) {
  if (payment.confirmationEmailsSent && !force) {
    return { skipped: true, reason: "already_sent" };
  }

  const result = await sendPaymentConfirmationEmails(payment);

  if (result.sent) {
    payment.confirmationEmailsSent = true;
    await payment.save();
  }

  return result;
}

/**
 * Webhook completes payments first; verify reads DB, waits briefly, then falls back to Paystack API.
 */
export async function processPaymentEmailNotification(reference, options = {}) {
  await connectDB();
  const payment = await Payment.findByReference(reference);

  if (!payment || payment.status !== "completed") {
    return { skipped: true, reason: "not_completed" };
  }

  return notifyPaymentCompleted(payment, options);
}

export function schedulePaymentEmailNotification(reference) {
  void processPaymentEmailNotification(reference).catch((err) => {
    logError("email", err);
  });
}
