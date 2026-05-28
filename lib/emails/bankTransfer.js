import { ACADEMY_URL } from "@/lib/emails/constants";
import { detailTable, emailLayout, escapeHtml } from "@/lib/emails/layout";
import { formatNairaFromKobo } from "@/lib/programs";

export function buildBankTransferStudentEmail(payment, bankDetails) {
  const amount = formatNairaFromKobo(payment.amount);
  const rows = [
    ["Program", escapeHtml(payment.programName)],
    ["Amount to transfer", escapeHtml(amount)],
    ["Bank", escapeHtml(bankDetails.bankName)],
    ["Account name", escapeHtml(bankDetails.accountName)],
    ["Account number", escapeHtml(bankDetails.accountNumber)],
    ["Reference", `<code>${escapeHtml(payment.reference)}</code>`],
  ];

  const html = emailLayout({
    preheader: "Complete your bank transfer to secure your slot",
    headline: "Bank transfer details",
    bodyHtml: `
      <p style="margin:0 0 12px">Hi ${escapeHtml(payment.firstName)},</p>
      <p style="margin:0 0 12px">We received your enrollment information. Complete the transfer below and keep your reference for confirmation.</p>
      ${detailTable(rows)}
      <p style="margin:20px 0 8px;font-weight:600">What to do next</p>
      <ol style="margin:0;padding-left:18px;line-height:1.7">
        <li>Transfer the exact amount to the account above.</li>
        <li>Keep your transfer receipt or screenshot.</li>
        <li>Send proof to <b>${escapeHtml(
          bankDetails.supportWhatsApp
        )}</b> or reply to this email with your reference: <b>${escapeHtml(
      payment.reference
    )}</b>.</li>
      </ol>
      <p style="margin:18px 0 0">We've received your transfer proof and we're verifying it now. Once confirmed, you'll get your onboarding details and class next steps.</p>
    `,
    cta: {
      href: `${ACADEMY_URL.replace(/\/$/, "")}/programs`,
      label: "Back to programs",
    },
  });

  const text = `Hi ${payment.firstName},

Complete your transfer to secure your slot:
- Program: ${payment.programName}
- Amount: ${amount}
- Bank: ${bankDetails.bankName}
- Account name: ${bankDetails.accountName}
- Account number: ${bankDetails.accountNumber}
- Reference: ${payment.reference}

What to do next:
1) Transfer the exact amount above
2) Keep your receipt/screenshot
3) Send proof to ${bankDetails.supportWhatsApp} or reply to this email with your reference (${payment.reference})

We've received your transfer proof and we're verifying it now.
Once confirmed, we'll send onboarding details.`;

  return {
    subject: `Bank transfer details: ${payment.programName}`,
    html,
    text,
  };
}

export function buildBankTransferAdminEmail(payment, proof, bankDetails) {
  const amount = formatNairaFromKobo(payment.amount);
  const rows = [
    ["Student", escapeHtml(payment.fullName)],
    ["Email", escapeHtml(payment.email)],
    ["Phone", escapeHtml(payment.phone)],
    ["Program", escapeHtml(payment.programName)],
    ["Amount", escapeHtml(amount)],
    ["Reference", `<code>${escapeHtml(payment.reference)}</code>`],
    ["Payment method", "Bank transfer"],
    ["Transfer reference", escapeHtml(payment.transferReference || "Not provided")],
    ["Proof URL", escapeHtml(proof.proofUrl || "Not provided")],
    ["Proof note", escapeHtml(proof.proofNote || "Not provided")],
  ];

  const html = emailLayout({
    preheader: `New bank transfer enrollment (${payment.reference})`,
    headline: "New bank transfer enrollment",
    align: "left",
    bodyHtml: `
      <p style="margin:0 0 12px">A learner started enrollment via bank transfer.</p>
      ${detailTable(rows)}
      <p style="margin:16px 0 8px">Bank account used: ${escapeHtml(
        bankDetails.bankName
      )} · ${escapeHtml(bankDetails.accountNumber)}</p>
      <p style="margin:0 0 8px;font-weight:600">Admin action</p>
      <ol style="margin:0;padding-left:18px;line-height:1.7">
        <li>Confirm incoming transfer using reference <b>${escapeHtml(
          payment.reference
        )}</b>.</li>
        <li>Open <b>/admin/payments</b> and mark as completed after confirmation.</li>
        <li>If mismatch or no transfer, keep pending or mark failed with notes.</li>
      </ol>
    `,
  });

  const text = `New bank transfer enrollment
Reference: ${payment.reference}
Student: ${payment.fullName}
Email: ${payment.email}
Phone: ${payment.phone}
Program: ${payment.programName}
Amount: ${amount}
Proof URL: ${proof.proofUrl || "Not provided"}
Proof note: ${proof.proofNote || "Not provided"}

Admin action:
- Confirm transfer in bank dashboard
- Update status in /admin/payments
- Mark completed only after confirmation`;

  return {
    subject: `Bank transfer enrollment: ${payment.fullName}`,
    html,
    text,
  };
}

