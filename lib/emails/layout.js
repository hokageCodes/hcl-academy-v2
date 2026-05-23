/** Shared transactional email shell — HCL brand, plain white */

import {
  ACADEMY_URL,
  COMPANY_URL,
  CONTACT_EMAIL,
  getLogoUrl,
} from "@/lib/emails/constants";

const BRAND = {
  purple: "#21083F",
  text: "#2a2a33",
  muted: "#6b6b76",
  border: "#ebebef",
};

export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailHeader() {
  const logoUrl = getLogoUrl();
  const academyUrl = ACADEMY_URL.replace(/\/$/, "");

  return `
    <a href="${escapeHtml(academyUrl)}" style="text-decoration:none;display:inline-block">
      <img
        src="${escapeHtml(logoUrl)}"
        width="80"
        height="80"
        alt="HCL Academy"
        style="display:block;margin:0 auto 12px;border:0;outline:none;width:80px;height:auto;max-width:80px"
      />
    </a>
    <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.purple}">HCL Academy</p>`;
}

function emailFooter() {
  const academyHost = ACADEMY_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const companyHost = COMPANY_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return `
    <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.65;color:${BRAND.muted}">
      Questions? Email
      <a href="mailto:${escapeHtml(CONTACT_EMAIL)}" style="color:${BRAND.purple};font-weight:600;text-decoration:none">${escapeHtml(CONTACT_EMAIL)}</a>
      or call
      <a href="tel:+2349035104366" style="color:${BRAND.purple};font-weight:600;text-decoration:none">+234 903 510 4366</a>
    </p>
    <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.65;color:${BRAND.muted}">
      <a href="${escapeHtml(ACADEMY_URL)}" style="color:${BRAND.purple};font-weight:600;text-decoration:none">${escapeHtml(academyHost)}</a>
      <span style="color:#c4c4cc"> &nbsp;·&nbsp; </span>
      <a href="${escapeHtml(COMPANY_URL)}" style="color:${BRAND.purple};font-weight:600;text-decoration:none">${escapeHtml(companyHost)}</a>
    </p>
    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#9a9aa8">
      Hokage Creative Labs
    </p>`;
}

/**
 * @param {{ preheader: string, headline: string, bodyHtml: string, cta?: { href: string, label: string }, align?: 'center' | 'left' }} opts
 */
export function emailLayout({
  preheader,
  headline,
  bodyHtml,
  cta,
  align = "center",
}) {
  const textAlign = align === "left" ? "left" : "center";

  const ctaBlock = cta
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0">
        <tr>
          <td align="center" style="border-radius:999px;background:${BRAND.purple}">
            <a href="${escapeHtml(cta.href)}" style="display:block;padding:16px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center">${escapeHtml(cta.label)}</a>
          </td>
        </tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff">
    <tr>
      <td align="center" style="padding:0;background:#ffffff">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
          <tr>
            <td align="center" style="padding:40px 32px 28px;background:#ffffff;text-align:center">
              ${emailHeader()}
              <h1 style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:26px;font-weight:700;line-height:1.3;color:${BRAND.purple};max-width:420px">${escapeHtml(headline)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.7;color:${BRAND.text};text-align:${textAlign}">
              ${bodyHtml}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:36px 32px 48px;background:#ffffff;text-align:center;border-top:1px solid ${BRAND.border};margin-top:8px">
              ${emailFooter()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function detailTable(rows) {
  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};font-size:13px;color:${BRAND.muted};width:36%;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};font-size:14px;font-weight:600;color:${BRAND.text};vertical-align:top;text-align:left">${value}</td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;border-collapse:collapse;text-align:left">
      ${rowsHtml}
    </table>`;
}

export function messageBlock(text) {
  return `
    <div style="margin:20px 0 0;padding:18px 20px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:8px;font-size:15px;line-height:1.65;color:${BRAND.text};white-space:pre-wrap;text-align:left">${escapeHtml(text)}</div>`;
}

export function emptyValue() {
  return "Not provided";
}
