"use client";
import { ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faFilePdf, faUserSecret, faUserTie } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-home.module.css";

const HERO_IMAGE = "Assets/art-gallery/Images/image_display_thumb/50.webp";

//**
// @Author Ahmed_Senseii
// @Description A React component that serves as the home section of the portfolio, featuring an image, social links, animations, and a CV language selection popup.
//**

const Home = (): ReactElement => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [showPopup, setShowPopup] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstActionRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? {
            duration: 0.35,
          }
        : {
            duration: 1.2,
            staggerChildren: 0.35,
            delayChildren: 0.15,
            ease: [0.22, 1, 0.36, 1] as const,
          },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? {
            duration: 0.3,
          }
        : {
            duration: 1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
    },
  };

  const openPopup = () => {
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDownload = (lang: "en" | "ar") => {
    const file =
      lang === "en"
        ? "Assets/cv/AhmedEmad_SOCAnalyst_CV.pdf"
        : "Assets/cv/AhmedEmad_SOCAnalyst_Resume.pdf";
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop() || "CV.pdf";
    link.click();
    setShowPopup(false);
  };

  // If you later want 4 distinct files, you can extend
  // the function above and add more `lang` cases, then
  // uncomment the extra buttons in the popup JSX below.

  useEffect(() => {
    if (!showPopup) {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }

      const toFocus = lastActiveElementRef.current ?? triggerRef.current;
      if (toFocus) {
        queueMicrotask(() => toFocus.focus());
      }
      return;
    }

    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    queueMicrotask(() => {
      firstActionRef.current?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePopup();
        return;
      }

      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showPopup]);

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
            src={HERO_IMAGE}
            alt="Ahmed Emad Image"
            className={styles.image}
            width={350}
            height={350}
            priority
            sizes="(max-width: 768px) 100vw, 350px"
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
              href="https://www.linkedin.com/in/eng-ahmed-nasr/"
              target="_blank"
              rel="noopener noreferrer"
              title="Linkedin"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              aria-label="Go to WhatsApp"
              href="https://wa.me/201013972690"
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
              ref={triggerRef}
              type="button"
              onClick={openPopup}
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
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.25 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
            }
          >
            <motion.div
              className={styles.popup}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-title"
              aria-describedby="download-desc"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: prefersReducedMotion ? 1 : 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: prefersReducedMotion ? 1 : 0.88, opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.25 }
                  : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
              }
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ y: prefersReducedMotion ? 0 : -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.35 }
                    : {
                        delay: 0.2,
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
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

              <h2 id="download-title" className={styles.popupTitle}>
                Download
              </h2>
              <p id="download-desc" className={styles.popupText}>
                Choose your preferred file.
              </p>

              <div className={styles.popupButtons}>
                <button
                  ref={firstActionRef}
                  type="button"
                  onClick={() => handleDownload("en")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  CV (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("ar")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  Resume (PDF)
                </button>
                {/*
                <button
                  type="button"
                  onClick={() => handleDownload("en")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  CV (Alternate)
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("ar")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  Resume (Alternate)
                </button>
                */}
              </div>

              <button
                className={styles.closeBtn}
                type="button"
                onClick={closePopup}
                aria-label="Close download dialog"
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
