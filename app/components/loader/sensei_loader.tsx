"use client";
import { useState, useEffect, JSX } from "react";
import styles from "./sensei_loader.module.css";
import loadingGif from "@/public/Assets/loading/loading.gif";

/**
 * A React component that renders a loading spinner.
 * Highly Optimized Version.
 * Designed by Ahmed Emad Nasr.
 */
function SenseiLoader(): JSX.Element | null {
  const [showLoader, setShowLoader] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handlePageLoader = () => {
      setIsFadingOut(true);
      
      // حفظ الـ ID بتاع الـ timeout عشان لو احتجنا نلغيه
      timeoutId = setTimeout(() => {
        setShowLoader(false);
      }, 500); 
    };

    if (document.readyState === "complete") {
      handlePageLoader();
    } else {
      window.addEventListener("load", handlePageLoader);
    }

    return () => {
      window.removeEventListener("load", handlePageLoader);
      // تنظيف الـ Timeout لمنع تسريب الذاكرة (Memory Leak)
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div 
      className={`${styles.loader} ${isFadingOut ? styles.fadeOut : ''}`} 
      id="page-loader"
    >
      <div className={styles.loaderContent}>
        <div className={styles.spinnerWrapper}>
          {/* استخدام img العادي لصورة 2KB أسرع وأخف من Next/Image 
            مع eager لضمان التحميل الفوري
          */}
          <img
            src={loadingGif.src}
            alt="Loading..."
            width={150}
            height={150}
            loading="eager"
            className={styles.spinner}
          />
        </div>
      </div>
    </div>
  );
}

export default SenseiLoader;