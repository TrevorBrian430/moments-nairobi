import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://momentsnairobi.co.ke"),
  title: "Moments Nairobi | Men's Fashion • Bags • Accessories",
  description:
    "Everyday fits. Every occasion. Shop premium men's bags, backpacks, clothing & accessories. Located at Tom Mboya St, Nairobi. Delivery countrywide.",
  keywords: [
    "men's fashion nairobi",
    "bags nairobi",
    "backpacks kenya",
    "men's accessories",
    "moments nairobi",
    "designer bags nairobi",
  ],
  openGraph: {
    title: "Moments Nairobi | Men's Fashion",
    description: "Everyday fits. Every occasion. Own Your Moment.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
