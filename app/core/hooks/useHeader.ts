"use client";
import { useState, useEffect, useCallback } from "react";
import {
  faHome,
  faUserSecret,
  faBook,
  faFolder,
  faPalette,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// ─── Statics ──────────────────────────────────────────────────────────────────

// Defined at module level so the object is never recreated on each hook call.
const SECTION_ICONS: Record<string, IconProp> = {
  Home:       faHome,
  Experience: faBook,
  Skills:     faBrain,
  Projects:   faFolder,
  Services:   faUserSecret,
  ArtGallery: faPalette,
};

// The section list is fixed — hoisted to avoid re-creating the array on every scroll event.
const SECTIONS = Object.keys(SECTION_ICONS);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useHeader = () => {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // ── Scroll handler ────────────────────────────────────────────────────────
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
      document.getElementById(savedSection)?.scrollIntoView({ behavior: "smooth" });
    }

    const handleScroll = (): void => {
      const current = SECTIONS.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= 100 && bottom >= 100;
      });
      if (current) {
        setActiveSection(current);
        localStorage.setItem("activeSection", current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Intentionally empty — runs once on mount, cleans up on unmount.

  // ── Resize handler ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth > 994 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    activeSection,
    toggleMenu,
    sectionIcons: SECTION_ICONS,
    setActiveSection,
    setIsMenuOpen,
  };
};