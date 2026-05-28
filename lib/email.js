import {
  buildContactAdminEmail,
  buildContactUserEmail,
} from "@/lib/emails/contact";
import {
  buildBankTransferAdminEmail,
  buildBankTransferStudentEmail,
} from "@/lib/emails/bankTransfer";
import {
  buildPaymentAdminEmail,
  buildPaymentStudentEmail,
} from "@/lib/emails/payment";
import {
  getContactAdminEmail,
  getPaymentAdminEmail,
  sendEmail,
} from "@/lib/resend";
import { getBankTransferDetails } from "@/lib/bankTransfer";
import { logInfo, logWarn } from "@/lib/logger";

/**
 * Send student + admin confirmation emails for a completed payment.
 */
export async function sendPaymentConfirmationEmails(payment) {
  const studentContent = buildPaymentStudentEmail(payment);
  const adminContent = buildPaymentAdminEmail(payment);

  const studentResult = await sendEmail({
    to: payment.email,
    subject: studentContent.subject,
    html: studentContent.html,
    text: studentContent.text,
    idempotencyKey: `payment-receipt/${payment.reference}`,
  });

  if (!studentResult.ok) {
    return {
      sent: false,
      reason: studentResult.reason || "student_email_failed",
    };
  }

  const adminResult = await sendEmail({
    to: getPaymentAdminEmail(),
    subject: adminContent.subject,
    html: adminContent.html,
    text: adminContent.text,
    replyTo: payment.email,
    idempotencyKey: `payment-admin/${payment.reference}`,
  });

  if (!adminResult.ok) {
    return {
      sent: false,
      reason: adminResult.reason || "admin_email_failed",
      partial: true,
    };
  }

  logInfo("email", `Payment confirmation sent (${payment.reference})`);
  return { sent: true, provider: "resend" };
}

/**
 * Send admin notification + auto-reply for contact form submissions.
 */
export async function sendContactFormEmails({ name, email, program, message }) {
  const slug = email.replace(/[^a-z0-9]/gi, "").slice(0, 24);
  const stamp = Date.now();

  const adminContent = buildContactAdminEmail({ name, email, program, message });
  const adminResult = await sendEmail({
    to: getContactAdminEmail(),
    subject: adminContent.subject,
    html: adminContent.html,
    text: adminContent.text,
    replyTo: email,
    idempotencyKey: `contact-admin/${slug}/${stamp}`,
  });

  if (!adminResult.ok) {
    return { sent: false, reason: adminResult.reason || "admin_email_failed" };
  }

  const userContent = buildContactUserEmail({ name });
  const userResult = await sendEmail({
    to: email,
    subject: userContent.subject,
    html: userContent.html,
    text: userContent.text,
    idempotencyKey: `contact-reply/${slug}/${stamp}`,
  });

  if (!userResult.ok) {
    return {
      sent: false,
      reason: userResult.reason || "auto_reply_failed",
      partial: true,
    };
  }

  logInfo("email", "Contact form notification sent");
  return { sent: true, provider: "resend" };
}

export async function sendBankTransferIntentEmails(payment, proof = {}) {
  if (payment.bankTransferSubmissionEmailSent) {
    return { sentToStudent: true, sentToAdmin: true, skipped: true };
  }
  const bankDetails = getBankTransferDetails();
  const studentContent = buildBankTransferStudentEmail(payment, bankDetails);
  const adminContent = buildBankTransferAdminEmail(payment, proof, bankDetails);

  const studentResult = await sendEmail({
    to: payment.email,
    subject: studentContent.subject,
    html: studentContent.html,
    text: studentContent.text,
    idempotencyKey: `bank-transfer-student/${payment.reference}`,
  });

  const adminResult = await sendEmail({
    to: getPaymentAdminEmail(),
    subject: adminContent.subject,
    html: adminContent.html,
    text: adminContent.text,
    replyTo: payment.email,
    idempotencyKey: `bank-transfer-admin/${payment.reference}`,
  });

  if (studentResult.ok && adminResult.ok) {
    payment.bankTransferSubmissionEmailSent = true;
    await payment.save();
  }

  if (!studentResult.ok) {
    logWarn(
      "email",
      `Bank transfer student email failed (${payment.reference}): ${
        studentResult.reason || "unknown"
      }`
    );
  }
  if (!adminResult.ok) {
    logWarn(
      "email",
      `Bank transfer admin email failed (${payment.reference}): ${
        adminResult.reason || "unknown"
      }`
    );
  }

  return {
    sentToStudent: studentResult.ok,
    sentToAdmin: adminResult.ok,
    studentReason: studentResult.reason || null,
    adminReason: adminResult.reason || null,
    provider: "resend",
  };
}
