import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Clock, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import CurriculumOutline from "@/components/cohorts/CurriculumOutline";
import { getCurriculumForBanner } from "@/lib/cohort2026Bootcamp";
import { getBannerByBannerId } from "@/lib/bannerService";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const banner = await getBannerByBannerId(slug);
  if (!banner) return { title: "Cohort | HCL Academy" };
  return {
    title: `${banner.title} | HCL Academy`,
    description: `${banner.tagline}. ${banner.duration}, ${banner.format}.`,
  };
}

export default async function CohortBannerPage({ params }) {
  const { slug } = await params;
  const banner = await getBannerByBannerId(slug);

  if (!banner) notFound();

  const curriculum = getCurriculumForBanner(slug);

  return (
    <main className="bg-white">
      <section className="border-b border-neutral-gray bg-white px-6 pb-16 pt-44 md:pb-20 md:pt-48 lg:pt-52">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              {banner.eyebrow}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-neutral-text md:text-5xl lg:text-6xl">
              {banner.title}
            </h1>
            <p className="mt-4 font-heading text-2xl font-bold text-primary md:text-3xl">
              {banner.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                    WhatsApp us
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-neutral-gray shadow-card">
            <Image
              src={banner.flyerImage}
              alt={banner.title}
              width={800}
              height={1000}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {curriculum ? (
                <CurriculumOutline curriculum={curriculum} />
              ) : (
                <>
                  <h2 className="font-heading text-3xl font-bold text-neutral-text md:text-4xl">
                    What you&apos;ll learn
                  </h2>
                  <ul className="mt-10 space-y-4">
                    {banner.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-4 rounded-xl border border-neutral-gray bg-white p-5 shadow-card"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-light">
                          <Check
                            className="size-4 text-primary"
                            strokeWidth={2.5}
                            aria-hidden
                          />
                        </span>
                        <span className="font-body text-base leading-relaxed text-neutral-text">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <aside className="h-fit rounded-2xl border border-neutral-gray bg-white p-8 shadow-card lg:sticky lg:top-36">
              <h3 className="font-heading text-xl font-bold text-neutral-text">
                At a glance
              </h3>
              <dl className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="font-heading text-sm font-semibold text-neutral-text">Duration</dt>
                    <dd className="font-body text-neutral-text/75">{banner.duration}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="font-heading text-sm font-semibold text-neutral-text">Location</dt>
                    <dd className="font-body text-neutral-text/75">{banner.format}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Wallet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="font-heading text-sm font-semibold text-neutral-text">Training fee</dt>
                    <dd className="font-heading text-2xl font-bold text-primary">{banner.feeLabel}</dd>
                  </div>
                </div>
              </dl>
              <Button
                asChild
                className="mt-6 h-11 w-full rounded-xl bg-primary font-heading font-semibold hover:bg-accent-light hover:text-primary"
              >
                <Link href={banner.applyPath}>Enroll on programs page</Link>
              </Button>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-gray px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <Button asChild variant="outline" className="rounded-xl font-heading">
            <Link href="/cohorts">Back to all cohorts</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
