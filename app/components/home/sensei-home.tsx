"use client";
import { JSX, useEffect } from "react";
import { motion, useAnimation, Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faUserSecret, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-home.module.css";

//**
// @Author Ahmed Emad Nasr
// @Description A React component that serves as the home section of the portfolio, featuring an image, social links, and animations.
//**

import { useRandomMedia } from "@/app/core/hooks/useRandomMedia";
import { aboutMeCards } from "@/app/core/data";

/**
 * A function component that renders a single about me card.
 */
const AboutMeCard: React.FC<{
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
        delay: index * 0.1,
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
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        ></motion.i>
        <h3 className={styles["card-title"]}>{title}</h3>
      </div>
      <div className={styles["card-part-2"]}>
        <p className={styles["card-description"]}>{description}</p>
      </div>
    </motion.div>
  );
};

const SenseiHome = (): JSX.Element => {

  const { handleImageClick } = useRandomMedia();



  /**

   * Animation controls for the home section.

   */

  const controls = useAnimation();

  const [ref, inView] = useInView({

    triggerOnce: false,

    threshold: 0.1,

  });



  useEffect(() => {

    if (inView) {

      controls.start("visible");

    }

  }, [controls, inView]);



  /**

   * Animation variants for the home section.

   */

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

  // useInView hook for about me header
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
  src="Assets/art-gallery/Images/logo/My_Logo.webp"
  alt="Ahmed Emad Nasr Image"
  className={styles.image}
  width={350}
  height={350}
  loading="lazy"
  onClick={handleImageClick}
/>

        </motion.div>

        <motion.div className={styles.homeContent} variants={itemVariants}>

<h1>
  <span className={styles.highlight}>Ahmed Emad Nasr</span>.
</h1>

          <h2 className={styles.typingText}>

           <span className={styles.typingHighlight}></span>

          </h2>
        

          <p>

           Computer Science student at Benha University specializing in Security Operations, Incident Response and Cybersecurity. Focused on monitoring, alert triage, DFIR, and defending systems with experience gained through hands-on DEPI, ITI Training Programs and  SOC projects. Passionate about continuously developing Blue Team skills and securing digital environments.

          </p>

          <motion.div className={styles.socialIcon} variants={itemVariants}>

            <a

              href="https://www.linkedin.com/in/ahmed-emad-nasr/"

              target="_blank"

              rel="noopener noreferrer"

              title="Linkedin"

            >

              <FontAwesomeIcon icon={faLinkedin} />

            </a>

           <a
  href="https://wa.me/201018166445"
  target="_blank"
  rel="noopener noreferrer"
  title="WhatsApp"
>
  <FontAwesomeIcon icon={faWhatsapp} />
</a>




          </motion.div>

          <motion.div className={styles.homeButton} variants={itemVariants}>

            <a href="#Contact" className={`${styles.btn} ${styles.btn1}`}>

              Hire Me <FontAwesomeIcon icon={faUserSecret} />

            </a>

            <a

              href="Assets/cv/AhmedEmad_SOCAnalyst_CV.pdf"

              download

              className={`${styles.btn} ${styles.btn2}`}>

              Download CV <FontAwesomeIcon icon={faFilePdf} />

            </a>

          </motion.div>

        </motion.div>

      </motion.div>

      {/* About Me Cards Section */}
      <div className={styles["about-me-section"]}>
        <motion.div
          ref={headerRef}
          className={styles["about-me-header"]}
          initial={{ opacity: 0, y: -50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles["about-me-title"]}>
            <span lang="ja">自己紹介 •</span>
            <span lang="en"> About Me</span>
          </h2>
        </motion.div>
        <div className={styles["about-me-grid"]}>
          {aboutMeCards.map((card, index) => (
            <AboutMeCard key={index} {...card} index={index} />
          ))}
        </div>
      </div>

    </section >

  );

};

export default SenseiHome;
