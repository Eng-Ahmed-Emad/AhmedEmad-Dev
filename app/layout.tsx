/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

import type { ReactNode } from "react";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Overlock, Yuji_Syuku } from 'next/font/google';
import type { Metadata } from "next";

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
    title: "Eng Ahmed Emad",
    description: "Hello! I'm Ahmed Emad, I am a Computer Science Student at BFCAI, Certified CCNA Engineer, Specializing in Information Security and Digital Forensics.",
    keywords: ["Ahmed Emad", "Information Security", "Digital Forensics", "CCNA", "Cybersecurity"],
    authors: [{ name: "Ahmed_Sensei" }],
    viewport: "width=device-width, initial-scale=1.0",
    openGraph: {
        title: "Eng Ahmed Emad - Cybersecurity Specialist",
        description: "A Computer Science Student specializing in Information Security and Digital Forensics",
        type: "website",
    },
    robots: "index, follow",
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
            </head>
            <body className="bg-black text-white">
                {children}
            </body>
        </html>
    );
}