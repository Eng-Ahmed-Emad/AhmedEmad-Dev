import React, { JSX } from "react";
import styles from "./sensei-contact.module.css";

//**
// @Author Ahmed Emad Nasr
// @Description A responsive contact me component with a menu that highlights the active section of the page.
//**

/**
 * @function SenseiContact
 * @description A functional component that renders the contact me section
 * @returns {JSX.Element} The JSX Element for the contact me section
 * @example
 * <SenseiContact />
 */
const SenseiContact = (): JSX.Element => {
  return (
    <section className={styles["Contact-Me-section"]} id="Contact">
      <div className={styles["header-section"]}>
        <h2 className={styles.title}>
          {/* A title with a Japanese and English string */}
          <span lang="ja">連絡先 •</span>
          <span lang="en"> Contact Me</span>
        </h2>
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles["contact-me"]}>
              <div className={styles["info-me"]}>
                <a
                  className={styles["link-me"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:ahmed.em.nasr@gmail.com?subject=こんにちは、 MR: Ahmed Emad"
                >
                  Ahmed Emad.Mail
                </a>
                <div className={styles.social}>
                  <p className={styles.meon}>Me on Social Network</p>

                  <a
                    aria-label="Go to Linkedin"
                    href="https://www.linkedin.com/in/ahmed-emad-nasr/?originalSubdomain=eg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* LinkedIn icon */}
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a
                    aria-label="Contact on WhatsApp"
                    href="https://wa.me/201018166445"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                  <a
                    aria-label="Go to Instagram"
                    href="https://www.instagram.com/ahmed.em.nasr/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    aria-label="Go to Facebook"
                    href="https://www.facebook.com/ahmed.em.nasr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-square-facebook"></i>
                  </a>
                   <a
                    aria-label="Go to Telegram"
                    href="https://t.me/Ox3omda"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Telegram icon */}
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                   <a
                    aria-label="Go to Sarhne"
                    href="https://17833478947642.sarhne.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Sarhne icon */}
                    <i className="fa-solid fa-comment"></i>
                  </a>
                
                </div>
              </div>
            </div>
            {/* Copyright footer */}
            <div className={styles.copyright}>
              &copy; 2024 - {new Date().getFullYear()}{" "}
              <span>
                <a
                  className={styles.Sensei_Name}
                  href="https://www.linkedin.com/in/ahmed-emad-nasr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ahmed Emad
                </a>
              </span>{" "}
              ALL Copyright Reserved.
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default SenseiContact;
