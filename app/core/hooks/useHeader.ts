"use client";
import { useState, useEffect } from "react";
import {
  faHome,
  faUserSecret,
  faBook,
  faFolder,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const useHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("Home");

  const toggleMenu = (): void => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleScroll = (): void => {
    const sections: Array<string> = [
      "Home",
      "Services",
      "Experience",
      "Projects",
      "ArtGallery",
      "Skills",
    ];
    const current: string | undefined = sections.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    if (current) {
      setActiveSection(current);
      localStorage.setItem("activeSection", current);
    }
  };

  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
      const element = document.getElementById(savedSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth > 994 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const sectionIcons: Record<string, IconProp> = {
    Home: faHome,
    Services: faUserSecret,
    Experience: faBook,
    Projects: faFolder,
    ArtGallery: faPalette,
    Skills: faUserSecret,
  };

  return { isMenuOpen, activeSection, toggleMenu, sectionIcons, setActiveSection, setIsMenuOpen };
};
