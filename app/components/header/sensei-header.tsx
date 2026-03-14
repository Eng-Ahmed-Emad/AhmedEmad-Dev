"use client";
import { useCallback, useMemo, memo } from "react";
import styles from "./sensei-header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeader } from "@/app/core/hooks/useHeader";

// ─── Stable class-name fragments ─────────────────────────────────────────────
// Hoisted outside the component so string concatenation never happens inside render
const MENU_ICON_BASE       = styles.MenuIcon;
const NAVBAR_BASE          = styles.navbar;
const ACTIVE_CLASS         = styles.active;
const MENU_ICON_ACTIVE     = `${MENU_ICON_BASE} ${ACTIVE_CLASS}`;
const NAVBAR_ACTIVE        = `${NAVBAR_BASE} ${ACTIVE_CLASS}`;

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

  const handleNavLinkClick = useCallback(
    (section: string) => {
      setActiveSection(section);
      // Bug fix: localStorage access inside useCallback is fine, but it should
      // be guarded for SSR environments (Next.js server components / pre-render).
      if (typeof window !== "undefined") {
        localStorage.setItem("activeSection", section);
        if (window.innerWidth <= 994) {
          setIsMenuOpen(false);
        }
      }
    },
    [setActiveSection, setIsMenuOpen],
  );

  const handleLogoClick = useCallback(
    () => handleNavLinkClick("Home"),
    [handleNavLinkClick],
  );

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Also support Space key for button-role elements (WCAG 2.1 §4.1.2)
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    },
    [toggleMenu],
  );

  // navLinks memoised – only re-built when icons map, active section, or click
  // handler changes (i.e. never in practice for a static icon map).
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
    [sectionIcons, activeSection, handleNavLinkClick],
  );

  // Pre-computed class strings – avoids template-literal allocation in render
  const menuIconClass = isMenuOpen ? MENU_ICON_ACTIVE : MENU_ICON_BASE;
  const navbarClass   = isMenuOpen ? NAVBAR_ACTIVE    : NAVBAR_BASE;

  return (
    <header className={styles.header}>
      <a href="#Home" className={styles.logo} onClick={handleLogoClick}>
        <span lang="ja">アーメド エマド</span>
      </a>

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

      <nav className={navbarClass} aria-label="Main navigation">
        {navLinks}
      </nav>
    </header>
  );
});

export default SenseiHeader;