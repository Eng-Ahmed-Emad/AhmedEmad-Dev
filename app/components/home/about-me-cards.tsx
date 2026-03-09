"use client";
import React, { JSX, memo } from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./about-me-cards.module.css";
import { aboutMeCards } from "@/app/core/data";

/**
 * @Author Ahmed Emad Nasr
 * @Description Optimized React component for 'About Me' cards with Framer Motion.
 */

interface CardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

// استخدام memo لمنع إعادة الرندر غير الضرورية
const AboutMeCard = memo(({ icon, title, description, index }: CardProps): JSX.Element => {
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
        delay: index * 0.1, // Staggered animation
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={styles["about-me-card"]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      <div className={styles["card-part-1"]}>
        <motion.i
          className={icon}
          aria-hidden="true"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        />
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles["card-part-2"]}>
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
});

AboutMeCard.displayName = "AboutMeCard";

function AboutMeCardsSection(): JSX.Element {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={styles["section-about-me"]} id="AboutMe">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={{ opacity: 0, y: -30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles.title}>
            <span lang="ja">自己紹介 •</span>
            <span lang="en"> About Me</span>
          </h2>
        </motion.div>
        
        <div className={styles["grid-container"]}>
          {aboutMeCards.map((card, index) => (
            <AboutMeCard 
              key={card.title || index} 
              {...card} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutMeCardsSection;