import CatalogSync from "@/components/CatalogSync";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F4F0] text-[#111111] w-full max-w-full overflow-x-hidden">
      <CatalogSync />
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
