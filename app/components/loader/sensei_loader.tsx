"use client";
import { useState, useEffect, useCallback, JSX } from "react";
import styles from "./sensei_loader.module.css";
import loadingGif from "@/public/Assets/loading/loading.gif";

/**
 * @Author Ahmed Emad Nasr
 * @Description Fast & Clean Loader Component - GPU Optimized
 */
function SenseiLoader(): JSX.Element | null {
  const [showLoader, setShowLoader] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handlePageLoader = useCallback(() => {
    setIsFadingOut(true);
    // بعد انتهاء التلاشي (500ms)، نقوم بحذف العنصر تماماً لتوفير الذاكرة
    const timeoutId = setTimeout(() => setShowLoader(false), 500);
    return timeoutId;
  }, []);

  useEffect(() => {
    // تم تقليل الوقت إلى 500ms ليكون أسرع وأخف، يمكنك تغييره حسب الحاجة
    const timeoutId = setTimeout(() => {
      handlePageLoader();
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [handlePageLoader]);

  // هذه الإضافة تضمن مسح الـ Loader من الـ DOM بالكامل بعد اختفائه
  if (!showLoader) return null;

  return (
    <div
      className={`${styles.loader}${isFadingOut ? ` ${styles.fadeOut}` : ""}`}
      id="page-loader"
      aria-hidden="true"
    >
      <div className={styles.loaderContent}>
        <img
          src={loadingGif.src}
          alt="Loading..."
          width={250}
          height={250}
          loading="eager"
          decoding="async"
          className={styles.spinner}
        />
      </div>
    </div>
  );
}

export default SenseiLoader;