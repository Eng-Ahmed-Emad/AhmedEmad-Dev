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
    let timeoutId: ReturnType<typeof setTimeout>;

    if (document.readyState === "complete") {
      timeoutId = handlePageLoader();
    } else {
      const onLoad = () => { timeoutId = handlePageLoader(); };
      window.addEventListener("load", onLoad, { once: true });
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [handlePageLoader]);

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