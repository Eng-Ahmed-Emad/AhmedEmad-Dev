"use client";
import React, { JSX } from "react";
import styles from "./sensei-header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeader } from "@/app/core/hooks/useHeader";
const SenseiHeader = (): JSX.Element => {
  const { isMenuOpen, activeSection, toggleMenu, sectionIcons, setActiveSection, setIsMenuOpen } = useHeader();

  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo}>
        <span lang="ja"> モスタファ</span>
      </a>
      <div
        className={`${styles.MenuIcon} ${isMenuOpen ? styles.active : ""}`}
        onClick={toggleMenu}
        onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
        tabIndex={0}
        role="button"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav className={`${styles.navbar} ${isMenuOpen ? styles.active : ""}`}>
        {Object.entries(sectionIcons).map(([section, icon]) => (
          <a
            key={section}
            href={`#${section}`}
            className={activeSection === section ? styles.active : ""}
            onClick={() => {
              setActiveSection(section);
              localStorage.setItem("activeSection", section);
              if (window.innerWidth <= 994) setIsMenuOpen(false);
            }}
          >
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            <span>{section}</span>
          </a>
        ))}
      </nav>
    </header>
  );
};

export default SenseiHeader;
