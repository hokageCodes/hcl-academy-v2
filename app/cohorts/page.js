"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const filters = ["All Projects", "Development", "Design", "A.I"];

export default function CohortsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Projects");
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
      author: { name: "Temidayo", initial: "T" },
      category: "Development"
    }
    // Add more projects here
  ];

  const cohort2023 = [
    // {
    //   title: "Neo Lagos Art Series",
    //   desc: "Digital Illustration",
    //   author: "Zainab A.",
    //   category: "Design"
    // },
  ];

  // Filter projects based on active filter
  const filterProjects = (projects) => {
    if (activeFilter === "All Projects") return projects;
    return projects.filter(project => project.category === activeFilter);
  };

  const filtered2024 = filterProjects(cohort2024);
  const filtered2023 = filterProjects(cohort2023);
  return (
    <main className="min-h-screen bg-[#0f0a19] pb-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-[#7FF41A]/10 rounded-full blur-[120px]"></div>
      </div>
      <meta name="description" content="Explore the first fruits from our talented graduates across programs at Hokage Academy. See student projects and cohort showcases." />
      <section className="pt-36 pb-12 px-4 md:px-8 lg:px-24 max-w-7xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            The Makers of <span className="text-[#7FF41A]">Tomorrow</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Explore the first fruits from our talented graduates across programs.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {filters.map((filter) => (
            <Button
              key={filter}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full font-bold transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-[#7FF41A] text-[#0f0a19] hover:bg-[#6ad815] shadow-lg shadow-[#7FF41A]/20"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              variant={activeFilter === filter ? "default" : "outline"}
            >
              {filter}
            </Button>
          ))}
        </div>
        {/* Cohort Projects */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Class of <span className="text-[#7FF41A] italic">2024</span></h2>
          {filtered2024.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No projects found in this category for Class of 2024.</p>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered2024.map((project, idx) => (
              <div key={idx} className="group bg-[#1a1425] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-[#7FF41A]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#7FF41A]/10">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image src={project.image ? project.image : '/hcl-logo.png'} alt={project.alt || 'Project screenshot'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1425] via-transparent to-transparent"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-3">
                    {project.tags && project.tags.map((tag, i) => (
                      <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? 'bg-[#7FF41A] text-[#0f0a19]' : 'bg-white/10 text-white'}`}>{tag.label}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white group-hover:text-[#7FF41A] transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">{project.desc}</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7FF41A] to-[#5eb812] text-[#0f0a19] flex items-center justify-center font-extrabold text-lg shadow-lg">{project.author?.initial || '?'}</span>
                    <span className="text-sm font-semibold text-white">{project.author?.name || ''}</span>
                  </div>
                  <Button className="mt-5 w-full bg-white/10 hover:bg-[#7FF41A] hover:text-[#0f0a19] text-white border-0 font-semibold transition-all" onClick={() => handleViewProject(project)}>
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
              {/* Project Modal/Dialog */}
              {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}>
                  <div className="bg-[#1a1425] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
                    <Button
                      className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold bg-white/10 hover:bg-white/20"
                      onClick={handleCloseModal}
                      aria-label="Close"
                      size="icon"
                      variant="ghost"
                    >
                      &times;
                    </Button>
                    <div className="mb-5">
                      <a href={(selectedProject.image ? selectedProject.image : '/hcl-logo.png')} target="_blank" rel="noopener noreferrer">
                        <Image src={selectedProject.image ? selectedProject.image : '/hcl-logo.png'} alt={selectedProject.alt || selectedProject.title} width={480} height={240} className="rounded-xl object-cover w-full h-52 cursor-zoom-in" />
                      </a>
                      <div className="text-xs text-[#0f0a19] mt-3 text-center rounded-full px-4 py-1.5 bg-[#7FF41A] font-semibold inline-block">Click image to view full size</div>
                    </div>
                    <h2 className="font-bold text-2xl mb-3 text-white">{selectedProject.title}</h2>
                    {Array.isArray(selectedProject.tags) && selectedProject.tags.length > 0 ? (
                      <div className="flex gap-2 mb-3">
                        {selectedProject.tags.map((tag, i) => (
                          <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? 'bg-[#7FF41A] text-[#0f0a19]' : 'bg-white/10 text-white'}`}>{tag.label}</span>
                        ))}
                      </div>
                    ) : null}
                    <p className="text-gray-400 mb-5 leading-relaxed">{selectedProject.desc}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7FF41A] to-[#5eb812] text-[#0f0a19] flex items-center justify-center font-extrabold text-lg shadow-lg">{selectedProject.author?.initial || '?'}</span>
                      <span className="text-sm font-semibold text-white">{selectedProject.author?.name || ''}</span>
                    </div>
                  </div>
                </div>
              )}
        </div>
        {/* Previous Cohorts */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Class of <span className="text-[#7FF41A] italic">2023</span></h2>
          {filtered2023.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No projects found in this category for Class of 2023.</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered2023.map((project, idx) => {
              const authorName = project.author || '';
              const authorInitial = authorName[0] || '?';
              const imageSrc = project.image ? project.image : '/hcl-logo.png';
              return (
                <div key={idx} className="group bg-[#1a1425] rounded-xl p-5 flex flex-col items-start border border-white/10 text-left hover:border-[#7FF41A]/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-white/10 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                    <Image src={imageSrc} alt={project.title} width={64} height={64} className="object-contain w-full h-full" />
                  </div>
                  <div className="font-bold text-sm mb-1 text-white group-hover:text-[#7FF41A] transition-colors">{project.title}</div>
                  <div className="text-xs text-gray-500 mb-3">{project.desc}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7FF41A] to-[#5eb812] text-[#0f0a19] flex items-center justify-center font-bold text-sm">{authorInitial}</span>
                    <span className="text-xs font-semibold text-gray-300">{authorName}</span>
                  </div>
                  <Button
                    variant="link"
                    className="font-semibold text-sm text-[#7FF41A] hover:text-[#9fff5a] transition p-0 h-auto mt-auto"
                    onClick={() => handleViewProject({ ...project, image: imageSrc, author: { name: authorName, initial: authorInitial } })}
                  >
                    View Project →
                  </Button>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}
