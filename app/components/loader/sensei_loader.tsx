"use client";
import { useState, useEffect, JSX } from "react";
import styles from "./sensei_loader.module.css";
import Image from "next/image";

/**
 * A React component that renders a loading spinner and a progress bar.
 * Designed by Ahmed Emad Nasr.
 */
function SenseiLoader(): JSX.Element | null {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // محاكاة حركة التحميل بشكل تدريجي
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval); // يتوقف عند 90% وينتظر تحميل الصفحة الفعلي
          return 90;
        }
        return prev + 2; 
      });
    }, 50);

    const handlePageLoader = () => {
      setProgress(100); // عند اكتمال تحميل الصفحة، نصل لـ 100%
      setTimeout(() => {
        setShowLoader(false);
      }, 600); // تأخير بسيط لإعطاء فرصة للعين لرؤية الـ 100%
    };

    if (document.readyState === "complete") {
      handlePageLoader();
    } else {
      window.addEventListener("load", handlePageLoader);
    }

    return () => {
      window.removeEventListener("load", handlePageLoader);
      clearInterval(interval);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div className={styles.loader} id="page-loader">
      <div className={styles.loaderContent}>
        {/* Spinner Image */}
     <Image
  src="/Assets/loading/loading.gif" // ✅ صح
  alt="A loading spinner"
  width={150}
  height={150}
  priority
  className={styles.spinner}
/>

        {/* Progress Section */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default SenseiLoader;