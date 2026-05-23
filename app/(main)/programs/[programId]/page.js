import { notFound } from "next/navigation";
import { getPublicProgramByProgramId } from "@/lib/programService";
import { getCurriculumForProgram } from "@/lib/cohort2026Bootcamp";
import { getProgramShareUrlFromRequest } from "@/lib/programUrls";
import ProgramPageClient from "./ProgramPageClient";

export async function generateMetadata({ params }) {
  const { programId } = await params;
  const program = await getPublicProgramByProgramId(programId);

  if (!program || !program.available) {
    return { title: "Program | HCL Academy" };
  }

  const url = await getProgramShareUrlFromRequest(program.programId);

  return {
    title: `${program.title} | HCL Academy`,
    description: program.desc,
    openGraph: {
      title: program.title,
      description: program.desc,
      url,
      images: [{ url: program.image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: program.desc,
      images: [program.image],
    },
  };
}

export default async function ProgramRegistrationPage({ params, searchParams }) {
  const { programId } = await params;
  const program = await getPublicProgramByProgramId(programId);

  if (!program || !program.available) notFound();

  const resolvedSearchParams = await searchParams;
  const autoApply = resolvedSearchParams?.apply === "1";
  const curriculum = getCurriculumForProgram(program.programId);

  return (
    <ProgramPageClient
      program={program}
      curriculum={curriculum}
      autoApply={autoApply}
    />
  );
}
