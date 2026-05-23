"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PatternBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg
        className="absolute inset-0 size-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="cohorts-hero-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="#21083F" fillOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cohorts-hero-dots)" />
      </svg>
    </div>
  );
}

function DefaultHero() {
  return (
    <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden border-b border-neutral-gray bg-white px-6 pt-44 md:pt-48 lg:pt-52">
      <PatternBackground />
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-primary">
          Students&apos;
        </p>
        <h1 className="font-heading text-5xl font-extrabold tracking-tight text-neutral-text md:text-6xl lg:text-7xl">
          The Makers of <span className="text-primary">Tomorrow</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-neutral-text/75 md:text-xl">
          Explore capstone work from HCL Academy graduates across web
          development, design, and AI programs.
        </p>
      </div>
    </section>
  );
}

function BannerSlide({ banner }) {
  return (
    <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
      <div className="text-center lg:text-left">
        <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-primary">
          {banner.eyebrow}
        </p>
        <h1 className="font-heading text-4xl font-extrabold leading-tight text-neutral-text md:text-5xl lg:text-6xl">
          {banner.title}
        </h1>
        <p className="mt-4 font-heading text-xl font-bold text-primary md:text-2xl">
          {banner.tagline}
        </p>
        <p className="mt-4 font-body text-base text-neutral-text/75 md:text-lg">
          {banner.duration} · {banner.format} · {banner.feeLabel}
        </p>
        <ul className="mt-6 hidden space-y-2 text-left sm:block">
          {banner.highlights.slice(0, 3).map((item) => (
            <li
              key={item}
              className="font-body text-sm text-neutral-text/80 md:text-base"
            >
              · {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl bg-primary px-8 font-heading font-semibold text-white hover:bg-accent-light hover:text-primary"
          >
            <Link href={banner.applyPath}>Apply now</Link>
          </Button>
          {banner.whatsappUrl ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-neutral-gray font-heading font-semibold"
            >
              <a
                href={banner.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 size-5" />
                WhatsApp
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 font-heading font-semibold text-primary"
          >
            <Link href={banner.detailPath}>Full details</Link>
          </Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-neutral-gray shadow-card lg:max-w-none">
        <Image
          src={banner.flyerImage}
          alt={banner.title}
          width={640}
          height={800}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}

export default function CohortsHero() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/banners?placement=cohortsHero");
        const data = await res.json();
        if (data.success) setBanners(data.data.banners);
      } catch {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const go = useCallback(
    (dir) => {
      if (banners.length <= 1) return;
      setIndex((i) => (i + dir + banners.length) % banners.length);
    },
    [banners.length]
  );

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [banners.length, go]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center border-b border-neutral-gray bg-white pt-44">
        <p className="font-body text-neutral-text/50">Loading…</p>
      </section>
    );
  }

  if (banners.length === 0) return <DefaultHero />;

  const current = banners[index];

  return (
    <section className="relative overflow-hidden border-b border-neutral-gray bg-white px-6 pb-16 pt-44 md:pb-20 md:pt-48 lg:pt-52">
      <PatternBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="relative">
          <div key={current.bannerId}>
            <BannerSlide banner={current} />
          </div>

          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-neutral-gray bg-white p-2 shadow-card transition hover:border-primary md:flex"
                aria-label="Previous bootcamp"
              >
                <ChevronLeft className="size-5 text-primary" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-neutral-gray bg-white p-2 shadow-card transition hover:border-primary md:flex"
                aria-label="Next bootcamp"
              >
                <ChevronRight className="size-5 text-primary" />
              </button>
              <div className="mt-10 flex justify-center gap-2">
                {banners.map((b, i) => (
                  <button
                    key={b.bannerId}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index
                        ? "w-8 bg-primary"
                        : "w-2 bg-neutral-gray hover:bg-primary/40"
                    )}
                    aria-label={`Show ${b.title}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
