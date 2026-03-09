"use client";
import React, { JSX } from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./sensei-skills.module.css";
import SectionHeader from "@/app/core/components/SectionHeader";
import { technicalSkills} from "@/app/core/data";

/**
 * SkillCard Component
 * Renders a single skill category card with animation
 */
const SkillCard: React.FC<{
  category: string;
  icon: string;
  skills: string;
  index: number;
}> = ({ category, icon, skills, index }): JSX.Element => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants: Variants = {
    hidden: { opacity: 0, y: 30 },
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
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        />
        <h3 className={styles.category}>{category}</h3>
      </div>
      <div className={styles["card-body"]}>
        <p className={styles["skills-text"]}>{skills}</p>
      </div>
    </motion.div>
  );
};

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
          transition={{ duration: 0.6 }}
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
              key={`technical-${index}`}
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

export default SkillsSection;
