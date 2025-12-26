// Hero section for HCL Academy
export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100vh] w-full bg-gradient-purple pt-32 md:pt-56 pb-20 px-2 md:px-0 overflow-hidden">
      {/* SVG background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF22" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Decorative background shapes */}
        {/* Removed top-left shiny accent shape */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary opacity-30 rounded-full blur-2xl" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto">
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-xl">
          Build the Future.<br className="hidden md:block" /> Learn Digital Creation.
        </h1>
        <p className="font-body text-xl md:text-2xl text-neutral-gray mb-10 max-w-xl mx-auto font-medium">
          Learn new skills from scratch and build real projects. No prior experience required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/programs">
            <button className="bg-accent-light text-primary font-heading font-bold px-8 py-4 rounded-xl text-lg hover:bg-primary hover:text-white transition-colors">
              Apply Now
            </button>
          </a>
          <a href="/programs">
            <button className="bg-white text-primary font-heading font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary hover:text-white transition-colors border border-primary/20">
              Explore Programs
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
