/** Brand URLs and inboxes for transactional email */

export const ACADEMY_URL = "https://learn.hokagecreativelabs.com";

export const COMPANY_URL = "https://hokagecreativelabs.com";

export const CONTACT_EMAIL = "info@hokagecreativelabs.com";

export const PAYMENT_ADMIN_EMAIL = "hokage@hokagecreativelabs.com";

export function getLogoUrl() {
  const override = process.env.EMAIL_LOGO_URL?.trim();
  if (override) return override;
  return `${ACADEMY_URL.replace(/\/$/, "")}/hcl-logo.png`;
}
