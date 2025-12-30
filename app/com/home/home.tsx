"use client";
import { JSX, useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUserSecret,
  faFilePdf,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-home.module.css";

//**
// @Author Ahmed_Sensei
// @Description A React component that serves as the home section of the portfolio, featuring an image, social links, animations, and a CV language selection popup.
//**

const Home = (): JSX.Element => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start("visible").then((r) => console.log(r));
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
        ? "Assets/cv/AhmedEmadEldeen_CV.pdf"
        : "Assets/cv/السيره الذاتيه.pdf";
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
          <img
            src="Assets/art-gallery/Images/image_display_thumb/6.webp"
            alt="Ahmed Emad Image"
            className={styles.image}
            width={350}
            height={350}
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
            CyberSecurity Trainee @ITI | SOC Analyst Trainee @Global Knowledge | Incdient Response Analyst @AMIT
          </p>

          <motion.div className={styles.socialIcon} variants={itemVariants}>
            <a
              href="https://www.linkedin.com/in/0x3omda/"
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
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              aria-label="Go to WhatsApp"
              href="https://wa.me/201013972690"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp"></i>
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="3x"
                  color="#ff4d4d"
                  className={styles.popupIcon}
                />
              </motion.div>

              <h2><p>Choose Language Of CV 📄</p></h2>

              <div className={styles.popupButtons}>
                <button
                  onClick={() => handleDownload("en")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleDownload("ar")}
                  className={`${styles.btn} ${styles.popupBtn}`}
                >
                  العربية
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
