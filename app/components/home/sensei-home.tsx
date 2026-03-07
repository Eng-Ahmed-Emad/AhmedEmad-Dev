"use client";
import { JSX, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
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



//**

// @Author Ahmed Emad Nasr

// @Description A React component that serves as the home section of the portfolio, featuring an image, social links, and animations.

//**



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

            width={400}

            height={400}

            onClick={handleImageClick}

          />

        </motion.div>

        <motion.div className={styles.homeContent} variants={itemVariants}>

          <h1>

            Hi, it's <span className={styles.highlight}>Ahmed Emad</span>

          </h1>

          <h3 className={styles.typingText}>

            I'm a <span className={styles.typingHighlight}></span>

          </h3>

          <p>

           Cybersecurity professional specializing in Security Operations and Incident Response. Computer Science student at the Faculty of Computer Science and Artificial Intelligence, Benha University.          Focused on threat analysis, alert triage, and incident investigation through hands-on SOC projects and training. Passionate about defending systems and continuously developing Blue Team skills.

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

    </section >

  );

};

export default SenseiHome;
