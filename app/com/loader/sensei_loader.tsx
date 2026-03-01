
/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

"use client";
import { useState, useEffect, ReactElement } from "react";
import styles from "./sensei_loader.module.css";
import Image, { ImageProps } from "next/image";

/**
 * A React component that renders a loading spinner until the page is fully loaded.
 *
 * @returns {ReactElement | null} A React element representing the loader, or null if loading is complete.
 */
function SenseiLoader(): ReactElement | null {
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

  const loaderImageProps: ImageProps = {
    src: "Assets/loading/loading.gif",
    alt: "Loading",
    width: 200,
    height: 200,
    priority: true,
    decoding: "async",
  };

  return (
    <>
      <div
        className={styles.loader}
        id="page-loader"
      >
        <Image {...loaderImageProps} />
      </div>
    </>
  );
}

export default SenseiLoader;
