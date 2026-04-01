import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-inter" });
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Rudra — Creative Developer",
  description: "Rudra Pratap Singh — Creative Developer & Designer building high-performance digital experiences.",
  openGraph: {
    title: "Rudra — Creative Developer",
    description: "Rudra Pratap Singh — Creative Developer & Designer building high-performance digital experiences.",
    url: "https://rudra.design",
    images: ["/images/og_image.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudra — Creative Developer",
    description: "Creative Developer building high-performance digital experiences.",
    images: ["/images/og_image.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorantGaramond.variable} ${dmMono.variable}`}>
        <div id="top-vignette"></div>
        <div id="cur"><div className="cur-inner"></div></div>
        <div id="cur-r"><div className="cur-inner"></div></div>
        <div id="grain"></div>
        {children}
      </body>
    </html>
  );
}
