"use client";
import React, { useState, useEffect, JSX } from 'react';
import styles from './sensei-header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    // faUserSecret,
    faBook,
    faFolder,
    faPalette
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


//**
// @Author Ahmed_Sensei (˶˃ ᵕ ˂˶)
// @Description A responsive header component with a menu that highlights the active section of the page.
//**

/**
 * The main header component with a responsive menu.
 * @returns The JSX Element for the header.
 */
const SenseiHeader = (): JSX.Element => {
    /**
     * The state of the menu, whether it is open or closed.
     */
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    /**
     * The state of the active section, which is the section that is currently in view.
     */
    const [activeSection, setActiveSection] = useState<string>('Home');

    const toggleMenu = (): void => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const handleScroll = (): void => {
        const sections: Array<string> = [
            'Home',
            // 'Services',
            'Experience',
            'Projects',
            'ArtGallery',
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
            localStorage.setItem('activeSection', current);
        }
    };

    useEffect(() => {
        const savedSection = localStorage.getItem('activeSection');
        if (savedSection) {
            setActiveSection(savedSection);
            const element = document.getElementById(savedSection);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = (): void => {
            if (window.innerWidth > 994 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    // Mapping section names to their respective FontAwesome icons
    const sectionIcons: Record<string, IconProp> = {
        Home: faHome,
        // Services: faUserSecret,
        Experience: faBook,
        Projects: faFolder,
        ArtGallery: faPalette,
    };

    return (
        <header className={styles.header}>
            <a href="#" className={styles.logo}>
                <span lang="ja">アーメド・エマド</span>
            </a>
            <div
                className={`${styles.MenuIcon} ${isMenuOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
                tabIndex={0}
                role="button"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            <nav className={`${styles.navbar} ${isMenuOpen ? styles.active : ''}`}>
                {Object.entries(sectionIcons).map(([section, icon]) => (
                    <a
                        key={section}
                        href={`#${section}`}
                        className={activeSection === section ? styles.active : ''}
                        onClick={() => {
                            setActiveSection(section);
                            localStorage.setItem('activeSection', section);
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
