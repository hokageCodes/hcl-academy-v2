"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/cohorts", label: "Cohorts" },
  { href: "/contact", label: "Contact" },
];

const NAV_VISIBLE_MS = 5000;
const PROMO_VISIBLE_MS = 4000;

const navLinkClassName =
  "font-heading font-semibold tracking-tight text-neutral-text transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 focus-visible:ring-offset-2 rounded-sm";

const ctaClassName =
  "font-heading font-semibold shadow-card rounded-xl bg-primary text-white hover:bg-accent-light hover:text-primary transition-colors";

const shellClassName =
  "fixed top-4 sm:top-6 left-1/2 z-50 w-[calc(100%-0.5rem)] max-w-7xl -translate-x-1/2 sm:w-[calc(100%-1rem)] md:w-[98vw] lg:max-w-[90rem]";

const containerBaseClassName =
  "relative min-h-[88px] overflow-hidden rounded-2xl border shadow-glass transition-[background-color,border-color,box-shadow] duration-700 ease-in-out sm:min-h-[96px] md:min-h-[112px]";

const mobileLogoClass = "h-[72px] w-auto sm:h-20 md:h-[84px]";
const mobileMenuButtonClass = "size-[72px] sm:size-20";

function layerTransition(visible) {
  return cn(
    "absolute inset-0 flex items-center transition-all duration-700 ease-in-out",
    visible
      ? "z-10 translate-y-0 opacity-100"
      : "pointer-events-none z-0 translate-y-1 opacity-0"
  );
}

function NavContent() {
  return (
    <>
      <Link
        href="/"
        className="relative z-20 flex shrink-0 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 focus-visible:ring-offset-2"
      >
        <Image
          src="/hcl-logo.png"
          alt="HCL Academy Logo"
          width={96}
          height={96}
          className={cn("rounded-xl object-contain", mobileLogoClass)}
          priority
        />
      </Link>

      <div className="hidden flex-1 justify-center md:flex">
        <ul className="flex items-center gap-8 lg:gap-12">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  navLinkClassName,
                  "text-lg lg:text-xl xl:text-2xl"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-20 hidden min-w-[120px] items-center justify-end md:flex">
        <Button
          asChild
          variant="default"
          size="xl"
          className={cn(
            ctaClassName,
            "h-12 px-10 text-lg lg:h-14 lg:px-12 lg:text-xl"
          )}
        >
          <Link href="/programs">Apply</Link>
        </Button>
      </div>
    </>
  );
}

