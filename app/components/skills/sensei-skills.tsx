"use client";
import { memo, useMemo } from "react";
import { motion, type Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./sensei-skills.module.css";
import SectionHeader from "@/app/core/components/SectionHeader";
import { technicalSkills } from "@/app/core/data";

// ─── Statics ──────────────────────────────────────────────────────────────────

// Hoisted at module level — allocated once, never recreated during renders.
const SLIDE_EASE = cubicBezier(0.22, 1, 0.36, 1);

const HEADER_INITIAL     = { opacity: 0, y: -50 } as const;
const HEADER_ANIMATE_IN  = { opacity: 1, y: 0 }   as const;
const HEADER_ANIMATE_OUT = {}                      as const;
const HEADER_TRANSITION  = { duration: 0.3 }       as const;

const ICON_ANIMATE    = { rotate: 0 }  as const;
const ICON_HOVER      = { rotate: 15 } as const;
const ICON_TRANSITION = { duration: 0.2 } as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillCardProps = {
  category: string;
  icon: string;
  skills: string;
  index: number;
};

// ─── SkillCard ────────────────────────────────────────────────────────────────

/**
 * Renders a single skill category card with entrance and hover animations.
 */
const SkillCard = memo<SkillCardProps>(({ category, icon, skills, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Recomputes only when index changes — SLIDE_EASE is stable (module-level).
  const variants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, delay: index * 0.05, ease: SLIDE_EASE },
      },
    }),
    [index]
  );

  return (
    <motion.div
      ref={ref}
      className={styles["skill-card"]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      <div className={styles["card-header"]}>
        <motion.i
          className={icon}
          animate={ICON_ANIMATE}
          whileHover={ICON_HOVER}
          transition={ICON_TRANSITION}
          aria-hidden="true"
        />
        <h3 className={styles.category}>{category}</h3>
      </div>
      <div className={styles["card-body"]}>
        <p className={styles["skills-text"]}>{skills}</p>
      </div>
    </motion.div>
  );
});

SkillCard.displayName = "SkillCard";

// ─── SkillsSection ────────────────────────────────────────────────────────────

/**
 * Main section component. Wrapped in memo to prevent re-renders driven
 * by parent scroll or unrelated state changes.
 */
const SkillsSection = memo(function SkillsSection() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={styles["skills-section"]} id="Skills">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={HEADER_INITIAL}
          animate={headerInView ? HEADER_ANIMATE_IN : HEADER_ANIMATE_OUT}
          transition={HEADER_TRANSITION}
        >
          <SectionHeader
            japaneseText="技能 スキル"
            englishText="Skills"
            titleClassName={styles.title}
          />
        </motion.div>

        <div className={styles["skills-grid"]}>
          {technicalSkills.map((skill, index) => (
            <SkillCard
              key={`technical-${skill.category}-${index}`}
              category={skill.category}
              icon={skill.icon}
              skills={skill.skills}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default SkillsSection;