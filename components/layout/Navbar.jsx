"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// Navbar component for global layout
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl bg-white text-primary px-2 md:px-8 py-3 flex items-center justify-between shadow-glass rounded-2xl border border-neutral-gray/30">
        {/* Logo on the left */}
        <div className="flex items-center min-w-[100px]">
          <Image src="/hcl-logo.png" alt="HCL Academy Logo" width={56} height={56} className="h-14 w-auto rounded-xl" priority />
        </div>
        {/* Hamburger for mobile */}
        <button className="md:hidden ml-auto" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Nav links centered (desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-8 items-center font-heading text-lg font-medium tracking-tight">
            <a href="/" className="hover:text-accent-light transition-colors">Home</a>
            <a href="/programs" className="hover:text-accent-light transition-colors">Programs</a>
            <a href="/about" className="hover:text-accent-light transition-colors">About</a>
            <a href="/admissions" className="hover:text-accent-light transition-colors">Admissions</a>
            <a href="/cohorts" className="hover:text-accent-light transition-colors">Cohorts</a>
            <a href="/contact" className="hover:text-accent-light transition-colors">Contact</a>
          </div>
        </div>
        {/* CTA on the far right (desktop) */}
        <div className="hidden md:flex items-center min-w-[100px] justify-end">
          <Button variant="default" size="lg" className="font-heading font-semibold shadow-card rounded-xl bg-primary text-white hover:bg-accent-light hover:text-primary transition-colors">Apply</Button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white rounded-b-2xl shadow-lg flex flex-col items-center py-4 gap-4 md:hidden animate-fade-in z-50">
            <a href="/" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="/programs" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>Programs</a>
            <a href="/about" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>About</a>
            <a href="/admissions" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>Admissions</a>
            <a href="/cohorts" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>Cohorts</a>
            <a href="/contact" className="font-heading text-lg text-primary hover:text-accent-light transition-colors" onClick={() => setMenuOpen(false)}>Contact</a>
            <Button variant="default" size="lg" className="font-heading font-semibold shadow-card rounded-xl bg-primary text-white hover:bg-accent-light hover:text-primary transition-colors w-full" onClick={() => setMenuOpen(false)}>Apply</Button>
          </div>
        )}
      </nav>
    );
}
