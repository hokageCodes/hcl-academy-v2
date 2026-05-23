import Link from "next/link";
import {
  PenTool,
  Rocket,
  Lightbulb,
  Target,
  Compass,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const audiences = [
  {
    icon: PenTool,
    title: "Aspiring Creatives",
    description:
      "You already think in visuals and ideas. We turn that instinct into HTML, CSS, JavaScript, and a portfolio you can show employers.",
    highlight: "Start from scratch",
  },
  {
    icon: Rocket,
    title: "Career Pivots",
    description:
      "Your past career isn't wasted capital. We help you translate what you know into tech skills and a narrative recruiters actually respond to.",
    highlight: "Reinvent yourself",
  },
  {
    icon: Target,
    title: "Ambitious Students",
    description:
      "Classroom theory only gets you so far. You'll ship real projects, get honest feedback, and leave with work that proves you can deliver.",
    highlight: "Get ahead early",
  },
  {
    icon: Compass,
    title: "Recent Graduates",
    description:
      "NYSC done, future wide open. We give you structure, mentorship, and a clear path from 'what now?' to 'I'm hired' or 'I'm building.'",
    highlight: "Chart your course",
  },
  {
    icon: Lightbulb,
    title: "Curious Minds",
    description:
      "No tech background? Good. We start where you are, move at a human pace, and build confidence week by week until the screen feels like home.",
    highlight: "Explore with purpose",
  },
];

const fitSignals = [
  "You're motivated to learn, not just collect a certificate",
  "You can commit a few hours each week to practice",
  "You want real projects in your portfolio, not just theory",
  "You're open to feedback and learning with others",
];

export default function WhoThisIsFor() {
  return (
    <>
      {/* Section 1 — intro */}
      <section
        className="border-b border-neutral-gray bg-white px-6 py-24 md:py-32"
        aria-labelledby="who-this-is-for-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-accent-light/40 bg-accent-light/15 px-4 py-1.5 font-heading text-sm font-semibold uppercase tracking-wide text-[#21083F]">
            Who it&apos;s for
          </p>
          <h2
            id="who-this-is-for-heading"
            className="font-heading text-4xl font-bold tracking-tight text-neutral-text md:text-5xl lg:text-6xl lg:leading-tight"
          >
            Is this program{" "}
            <span className="text-[#21083F]">for you?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-neutral-text/75 md:text-xl">
            We built HCL Academy for driven people ready to invest in their
            future. If you&apos;re willing to show up and put in the work—you
            belong here.
          </p>

          <ul className="mx-auto mt-12 max-w-2xl space-y-4">
            {fitSignals.map((signal) => (
              <li
                key={signal}
                className="flex items-center justify-center gap-3 font-body text-sm leading-relaxed text-neutral-text/80 md:text-base"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-light text-[#21083F]">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {signal}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#21083F] px-8 font-heading font-semibold text-white hover:bg-accent-light hover:text-[#21083F]"
            >
              <Link href="/programs" className="inline-flex items-center gap-2">
                View Programs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Link
              href="/contact"
              className="font-heading text-sm font-semibold text-[#21083F] underline-offset-4 transition-colors hover:underline"
            >
              Still not sure? Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — audience list */}
      <section
        className="border-t border-neutral-gray bg-white px-6 py-24 md:py-32"
        aria-labelledby="audiences-heading"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 border-b border-neutral-gray pb-6 md:mb-8 md:pb-8">
            <p className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-[#21083F]">
              Built for many paths
            </p>
            <h3
              id="audiences-heading"
              className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-neutral-text md:text-4xl lg:text-[2.75rem] lg:leading-tight"
            >
              You might see yourself here
            </h3>
            <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-neutral-text/70">
              Five different starting points. One shared outcome: skills you can
              prove and confidence you can feel.
            </p>
          </header>

          <ul role="list">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              const isLast = index === audiences.length - 1;

              return (
                <li
                  key={audience.title}
                  className={cn(
                    "group py-8 first:pt-0 md:py-12 md:first:pt-0",
                    !isLast && "border-b border-neutral-gray"
                  )}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className="font-heading text-4xl font-extrabold leading-none tracking-tight text-accent-light/50 md:text-5xl"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg",
                          index % 2 === 0
                            ? "bg-[#21083F] text-white"
                            : "bg-accent-light text-[#21083F]"
                        )}
                      >
                        <Icon className="size-4" strokeWidth={2} />
                      </span>
                      <span className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-neutral-text/45">
                        {audience.highlight}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,16rem)_1fr] md:items-center md:gap-14 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-20">
                    <h4 className="font-heading text-2xl font-bold leading-tight text-neutral-text transition-colors duration-300 group-hover:text-[#21083F] md:text-[1.65rem] lg:text-3xl">
                      {audience.title}
                    </h4>
                    <p className="font-body text-base leading-[1.75] text-neutral-text/80 md:border-l md:border-neutral-gray md:pl-14 md:text-lg lg:pl-20 lg:text-[1.125rem]">
                      {audience.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
