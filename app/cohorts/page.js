"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

export default function CohortsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleViewProject = (project) => setSelectedProject(project);
  const handleCloseModal = () => setSelectedProject(null);
    // Data for mapping
    const cohort2024 = [
      {
        image: "/projects/temidayo.png",
        alt: "Fintech Dashboard Redesign",
        tags: [
          { label: "Frontend", color: "bg-green-600 text-white" },
          { label: "Featured", color: "bg-gray-900 text-white" }
        ],
        title: "E-commerce landing Page Redesign",
        desc: "A modern e-commerce landing page, built by Temidayo (Web Development Specialization).",
        author: { name: "Temidayo", initial: "T" }
      }
      // Add more projects here
    ];

    const cohort2023 = [
      {
        title: "Neo Lagos Art Series",
        desc: "Digital Illustration",
        author: "Zainab A."
      },
    ];
  return (
    <main className="min-h-screen bg-white pb-12">
      <title>Cohorts | Hokage Academy</title>
      <meta name="description" content="Explore the first fruits from our talented graduates across programs at Hokage Academy. See student projects and cohort showcases." />
      <section className="pt-36 pb-12 px-4 md:px-8 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 px-3 py-1 rounded-full border text-black font-semibold text-xs tracking-wider">STUDENT SHOWCASE</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-2">
            The Makers of <span className="text-primary-DEFAULT">Tomorrow</span>
          </h1>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">Explore the first fruits from our talented graduates across programs.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button size="sm" className="rounded-full shadow" variant="default">All Projects</Button>
          <Button size="sm" className="rounded-full" variant="outline">Development</Button>
          <Button size="sm" className="rounded-full" variant="outline">Design</Button>
          <Button size="sm" className="rounded-full" variant="outline">A.I</Button>
        </div>
        {/* Cohort Projects */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Class of <span className="text-primary-DEFAULT italic">2024</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cohort2024.map((project, idx) => (
              <Card key={idx} className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden flex flex-col items-stretch text-left p-0">
                <div className="relative h-48 w-full">
                  <Image src={project.image ? project.image : '/hcl-logo.png'} alt={project.alt || 'Project screenshot'} fill className="object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-2">
                    {project.tags && project.tags.map((tag, i) => (
                      <span key={i} className={`text-xs font-bold px-2 py-1 rounded ${tag.color}`}>{tag.label}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-gray-900">{project.title}</h3>
                  <p className="text-gray-800 text-sm mb-2 flex-1">{project.desc}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-lg shadow">{project.author?.initial || '?'}</span>
                    <span className="text-sm font-bold text-black ml-1">{project.author?.name || ''}</span>
                  </div>
                  <Button className="mt-4" onClick={() => handleViewProject(project)}>
                    View Project
                  </Button>
                </div>
              </Card>
            ))}
          </div>
              {/* Project Modal/Dialog */}
              {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={handleCloseModal}>
                  <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
                    <Button
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold"
                      onClick={handleCloseModal}
                      aria-label="Close"
                      size="icon"
                      variant="ghost"
                    >
                      &times;
                    </Button>
                    <div className="mb-4">
                      <a href={(selectedProject.image ? selectedProject.image : '/hcl-logo.png')} target="_blank" rel="noopener noreferrer">
                        <Image src={selectedProject.image ? selectedProject.image : '/hcl-logo.png'} alt={selectedProject.alt || selectedProject.title} width={480} height={240} className="rounded-xl object-cover w-full h-48 cursor-zoom-in" />
                      </a>
                      <div className="text-xs text-white mt-2 text-center rounded px-3 py-1 bg-primary-DEFAULT font-semibold shadow">Click image to view full size</div>
                    </div>
                    <h2 className="font-bold text-2xl mb-2 text-gray-900">{selectedProject.title}</h2>
                    {Array.isArray(selectedProject.tags) && selectedProject.tags.length > 0 ? (
                      <div className="flex gap-2 mb-2">
                        {selectedProject.tags.map((tag, i) => (
                          <span key={i} className={`text-xs font-bold px-2 py-1 rounded ${tag.color}`}>{tag.label}</span>
                        ))}
                      </div>
                    ) : null}
                    <p className="text-gray-800 mb-4">{selectedProject.desc}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-lg shadow">{selectedProject.author?.initial || '?'}</span>
                      <span className="text-sm font-bold text-black ml-1">{selectedProject.author?.name || ''}</span>
                    </div>
                  </div>
                </div>
              )}
        </div>
        {/* Previous Cohorts */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Class of <span className="text-primary-DEFAULT italic">2023</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cohort2023.map((project, idx) => {
              const authorName = project.author || '';
              const authorInitial = authorName[0] || '?';
              const imageSrc = project.image ? project.image : '/hcl-logo.png';
              return (
                <Card key={idx} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col items-start border border-gray-200 text-left">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                    <Image src={imageSrc} alt={project.title} width={64} height={64} className="object-contain w-full h-full" />
                  </div>
                  <div className="font-bold text-sm mb-1 text-gray-900">{project.title}</div>
                  <div className="text-xs text-gray-700 mb-2">{project.desc}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-lg shadow">{authorInitial}</span>
                    <span className="text-sm font-bold text-black ml-1">{authorName}</span>
                  </div>
                  <Button
                    variant="link"
                    className="font-extrabold text-sm underline underline-offset-4 decoration-2 mt-2 hover:text-black transition p-0 h-auto"
                    onClick={() => handleViewProject({ ...project, image: imageSrc, author: { name: authorName, initial: authorInitial } })}
                  >
                    View Project
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
