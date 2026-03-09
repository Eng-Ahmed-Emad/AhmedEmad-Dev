"use client";
import React from "react";
import { useInView } from "react-intersection-observer";
import { faStar, faExclamationCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import { cubicBezier, motion, Variants } from "framer-motion";
import styles from "./sensei-services-projects.module.css";
import { useGitHubRepos, type GitHubRepository } from "@/app/core/hooks/useGitHubRepos";
import { getIconForLanguage, formatDate } from "@/app/core/utils/projectsUtils";
import MotionInView from "@/app/core/components/MotionInView";
import SectionHeader from "@/app/core/components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//**
// @Author Ahmed Emad Nasr
// @Description React component that fetches and displays GitHub repositories with animation and styling using Framer Motion and FontAwesome.
/**

/**
 * Component representing a single GitHub repository item in the projects list.
 * @param repo - The GitHub repository data.
 * @param index - The index of the repository in the list.
 */
const ProjectItem: React.FC<{ repo: GitHubRepository; index: number }> = React.memo(
  ({ repo, index }) => {
    // Define animation variants for the project item
    const variants: Variants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: index * 0.1,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
      },
    };

    return (
      <MotionInView
        className={styles["single-project"]}
        variants={variants}
        onClick={() => window.open(repo.html_url, "_blank")}
      >
        <div className={styles["part-1"]}>
          <motion.i
            className={getIconForLanguage(repo.language)}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          />
          <h3>{repo.name}</h3>
        </div>
        <div className={styles["part-2"]}>
          <p className={styles.description}>
            {repo.description || "No description available."}
          </p>
          <div className={styles.description}>
            <strong>Stars:</strong> {repo.stargazers_count}{" "}
            <FontAwesomeIcon icon={faStar} /> |<strong>Issues:</strong>{" "}
            {repo.open_issues_count}{" "}
            <FontAwesomeIcon icon={faExclamationCircle} /> |
            <strong>Watchers:</strong> {repo.watchers_count}{" "}
            <FontAwesomeIcon icon={faEye} />
            <br />
            <strong>Created:</strong> {formatDate(repo.created_at)}
            <br />
            <strong>Updated:</strong> {formatDate(repo.updated_at)}
            <br />
            {repo.topics.length > 0 && (
              <p className={styles.description}>
                <strong>Topics:</strong> {repo.topics.join(", ")}
              </p>
            )}
          </div>
          <div className={styles.description}>
            <strong>Owner:</strong> {repo.owner.login}
            <br />
            <strong>Language:</strong>{" "}
            {repo.language ? repo.language : "Markdown"}
            {repo.license && (
              <p className={styles.description}>
                <strong>License:</strong> {repo.license.name}
              </p>
            )}
          </div>
        </div>
      </MotionInView>
    );
  },
  (prevProps, nextProps) => prevProps.repo.id === nextProps.repo.id,
);

/**
 * Main component that fetches and displays GitHub repositories.
 * It handles the fetching of repositories and renders them as project items.
 */
const SenseiProjects: React.FC = () => {
  const repos = useGitHubRepos();
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const motionProps = {
    initial: { scale: 0 },
    animate: headerInView ? { scale: 1 } : {},
    transition: {
      duration: 0.6,
      delay: 0.3,
      type: "spring" as const,
      stiffness: 200,
      damping: 10,
    },
  };

  return (
    <section className={styles["section-projects"]} id="Projects">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            japaneseText="計画"
            englishText="Projects"
            titleClassName={styles.title}
            japaneseMotionProps={motionProps}
            englishMotionProps={motionProps}
          />
        </motion.div>
        <div className={styles["grid-container"]}>
          {repos.map((repo, index) => (
            <ProjectItem key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenseiProjects;
