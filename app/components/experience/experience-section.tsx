"use client";
import React, { useMemo, useCallback, memo } from "react";
import { motion, cubicBezier, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./experience-section.module.css";
import MotionInView from "@/app/core/components/MotionInView";
import SectionHeader from "@/app/core/components/SectionHeader";
import { calculateExperience } from "@/app/core/utils/experienceUtils";
import { knowledgeEducationItems } from "@/app/core/data";

type TimelineItemProps = {
  tag: string;
  subTag?: string;
  subTagHyperlink?: string;
  desc: string;
  isRight: boolean;
  startDate: string;
  endDate?: string;
  showDate?: boolean;
};

const TimelineItem = memo<TimelineItemProps & { index: number }>(
  ({
    isRight,
    tag,
    subTag,
    subTagHyperlink,
    desc,
    index,
    startDate,
    endDate,
    showDate = true,
  }) => {
    // Calculate experience time only when dates change
    const experienceTime = useMemo(
      () => calculateExperience(startDate, endDate),
      [startDate, endDate]
    );

    // Memoize the click handler to prevent inline function recreation
    const handleSubTagClick = useCallback((): void => {
      if (subTagHyperlink) {
        window.open(subTagHyperlink, "_blank");
      }
    }, [subTagHyperlink]);

    // Memoize variants so Framer Motion doesn't recalculate them on every render
    const variants: Variants = useMemo(
      () => ({
        hidden: {
          opacity: 0,
          x: isRight ? 100 : -100,
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: cubicBezier(0.22, 1, 0.36, 1),
          },
        },
      }),
      [isRight, index]
    );

    return (
      <MotionInView
        className={`${styles["timeline-container"]} ${
          isRight ? styles.right : styles.left
        }`.trim()}
        variants={variants}
      >
        <div className={styles.content}>
          <div className={styles.tag}>
            <h2>{tag}</h2>
            {/* Render h3 only if subTag exists, and attach onClick only if there's a hyperlink */}
            {subTag && (
              <h3 
                onClick={subTagHyperlink ? handleSubTagClick : undefined}
                style={{ cursor: subTagHyperlink ? "pointer" : "default" }}
              >
                {subTag}
              </h3>
            )}
          </div>
          <div className={styles.desc}>
            <p dangerouslySetInnerHTML={{ __html: desc }}></p>
          </div>
          {showDate && (
            <div className={styles["date-details"]}>
              <div className={styles["experience-time"]}>{experienceTime}</div>
              <div className={styles["date-range"]}>
                {startDate} {endDate ? `- ${endDate}` : "- Present"}
              </div>
            </div>
          )}
        </div>
      </MotionInView>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

function ExperienceSection() {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={styles["section-education"]} id="Experience">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            japaneseText="経験"
            englishText="Experience"
            titleClassName={styles.title}
          />
        </motion.div>
        <div className={styles["time-line"]}>
          {knowledgeEducationItems.map((item, index) => (
            // Using a combination of tag and index as a more stable key than just index
            <TimelineItem 
              key={`${item.tag}-${index}`} 
              {...item} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ExperienceSection);