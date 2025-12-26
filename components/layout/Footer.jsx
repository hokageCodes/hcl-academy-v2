// Footer component for global layout
import { ArrowUp, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 px-0 pt-8 pb-0 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-0">
        {/* Top Layer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 pb-4 border-b border-gray-100">
          {/* Logo left */}
          <div className="flex items-center min-w-[120px] justify-center md:justify-start w-full md:w-auto">
            <Image src="/hcl-logo.png" alt="HCL Academy Logo" width={48} height={48} className="h-12 w-auto rounded-xl" priority />
          </div>
          {/* Nav links center */}
          <nav className="flex-1 flex justify-center w-full">
            <div className="flex gap-8 items-center font-heading text-base font-medium tracking-tight">
              <a href="#" className="hover:text-accent-light transition-colors">Home</a>
              <a href="#" className="hover:text-accent-light transition-colors">Programs</a>
              <a href="#" className="hover:text-accent-light transition-colors">About</a>
            </div>
          </nav>
          {/* Social links right */}
          <div className="flex items-center gap-4 min-w-[120px] justify-center md:justify-end w-full md:w-auto">
            <a href="#" aria-label="Twitter" className="hover:text-accent-light transition-colors" rel="noopener noreferrer"><Twitter className="w-5 h-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-accent-light transition-colors" rel="noopener noreferrer"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-accent-light transition-colors" rel="noopener noreferrer"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        {/* Bottom Layer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4">
          {/* Privacy & Terms left */}
          <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start">
            <a href="#" className="hover:text-accent-light transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-light transition-colors">Terms</a>
          </div>
          {/* Copyright center */}
          <div className="w-full md:w-auto text-center font-heading text-base font-semibold text-gray-500">
            &copy; {new Date().getFullYear()} HCL Academy. All rights reserved.
          </div>
          {/* Back to top right */}
          <div className="flex w-full md:w-auto justify-center md:justify-end">
            <a href="#top" className="flex items-center gap-1 hover:text-accent-light transition-colors group">
              <span className="hidden sm:inline">Back to top</span>
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
  <div className="max-w-7xl mx-auto">
    <span>&copy; {new Date().getFullYear()} HCL Academy. All rights reserved.</span>
  </div>
