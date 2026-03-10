"use client";
import { JSX, useCallback, useMemo, memo } from "react";
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
    setIsMenuOpen,
  } = useHeader();

  const handleNavLinkClick = useCallback((section: string) => {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
    if (window.innerWidth <= 994) {
      setIsMenuOpen(false);
    }
  }, [setActiveSection, setIsMenuOpen]);

  // Memoize the navigation links to prevent unnecessary re-renders of the array
  // during state changes (e.g., when scrolling updates the activeSection).
  const navLinks = useMemo(() => {
    return Object.entries(sectionIcons).map(([section, icon]) => (
      <a
        key={section}
        href={`#${section}`}
        className={activeSection === section ? styles.active : undefined}
        onClick={() => handleNavLinkClick(section)}
      >
        <FontAwesomeIcon icon={icon} aria-hidden="true" />
        <span className={styles.navText}>{section}</span>
      </a>
    ));
  }, [sectionIcons, activeSection, handleNavLinkClick]);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <a 
        href="#" 
        className={styles.logo} 
        onClick={() => handleNavLinkClick("home")}
      >
        <span lang="ja">エンジニア・アハメド</span>
      </a>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div
        className={`${styles.MenuIcon} ${isMenuOpen ? styles.active : ""}`.trim()}
        onClick={toggleMenu}
        onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
        tabIndex={0}
        role="button"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>

      {/* Navigation Links */}
      <nav
        className={`${styles.navbar} ${isMenuOpen ? styles.active : ""}`.trim()}
        aria-label="Main navigation"
      >
        {navLinks}
      </nav>
    </header>
  );
};

// Wrap the export in React.memo to prevent re-renders from parent components 
// unless the internal hook state forces an update.
export default memo(SenseiHeader);