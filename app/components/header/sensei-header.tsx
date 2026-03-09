"use client";
import React, { JSX } from "react";
import styles from "./sensei-header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeader } from "@/app/core/hooks/useHeader";

/**
 * @Author Ahmed Emad Nasr
 * @Description A responsive header component with a modern progress-aware menu.
 */

const SenseiHeader = (): JSX.Element => {
  const { 
    isMenuOpen, 
    activeSection, 
    toggleMenu, 
    sectionIcons, 
    setActiveSection, 
    setIsMenuOpen 
  } = useHeader();

  // وظيفة للتعامل مع النقر على الروابط لإغلاق المنيو في الموبايل بسلاسة
  const handleNavLinkClick = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
    if (window.innerWidth <= 994) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      {/* Logo Section */}
      <a href="#" className={styles.logo} onClick={() => handleNavLinkClick("home")}>
        <span lang="ja">エンジニア・アハメド</span>
      </a>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div
        className={`${styles.MenuIcon} ${isMenuOpen ? styles.active : ""}`}
        onClick={toggleMenu}
        onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
        tabIndex={0}
        role="button"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation Links */}
      <nav className={`${styles.navbar} ${isMenuOpen ? styles.active : ""}`}>
        {Object.entries(sectionIcons).map(([section, icon]) => (
          <a
            key={section}
            href={`#${section}`}
            className={activeSection === section ? styles.active : ""}
            onClick={() => handleNavLinkClick(section)}
          >
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            <span className={styles.navText}>{section}</span>
          </a>
        ))}
      </nav>
    </header>
  );
};

export default SenseiHeader;