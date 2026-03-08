import React from "react";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata, Viewport } from "next";

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Metadata configuration
export const metadata: Metadata = {
  title: "Ahmed Emad Nasr",
  description:
    "Hello! I'm Ahmed Emad, Soc Analyst and Cybersecurity Engineer. I specialize in protecting digital assets and ensuring online safety. With a passion for cybersecurity, I analyze threats, implement security measures, and stay ahead of cybercriminals to safeguard data and systems.",
  keywords: "Ahmed Emad Nasr, Soc Analyst, Cybersecurity Engineer, Incident Response Analyst, Blue Team, Cybersecurity Instructor, Software Engineer, Portfolio",
  authors: [{ name: "Ahmed Emad Nasr" }],
};

config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="google-site-verification" content="VCIeVhcDb-vQGmE68weZARtruR_F2bUwv6hcjKYdwqo" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&amp;family=Overlock&amp;family=Yuji+Syuku&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
