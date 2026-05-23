import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareProgramButton from "@/components/programs/ShareProgramButton";
import { getProgramSharePath } from "@/lib/programUrls";
import { cn } from "@/lib/utils";

function formatNaira(amount) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function ProgramCard({
  program,
  onApply,
  showShare = true,
  linkTitle = true,
}) {
  const canRegister = program.available;
  const titleEl =
    linkTitle && canRegister ? (
      <Link
        href={getProgramSharePath(program.programId)}
        className="font-heading text-2xl font-bold text-neutral-text transition-colors hover:text-primary"
      >
        {program.title}
      </Link>
    ) : (
      <h2 className="font-heading text-2xl font-bold text-neutral-text">
        {program.title}
      </h2>
    );

  return (
    <article
      id={program.programId}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-glass",
        program.featured
          ? "border-accent-light/60 ring-2 ring-accent-light/30"
          : "border-neutral-gray"
      )}
    >
      <div className="relative h-52 shrink-0 sm:h-56">
        <img
          src={program.image}
          alt={program.title}
          className="size-full object-cover"
        />
        {program.bestSeller && (
          <span className="absolute left-4 top-4 rounded-full bg-accent-light px-3 py-1 font-heading text-xs font-bold text-primary">
            Best Seller
          </span>
        )}
        {!program.available && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 font-heading text-xs font-bold text-white">
            Coming Soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {program.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-gray px-3 py-1 font-body text-xs font-semibold text-neutral-text"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 font-body text-xs font-semibold text-neutral-text/70">
            <Clock className="size-3.5" />
            {program.duration}
          </span>
        </div>

        {titleEl}

        <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-neutral-text/75 md:text-base">
          {program.desc}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {program.skills.map((skill) => (
            <span
              key={skill.label}
              className="rounded-lg border border-neutral-gray bg-white px-3 py-1 font-body text-xs font-semibold text-neutral-text"
            >
              {skill.label}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-neutral-gray pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {program.originalPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-body text-sm text-neutral-text/50 line-through">
                    {formatNaira(program.originalPrice)}
                  </span>
                  <span className="font-heading text-2xl font-bold text-neutral-text">
                    {program.price}
                  </span>
                </div>
              ) : (
                <span className="font-heading text-2xl font-bold text-neutral-text">
                  {program.price}
                </span>
              )}
            </div>

            {program.available ? (
              <Button
                onClick={() => onApply(program)}
                className="h-11 w-full rounded-xl bg-primary font-heading font-semibold text-white hover:bg-accent-light hover:text-primary sm:w-auto sm:min-w-[140px]"
              >
                Apply Now
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="h-11 w-full cursor-not-allowed rounded-xl font-heading font-semibold sm:w-auto sm:min-w-[140px]"
              >
                Coming Soon
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/cohorts"
              className="font-body text-sm font-medium text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary"
            >
              See results from past cohorts
            </Link>
            {showShare && canRegister ? (
              <ShareProgramButton
                programId={program.programId}
                title={program.title}
                variant="link"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-neutral-text/70 transition-colors hover:text-primary"
              />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
