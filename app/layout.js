import "./globals.css";

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
        url: "/hcl-logo.png",
        width: 1200,
        height: 630,
        alt: "HCL Academy – Learn Digital Creation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HCL Academy – Learn Digital Creation",
    description: "Join HCL Academy to learn web development, UI/UX, and digital skills in a vibrant, project-based community.",
    images: ["/hcl-logo.png"],
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
        {children}
      </body>
    </html>
  );
}
