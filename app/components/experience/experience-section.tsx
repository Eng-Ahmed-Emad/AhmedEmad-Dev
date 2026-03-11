"use client";
import { memo, useMemo } from "react";
import { motion, cubicBezier, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./experience-section.module.css";
import MotionInView from "@/app/core/components/MotionInView";
import SectionHeader from "@/app/core/components/SectionHeader";
import { calculateExperience } from "@/app/core/utils/experienceUtils";
import { knowledgeEducationItems } from "@/app/core/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimelineItemProps = {
  tag: string;
  subTag?: string;
  subTagHyperlink?: string;
  desc: string;
  isRight: boolean;
  startDate: string;
  endDate?: string;
  showDate?: boolean;
  index: number;
};

// ─── Statics ──────────────────────────────────────────────────────────────────

// cubicBezier() creates a new easing function object on every call.
// Hoisting it as a module-level constant avoids recreating it on each render.
const SLIDE_EASE = cubicBezier(0.22, 1, 0.36, 1);

// The header animation objects are static — no need to recreate them per render.
const HEADER_INITIAL = { opacity: 0, y: -50 } as const;
const HEADER_ANIMATE_IN = { opacity: 1, y: 0 } as const;
const HEADER_ANIMATE_OUT = {} as const;
const HEADER_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

// ─── TimelineItem ─────────────────────────────────────────────────────────────

const TimelineItem = memo<TimelineItemProps>(
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
    // Recompute only when dates change.
    const experienceTime = useMemo(
      () => calculateExperience(startDate, endDate),
      [startDate, endDate]
    );

    // Variants depend only on isRight + index — memoised accordingly.
    const variants: Variants = useMemo(
      () => ({
        hidden: { opacity: 0, x: isRight ? 100 : -100 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            delay: index * 0.05,
            ease: SLIDE_EASE,
          },
        },
      }),
      [isRight, index]
    );

    // Derived once per render — cheaper than an extra useCallback + closure.
    const containerClass = `${styles["timeline-container"]} ${
      isRight ? styles.right : styles.left
    }`;

    // Stable inline object avoided: only rendered when subTagHyperlink is truthy,
    // so the conditional style below is evaluated at most once per item.
    const subTagStyle = subTagHyperlink
      ? ({ cursor: "pointer" } as const)
      : ({ cursor: "default" } as const);

    return (
      <MotionInView className={containerClass} variants={variants}>
        <div className={styles.content}>
          <div className={styles.tag}>
            <h2>{tag}</h2>
            {subTag && (
              <h3
                // Opens the link directly — no extra handler wrapper needed.
                onClick={
                  subTagHyperlink
                    ? () => window.open(subTagHyperlink, "_blank")
                    : undefined
                }
                style={subTagStyle}
              >
                {subTag}
              </h3>
            )}
          </div>
          <div className={styles.desc}>
            {/* eslint-disable-next-line react/no-danger */}
            <p dangerouslySetInnerHTML={{ __html: desc }} />
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

// ─── ExperienceSection ────────────────────────────────────────────────────────

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
          initial={HEADER_INITIAL}
          animate={headerInView ? HEADER_ANIMATE_IN : HEADER_ANIMATE_OUT}
          transition={HEADER_TRANSITION}
        >
          <SectionHeader
            japaneseText="経験"
            englishText="Experience"
            titleClassName={styles.title}
          />
        </motion.div>
        <div className={styles["time-line"]}>
          {knowledgeEducationItems.map((item, index) => (
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