"use client";
import React, { useState, useEffect } from 'react';
import styles from './sensei-header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faLaptopCode,
    faGraduationCap,
    faFolderOpen,
    faPalette
} from '@fortawesome/free-solid-svg-icons';

const SenseiHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const handleScroll = () => {
        const sections = ['Home', 'Service', 'Education', 'Projects', 'Gallery'];
        const current = sections.find(section => {
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
        const handleResize = () => {
            if (window.innerWidth > 994 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    const sectionIcons = {
        Home: faHome,
        Service: faLaptopCode,
        Education: faGraduationCap,
        Projects: faFolderOpen,
        Gallery: faPalette,
    };

    return (
        <header className={styles.header}>
            <a href="#" className={styles.logo}>
                <span lang="en">Mostafa •</span>
                <span lang="ja"> モスタファ</span></a>
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