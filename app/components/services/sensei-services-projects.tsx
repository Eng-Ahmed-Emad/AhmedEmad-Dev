// Import necessary dependencies and styles
"use client";
import React, { JSX } from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./sensei-services-projects.module.css";

//**
// @Author Ahmed Emad Nasr
// @Description React component that displays a list of service items using Framer Motion animations.
// Each service item includes an icon, title, and description, all of which are animated based on the user's scroll position.
//**

/**
 * A function component that renders a single service item.
 *
 * @param {{ icon: string; title: string; description: string; index: number; }} props
 * The props object should have the following properties:
 * - `icon`: The class name of the font awesome icon to use.
 * - `title`: The title of the service.
 * - `description`: A brief description of the service.
 * - `index`: The index of the service in the list for animation delay purposes.
 *
 * @returns {JSX.Element} A JSX element representing a single service item.
 */
const ServiceItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }): JSX.Element => {
  // useInView hook to track if the element is visible in the viewport
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Define animation variants for Framer Motion
  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Delay based on the service index for staggered animation
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={styles["single-service"]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      <div className={styles["part-1"]}>
        <motion.i
          className={icon}
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        />
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles["part-2"]}>
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
};

/**
 * A React component that displays a list of service items in a grid format.
 * Each service item is rendered using the ServiceItem component and is animated when it appears in the viewport.
 *
 * @returns {JSX.Element} A JSX element representing the services section.
 */
function SenseiServicesProjects(): JSX.Element {
  const services = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Security Operations Center (SOC) Analysis",
      description:
        "Advanced alert triage, threat detection, and security event analysis. Utilize Wazuh, ELK Stack, and Splunk for real-time monitoring. Implement MITRE ATT&CK framework for threat classification and improve detection accuracy.",
    },

    {
      icon: "fa-solid fa-fire",
      title: "Incident Response (IR) & Handling",
      description:
        "End-to-end incident response lifecycle management. Perform threat hunting, containment, eradication, and recovery. Execute incident response playbooks using best practices and frameworks.",
    },

    {
      icon: "fa-solid fa-magnifying-glass",
      title: "Threat Hunting & Detection Engineering",
      description:
        "Proactive threat hunting using YARA rules, Suricata IDS/IPS, and behavioral analysis. Create custom detection signatures, reduce false positive alerts, and strengthen security posture.",
    },

    {
      icon: "fa-solid fa-database",
      title: "SIEM & EDR Implementation",
      description:
        "Deploy and configure enterprise-grade SIEM solutions including ELK Stack and Splunk. Implement EDR tools like Wazuh for endpoint detection and response capabilities.",
    },

    {
      icon: "fa-solid fa-file-lines",
      title: "Log Analysis & Digital Forensics",
      description:
        "Comprehensive log analysis, IOC extraction, and digital forensics investigations. Perform memory forensics, malware behavioral analysis, and evidence collection for incident investigations.",
    },

    {
      icon: "fa-solid fa-triangle-exclamation",
      title: "Vulnerability Assessment & Penetration Testing",
      description:
        "Identify security weaknesses through systematic vulnerability assessments. Conduct authorized penetration testing, create detailed reports, and recommend remediation strategies.",
    },

    {
      icon: "fa-solid fa-person-chalkboard",
      title: "Cybersecurity Training & Awareness",
      description:
        "Deliver comprehensive cybersecurity training programs to technical and non-technical audiences. Build security awareness, improve incident response skills, and foster security culture.",
    },

    {
      icon: "fa-solid fa-virus",
      title: "Malware Analysis & Prevention",
      description:
        "Perform static and dynamic malware analysis in isolated environments. Extract indicators of compromise (IOCs), develop detection signatures, and implement prevention strategies using YARA rules.",
    },
  ];

  // useInView hook to track if the header is visible in the viewport
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={styles["section-services"]} id="Services">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles.title}>
            <span lang="ja">事業 •</span>
            <span lang="en"> Services</span>
          </h2>
        </motion.div>
        <div className={styles["grid-container"]}>
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SenseiServicesProjects;
