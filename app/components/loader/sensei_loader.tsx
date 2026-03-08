"use client";
import { useState, useEffect, JSX } from "react";
import styles from "./sensei_loader.module.css";
import Image from "next/image";

/**
 * A React component that renders a loading spinner until the page is fully loaded.
 *
 * @returns {JSX.Element | null} A JSX element representing the loader, or null if loading is complete.
 */
function SenseiLoader(): JSX.Element | null {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageLoader = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      handlePageLoader();
    } else {
      window.addEventListener("load", handlePageLoader);
    }

    return () => {
      window.removeEventListener("load", handlePageLoader);
    };
  }, []);

  if (!isLoading) return null;

  const loaderImageProps = {
    src: "Assets/loading/loading.gif",
    alt: "Loading",
    width: 200,
    height: 200,
    priority: true,
  } as const;

  return (
    <>
      <div className={styles.loader} id="page-loader">
        <Image {...loaderImageProps} alt="A loading spinner" />
      </div>
    </>
  );
}

export default SenseiLoader;
