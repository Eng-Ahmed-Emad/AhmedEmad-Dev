// Import necessary dependencies and styles
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Variants, motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faEye, faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-services-projects.module.css";

/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */
interface GitHubRepository {
    id: number;
    name: string;
    description: string;
    language: string;
    html_url: string;
    stargazers_count: number;
    open_issues_count: number;
    updated_at: string;
    created_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    topics: string[];
    default_branch: string;
    watchers_count: number;
    license: {
        name: string;
    } | null;
}

const GITHUB_USERNAME = 'Ahmed-Emad-Nasr';
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

/**
 * Returns the corresponding FontAwesome class for a given programming language.
 * @param language - The programming language of the repository.
 * @returns The FontAwesome icon class for the language.
 */
const getIconForLanguage = (language: string): string => {
    const iconMap: { [key: string]: string } = {
        TypeScript: 'fa-brands fa-react',
        JavaScript: 'fa-brands fa-js',
        Python: 'fa-brands fa-python',
        HTML: 'fa-brands fa-html5',
        CSS: 'fa-brands fa-css3',
        Java: 'fa-brands fa-java',
        'C++': 'fa-solid fa-code',
        Dart: 'fa-brands fa-flutter',
        Ruby: 'fa-brands fa-gem',
        PHP: 'fa-brands fa-php',
        Go: 'fa-brands fa-golang',
        Kotlin: 'fa-brands fa-android',
        Rust: 'fa-brands fa-rust',
        'C#': 'fa-brands fa-dot-circle'
    };

    return iconMap[language] || 'fa-solid fa-code';
};

/**
 * Formats a date string into a more readable format.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Component representing a single GitHub repository item in the projects list.
 * @param repo - The GitHub repository data.
 */
const ProjectItem: React.FC<{ repo: GitHubRepository }> = React.memo(({ repo }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const prefersReducedMotion = useReducedMotion();

    // Define animation variants for the project item
    // const variants = {
    //     hidden: { opacity: 0, y: 50 },
    //     visible: {
    //         opacity: 1,
    //         y: 0,
    //         transition: {
    //             duration: 0.5,
    //             delay: index * 0.1,
    //             ease: [0.22, 1, 0.36, 1],
    //         },
    //     },
    // };

    const variants: Variants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 48 },
        visible: {
            opacity: 1,
            y: 0,
            transition: prefersReducedMotion
                ? {
                    duration: 0.35,
                }
                : {
                    duration: 1,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={styles['single-project']}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            onClick={() => window.open(repo.html_url, '_blank')}
        >
            <div className={styles['part-1']}>
                <motion.i
                    className={getIconForLanguage(repo.language)}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
                <h3>{repo.name}</h3>
            </div>
            <div className={styles['part-2']}>
                <p className={styles.description}>{repo.description || 'No description available.'}</p>
                <p className={styles.description}>
                    <strong>Stars:</strong> {repo.stargazers_count} <FontAwesomeIcon icon={faStar} /> |
                    <strong>Issues:</strong> {repo.open_issues_count} <FontAwesomeIcon icon={faExclamationCircle} /> |
                    <strong>Watchers:</strong> {repo.watchers_count} <FontAwesomeIcon icon={faEye} />
                    <br />
                    <strong>Created:</strong> {formatDate(repo.created_at)}<br />
                    <strong>Updated:</strong> {formatDate(repo.updated_at)}
                    <br />
                    {repo.topics.length > 0 && (
                        <p className={styles.description}>
                            <strong>Topics:</strong> {repo.topics.join(', ')}
                        </p>
                    )}
                </p>
                <div className={styles.description}>
                    <p><strong>Owner:</strong> {repo.owner.login}</p>
                    {repo.license && (
                        <p><strong>License:</strong> {repo.license.name}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => prevProps.repo.id === nextProps.repo.id);

/**
 * Main component that fetches and displays GitHub repositories.
 * It handles the fetching of repositories and renders them as project items.
 */
const SenseiProjects: React.FC = () => {
    const [repos, setRepos] = useState<GitHubRepository[]>([]);
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const prefersReducedMotion = useReducedMotion();

    /**
     * Fetches repositories from GitHub and updates the state.
     */
    const fetchGitHubRepos = useCallback(async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            const data = await response.json();
            setRepos(data);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    }, []);

    // Fetch repositories on component mount
    useEffect(() => {
        fetchGitHubRepos();
    }, [fetchGitHubRepos]);

    return (
        <section className={styles['section-projects']} id="Projects">
            <div className={styles.container}>
                <motion.div
                    ref={headerRef}
                    className={styles['header-section']}
                    initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={
                        prefersReducedMotion
                            ? { duration: 0.3 }
                            : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
                    }
                >
                    <h2 className={styles.title}>
                        <motion.span
                            lang="ja"
                            initial={{ scale: 0 }}
                            animate={headerInView ? { scale: 1 } : {}}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            計画  •
                        </motion.span>
                        <motion.span
                            lang="en"
                            initial={{ scale: 0 }}
                            animate={headerInView ? { scale: 1 } : {}}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        > Projects
                        </motion.span>
                    </h2>
                </motion.div>
                <div className={styles['grid-container']}>
                    {repos.map((repo) => (
                        <ProjectItem key={repo.id} repo={repo} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SenseiProjects;
