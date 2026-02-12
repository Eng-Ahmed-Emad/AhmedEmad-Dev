"use client";

import { ReactElement, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faUserSecret, faFilePdf, faUserTie } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-home.module.css";

//**
// @Author Ahmed_Emad
// @Description A React component that serves as the home section of the portfolio, featuring an image,
// social links, animations, and a CV language selection popup.
//**

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 22,
      mass: 1,
      duration: 0.7,
      staggerChildren: 0.18,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 24,
      mass: 0.95,
      duration: 0.6,
    },
  },
};

const Home = (): ReactElement => {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const firstPopupButtonRef = useRef<HTMLButtonElement | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        controls.set("visible");
      } else {
        controls.start("visible");
      }
    }
  }, [controls, inView, shouldReduceMotion]);

  // Focus management & keyboard accessibility for the popup
  useEffect(() => {
    if (!showPopup) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (firstPopupButtonRef.current) {
      firstPopupButtonRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPopup(false);
        return;
      }

      if (event.key === "Tab" && popupRef.current) {
        const focusableElements = popupRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [showPopup]);

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleDownload = (lang: "en" | "ar") => {
    const file =
      lang === "en"
        ? "Assets/cv/AhmedEmad_SOC_And_IR_Analyst_CV.pdf"
        : "Assets/cv/AhmedEmad_SOC_And_IR_Analyst_Resume.pdf";

    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop() || "CV.pdf";
    link.click();
    setShowPopup(false);
  };

  return (
    <section className={styles.home} id="Home">
      <motion.div
        className={styles.container}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        ref={ref}
      >
        <motion.div className={styles.homeImg} variants={itemVariants}>
          <Image
            src="Assets/art-gallery/Images/image_display_thumb/4.webp"
            alt="Ahmed Emad Image"
            className={styles.image}
            width={350}
            height={350}
            priority
          />
        </motion.div>

        <motion.div className={styles.homeContent} variants={itemVariants}>
          <h1>
            Hi It's <span className={styles.highlight}>Ahmed Emad</span>
          </h1>
          <h3 className={styles.typingText}>
            I'm a <span className={styles.typingHighlight}></span>
          </h3>
          <p>
            CyberSecurity Trainee @ITI | Info Sec Trainee @DEPI | IR Analyst @AMIT
          </p>

          <motion.div className={styles.socialIcon} variants={itemVariants}>
            <a
              href="https://www.linkedin.com/in/ahmeddnasrr/"
              target="_blank"
              rel="noopener noreferrer"
              title="Linkedin"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a
              aria-label="Go to Instagram"
              href="https://www.instagram.com/0x3omda/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>

            <a
              aria-label="Go to WhatsApp"
              href="https://wa.me/201018166445"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </motion.div>

          {/* Buttons Section */}
          <motion.div className={styles.homeButton} variants={itemVariants}>
            <a href="#Contact" className={`${styles.btn} ${styles.btn1}`}>
              Hire Me <FontAwesomeIcon icon={faUserSecret} />
            </a>

            <button
              onClick={handleDownloadClick}
              className={`${styles.btn} ${styles.btn2}`}
            >
              Download CV <FontAwesomeIcon icon={faFilePdf} />
            </button>

            <a
              href="https://docs.google.com/document/d/1j4Ln8O3dHafPMFzt8Fgm1KkKSahrkS8NiXF9bluMDtU/edit?usp=sharing"
              target="_blank"
              className={`${styles.btn} ${styles.btn1}`}
            >
              About Me <FontAwesomeIcon icon={faUserTie} />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Popup Section */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className={styles.popupOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.popup}
              ref={popupRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.3, ease: "easeOut" }
                    : {
                        delay: 0.1,
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }
                }
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="3x"
                  color="#ff4d4d"
                  className={styles.popupIcon}
                />
              </motion.div>

              <h2>
                <p>Choose CV or Resume 📄</p>
              </h2>

              <div className={styles.popupButtons}>
                <button
                  onClick={() => handleDownload("en")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                  ref={firstPopupButtonRef}
                >
                  Cv
                </button>
                <button
                  onClick={() => handleDownload("ar")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  Resume
                </button>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setShowPopup(false)}
                aria-label="Close CV selection popup"
              >
                ✖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Home;

