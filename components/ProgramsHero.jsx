import Image from "next/image";

export default function ProgramsHero() {
  return (
    <section className="w-full py-32 md:py-40 px-4 md:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT: Text */}
        <div className="z-10 flex flex-col items-start text-left">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
            GET YOUR FOOT IN
          </h1>
          <p className="font-body text-xl md:text-2xl text-neutral-gray mb-8 max-w-xl font-medium">
            Industry-standard curriculum and a need-based learning style will take you from complete beginner to strong in no time.
          </p>
        </div>
        {/* RIGHT: Image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/hcl-programs-hero.jpg"
            alt="Students learning together"
            width={520}
            height={420}
            className="rounded-3xl shadow-xl object-cover w-full h-auto max-h-[420px]"
            priority
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
