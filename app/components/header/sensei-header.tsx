"use client";
import { useCallback, useMemo, memo } from "react";
import styles from "./sensei-header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeader } from "@/app/core/hooks/useHeader";

/**
 * @Author Ahmed Emad Nasr
 * @Description A responsive header component with a modern progress-aware menu.
 */

// ─── Statics ──────────────────────────────────────────────────────────────────

// Stable class strings derived once at module level.
// The conditional variants are kept inline (they depend on runtime state),
// but the base + active combinations are predictable enough to note here.
const MENU_ICON_BASE = styles.MenuIcon;
const NAVBAR_BASE    = styles.navbar;
const ACTIVE_CLASS   = styles.active;

// ─── SenseiHeader ─────────────────────────────────────────────────────────────

const SenseiHeader = memo(function SenseiHeader() {
  const {
    isMenuOpen,
    activeSection,
    toggleMenu,
    sectionIcons,
    setActiveSection,
    setIsMenuOpen,
  } = useHeader();

  // Stable handler — only recreated if setActiveSection / setIsMenuOpen change,
  // which only happens on initial mount (hook-provided setters are stable).
  const handleNavLinkClick = useCallback(
    (section: string) => {
      setActiveSection(section);
      localStorage.setItem("activeSection", section);
      if (window.innerWidth <= 994) {
        setIsMenuOpen(false);
      }
    },
    [setActiveSection, setIsMenuOpen]
  );

  // Stable logo click — extracted from inline arrow to avoid a new function
  // reference on every render of the logo anchor.
  const handleLogoClick = useCallback(
    () => handleNavLinkClick("home"),
    [handleNavLinkClick]
  );

  // Stable keyboard handler for the hamburger button.
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") toggleMenu();
    },
    [toggleMenu]
  );

  // Rebuilds only when sectionIcons, activeSection, or handleNavLinkClick change.
  // All three are stable across scroll-driven re-renders once mounted.
  const navLinks = useMemo(
    () =>
      Object.entries(sectionIcons).map(([section, icon]) => (
        <a
          key={section}
          href={`#${section}`}
          className={activeSection === section ? ACTIVE_CLASS : undefined}
          onClick={() => handleNavLinkClick(section)}
        >
          <FontAwesomeIcon icon={icon} aria-hidden="true" />
          <span className={styles.navText}>{section}</span>
        </a>
      )),
    [sectionIcons, activeSection, handleNavLinkClick]
  );

  // Derived class strings — computed inline but trivially cheap.
  const menuIconClass = isMenuOpen
    ? `${MENU_ICON_BASE} ${ACTIVE_CLASS}`
    : MENU_ICON_BASE;

  const navbarClass = isMenuOpen
    ? `${NAVBAR_BASE} ${ACTIVE_CLASS}`
    : NAVBAR_BASE;

  return (
    <header className={styles.header}>
      {/* Logo */}
      <a href="#" className={styles.logo} onClick={handleLogoClick}>
        <span lang="ja">アーメド エマド</span>
      </a>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div
        className={menuIconClass}
        onClick={toggleMenu}
        onKeyDown={handleMenuKeyDown}
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
      <nav className={navbarClass} aria-label="Main navigation">
        {navLinks}
      </nav>
    </header>
  );
});

export default SenseiHeader;