import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";
import CalendlyWidgetLoader from "@/components/CalendlyWidgetLoader";

export default function MainLayout({ children }) {
  return (
    <>
      <CalendlyWidgetLoader />
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-primary px-4 py-2 rounded z-50 transition-shadow focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className="flex-1 flex flex-col outline-none"
        tabIndex={-1}
      >
        {children}
      </main>
      <CTASection />
      <Footer />
    </>
  );
}

