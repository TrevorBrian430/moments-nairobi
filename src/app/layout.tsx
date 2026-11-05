import type { Metadata, Viewport } from "next";
import { Inter_Tight, Inter } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://momentsnairobi.co.ke"),
  title: "Moments Nairobi | Men's Fashion, Bags & Accessories",
  description:
    "Curated men's bags, backpacks, clothing, and accessories in Nairobi CBD. Physical store at Twilight Suites F4-08. Nationwide delivery.",
  keywords: [
    "men's fashion nairobi",
    "bags nairobi",
    "backpacks kenya",
    "men's accessories nairobi",
    "moments nairobi",
    "designer backpacks kenya",
    "travel bags nairobi",
  ],
  openGraph: {
    title: "Moments Nairobi | Men's Fashion & Bags",
    description: "Curated men's fashion, premium bags, and accessories in Nairobi CBD.",
    type: "website",
    url: "https://momentsnairobi.co.ke",
    siteName: "Moments Nairobi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#111111] bg-[#F6F4F0] selection:bg-[#BB4C6C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
