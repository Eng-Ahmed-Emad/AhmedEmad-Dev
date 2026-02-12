/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

import type { ReactNode } from "react";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Overlock, Yuji_Syuku } from 'next/font/google';
import type { Metadata, Viewport } from "next";

// Google Fonts Configuration
const overlock = Overlock({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-overlock',
    display: 'swap',
});

const yujiSyuku = Yuji_Syuku({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-yuji-syuku',
    display: 'swap',
});

// Viewport configuration (Next.js App Router)
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#000000",
};

// Metadata configuration
export const metadata: Metadata = {
    title: "Eng Ahmed Emad",
    description: "Hello! I'm Ahmed Emad, I am a Computer Science Student at BFCAI, Certified CCNA Engineer, Specializing in Information Security and Digital Forensics.",
    keywords: ["Ahmed Emad", "Information Security", "Digital Forensics", "CCNA", "Cybersecurity"],
    authors: [{ name: "Ahmed_Sensei" }],
    openGraph: {
        title: "Eng Ahmed Emad - Cybersecurity Specialist",
        description: "A Computer Science Student specializing in Information Security and Digital Forensics",
        type: "website",
        url: "https://ahmedemad-dev.com",
        images: [
            {
                url: "/Assets/art-gallery/Images/image_display_thumb/4.webp",
                width: 1200,
                height: 630,
                alt: "Ahmed Emad - Cybersecurity Portfolio",
            },
        ],
    },
    robots: "index, follow",
    twitter: {
        card: "summary_large_image",
        title: "Eng Ahmed Emad - Cybersecurity Specialist",
        description: "Cybersecurity student and analyst focusing on information security and digital forensics.",
        images: ["/Assets/art-gallery/Images/image_display_thumb/4.webp"],
        creator: "@Ahmed3Emad77",
    },
};

config.autoAddCss = false;

export default function RootLayout({ children }: { children: ReactNode; }) {
    return (
        <html lang="en" dir="ltr" className={`${overlock.variable} ${yujiSyuku.variable}`}>
            <head>
                <meta charSet="UTF-8" />
                <link rel="canonical" href="https://ahmedemad-dev.com" />
            </head>
            <body className="bg-black text-white">
                {children}
            </body>
        </html>
    );
}