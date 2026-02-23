"use client";
import { ReactElement, useEffect, useState } from "react";
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

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPopup(true);
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
            transition={
              prefersReducedMotion
                ? { duration: 0.25 }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
            }
          >
            <motion.div
              className={styles.popup}
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

              <h2><p>Choose CV or Resume 📄</p></h2>

              <div className={styles.popupButtons}>
                <button
                  onClick={() => handleDownload("en")}
                  className={`${styles.btn} ${styles.popupBtn}`}
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
