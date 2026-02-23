import { JSX } from 'react';
import styles from './sensei-contact.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLinkedin,
    faWhatsapp,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";

//**
// @Author Ahmed Sensei106
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
        <section className={styles['Contact-Me-section']} id="Contact">
            <div className={styles['header-section']}>
                <h2 className={styles.title}>
                    {/* A title with a Japanese and English string */}
                    <span lang="ja">連絡先 •</span>
                    <span lang="en"> Contact Me</span>
                </h2>
                <footer className={styles.footer}>
                    <div className={styles.container}>
                        <div className={styles['contact-me']}>
                            <div className={styles['info-me']}>
                                <a
                                    className={styles['link-me']}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="mailto:ahmed.em.nasr@gmail.com?subject=Hello Eng Ahmed: "
                                >
                                    ahmed.em.nasr@gmail.com
                                </a>
                                <div className={styles.social}>
                                    <p className={styles.meon}>Me on Social Network</p>
                                    <a
                                        aria-label="Go to WhatsApp"
                                        href="https://wa.me/201013972690"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="WhatsApp"
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} />
                                    </a>

                                    <a
                                        aria-label="Go to Linkedin"
                                        href="https://www.linkedin.com/in/eng-ahmed-nasr/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FontAwesomeIcon icon={faLinkedin} />
                                    </a>
                                   
                                    <a
                                        aria-label="Go to GitHub"
                                        href="https://github.com/Eng-Ahmed-Emad"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FontAwesomeIcon icon={faGithub} />
                                    </a>
                                   



                                </div>
                            </div>
                        </div>
                        {/* Copyright footer */}
                        <div className={styles.copyright}>

                            &copy; 2024 - {new Date().getFullYear()}{' '}
                            <span>
                                <a
                                    className={styles.Sensei_Name}
                                    href="https://github.com/Eng-Ahmed-Emad/AhmedEmad-Dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ahmed Emad (˶˃ ᵕ ˂˶)
                                </a>
                            </span>{' '}
                            ALL Copyright Reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default SenseiContact;
