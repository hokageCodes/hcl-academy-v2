/** Web Development Bootcamp 2026 — shared copy for navbar promo + landing page */

export const WEB_DEV_CURRICULUM = {
  structure: {
    title: "Structure",
    description:
      "Before you write code, we map how the web fits together so every term you hear later makes sense.",
    topics: [
      "How the web works",
      "The internet vs the web",
      "Databases, APIs, frontend, backend — we clarify each term",
    ],
  },
  program: {
    title: "Program",
    description:
      "A step-by-step path from foundations to a portfolio you can show employers.",
    modules: [
      { title: "Git & version control + GitHub" },
      {
        title: "HTML",
        note: "Milestone project after this module",
      },
      {
        title: "CSS 1",
        subtitle: "Basics, typography, color, fonts, and core styling",
      },
      {
        title: "CSS 2",
        subtitle: "Flexbox and layout on the page",
        note: "Milestone project after this module",
      },
      {
        title: "Team project",
        subtitle: "Collaborate with peers and learn how real teams ship work",
      },
      {
        title: "Intro to JavaScript",
        subtitle: "Interactions and behavior on the webpage",
      },
      {
        title: "Final portfolio / finishing project",
        subtitle: "Bring everything together into a project you can showcase",
      },
    ],
  },
};

export const WEB_DEV_BOOTCAMP_2026 = {
  slug: "2026",
  path: "/cohorts/2026",
  eyebrow: "Now enrolling · Class of 2026",
  title: "Beginner-friendly Web Development Bootcamp",
  tagline: "Learn to build websites from scratch",
  highlights: [
    "Learn HTML, CSS & JavaScript",
    "Build real-world web pages from scratch",
    "Understand how websites actually work",
    "Hands-on practical learning",
  ],
  curriculum: WEB_DEV_CURRICULUM,
  duration: "6 weeks",
  format: "Virtual",
  feeNaira: 80000,
  feeLabel: "₦80,000",
  whatsapp: "09035104366",
  whatsappUrl: "https://wa.me/2349035104366",
  applyPath: "/programs",
  flyerImage: "/cohorts/web-dev-bootcamp-2026.png",
};

/** Short copy for the navbar announcement (fits one bar) */
export function getCurriculumForProgram(programId) {
  if (programId === "intro-to-web-development") {
    return WEB_DEV_BOOTCAMP_2026.curriculum;
  }
  return null;
}

/** Curriculum outline for cohort detail pages keyed by bannerId */
export function getCurriculumForBanner(bannerId) {
  if (bannerId === WEB_DEV_BOOTCAMP_2026.slug) {
    return WEB_DEV_BOOTCAMP_2026.curriculum;
  }
  return null;
}

export const NAV_PROMO_BOOTCAMP_2026 = {
  href: WEB_DEV_BOOTCAMP_2026.path,
  eyebrow: WEB_DEV_BOOTCAMP_2026.eyebrow,
  headline: `${WEB_DEV_BOOTCAMP_2026.tagline}`,
  subline: `6 weeks · Virtual · ${WEB_DEV_BOOTCAMP_2026.feeLabel} · Web Dev Bootcamp 2026`,
  cta: "See details",
};
