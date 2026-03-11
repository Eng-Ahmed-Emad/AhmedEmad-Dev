"use client";
import { memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { faStar, faExclamationCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import { cubicBezier, motion, type Variants } from "framer-motion";
import styles from "./sensei-services-projects.module.css";
import { useGitHubRepos, type GitHubRepository } from "@/app/core/hooks/useGitHubRepos";
import { getIconForLanguage, formatDate } from "@/app/core/utils/projectsUtils";
import MotionInView from "@/app/core/components/MotionInView";
import SectionHeader from "@/app/core/components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @Author Ahmed Emad Nasr
 * @Description React component that fetches and displays GitHub repositories with animation
 * and styling using Framer Motion and FontAwesome.
 */

// ─── Statics ──────────────────────────────────────────────────────────────────

// Created once at module load — never reallocated during the component lifecycle.
const SLIDE_EASE = cubicBezier(0.22, 1, 0.36, 1);

const HEADER_INITIAL     = { opacity: 0, y: -50 } as const;
const HEADER_ANIMATE_IN  = { opacity: 1, y: 0 }   as const;
const HEADER_ANIMATE_OUT = {}                      as const;
const HEADER_TRANSITION  = { duration: 0.3, ease: "easeOut" } as const;

const ICON_ANIMATE    = { rotate: 0 }   as const;
const ICON_HOVER      = { rotate: 360 } as const;
const ICON_TRANSITION = { duration: 0.3 } as const;

// The spring transition for SectionHeader motionProps is also fully static.
const SECTION_HEADER_TRANSITION = {
  duration: 0.3,
  delay: 0.3,
  type: "spring" as const,
  stiffness: 200,
  damping: 10,
} as const;

const MOTION_PROPS_SCALE_IN  = { scale: 1 } as const;
const MOTION_PROPS_SCALE_OUT = {}           as const;
const MOTION_PROPS_INITIAL   = { scale: 0 } as const;

// ─── ProjectItem ──────────────────────────────────────────────────────────────

type ProjectItemProps = { repo: GitHubRepository; index: number };

const ProjectItem = memo<ProjectItemProps>(
  ({ repo, index }) => {
    // Recomputes only when index changes.
    const variants: Variants = useMemo(
      () => ({
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, delay: index * 0.05, ease: SLIDE_EASE },
        },
      }),
      [index]
    );

    return (
      <MotionInView
        className={styles["single-project"]}
        variants={variants}
        // Inline arrow is acceptable here: MotionInView is memoised and onClick
        // only changes when repo.html_url changes (same frequency as repo.id).
        onClick={() => window.open(repo.html_url, "_blank")}
      >
        <div className={styles["part-1"]}>
          <motion.i
            className={getIconForLanguage(repo.language)}
            animate={ICON_ANIMATE}
            whileHover={ICON_HOVER}
            transition={ICON_TRANSITION}
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
            <strong>Language:</strong> {repo.language ?? "Markdown"}
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
  // Custom comparator: skip re-render if repo identity hasn't changed.
  (prev, next) => prev.repo.id === next.repo.id && prev.index === next.index
);

ProjectItem.displayName = "ProjectItem";

// ─── SenseiProjects ───────────────────────────────────────────────────────────

const SenseiProjects = memo(function SenseiProjects() {
  const repos = useGitHubRepos();
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Only the `animate` value changes with headerInView — hoist everything else.
  const motionProps = useMemo(
    () => ({
      initial: MOTION_PROPS_INITIAL,
      animate: headerInView ? MOTION_PROPS_SCALE_IN : MOTION_PROPS_SCALE_OUT,
      transition: SECTION_HEADER_TRANSITION,
    }),
    [headerInView]
  );

  return (
    <section className={styles["section-projects"]} id="Projects">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={HEADER_INITIAL}
          animate={headerInView ? HEADER_ANIMATE_IN : HEADER_ANIMATE_OUT}
          transition={HEADER_TRANSITION}
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
});

export default SenseiProjects;