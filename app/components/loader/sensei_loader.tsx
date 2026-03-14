"use client";
import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import styles from "./sensei_loader.module.css";
import loadingGif from "@/public/Assets/loading/loading.gif";

/**
 * @Author Ahmed Emad Nasr
 * @Description Fast & Clean Loader Component - GPU Optimized
 */
function SenseiLoader(): JSX.Element | null {
  const [showLoader, setShowLoader]   = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Bug fix: the original implementation used useCallback to wrap handlePageLoader,
  // then called it from useEffect. The returned timeoutId from the callback was
  // *never cleaned up* — if the component unmounted during the fade window the
  // inner setTimeout would still fire on an unmounted component, causing a
  // "Can't perform a React state update on an unmounted component" warning.
  //
  // Fix: track the inner timeout with a ref so it can be cancelled on unmount.
  const innerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Start fade-out after 500 ms
    const outerTimer = setTimeout(() => {
      setIsFadingOut(true);

      // Remove from DOM after the CSS transition completes (500 ms)
      innerTimerRef.current = setTimeout(() => setShowLoader(false), 500);
    }, 500);

    return () => {
      clearTimeout(outerTimer);
      if (innerTimerRef.current !== null) {
        clearTimeout(innerTimerRef.current);
      }
    };
  }, []); // empty dep array – runs once on mount, cleans up on unmount

  // Unmount entirely after fade completes – saves memory & DOM nodes
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