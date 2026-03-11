"use client";
import { memo, useState, useCallback } from "react";
import { motion, type Variants, cubicBezier } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./sensei-contact.module.css";
import SectionHeader from "@/app/core/components/SectionHeader";

/**
 * @Author Ahmed Emad Nasr
 * @Description High-performance Glassmorphism Contact Section.
 */

// ─── Statics ──────────────────────────────────────────────────────────────────
const SLIDE_EASE = cubicBezier(0.22, 1, 0.36, 1);

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SLIDE_EASE } },
};

const HEADER_INITIAL = { opacity: 0, y: -50 } as const;
const HEADER_ANIMATE_IN = { opacity: 1, y: 0 } as const;
const HEADER_ANIMATE_OUT = {} as const;
const HEADER_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

// ─── SenseiContact ────────────────────────────────────────────────────────────

const SenseiContact = memo(function SenseiContact() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [containerRef, containerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Form Submission (Simulated for now)
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    // هنا هتحط كود الـ EmailJS أو الـ API بتاعك مستقبلاً
    // حالياً بنعمل Fake Delay لمدة ثانيتين عشان ندي شكل احترافي
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset(); // تفريغ الحقول بعد الإرسال
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  }, []);

  return (
    <section className={styles["contact-section"]} id="Contact">
      <div className={styles.container}>
        {/* Header */}
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

        {/* Content Wrapper */}
        <motion.div
          ref={containerRef}
          className={styles["contact-wrapper"]}
          initial="hidden"
          animate={containerInView ? "visible" : "hidden"}
          variants={CONTAINER_VARIANTS}
        >
          {/* Left Side: Contact Info */}
          <motion.div className={styles["info-card"]} variants={ITEM_VARIANTS}>
            <h3 className={styles["info-title"]}>Let's Connect</h3>
            <p className={styles["info-desc"]}>
              Whether you have a question about cybersecurity, a project proposal, or just want to say hi, my inbox is always open!
            </p>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}><FontAwesomeIcon icon={faEnvelope} /></div>
              <div className={styles["info-text"]}>
                <h4>Email</h4>
                <p>ahmed.em.nasr@gmail.com</p>
              </div>
            </div>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}><FontAwesomeIcon icon={faPhone} /></div>
              <div className={styles["info-text"]}>
                <h4>Phone / WhatsApp</h4>
                <p>+20 101 816 6445</p>
              </div>
            </div>

            <div className={styles["info-item"]}>
              <div className={styles["icon-box"]}><FontAwesomeIcon icon={faLocationDot} /></div>
              <div className={styles["info-text"]}>
                <h4>Location</h4>
                <p>Banha, Egypt</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div className={styles["form-card"]} variants={ITEM_VARIANTS}>
            <form onSubmit={handleSubmit}>
              <div className={styles["input-group"]}>
                <input type="text" placeholder="Your Name" required className={styles["input-field"]} />
              </div>
              <div className={styles["input-group"]}>
                <input type="email" placeholder="Your Email" required className={styles["input-field"]} />
              </div>
              <div className={styles["input-group"]}>
                <input type="text" placeholder="Subject" required className={styles["input-field"]} />
              </div>
              <div className={styles["input-group"]}>
                <textarea placeholder="Your Message..." required className={styles["input-field"]}></textarea>
              </div>

              <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending... <FontAwesomeIcon icon={faSpinner} spin /></>
                ) : (
                  <>Send Message <FontAwesomeIcon icon={faPaperPlane} /></>
                )}
              </button>

              {isSuccess && (
                <motion.p 
                  className={styles["success-msg"]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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