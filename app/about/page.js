
import FAQs from '@/components/sections/FAQs';
import React from 'react';

export default function AboutPage() {
  return (
    <main>
      {/* SEO Headings for Next.js App Router (if using) */}
      <title>About | Hokage Academy</title>
      <meta name="description" content="Learn about Hokage Academy: our mission, vision, values, and how we empower Africa’s next generation of digital creators through accessible, practical, and community-driven tech education." />

      <header>
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-primary px-4 overflow-hidden" aria-label="About Hokage Academy">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" focusable="false" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#7FF41A" fillOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          <h1 className="relative z-10 text-4xl md:text-5xl font-heading font-bold mb-4 text-primary-foreground">
            We’ve Been Where You Are.
          </h1>
          <p className="relative z-10 text-lg md:text-xl max-w-2xl text-primary-foreground/80">
            Every founder and instructor here once stood at the starting line, unsure what to do next.
          </p>
        </section>
      </header>

      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6 items-center text-center py-10 md:py-16 px-4 md:px-0" aria-labelledby="origin-heading">
        <h2 id="origin-heading" className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
          Our Origin: Built From Experience
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl">
          Hokage Academy was born from the real struggles and breakthroughs of people who made the leap into tech themselves. Our curriculum is shaped by the same journey you’re on now, so you’re never alone, and always learning what matters most.
        </p>
      </section>

      <section className="max-w-6xl mx-auto w-full py-16 md:py-24 px-4" aria-label="Mission, Vision, and Values">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN — IMAGE */}
          <div className="order-1 md:order-1 flex items-center justify-center">
            <div className="relative w-full h-72 md:h-full rounded-2xl overflow-hidden shadow-card max-w-md">
              <img
                src="/bulb.jpeg"
                alt="Creative learning at Hokage Academy, a student with a lightbulb moment."
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* RIGHT COLUMN — TEXT CARDS */}
          <div className="flex flex-col gap-6 order-2 md:order-2">
            {/* Mission */}
            <article className="bg-white rounded-2xl shadow-card p-8 text-left flex gap-4 items-start" aria-labelledby="mission-heading">
              <span className="inline-flex items-center justify-center w-16 h-16 mt-1" aria-hidden="true">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#7FF41A" fillOpacity="0.15"/><path d="M20 10v16m0 0l-5-5m5 5l5-5" stroke="#7FF41A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <h3 id="mission-heading" className="font-heading text-xl font-bold mb-2 text-primary">Our Mission</h3>
                <p className="text-gray-700">Empower Africa’s next generation of digital creators by making world-class tech education accessible, practical, and community-driven.</p>
              </div>
            </article>
            {/* Vision */}
            <article className="bg-white rounded-2xl shadow-card p-8 text-left flex gap-4 items-start" aria-labelledby="vision-heading">
              <span className="inline-flex items-center justify-center w-16 h-16 mt-1" aria-hidden="true">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#6C47FF" fillOpacity="0.15"/><path d="M20 14c3.5 0 6.5 2.5 6.5 6.5S23.5 27 20 27s-6.5-2.5-6.5-6.5S16.5 14 20 14zm0 0v13" stroke="#6C47FF" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </span>
              <div>
                <h3 id="vision-heading" className="font-heading text-xl font-bold mb-2 text-primary">Our Vision</h3>
                <p className="text-gray-700">To be the launchpad for Africa’s most creative, resilient, and globally relevant digital leaders.</p>
              </div>
            </article>
            {/* Values */}
            <article className="bg-white rounded-2xl shadow-card p-8 text-left flex gap-4 items-start" aria-labelledby="values-heading">
              <span className="inline-flex items-center justify-center w-16 h-16 mt-1" aria-hidden="true">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#F4B41A" fillOpacity="0.15"/><path d="M20 16l3 6h-6l3-6z" stroke="#F4B41A" strokeWidth="2.5" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <h3 id="values-heading" className="font-heading text-xl font-bold mb-2 text-primary">Our Values</h3>
                <p className="text-gray-700">Real-world learning, radical inclusion, and strong community — because no one should have to walk this path alone.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full py-16 md:py-24 px-4" aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-10">The Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Selection */}
          <article className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center text-center" aria-labelledby="get-in-heading">
            <span className="inline-flex items-center justify-center w-16 h-16 mb-4" aria-hidden="true">
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#7FF41A" fillOpacity="0.15"/><path d="M28 16l-8 8-4-4" stroke="#7FF41A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <h3 id="get-in-heading" className="font-heading text-lg font-bold mb-2 text-primary">Get In</h3>
            <p className="text-gray-700">Apply and get selected to join a cohort of ambitious creators. We look for drive, curiosity, and a willingness to learn. No experience required.</p>
          </article>
          {/* Step 2: Learn & Build */}
          <article className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center text-center" aria-labelledby="learn-build-heading">
            <span className="inline-flex items-center justify-center w-16 h-16 mb-4" aria-hidden="true">
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#6C47FF" fillOpacity="0.15"/><path d="M14 26v-2a4 4 0 014-4h4a4 4 0 014 4v2M20 18a4 4 0 100-8 4 4 0 000 8z" stroke="#6C47FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <h3 id="learn-build-heading" className="font-heading text-lg font-bold mb-2 text-primary">Learn & Build</h3>
            <p className="text-gray-700">Spend 8 weeks learning, building, and collaborating on real projects. Work solo and in groups, gaining hands-on experience and a portfolio that stands out.</p>
          </article>
          {/* Step 3: Community Immersion */}
          <article className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center text-center" aria-labelledby="community-heading">
            <span className="inline-flex items-center justify-center w-16 h-16 mb-4" aria-hidden="true">
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#F4B41A" fillOpacity="0.15"/><path d="M12 24c0-2.21 3.58-4 8-4s8 1.79 8 4v2a2 2 0 01-2 2H14a2 2 0 01-2-2v-2zM20 18a4 4 0 100-8 4 4 0 000 8z" stroke="#F4B41A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <h3 id="community-heading" className="font-heading text-lg font-bold mb-2 text-primary">Community for Life</h3>
            <p className="text-gray-700">After graduation, you’re never left behind. You join a thriving community, sharing resources, job leads, expert advice, and ongoing support as you keep growing.</p>
          </article>
        </div>
      </section>

      <FAQs />
    </main>
  );
}
