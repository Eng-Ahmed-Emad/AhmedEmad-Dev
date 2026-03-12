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
    const timeoutId = setTimeout(() => setShowLoader(false), 500);
    return timeoutId;
  }, []);

useEffect(() => {
    // إجبار الـ Loader إنه يفضل ظاهر لفترة بسيطة حتى لو الصفحة جاهزة
    // عشان نضمن إن الـ Animations والـ Mounting خلصوا
    const timeoutId = setTimeout(() => {
      handlePageLoader();
    }, 1200); // 1.5 ثانية وقت كافي يظهر فيه الـ Loader بشكل شيك

    return () => clearTimeout(timeoutId);
  }, [handlePageLoader]);

  return (
    <div
      className={`${styles.loader}${isFadingOut ? ` ${styles.fadeOut}` : ""}`}
      id="page-loader"
      aria-hidden="true"
    >
      <div className={styles.loaderContent}>
        <img
          src={loadingGif.src}
          alt=""
          width={150}
          height={150}
          loading="eager"
          decoding="async"
          className={styles.spinner}
        />
      </div>
    </div>
  );
}

export default SenseiLoader;