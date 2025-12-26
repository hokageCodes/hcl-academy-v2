"use client";
import CommunityVoices from "@/components/sections/CommunityVoices";
import FAQs from "@/components/sections/FAQs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

// Calendly Widget Loader
function CalendlyWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Calendly) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  return null;
}

// CTA Button with Calendly popup
function TalkToAdvisorCTA() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    const tryOpen = () => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ 
          url: "https://calendly.com/hokagecreativelabs001/30mins" 
        });
        setLoading(false);
      } else {
        setTimeout(tryOpen, 100);
      }
    };
    
    tryOpen();
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 font-semibold px-8 py-4 rounded-xl transition-all duration-300 min-w-[180px]"
      type="button"
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading…
        </span>
      ) : (
        <span>Talk to an Advisor</span>
      )}
    </button>
  );
}

const PROGRAM_TABS = [
  { key: "all", label: "All Programs" },
  { key: "development", label: "Development" },
  { key: "design", label: "Design" },
  { key: "ai", label: "AI" },
];

const PROGRAMS = [
  {
    id: 1,
    category: ["development", "all"],
    featured: true,
    title: "Intro to Web Development",
    desc: "Master the foundations of the web. Learn HTML5, CSS3, JavaScript ES6+, and Responsive Design. Build real-world projects and launch your portfolio in just 2 months.",
    duration: "8 Weeks",
    tags: ["Beginner Friendly", "Frontend"],
    skills: [
      { label: "HTML5", icon: "html" },
      { label: "CSS3", icon: "css" },
      { label: "JavaScript", icon: "js" },
      { label: "Responsive", icon: "responsive" },
    ],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    bestSeller: true,
    price: "N50,000",
  },
  {
    id: 2,
    category: ["design", "all"],
    featured: false,
    title: "UI/UX Design Fundamentals",
    desc: "Learn the basics of user interface and user experience design. Master Figma, wireframing, prototyping, and design systems.",
    duration: "6 Weeks",
    tags: ["Beginner Friendly", "Design"],
    skills: [
      { label: "Figma", icon: "figma" },
      { label: "Wireframing", icon: "wireframe" },
      { label: "Prototyping", icon: "prototype" },
      { label: "Design Systems", icon: "system" },
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    bestSeller: false,
  },
  {
    id: 3,
    category: ["ai", "all"],
    featured: false,
    title: "Vibe Coding Essentials",
    desc: "Speed up your workflow using what you already know in web development. Learn essential patterns, shortcuts, and tools to code faster and smarter.",
    duration: "4 Weeks",
    tags: ["Coding Essentials", "Workflow"],
    skills: [
      { label: "Web Dev Knowledge", icon: "web" },
      { label: "Patterns", icon: "pattern" },
      { label: "Tools & Shortcuts", icon: "tools" },
    ],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    bestSeller: false,
  },
];

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const filteredPrograms = activeTab === "all" 
    ? PROGRAMS 
    : PROGRAMS.filter((p) => p.category.includes(activeTab));

  return (
    <main>
      <CalendlyWidgetLoader />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-36 pb-20 px-6 flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Learn. Build. Launch.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Choose from our carefully designed programs that take you from
                  a complete beginner to "i can fix your printers" in no time
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <TalkToAdvisorCTA />
                <a
                  href="/mentorship"
                  className="inline-flex items-center justify-center gap-2 bg-lime-400 text-black hover:bg-lime-500 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                >
                  <span>Book 1:1 Mentorship</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Students collaborating on projects"
                  className="w-full h-[600px] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Section */}
      <section className="max-w-7xl mx-auto w-full mt-12 px-2 md:px-0 mb-24">
        {/* Tabs */}
        <div className="flex gap-4 mb-10 flex-wrap">
          {PROGRAM_TABS.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full font-semibold text-base px-6 py-3 ${
                activeTab === tab.key
                  ? "bg-white text-black shadow-lg"
                  : "bg-black/80 text-white hover:bg-black"
              }`}
              variant={activeTab === tab.key ? "default" : "outline"}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className={`relative flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-105 p-0 ${
                program.featured ? "border-2 border-lime-400/80" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-64 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                {program.bestSeller && (
                  <span className="absolute left-4 top-4 bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    BEST SELLER
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 bg-black/90 flex flex-col flex-1 justify-between text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1 text-lime-400 text-xs font-bold">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="currentColor" />
                    </svg>
                    {program.duration}
                  </span>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <h2 className="text-2xl font-bold">{program.title}</h2>
                  <p className="text-gray-300 text-sm md:text-base">{program.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/10"
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {(program.title === "UI/UX Design Fundamentals" || program.title === "Vibe Coding Essentials") ? (
                    <Button
                      disabled
                      variant="link"
                      className="text-gray-400 font-semibold underline underline-offset-4 text-base cursor-not-allowed opacity-60"
                      type="button"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="link"
                      className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 text-base"
                    >
                      <a href="#apply">Apply Now</a>
                    </Button>
                  )}
                  {program.price && (
                    <span className="bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                      {program.price}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <CommunityVoices />
	  <FAQs />
    </main>
  );
}