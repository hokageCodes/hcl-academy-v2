import { ACADEMY_URL, CONTACT_EMAIL } from "@/lib/emails/constants";
import {
  detailTable,
  emailLayout,
  escapeHtml,
  messageBlock,
} from "@/lib/emails/layout";

const PROGRAM_LABELS = {
  "intro-to-web-development": "Intro to Web Development",
  "ui-ux-design-fundamentals": "UI/UX Design Fundamentals",
  "vibe-coding-essentials": "Vibe Coding Essentials",
  general: "General inquiry",
};

export function getContactProgramLabel(program) {
  return PROGRAM_LABELS[program] || program || "Not specified";
}

export function buildContactAdminEmail({ name, email, program, message }) {
  const programLabel = getContactProgramLabel(program);

  const html = emailLayout({
    preheader: `New message from ${name}`,
    headline: "Someone reached out",
    align: "left",
    bodyHtml: `
      <p style="margin:0 0 16px">A new message just came in through the contact form. Here are the details.</p>
      ${detailTable([
        ["Name", escapeHtml(name)],
        [
          "Email",
          `<a href="mailto:${escapeHtml(email)}" style="color:#21083F;text-decoration:none;font-weight:600">${escapeHtml(email)}</a>`,
        ],
        ["Program interest", escapeHtml(programLabel)],
      ])}
      <p style="margin:24px 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#6b6b76">Their message</p>
      ${messageBlock(message)}
    `,
    cta: {
      href: `mailto:${email}`,
      label: "Reply to them",
    },
  });

  const text = `New contact from ${name} (${email})
Program: ${programLabel}

${message}`;

  return {
    subject: `Contact form: ${name}`,
    html,
    text,
  };
}

export function buildContactUserEmail({ name }) {
  const html = emailLayout({
    preheader: "We received your message and will reply soon.",
    headline: "Thanks for saying hello",
    bodyHtml: `
      <p style="margin:0 0 16px">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 16px">We're glad you reached out. Your message is with our team now, and we usually reply within one business day.</p>
      <p style="margin:0;font-size:15px;color:#6b6b76">While you wait, explore our programs or email us at ${escapeHtml(CONTACT_EMAIL)} if you need anything sooner.</p>
    `,
    cta: {
      href: `${ACADEMY_URL.replace(/\/$/, "")}/programs`,
      label: "Browse our programs",
    },
  });

  const text = `Hi ${name},

Thanks for contacting HCL Academy. We've received your message and will get back to you within one business day.

If your question is urgent, call +234 903 510 4366 or email ${CONTACT_EMAIL}.

HCL Academy`;

  return {
    subject: "We received your message | HCL Academy",
    html,
    text,
  };
}
