import { ACADEMY_URL } from "@/lib/emails/constants";
import { formatNairaFromKobo } from "@/lib/programs";
import {
  detailTable,
  emailLayout,
  emptyValue,
  escapeHtml,
} from "@/lib/emails/layout";

function formatPaidAt(paidAt) {
  if (!paidAt) return emptyValue();
  return new Date(paidAt).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildPaymentStudentEmail(payment) {
  const amount = formatNairaFromKobo(payment.amount);
  const paidAt = formatPaidAt(payment.paidAt);

  const rows = [
    ["Program", escapeHtml(payment.programName)],
    ["Amount paid", escapeHtml(amount)],
    [
      "Reference",
      `<span style="font-family:ui-monospace,monospace;font-size:13px;word-break:break-all">${escapeHtml(payment.reference)}</span>`,
    ],
    ["Date", escapeHtml(paidAt)],
  ];
  if (payment.channel) {
    rows.push(["Payment method", escapeHtml(payment.channel)]);
  }

  const html = emailLayout({
    preheader: `You're in. ${payment.programName} is confirmed.`,
    headline: "You're officially enrolled",
    bodyHtml: `
      <p style="margin:0 0 16px">Hi ${escapeHtml(payment.firstName)},</p>
      <p style="margin:0 0 16px">Thank you for choosing HCL Academy. Your payment went through, and your spot is confirmed. We're excited to have you on this cohort.</p>
      <p style="margin:0 0 4px;font-size:14px;color:#6b6b76">Save this email for your records:</p>
      ${detailTable(rows)}
      <p style="margin:24px 0 0;font-size:15px;color:#6b6b76">We'll be in touch soon with onboarding steps. If you have questions in the meantime, just reply to this email.</p>
    `,
    cta: {
      href: `${ACADEMY_URL.replace(/\/$/, "")}/programs`,
      label: "View program details",
    },
  });

  const text = `Hi ${payment.firstName},

Thank you for enrolling with HCL Academy. Your payment of ${amount} for ${payment.programName} was successful.

Reference: ${payment.reference}
Date: ${paidAt}

We'll send onboarding details soon.

HCL Academy`;

  return {
    subject: `You're enrolled: ${payment.programName}`,
    html,
    text,
  };
}

export function buildPaymentAdminEmail(payment) {
  const amount = formatNairaFromKobo(payment.amount);
  const paidAt = formatPaidAt(payment.paidAt);

  const rows = [
    ["Student", escapeHtml(payment.fullName)],
    [
      "Email",
      `<a href="mailto:${escapeHtml(payment.email)}" style="color:#21083F;text-decoration:none;font-weight:600">${escapeHtml(payment.email)}</a>`,
    ],
    ["Phone", escapeHtml(payment.phone || emptyValue())],
    ["Program", escapeHtml(payment.programName)],
    ["Amount", escapeHtml(amount)],
    [
      "Reference",
      `<span style="font-family:ui-monospace,monospace;font-size:13px;word-break:break-all">${escapeHtml(payment.reference)}</span>`,
    ],
    ["Paid at", escapeHtml(paidAt)],
  ];
  if (payment.channel) {
    rows.push(["Channel", escapeHtml(payment.channel)]);
  }

  const html = emailLayout({
    preheader: `New payment from ${payment.fullName}`,
    headline: "New enrolment payment",
    align: "left",
    bodyHtml: `
      <p style="margin:0 0 16px">A student just completed payment on the programs page. Details below.</p>
      ${detailTable(rows)}
    `,
    cta: {
      href: `mailto:${escapeHtml(payment.email)}`,
      label: "Email the student",
    },
  });

  const text = `New payment

Student: ${payment.fullName}
Email: ${payment.email}
Phone: ${payment.phone || "Not provided"}
Program: ${payment.programName}
Amount: ${amount}
Reference: ${payment.reference}
Paid at: ${paidAt}`;

  return {
    subject: `New payment: ${payment.fullName} (${payment.programName})`,
    html,
    text,
  };
}
