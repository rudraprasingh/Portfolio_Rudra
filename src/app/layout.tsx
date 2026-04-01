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

export const viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Rudra — Creative Developer",
  description: "Rudra Pratap Singh — Creative Developer & Designer building high-performance digital experiences.",
  keywords: ["Creative Developer", "Frontend Engineer", "Web Design", "Portfolio", "GSAP Animation", "Next.js"],
  authors: [{ name: "Rudra Pratap Singh" }],
  creator: "Rudra Pratap Singh",
  openGraph: {
    title: "Rudra — Creative Developer | Rudra Pratap Singh",
    description: "Personal portfolio of Rudra Pratap Singh. Specializing in high-performance digital experiences, editorial design, and cinematic motion.",
    url: "https://rudra.design",
    siteName: "Rudra Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/images/og_image.webp",
        width: 1200,
        height: 630,
        alt: "Rudra Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudra — Creative Developer",
    description: "Creative Developer building high-performance digital experiences.",
    creator: "@singh_rudr51758",
    images: ["/images/og_image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
