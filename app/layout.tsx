/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

import React from "react";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from "next";

/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

// Custom Metadata
type CustomMetadata = Metadata & {
    description: string;
    keywords: string;
    author: string;
    charset: string;
    viewport: string;
};

// Metadata configuration
export const metadata: CustomMetadata = {
    description: "Hello! I'm Ahmed Emad, I am a Computer Science Student at BFCAI , Certfied CCNA Engineer , Specializing in Information Security and Digital Forensics.",
    keywords: "Ahmed Emad,Information Security and Digital Forensics ",
    author: "Ahmed_Sensei",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1.0",
};

config.autoAddCss = false;

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="en" dir="ltr">
            <head>
                <title>Eng Ahmed Emad</title>
                <meta charSet="UTF-8" />
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                <meta name="author" content={metadata.author} />
                <meta name="viewport" content={metadata.viewport} />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&amp;family=Overlock&amp;family=Yuji+Syuku&amp;display=swap" rel="stylesheet" />
            </head>
            <body className="bg-black text-white">
                {children}
            </body>
        </html>
    );
}