import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/cohorts", label: "Cohorts" },
];

const academyLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/admissions", label: "Admissions" },
  { href: "/mentorship", label: "Mentorship" },
];

const legalLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

const socialLinks = [
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "LinkedIn", icon: Linkedin },
];

const footerLinkClass =
  "font-body text-sm text-neutral-text/75 transition-colors hover:text-primary";

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wide text-neutral-text">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={footerLinkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-gray bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 focus-visible:ring-offset-2"
            >
              <Image
                src="/hcl-logo.png"
                alt="HCL Academy Logo"
                width={64}
                height={64}
                className="h-14 w-auto rounded-xl"
              />
            </Link>
            <p className="mt-5 max-w-sm font-body text-sm leading-relaxed text-neutral-text/75">
              Learn in-demand digital skills from scratch. Build real projects
              with a community that has your back.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-neutral-gray/80 bg-white text-neutral-text transition-colors hover:border-accent-light/50 hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterLinkGroup title="Academy" links={academyLinks} />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wide text-neutral-text">
              Get started
            </h3>
            <p className="font-body text-sm leading-relaxed text-neutral-text/75">
              Ready to learn web development or UI/UX? Browse our programs and
              apply today.
            </p>
            <Link
              href="/programs"
              className={cn(
                "mt-5 inline-flex items-center rounded-xl bg-primary px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-accent-light hover:text-primary"
              )}
            >
              View Programs
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-neutral-gray/80 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-sm text-neutral-text/60">
            &copy; {new Date().getFullYear()} HCL Academy. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={footerLinkClass}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-neutral-text transition-colors hover:text-primary"
            >
              Back to top
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
