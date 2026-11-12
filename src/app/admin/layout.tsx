import type { Metadata, Viewport } from "next";
import "./admin.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  title: "Admin | Moments Nairobi",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-[#f4ebe1] font-sans text-[#322019] antialiased selection:bg-[#e6c7ad]">
      {children}
    </div>
  );
}
