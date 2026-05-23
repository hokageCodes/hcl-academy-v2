/**
 * Server-side program catalog — amounts in kobo (Paystack).
 * Keep in sync with frontend program cards on /programs.
 */
export const VALID_PROGRAMS = {
  "intro-to-web-development": {
    name: "Intro to Web Development",
    amount: 10000000, // ₦100,000
    originalAmount: 15000000, // ₦150,000
    description: "8-week comprehensive web development program",
    available: true,
  },
  "ui-ux-design-fundamentals": {
    name: "UI/UX Design Fundamentals",
    amount: 8000000, // ₦80,000
    originalAmount: 10000000, // ₦100,000
    description: "6-week UI/UX design program",
    available: false,
  },
  "vibe-coding-essentials": {
    name: "Vibe Coding Essentials",
    amount: 5000000, // ₦50,000
    originalAmount: null,
    description: "4-week AI-assisted development program",
    available: false,
  },
};

export function formatNairaFromKobo(kobo) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

export function koboToNaira(kobo) {
  return kobo / 100;
}
