"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COHORT_2024 } from "@/lib/cohortProjects";
import CohortsHero from "@/components/cohorts/CohortsHero";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const FILTERS = ["All Projects", "Development", "Design", "AI"];

function CohortFilters({ activeFilter, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Project categories"
      className="inline-flex w-full flex-wrap justify-center gap-1 rounded-2xl border border-neutral-gray/80 bg-white p-1.5 shadow-card sm:w-auto"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={cn(
              "whitespace-nowrap rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition-all",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-text/70 hover:bg-neutral-gray hover:text-neutral-text"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

function ProjectCard({ project, onView }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-gray bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-light/50 hover:shadow-glass">
      <div className="relative h-52 w-full overflow-hidden bg-neutral-gray">
        <Image
          src={project.image}
          alt={project.alt || project.title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                "rounded-full px-3 py-1 font-heading text-xs font-bold",
                tag.color || "bg-neutral-gray text-neutral-text"
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <h3 className="font-heading text-xl font-bold text-neutral-text transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-neutral-text/75">
          {project.desc}
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-neutral-gray pt-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
            {project.author?.initial || "?"}
          </span>
          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold text-neutral-text">
              {project.author?.name}
            </p>
            <p className="font-body text-xs text-neutral-text/60">
              {project.program}
              {project.cohortYear ? ` · Class of ${project.cohortYear}` : ""}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => onView(project)}
          className="mt-5 h-11 w-full rounded-xl bg-primary font-heading font-semibold text-white hover:bg-accent-light hover:text-primary"
        >
          View Project
        </Button>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  useLockBodyScroll(Boolean(project));

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-neutral-gray bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-gray px-6 py-4">
          <div className="min-w-0 pr-2">
            <p className="font-heading text-xs font-semibold uppercase tracking-wide text-primary">
              Student project
            </p>
            <h2
              id="project-modal-title"
              className="mt-1 font-heading text-lg font-bold leading-snug text-neutral-text md:text-xl"
            >
              {project.title}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 rounded-xl text-neutral-text/60 hover:bg-neutral-gray hover:text-neutral-text"
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-5">
            <a
              href={project.image}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block max-h-[min(58vh,520px)] min-h-[220px] w-full overflow-hidden rounded-xl bg-neutral-gray"
            >
              <Image
                src={project.image}
                alt={project.alt || project.title}
                width={900}
                height={1600}
                className="mx-auto size-full cursor-zoom-in object-contain object-top"
              />
            </a>
            <p className="mt-3 flex items-center justify-center gap-1.5 font-body text-xs text-neutral-text/55">
              <ArrowUp className="size-3.5 shrink-0" aria-hidden />
              Click image to view full size
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  "rounded-full px-3 py-1 font-heading text-xs font-bold",
                  tag.color || "bg-neutral-gray text-neutral-text"
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <p className="font-body leading-relaxed text-neutral-text/80">
            {project.desc}
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-neutral-gray pt-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-light font-heading text-sm font-bold text-primary">
              {project.author?.initial}
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-neutral-text">
                {project.author?.name}
              </p>
              <p className="font-body text-xs text-neutral-text/60">
                {project.program}
                {project.cohortYear ? ` · Class of ${project.cohortYear}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCohort({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-gray bg-neutral-gray px-8 py-14 text-center">
      <p className="font-body text-neutral-text/60">{message}</p>
    </div>
  );
}

export default function CohortsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filterProjects = (projects) => {
    if (activeFilter === "All Projects") return projects;
    return projects.filter((p) => p.category === activeFilter);
  };

  const filtered2024 = filterProjects(COHORT_2024);

  return (
    <main className="bg-white">
      <CohortsHero />

      {/* Class of 2024 */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold text-neutral-text md:text-4xl">
                Class of <span className="text-primary">2024</span>
              </h2>
              <p className="mt-3 font-body text-neutral-text/75">
                Real projects built during the program — filter by track to
                browse.
              </p>
            </div>
            <CohortFilters
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
          {filtered2024.length === 0 ? (
            <EmptyCohort message="No projects in this category for the Class of 2024 yet." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered2024.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={setSelectedProject}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-gray bg-white px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-neutral-text md:text-3xl">
            Ready to build something worth showcasing?
          </h2>
          <p className="mt-3 font-body text-neutral-text/75">
            Join the next cohort and add your project to this wall.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-xl bg-primary px-10 font-heading font-semibold text-white hover:bg-accent-light hover:text-primary"
          >
            <Link href="/programs">View Programs</Link>
          </Button>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
