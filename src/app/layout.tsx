import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: "Moments Nairobi | Men's Fashion • Bags • Accessories",
  description:
    "Everyday fits. Every occasion. Shop premium men's bags, backpacks, clothing & accessories. Located at Tom Mboya St, Nairobi. Delivery countrywide.",
  keywords: [
    "men's fashion nairobi",
    "bags nairobi",
    "backpacks kenya",
    "goyard backpacks nairobi",
    "men's accessories",
    "moments nairobi",
    "designer bags nairobi",
  ],
  openGraph: {
    title: "Moments Nairobi | Men's Fashion",
    description: "Everyday fits. Every occasion. Own Your Moment.",
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
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white selection:bg-[#B85C6E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
