/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./experience-section.module.css";


type TimelineItem = {
    tag: string;
    subTag?: string;
    subTagHyperlink?: string;
    desc: string;
    isRight: boolean;
    startDate: string;
    endDate?: string;
    showDate?: boolean;
};

const calculateExperience = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
    );

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0)
        return `${years} Year${years > 1 ? "s" : ""} ${remainingMonths} Month${remainingMonths > 1 ? "s" : ""}`;
    if (years > 0) return `${years} Year${years > 1 ? "s" : ""}`;
    if (months > 0) return `${Math.round(months)} Month${months > 1 ? "s" : ""}`;

    return "< 1 mo";
};

const TimelineItem = React.memo<TimelineItem & { index: number }>(
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
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });

        const [experienceTime] = useState<string>(() =>
            calculateExperience(startDate, endDate),
        );

        const handleSubTagClick = (): void => {
            if (subTagHyperlink) {
                window.open(subTagHyperlink, "_blank");
            }
        };

        const variants: Variants = {
            hidden: { opacity: 0, x: isRight ? 80 : -80 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    type: "spring",
                    stiffness: 110,
                    damping: 22,
                    mass: 1,
                    delay: index * 0.12,
                    duration: 0.7,
                },
            },
        };

        return (
            <motion.div
                ref={ref}
                className={`${styles["timeline-container"]} ${isRight ? styles.right : styles.left}`}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={variants}
            >
                <div className={styles.content}>
                    <div className={styles.tag}>
                        <h2>{tag}</h2>
                        <h3 onClick={handleSubTagClick}>{subTag}</h3>
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
            </motion.div>
        );
    },
);

function ExperienceSection() {
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const knowledgeEducationItems = [
        {
            tag: "Incident Response Analyst -- Intern",
            subTag: "AMIT",
            subTagHyperlink: "https://amit-learning.com/",
            desc: `Responsible for monitoring, detecting, and analyzing security incidents across IT infrastructure. Quickly responds to threats, investigates potential breaches, and implements incident response playbooks to mitigate risks and minimize business impact. Collaborates with security teams to improve detection capabilities, enhance response processes, and maintain overall system security`,
            startDate: "2026-01-01",
            endDate: "2026-06-01",
            isRight: true,
            showDate: true,
        },


        {
            tag: " ITI Cybersecurity Summer Program",
            subTag: "Information Technology Institute (ITI)",
            subTagHyperlink: "https://iti.gov.eg/",
            desc: "Penetration Testing Program including an eJPT Voucher and a CTF Competition",
            startDate: "2025-07-01",
            endDate: "2025-12-15",
            isRight: false,
            showDate: true,
        },


        {
            tag: "Information Security Analyst -– Internship",
            subTag: "Global Knowledge",
            subTagHyperlink: "https://depi.gov.eg/content/home",
            desc: `Monitored and triaged security alerts using **Wazuh SIEM** and **Security Onion**  
                   Configured and maintained **pfSense Firewall** for network security  
                   Implemented and fine-tuned **Snort IDS/IPS** to detect and prevent threats`,
            startDate: "2025-06-01",
            endDate: "2025-12-31",
            isRight: true,
            showDate: true,

        },

        {
            tag: "Cyber Security Instructor",
            subTag: "Google Student Club",
            subTagHyperlink:
                "https://gdg.community.dev/gdg-on-campus-benha-university-benha-egypt/",
            desc: "Delivered cybersecurity training to 120+ learners, resulting in 40% practical skill improvement and a 4.9/5 average satisfaction rating.",
            isRight: false,
            startDate: "2024-10-01",
            endDate: "2025-11-31",
            showDate: true,
        },

        {
            tag: " Two Summer Trainings With Huawei",
            subTag: "Huawei",
            subTagHyperlink: "https://www.huawei.com/en/",
            desc: " Huawei HCIA-Datacom V1.0 (H12-811) Routing and Switching && HCIA_ Cloud_Computing V5.0 ",
            isRight: true,
            startDate: "2023-05-01",
            showDate: false,
        },

        {
            tag: "Computer Science Degree",
            desc: "Studying Computer's Science, building skills in in Information Security and Digital Forensics. GPA :3.73 ˶˃ ᵕ ˂˶  ",
            subTag: "Benha University (BFCAI)",
            subTagHyperlink: "https://www.bu.edu.eg/",
            isRight: false,
            startDate: "2022-10-01",
            endDate: "2026-07-01",
            showDate: true,
        },

        {
            tag: "Arabic Language",
            desc: " Native Speaker",
            isRight: true,
            startDate: "2018-01-01",
            showDate: false,
        },
        {
            tag: "English C1 ",
            desc: "Professional Working Proficiency ",
            isRight: false,
            startDate: "2016-01-01",
            showDate: false,
        },
        {
            tag: "HOBBIES",
            desc: " The next Are Hobbies And My Atheletic Career (˶˃ ᵕ ˂˶)  ",
            isRight: true,
            startDate: "2018-01-01",
            showDate: false,
        },


        {
            tag: "Athlete @Al Ahly FC",
            desc: " I Am An Athlete At Al Ahly FC (Runner) Specialized in 800 m && 1500 m And 10k m Races ",
            isRight: false,
            startDate: "2018-01-01",
            showDate: true,
        },
        {
            tag: "Former pentathlon",
            desc: "I Was pentathlon player @Banha FC specialized in Running (800 m) & Swimming (100 m) And Lazer Run (4 x 800 m)  ",
            isRight: true,
            startDate: "2016-01-01",
            showDate: true,
        },

    ];

    return (
        <section className={styles["section-education"]} id="Experience">
            <div className={styles.container}>
                <motion.div
                    ref={headerRef}
                    className={styles["header-section"]}
                    initial={{ opacity: 0, y: -50 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        type: "spring",
                        stiffness: 110,
                        damping: 22,
                        duration: 0.6,
                    }}
                >
                    <h2 className={styles.title}>
                        <span lang="ja">経験 •</span>
                        <span lang="en"> Experience</span>
                    </h2>
                </motion.div>
                <div className={styles["time-line"]}>
                    {knowledgeEducationItems.map((item, index) => (
                        <TimelineItem key={index} {...item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection;


