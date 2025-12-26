 

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import CTASection from "@/components/sections/CTASection";
import CalendlyWidgetLoader from "@/components/CalendlyWidgetLoader";


export const metadata = {
  title: "HCL Academy – Learn Digital Creation | Web, Design, Community",
  description: "Join HCL Academy to learn web development, UI/UX, and digital skills in a vibrant, project-based community. No experience required. Start your tech journey today!",
  openGraph: {
    title: "HCL Academy – Learn Digital Creation",
    description: "Join HCL Academy to learn web development, UI/UX, and digital skills in a vibrant, project-based community. No experience required. Start your tech journey today!",
    url: "https://hclacademy.com/",
    siteName: "HCL Academy",
    images: [
      {
        url: "/hcl-og.png",
        width: 1200,
        height: 630,
        alt: "HCL Academy – Learn Digital Creation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://hclacademy.com/"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-body antialiased">
        <CalendlyWidgetLoader />
        {/* Accessible skip link */}
        <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-primary px-4 py-2 rounded z-50 transition-shadow focus:shadow-lg">Skip to main content</a>
        <Navbar />
        <main id="main-content" className="flex-1 flex flex-col outline-none" tabIndex={-1}>
          {children}
        </main>
        <CTASection />
        <Footer />
      </body>
    </html>
  );
}
