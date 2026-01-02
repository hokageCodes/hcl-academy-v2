import FAQs from "@/components/sections/FAQs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AdmissionsPage() {
  return (
    <main>
      <title>Admissions | Hokage Academy</title>
      <meta name="description" content="Everything you need to know about applying to HCL Academy. Learn about our process, what we look for, and how to stand out." />
      <section className="min-h-screen pt-36 pb-20 px-6 flex items-center relative overflow-hidden" aria-label="Admissions Hero">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Your Journey Starts Here
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Everything you need to know about applying to HCL Academy. Learn about our process, what we look for, and how to stand out.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="px-8 py-4">
                  <a href="/programs">
                    <span>Apply Now</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </Button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                  <div className="text-sm text-gray-600">Cohorts per Year</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Community focused</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">1:1</div>
                  <div className="text-sm text-gray-600">Mentorship</div>
                </div>
              </div>
            </div>
            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/admissions.jpeg"
                  alt="Admissions process at HCL Academy"
                  width={800}
                  height={600}
                  className="w-full h-[600px] object-cover"
                  priority
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
{/* Learning Experience Section */}
      <section className="relative py-24 px-4 md:px-8 lg:px-24 bg-[#21083F] overflow-hidden" aria-labelledby="how-learn-heading">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#7FF41A]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7FF41A]/5 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mb-16">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#7FF41A]/20 border border-[#7FF41A]/30 text-[#7FF41A] text-sm font-medium tracking-wide uppercase">
              Learning Experience
            </span>
            <h2 id="how-learn-heading" className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              How You'll Learn
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our learning model is designed for real life — structured, flexible, and deeply practical.
              You won't just watch lessons. You'll build, practice, and grow with guidance every step
              of the way.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Weekend Track Card */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-[#7FF41A]/30 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FF41A] to-[#7FF41A]/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 mb-6 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="inline-block mb-4 text-[#7FF41A] text-sm font-semibold tracking-wide uppercase">
                Weekend Track
              </span>
              <h3 className="text-xl font-semibold text-white mb-3">
                Learn without disrupting your week
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Intensive Saturday and Sunday sessions designed for professionals, students,
                and career switchers who need structure without weekday pressure.
              </p>
            </div>

            {/* Daily Track Card */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-[#7FF41A]/30 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FF41A] to-[#7FF41A]/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 mb-6 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="inline-block mb-4 text-[#7FF41A] text-sm font-semibold tracking-wide uppercase">
                Daily Track
              </span>
              <h3 className="text-xl font-semibold text-white mb-3">
                Build momentum, one day at a time
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Short, focused daily sessions that keep you consistent and engaged.
                Ideal if you want faster progress and a steady learning rhythm.
              </p>
            </div>

            {/* Fully Online Card */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-[#7FF41A]/30 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FF41A] to-[#7FF41A]/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 mb-6 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <span className="inline-block mb-4 text-[#7FF41A] text-sm font-semibold tracking-wide uppercase">
                Fully Online
              </span>
              <h3 className="text-xl font-semibold text-white mb-3">
                Learn from anywhere
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All programs run online with live sessions, real-time feedback,
                recordings, and collaborative projects, no matter where you're based.
              </p>
            </div>
          </div>
        </div>
      </section>

          {/* Admission Process Section */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4 text-gray-900">The Admission Process</h2>
          <p className="text-lg text-center text-gray-500 mb-16">A clear, four-step path to launching your creative career.</p>
          <ol className="relative border-l-2 border-gray-200 ml-8">
            {/* Step 1 */}
            <li className="mb-16 ml-8 flex items-start">
              <span className="absolute -left-8 flex items-center justify-center w-12 h-12 rounded-full border-2 border-accent-light bg-white text-accent-light">
                {/* Icon: Clipboard */}
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="7" y="5" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M11 9h6M11 13h6M11 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold mb-1 text-gray-900">Submit Application</h3>
                <p className="text-gray-600 max-w-xl">Complete the online form. Tell us about your background, your creative interests, and why you want to join Hokage Labs. No experience or portfolio required.</p>
              </div>
            </li>
            {/* Step 2 */}
            <li className="mb-16 ml-8 flex items-start">
              <span className="absolute -left-8 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-gray-400">
                {/* Icon: Chat/Welcome */}
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="4" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold mb-1 text-gray-900">Welcome Call</h3>
                <p className="text-gray-600 max-w-xl">A friendly chat with our admissions team to answer your questions, set expectations, and help you feel at home. No tests, no pressure.</p>
              </div>
            </li>
            {/* Step 3 */}
            <li className="mb-16 ml-8 flex items-start">
              <span className="absolute -left-8 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-purple-400">
                {/* Icon: Payment/Cash */}
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="5" y="9" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold mb-1 text-gray-900">Program Fees & Free Sessions</h3>
                <p className="text-gray-600 max-w-xl">Most programs require a tuition fee, but we offer payment plans and scholarships. We also run free crash sessions and workshops for beginners—watch for announcements!</p>
              </div>
            </li>
            {/* Step 4 */}
            <li className="ml-8 flex items-start">
              <span className="absolute -left-8 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-gray-400">
                {/* Icon: Rocket/Onboarding */}
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M14 4l3 7h7l-5.5 4.5L20 25l-6-4-6 4 1.5-9.5L4 11h7l3-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold mb-1 text-gray-900">Enrollment & Onboarding</h3>
                <p className="text-gray-600 max-w-xl">Welcome aboard! Secure your spot, access the student portal, and meet your mentors before the first day of class.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <FAQs />
      </main>
  );
}

