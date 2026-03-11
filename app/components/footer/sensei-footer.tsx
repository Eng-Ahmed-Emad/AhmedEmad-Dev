"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faWhatsapp, faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-footer.module.css";

/**
 * @Author Ahmed Emad Nasr
 * @Description Modern Glassmorphism Footer Section
 */

const SenseiFooter = memo(function SenseiFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.footer 
      className={styles.footer}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={styles["footer-content"]}>
        <div className={styles["footer-logo"]}>
          Ahmed <span>Emad</span>
        </div>
        
        <div className={styles["social-icons"]}>
          <a href="https://www.linkedin.com/in/ahmed-emad-nasr/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/Ahmed-Emad-Nasr" target="_blank" rel="noopener noreferrer" title="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://x.com/0x3omda" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a href="https://wa.me/201018166445" target="_blank" rel="noopener noreferrer" title="WhatsApp">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>

        <p className={styles["footer-text"]}>
          &copy; {currentYear} Ahmed Emad Nasr. All Rights Reserved.
        </p>
      </div>

      <a href="#Home" onClick={scrollToTop} className={styles["back-to-top"]} title="Back to Top" aria-label="Back to Top">
        <FontAwesomeIcon icon={faArrowUp} />
      </a>
    </motion.footer>
  );
});

export default SenseiFooter;