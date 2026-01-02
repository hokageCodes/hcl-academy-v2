"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <main className="min-h-screen bg-[#0f0a19] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#7FF41A]/8 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-40 left-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7FF41A]/5 rounded-full blur-[200px]"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <meta name="description" content="Reach out to Hokage Academy with questions about our curriculum, tuition, or partnerships. We're here to help you build the future." />
      
      <section className="pt-36 pb-24 px-4 md:px-8 lg:px-24 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Let's Start a <span className="text-[#7FF41A]">Conversation</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about our programs? Ready to begin your journey? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left: Contact Info - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Card */}
            <div className="group bg-[#1a1425] border border-white/10 rounded-2xl p-6 hover:border-[#7FF41A]/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email Us</h3>
                  <p className="text-gray-500 text-sm mb-2">For general inquiries and admissions</p>
                  <a href="mailto:hello@hclacademy.com" className="text-[#7FF41A] font-medium hover:underline">
                    hokage@hokagecreativelabs.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group bg-[#1a1425] border border-white/10 rounded-2xl p-6 hover:border-[#7FF41A]/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Call Us</h3>
                  <p className="text-gray-500 text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                  <a href="tel:+254700123456" className="text-[#7FF41A] font-medium hover:underline">
                    +2349035104366
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group bg-[#1a1425] border border-white/10 rounded-2xl p-6 hover:border-[#7FF41A]/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7FF41A]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#7FF41A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                  <p className="text-gray-500 text-sm mb-2">Come say hello at our HQ</p>
                  <p className="text-gray-300 text-sm">
                    8, Folagoro road, Shomolu, Lagos.<br />
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#1a1425] border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Follow Our Journey</h3>
              <div className="flex gap-3">
                <a href="#" aria-label="Twitter" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#7FF41A]/20 hover:border-[#7FF41A]/30 transition-all">
                  <svg className="w-5 h-5 text-gray-400 hover:text-[#7FF41A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#7FF41A]/20 hover:border-[#7FF41A]/30 transition-all">
                  <svg className="w-5 h-5 text-gray-400 hover:text-[#7FF41A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#7FF41A]/20 hover:border-[#7FF41A]/30 transition-all">
                  <svg className="w-5 h-5 text-gray-400 hover:text-[#7FF41A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#7FF41A]/20 hover:border-[#7FF41A]/30 transition-all">
                  <svg className="w-5 h-5 text-gray-400 hover:text-[#7FF41A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form - 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a1425] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7FF41A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-300 mb-2">Program of Interest</label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                  >
                    <option value="" className="bg-[#1a1425]">Select a program...</option>
                    <option value="web-development" className="bg-[#1a1425]">Web Development</option>
                    <option value="ui-ux-design" className="bg-[#1a1425]">UI/UX Design</option>
                    <option value="ai-ml" className="bg-[#1a1425]">AI & Machine Learning</option>
                    <option value="data-science" className="bg-[#1a1425]">Data Science</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and what you're looking for..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FF41A]/50 focus:ring-1 focus:ring-[#7FF41A]/50 transition-all resize-none"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-bold text-base rounded-xl shadow-lg shadow-[#7FF41A]/20 transition-all hover:shadow-xl hover:shadow-[#7FF41A]/30 flex items-center justify-center gap-2"
                >
                  Send Message
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
