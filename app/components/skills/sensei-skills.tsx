"use client";
import React, { JSX, useMemo, memo } from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./sensei-skills.module.css";
import SectionHeader from "@/app/core/components/SectionHeader";
import { technicalSkills } from "@/app/core/data";

/**
 * SkillCard Component
 * Renders a single skill category card with animation
 */
const SkillCard = memo(({
  category,
  icon,
  skills,
  index,
}: {
  category: string;
  icon: string;
  skills: string;
  index: number;
}): JSX.Element => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Memoize the animation variants so Framer Motion doesn't recalculate
  // this object for every single card on every render cycle.
  const variants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.2,
          delay: index * 0.05,
          ease: cubicBezier(0.22, 1, 0.36, 1),
        },
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
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.2 }}
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

/**
 * SkillsSection Component
 * Main component that renders technical and non-technical skills
 */
function SkillsSection(): JSX.Element {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={styles["skills-section"]} id="Skills">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
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
              // Using category combined with index creates a much more stable key 
              // for React's reconciliation engine during DOM updates.
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
}

// Wrapping the entire section in memo prevents global scroll events 
// from trickling down and needlessly re-rendering this heavy component.
export default memo(SkillsSection);