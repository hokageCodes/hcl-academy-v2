export const metadata = {
  title: "Admin Dashboard | HCL Academy",
  description: "HCL Academy Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f0a19]">
      {children}
    </div>
  );
}
