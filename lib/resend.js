import { Resend } from "resend";
import { logError } from "@/lib/logger";
import {
  CONTACT_EMAIL,
  PAYMENT_ADMIN_EMAIL,
} from "@/lib/emails/constants";

let client = null;

function normalizeResendError(error) {
  if (!error) return "Unknown email provider error";
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
    if (typeof error.name === "string" && error.name.trim()) {
      return error.name;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown email provider error";
    }
  }
  return "Unknown email provider error";
}

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export function getFromAddress() {
  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    null;

  if (!from) {
    throw new Error(
      "RESEND_FROM is not set. Use a verified domain, e.g. HCL Academy <noreply@yourdomain.com>"
    );
  }

  return from.includes("<") ? from : `HCL Academy <${from}>`;
}

/** Contact form notifications → info@ by default */
export function getContactAdminEmail() {
  return process.env.CONTACT_ADMIN_EMAIL?.trim() || CONTACT_EMAIL;
}

/** Payment notifications */
export function getPaymentAdminEmail() {
  return (
    process.env.PAYMENT_ADMIN_EMAIL?.trim() ||
    process.env.NOTIFICATION_EMAIL?.trim() ||
    PAYMENT_ADMIN_EMAIL
  );
}

/** @deprecated Use getContactAdminEmail or getPaymentAdminEmail */
export function getAdminEmail() {
  return getContactAdminEmail();
}

/**
 * @param {{ to: string, subject: string, html: string, text?: string, replyTo?: string, idempotencyKey?: string }} params
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  idempotencyKey,
}) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, reason: "RESEND_API_KEY not configured" };
  }

  let from;
  try {
    from = getFromAddress();
  } catch (error) {
    return { ok: false, reason: error.message };
  }

  const payload = {
    from,
    to: [to],
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  };

  const options = idempotencyKey ? { idempotencyKey } : undefined;

  let data;
  let error;
  try {
    const response = await resend.emails.send(payload, options);
    data = response?.data;
    error = response?.error;
  } catch (caughtError) {
    const message = normalizeResendError(caughtError);
    logError("resend", message);
    return { ok: false, reason: message };
  }

  if (error) {
    const message = normalizeResendError(error);
    logError("resend", message);
    return { ok: false, reason: message };
  }

  return { ok: true, id: data?.id };
}

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim()
  );
}
