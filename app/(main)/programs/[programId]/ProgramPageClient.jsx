"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Wallet } from "lucide-react";
import PaymentModal from "@/components/programs/PaymentModal";
import ShareProgramButton from "@/components/programs/ShareProgramButton";
import CurriculumOutline from "@/components/cohorts/CurriculumOutline";
import { Button } from "@/components/ui/button";

export default function ProgramPageClient({ program, curriculum, autoApply }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (autoApply && program.available) {
      setIsPaymentModalOpen(true);
    }
  }, [autoApply, program.available]);

  const openApply = () => {
    if (!program.available) return;
    setIsPaymentModalOpen(true);
  };

  return (
    <main className="bg-white">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        program={program}
      />

      <section className="border-b border-neutral-gray px-6 pb-16 pt-44 md:pb-20 md:pt-48 lg:pt-52">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Link
              href="/programs"
              className="font-body text-sm font-medium text-primary hover:underline"
            >
              ← All programs
            </Link>
            <p className="mb-3 mt-6 font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              {program.tags?.[0] || "Program"}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-neutral-text md:text-5xl lg:text-6xl">
              {program.title}
            </h1>
            <p className="mt-4 font-body text-lg leading-relaxed text-neutral-text/75 md:text-xl">
              {program.desc}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {program.available ? (
                <Button
                  size="lg"
                  onClick={openApply}
                  className="h-12 rounded-xl bg-primary px-8 font-heading font-semibold text-white hover:bg-accent-light hover:text-primary"
                >
                  Apply now
                </Button>
              ) : (
                <Button
                  disabled
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl font-heading font-semibold"
                >
                  Coming soon
                </Button>
              )}
              {program.available ? (
                <ShareProgramButton
                  programId={program.programId}
                  title={program.title}
                  className="h-12 rounded-xl px-6 font-heading"
                />
              ) : null}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-neutral-gray shadow-card">
            <Image
              src={program.image}
              alt={program.title}
              width={800}
              height={600}
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
                    {program.skills.map((skill) => (
                      <li
                        key={skill.label}
                        className="rounded-xl border border-neutral-gray bg-white p-5 font-body text-base leading-relaxed text-neutral-text shadow-card"
                      >
                        {skill.label}
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
                    <dt className="font-heading text-sm font-semibold text-neutral-text">
                      Duration
                    </dt>
                    <dd className="font-body text-neutral-text/75">{program.duration}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Wallet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="font-heading text-sm font-semibold text-neutral-text">
                      Program fee
                    </dt>
                    <dd>
                      {program.originalPrice ? (
                        <span className="mr-2 font-body text-sm text-neutral-text/50 line-through">
                          ₦{program.originalPrice.toLocaleString("en-NG")}
                        </span>
                      ) : null}
                      <span className="font-heading text-2xl font-bold text-primary">
                        {program.price}
                      </span>
                    </dd>
                  </div>
                </div>
              </dl>
              {program.available ? (
                <>
                  <Button
                    onClick={openApply}
                    className="mt-6 h-11 w-full rounded-xl bg-primary font-heading font-semibold hover:bg-accent-light hover:text-primary"
                  >
                    Apply now
                  </Button>
                  <ShareProgramButton
                    programId={program.programId}
                    title={program.title}
                    variant="link"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 font-body text-sm font-medium text-neutral-text/70 transition-colors hover:text-primary"
                  />
                </>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="mt-6 h-11 w-full rounded-xl font-heading font-semibold"
                >
                  Coming soon
                </Button>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