function PromoBanner({ banner, visible }) {
  if (!banner) return null;

  return (
    <Link
      href={banner.detailPath}
      className={cn(
        layerTransition(visible),
        "flex flex-col items-stretch justify-center gap-2 px-3 py-2.5 text-left",
        "pr-14 sm:gap-2.5 sm:px-5 sm:py-3 sm:pr-16",
        "md:flex-row md:items-center md:gap-6 md:px-16 md:py-3 md:pr-16 md:text-left",
        "lg:gap-10 lg:px-20"
      )}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-[10px] font-bold uppercase tracking-wide text-accent-light sm:text-xs sm:tracking-widest">
          {banner.eyebrow}
        </p>
        <p className="mt-0.5 line-clamp-2 font-heading text-xs font-bold leading-snug text-white sm:text-sm md:line-clamp-none md:text-base lg:text-lg">
          {banner.navHeadline}
        </p>
        <p className="mt-0.5 line-clamp-2 font-body text-[10px] leading-snug text-white/75 sm:mt-1 sm:text-xs sm:leading-relaxed md:line-clamp-none md:max-w-xl md:text-sm">
          {banner.navSubline}
        </p>
      </div>

      <span className="inline-flex w-fit max-w-full shrink-0 items-center gap-0.5 self-start rounded-lg bg-accent-light px-2.5 py-1 font-heading text-[10px] font-bold text-primary transition-colors hover:bg-white sm:gap-1 sm:self-auto sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs md:text-sm">
        <span className="truncate">{banner.navCta}</span>
        <ChevronRight className="size-3.5 shrink-0 sm:size-4" aria-hidden />
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBanners, setNavBanners] = useState([]);
  const [showPromo, setShowPromo] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const hasNavPromo = navBanners.length > 0;
  const activePromo = hasNavPromo ? navBanners[promoIndex] : null;

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("/api/banners?placement=navbar");
        const data = await res.json();
        if (data.success) setNavBanners(data.data.banners);
      } catch {
        setNavBanners([]);
      }
    }
    loadBanners();
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || paused || menuOpen || !hasNavPromo) return;

    const delay = showPromo ? PROMO_VISIBLE_MS : NAV_VISIBLE_MS;

    timerRef.current = window.setTimeout(() => {
      if (!showPromo) {
        setShowPromo(true);
        setPromoIndex(0);
      } else if (promoIndex < navBanners.length - 1) {
        setPromoIndex((i) => i + 1);
      } else {
        setShowPromo(false);
        setPromoIndex(0);
      }
    }, delay);
  }, [clearTimer, showPromo, promoIndex, navBanners.length, hasNavPromo, paused, menuOpen]);

  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [scheduleNext, clearTimer]);

  useEffect(() => {
    if (menuOpen) setShowPromo(false);
  }, [menuOpen]);

  const showNav = !showPromo || !hasNavPromo;

  return (
    <>
      <header className={shellClassName}>
        <div
          className={cn(
            containerBaseClassName,
            showPromo && hasNavPromo
              ? "min-h-[100px] sm:min-h-[104px] md:min-h-[112px]"
              : "",
            showPromo
              ? "border-primary/30 bg-primary"
              : "border-neutral-gray/30 bg-white"
          )}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <nav
            className={cn(
              layerTransition(showNav),
              "justify-between px-4 py-3 md:px-10 md:py-5 lg:px-12 lg:py-6"
            )}
            aria-label="Main navigation"
            aria-hidden={!showNav}
          >
            <NavContent />
          </nav>

          {hasNavPromo && (
            <PromoBanner banner={activePromo} visible={showPromo} />
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-1.5 top-1/2 z-30 -translate-y-1/2 shrink-0 rounded-xl md:hidden",
              showPromo
                ? "size-11 [&_svg]:size-6 sm:size-12 sm:[&_svg]:size-7"
                : cn(mobileMenuButtonClass, "[&_svg]:size-8 sm:right-3 sm:[&_svg]:size-9"),
              showPromo
                ? "text-white hover:bg-white/10 hover:text-white"
                : "text-neutral-text hover:bg-neutral-gray"
            )}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu strokeWidth={2.25} />
          </Button>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {showPromo && activePromo
              ? `${activePromo.eyebrow}. ${activePromo.navHeadline}`
              : "Navigation"}
          </p>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className={cn(
            "inset-0 flex h-dvh w-full max-w-none flex-col border-0 bg-white p-0 sm:max-w-none",
            "[&>button]:hidden"
          )}
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          <div className="flex items-center justify-between border-b border-neutral-gray/40 px-6 py-5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 focus-visible:ring-offset-2"
            >
              <Image
                src="/hcl-logo.png"
                alt="HCL Academy Logo"
                width={72}
                height={72}
                className="h-[72px] w-auto rounded-xl"
              />
            </Link>
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="font-heading rounded-xl border-neutral-gray/60 px-6 text-base text-neutral-text"
              >
                Close
              </Button>
            </SheetClose>
          </div>

          <nav
            className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10"
            aria-label="Mobile navigation"
          >
            <ul className="flex w-full max-w-sm flex-col items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="w-full text-center">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLinkClassName,
                      "block text-3xl sm:text-4xl"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-neutral-gray/40 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <Button
              asChild
              variant="default"
              size="xl"
              className={cn(ctaClassName, "h-14 w-full text-xl")}
            >
              <Link href="/programs" onClick={() => setMenuOpen(false)}>
                Apply
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
