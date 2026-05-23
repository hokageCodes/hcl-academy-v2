"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProgramCard from "@/components/programs/ProgramCard";
import ProgramsGridSkeleton from "@/components/programs/ProgramsGridSkeleton";
import { cn } from "@/lib/utils";

const PROGRAM_TABS = [
  { key: "all", label: "All Programs" },
  { key: "development", label: "Development" },
  { key: "design", label: "Design" },
  { key: "ai", label: "AI" },
];

function ProgramFilters({ activeTab, onChange, className }) {
  return (
    <div className={cn("w-full md:w-auto md:shrink-0", className)}>
      <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-neutral-text/50 md:text-right">
        Filter by track
      </p>
      <div
        role="tablist"
        aria-label="Program categories"
        className="inline-flex w-full flex-wrap gap-1 rounded-2xl border border-neutral-gray/80 bg-white p-1.5 shadow-card md:w-auto md:justify-end"
      >
        {PROGRAM_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2.5 font-heading text-sm font-semibold transition-all sm:px-4",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-text/70 hover:bg-neutral-gray hover:text-neutral-text"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

async function fetchPrograms(signal) {
  const res = await fetch("/api/programs", {
    signal,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to load programs");
  }
  return data.data.programs;
}

export default function ProgramsSection({ onApply, onProgramsLoaded }) {
  const [activeTab, setActiveTab] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const list = await fetchPrograms(controller.signal);
      setPrograms(list);
      onProgramsLoaded?.(list);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Check your connection and try again.");
      } else {
        setError(err.message || "Failed to load programs");
      }
      onProgramsLoaded?.([]);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [onProgramsLoaded]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const filteredPrograms =
    activeTab === "all"
      ? programs
      : programs.filter((p) => p.category.includes(activeTab));

  return (
    <section
      id="programs"
      className="scroll-mt-44 bg-white px-6 py-16 md:scroll-mt-48 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              Our Programs
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-text md:text-4xl">
              Pick your path
            </h2>
            <p className="mt-3 font-body text-neutral-text/75">
              Compare duration, skills, and pricing across every track.
            </p>
          </div>

          <ProgramFilters activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {loading ? (
          <ProgramsGridSkeleton />
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-body text-red-600">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={loadPrograms}
              className="mt-4 rounded-xl font-heading"
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.programId}
                  program={program}
                  onApply={onApply}
                />
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <p className="py-16 text-center font-body text-neutral-text/60">
                No programs in this category yet.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
