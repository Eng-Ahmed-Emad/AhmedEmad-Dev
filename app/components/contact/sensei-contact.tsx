"use client";
import { memo, useState, useCallback, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faPaperPlane,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faWhatsapp,
  faXTwitter,
  faInstagram,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./sensei-contact.module.css";
import SectionHeader from "@/app/core/components/SectionHeader";

// ─── Shared animation constants ───────────────────────────────────────────────
const SLIDE_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: SLIDE_EASE } },
};

const HEADER_INITIAL     = { opacity: 0, y: -30 } as const;
const HEADER_ANIMATE_IN  = { opacity: 1, y: 0 }   as const;
const HEADER_ANIMATE_OUT = {}                      as const;
const HEADER_TRANSITION  = { duration: 0.3, ease: SLIDE_EASE } as const;

// Stable success-message animation objects (avoids inline allocation on every render)
const SUCCESS_INITIAL  = { opacity: 0, y: 10 } as const;
const SUCCESS_ANIMATE  = { opacity: 1, y: 0 }  as const;

// Stable useInView config
const ONCE_VIEW_CONFIG = { triggerOnce: true, threshold: 0.1 } as const;

// ─── SenseiContact ────────────────────────────────────────────────────────────
const SenseiContact = memo(function SenseiContact() {
  const [headerRef,    headerInView]    = useInView(ONCE_VIEW_CONFIG);
  const [containerRef, containerInView] = useInView(ONCE_VIEW_CONFIG);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);

  // Bug fix: the original `setTimeout(() => setIsSuccess(false), 5000)` was
  // never cleaned up. If the component unmounted before 5 s elapsed (e.g. the
  // user navigated away), it would call setState on an unmounted component.
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setIsSuccess(false);

      // Cancel any pending "hide success message" timer before starting a new
      // submission to prevent race conditions.
      if (successTimerRef.current !== null) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      try {
        const response = await fetch("https://formspree.io/f/mlgpbpdr", {
          method: "POST",
          body: new FormData(e.currentTarget),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          setIsSuccess(true);
          // Bug fix: use e.currentTarget instead of casting e.target.
          // e.target may differ from the form element in bubbling scenarios;
          // e.currentTarget is always the element the handler is attached to.
          e.currentTarget.reset();

          successTimerRef.current = setTimeout(() => {
            setIsSuccess(false);
            successTimerRef.current = null;
          }, 5000);
        } else {
          console.error("Failed to send message. Server responded with an error.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [], // no external deps — all state setters are stable
  );

  return (
    <section className={styles["contact-section"]} id="Contact">
      <div className={styles.container}>
        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial={HEADER_INITIAL}
          animate={headerInView ? HEADER_ANIMATE_IN : HEADER_ANIMATE_OUT}
          transition={HEADER_TRANSITION}
        >
          <SectionHeader
            japaneseText="連絡先"
            englishText="Contact Me"
            titleClassName={styles.title}
          />
        </motion.div>

        {/* ── Contact wrapper ── */}
        <motion.div
          ref={containerRef}
          className={styles["contact-wrapper"]}
          initial="hidden"
          animate={containerInView ? "visible" : "hidden"}
          variants={CONTAINER_VARIANTS}
        >
          {/* ── Info card ── */}
          <motion.div className={styles["info-card"]} variants={ITEM_VARIANTS}>
            <h3 className={styles["info-title"]}>Let&apos;s Connect</h3>
            <p className={styles["info-desc"]}>
              Whether you have a question about cybersecurity, a project proposal, or just want to
              say hi, my inbox is always open!
            </p>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}>
                <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
              </div>
              <div className={styles["info-text"]}>
                <h4>Email</h4>
                <p>ahmed.em.nasr@gmail.com</p>
              </div>
            </div>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}>
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
              </div>
              <div className={styles["info-text"]}>
                <h4>Phone / WhatsApp</h4>
                <p>+20 101 816 6445</p>
              </div>
            </div>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}>
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
              </div>
              <div className={styles["info-text"]}>
                <h4>Location</h4>
                <p>Banha, Egypt</p>
              </div>
            </div>

            <div className={styles["contact-socials"]}>
              <a href="https://wa.me/201018166445" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a href="https://www.linkedin.com/in/ahmed-emad-nasr/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://x.com/0x3omda" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X (Twitter)">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://instagram.com/ahmed.em.nasr" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://t.me/ahmed_em_nasr" target="_blank" rel="noopener noreferrer" title="Telegram" aria-label="Telegram">
                <FontAwesomeIcon icon={faTelegram} />
              </a>
            </div>
          </motion.div>

          {/* ── Form card ── */}
          <motion.div className={styles["form-card"]} variants={ITEM_VARIANTS}>
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles["input-group"]}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  autoComplete="name"
                  className={styles["input-field"]}
                />
              </div>
              <div className={styles["input-group"]}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  autoComplete="email"
                  className={styles["input-field"]}
                />
              </div>
              <div className={styles["input-group"]}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  className={styles["input-field"]}
                />
              </div>
              <div className={styles["input-group"]}>
                <textarea
                  name="message"
                  placeholder="Your Message..."
                  required
                  className={styles["input-field"]}
                />
              </div>

              <button
                type="submit"
                className={styles["submit-btn"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Sending… <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Send Message <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
                  </>
                )}
              </button>

              {isSuccess && (
                <motion.p
                  className={styles["success-msg"]}
                  initial={SUCCESS_INITIAL}
                  animate={SUCCESS_ANIMATE}
                  role="status"
                  aria-live="polite"
                >
                  Message sent successfully! I will get back to you soon.
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default SenseiContact;