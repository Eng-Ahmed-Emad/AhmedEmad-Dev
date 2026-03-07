"use client";
import React, { useState, useEffect, JSX } from "react";
import styles from "./sensei-header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserSecret,
  faBook,
  faFolder,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

//**
// @Author Mostafa Sensei106
// @Description A responsive header component with a menu that highlights the active section of the page.
//**

/**
 * The main header component with a responsive menu.
 * @returns The JSX Element for the header.
 */
import { useHeader } from "@/app/core/hooks/useHeader";

//**
// @Author Mostafa Sensei106
// @Description A responsive header component with a menu that highlights the active section of the page.
//**

/**
 * The main header component with a responsive menu.
 * @returns The JSX Element for the header.
 */
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