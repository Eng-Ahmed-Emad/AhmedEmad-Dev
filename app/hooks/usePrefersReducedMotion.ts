"use client";

import { useEffect, useState } from "react";

export const usePrefersReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const updatePreference = () => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        updatePreference();
        mediaQuery.addEventListener("change", updatePreference);

        return () => {
            mediaQuery.removeEventListener("change", updatePreference);
        };
    }, []);

    return prefersReducedMotion;
};

