import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf9fb] pb-12">
      <section className="pt-36 pb-16 px-4 md:px-8 lg:px-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div>
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-accent-light/10 text-accent font-semibold text-xs tracking-wider">GET IN TOUCH</span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-2">
              Start Your <span className="text-primary-default italic">Creative Journey</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">Reach out with questions about our curriculum, tuition, or partnerships. We are here to help you build the future.</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
                <span className="bg-accent-light/10 p-2 rounded-full">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9zm0 13a2 2 0 110-4 2 2 0 010 4z" stroke="#a259ff" strokeWidth="2"/></svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Academy HQ</div>
                  <div className="text-sm text-gray-600">123 Innovation Drive, Tech District<br/>Nairobi, Kenya 00100</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
                <span className="bg-accent-light/10 p-2 rounded-full">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21 8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-1" stroke="#a259ff" strokeWidth="2"/><path d="M21 8l-9 6-9-6" stroke="#a259ff" strokeWidth="2"/></svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Email Us</div>
                  <div className="text-sm text-gray-600">For general inquiries and admissions.</div>
                  <a href="mailto:hello@hclacademy.com" className="text-accent font-medium text-sm">hello@hclacademy.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
                <span className="bg-accent-light/10 p-2 rounded-full">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 01-2 2A17.91 17.91 0 013 5a2 2 0 012-2h2.09a1 1 0 011 .75l1.13 4.52a1 1 0 01-.29.95l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a1 1 0 01.95-.29l4.52 1.13a1 1 0 01.75 1z" stroke="#a259ff" strokeWidth="2"/></svg>
                </span>
                <div>
                  <div className="font-semibold text-gray-900">Call Us</div>
                  <div className="text-sm text-gray-600">Mon-Fri from 8am to 5pm.</div>
                  <a href="tel:+254700123456" className="text-accent font-medium text-sm">+254 (0) 700 123 456</a>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="font-semibold mb-2">Follow the Hokage</div>
              <div className="flex gap-4">
                <a href="#" aria-label="Twitter" className="hover:text-accent"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.48 4.48 0 0016.11 0c-2.5 0-4.51 2.01-4.51 4.5 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.7 2.16 2.94 4.07 2.97A9.01 9.01 0 010 21.54a12.77 12.77 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" fill="#a259ff"/></svg></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-accent"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" stroke="#a259ff" strokeWidth="2"/><path d="M7 10v7M7 7v.01M12 10v7m0 0v-4a2 2 0 114 0v4" stroke="#a259ff" strokeWidth="2" strokeLinecap="round"/></svg></a>
                <a href="#" aria-label="Instagram" className="hover:text-accent"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" stroke="#a259ff" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#a259ff" strokeWidth="2"/><circle cx="17" cy="7" r="1.5" fill="#a259ff"/></svg></a>
              </div>
            </div>
          </div>
          {/* Right: Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Send us a message</h2>
              <p className="text-gray-600 mb-6 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Jane Doe" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-light" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="jane@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-light" />
                  </div>
                </div>
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program of Interest</label>
                  <select id="program" name="program" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-light">
                    <option value="">Select a program...</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="animation">Animation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" name="message" rows={4} placeholder="Tell us a little about yourself and what you're looking for..." className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-light"></textarea>
                </div>
                <button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 rounded-lg shadow-lg transition-all duration-300 mt-2 flex items-center justify-center gap-2">
                  Send Message <span aria-hidden="true">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-16">
        <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <Image src="/hcl-logo.png" alt="Map to HCL Academy, Lagos, Nigeria" width={1200} height={400} className="w-full h-80 object-cover" />
        </div>
      </section>
    </main>
  );
}
