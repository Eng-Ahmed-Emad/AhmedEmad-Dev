import React, { JSX, memo } from "react";
import styles from "./sensei-contact.module.css";

/**
 * @Author Ahmed Emad Nasr
 * @Description A responsive contact me component with a menu that highlights the active section of the page.
 */

// 1. Extract static data outside the component to prevent recreating these objects on every render.
const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/in/ahmed-emad-nasr/?originalSubdomain=eg",
    ariaLabel: "Go to Linkedin",
    iconClass: "fa-brands fa-linkedin",
  },
  {
    href: "https://wa.me/201018166445",
    ariaLabel: "Contact on WhatsApp",
    iconClass: "fa-brands fa-whatsapp",
  },
  {
    href: "https://www.instagram.com/ahmed.em.nasr/",
    ariaLabel: "Go to Instagram",
    iconClass: "fa-brands fa-instagram",
  },
  {
    href: "https://www.facebook.com/ahmed.em.nasr",
    ariaLabel: "Go to Facebook",
    iconClass: "fa-brands fa-square-facebook",
  },
  {
    href: "https://t.me/Ox3omda",
    ariaLabel: "Go to Telegram",
    iconClass: "fa-brands fa-telegram",
  },
];

// 2. Compute the current year once when the file loads, rather than executing the Date object on every render.
const CURRENT_YEAR = new Date().getFullYear();

const SenseiContact = (): JSX.Element => {
  return (
    <section className={styles["Contact-Me-section"]} id="Contact">
      <div className={styles["header-section"]}>
        <h2 className={styles.title}>
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
                  {/* 3. Map over the extracted array for cleaner, more maintainable code */}
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.iconClass}
                      aria-label={link.ariaLabel}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={link.iconClass} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            {/* Copyright footer */}
            <div className={styles.copyright}>
              &copy; 2024 - {CURRENT_YEAR}{" "}
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

// 4. Wrap in React.memo. Since this component takes no props and has no internal state, 
// this guarantees it will NEVER needlessly re-render if a parent component updates.
export default memo(SenseiContact);