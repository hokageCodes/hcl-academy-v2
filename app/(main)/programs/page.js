"use client";
// import CommunityVoices from "@/components/sections/CommunityVoices";
import FAQs from "@/components/sections/FAQs";
import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ProgramsGridSkeleton from "@/components/programs/ProgramsGridSkeleton";
import PaymentModal from "@/components/programs/PaymentModal";

const ProgramsSection = dynamic(
  () => import("@/components/programs/ProgramsSection"),
  { loading: () => <ProgramsGridSkeleton /> }
);

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

export default function ProgramsPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programCount, setProgramCount] = useState(null);

  const handleApplyClick = (program) => {
    if (!program.available) return;
    setSelectedProgram(program);
    setIsPaymentModalOpen(true);
  };

  return (
    <main>
      <CalendlyWidgetLoader />
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-44 pb-20 px-6 flex items-center relative overflow-hidden md:pt-48 lg:pt-52">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Learn & Build...
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Choose from our carefully designed programs that take you from
                  a complete beginner to "i can fix your printers" in no time
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <TalkToAdvisorCTA />
                <a
                  href="#programs"
                  className="inline-flex items-center justify-center gap-2 bg-lime-400 text-black hover:bg-lime-500 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                >
                  <span>Start Learning</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">4–8</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {programCount === null ? "—" : programCount}
                  </div>
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
              <div className="relative aspect-[4/5] min-h-[420px] w-full overflow-hidden rounded-3xl bg-neutral-gray shadow-2xl lg:aspect-auto lg:min-h-[600px]">
                <Image
                  src="/coding-kid.png"
                  alt="Student learning to code at HCL Academy"
                  width={800}
                  height={1000}
                  className="size-full object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<ProgramsGridSkeleton />}>
        <ProgramsSection
          onApply={handleApplyClick}
          onProgramsLoaded={(list) => setProgramCount(list.length)}
        />
      </Suspense>
      {/* <CommunityVoices /> */}
	  <FAQs />
    </main>
  );
}

