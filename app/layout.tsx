import React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Overlock, Yuji_Syuku } from "next/font/google";

// Viewport configuration extracted natively
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Metadata configuration using Next.js native attributes for SEO & Verification
export const metadata: Metadata = {
  title: "Ahmed Emad Nasr",
  description:
    "Hello! I'm Ahmed Emad, Soc Analyst and Cybersecurity Engineer. I specialize in protecting digital assets and ensuring online safety. With a passion for cybersecurity, I analyze threats, implement security measures, and stay ahead of cybercriminals to safeguard data and systems.",
  keywords:
    "Ahmed Emad Nasr, Soc Analyst, Cybersecurity Engineer, Incident Response Analyst, Blue Team, Cybersecurity Instructor, Software Engineer, Portfolio",
  authors: [{ name: "Ahmed Emad Nasr" }],
  verification: {
    google: "VCIeVhcDb-vQGmE68weZARtruR_F2bUwv6hcjKYdwqo",
  },
};

const overlock = Overlock({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-overlock",
  display: "swap",
});

const yujiSyuku = Yuji_Syuku({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yuji-syuku",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to FontAwesome CDN to establish early network connections, speeding up icon loading */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body className={`bg-black text-white ${overlock.variable} ${yujiSyuku.variable}`.trim()}>
        {children}
      </body>
    </html>
  );
}