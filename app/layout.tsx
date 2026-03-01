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

// Metadata configuration
export const metadata: Metadata = {
    title: "Ahmed Emad Nasr",
    description: "Ahmed Emad Nasr is a SOC Analyst experienced in ELK, Wazuh, and Incident Response. Holds eJPT v2 and CCNA certifications, specializing in Information Security.",
    keywords: ["Ahmed Emad", "Information Security", "Digital Forensics", "CCNA", "Cybersecurity"],
    authors: [{ name: "Ahmed_Sensei" }],
    openGraph: {
        title: "Ahmed Emad Nasr - Cybersecurity Specialist",
        description: "Ahmed Emad Nasr is a SOC Analyst experienced in ELK, Wazuh, and Incident Response. Holds eJPT v2 and CCNA certifications, specializing in Information Security.",
        type: "website",
    },
    robots: "index, follow",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
};

config.autoAddCss = false;

export default function RootLayout({ children }: { children: ReactNode; }) {
    return (
        <html lang="en" dir="ltr" className={`${overlock.variable} ${yujiSyuku.variable}`}>
            <head>
                <meta charSet="UTF-8" />
                <link rel="canonical" href="https://ahmedemad-dev.com" />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#000000" />
                <link rel="preload" as="image" href="/Assets/art-gallery/Images/image_display_thumb/50.webp" />
            </head>
            <body className="bg-black text-white">
                {children}
            </body>
        </html>
    );
}