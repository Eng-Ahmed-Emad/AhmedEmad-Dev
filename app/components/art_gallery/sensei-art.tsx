"use client";
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Variants, motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "yet-another-react-lightbox/styles.css";
import styles from "./sensei-art.module.css";

/**
 * @Author: Ahmed_emad
 * @Description: A responsive experience component with a menu that highlights the active section of the page.
 */

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface GalleryImage {
  src: string;
  thumb: string;
}

interface ImageItemProps {
  image: GalleryImage;
  index: number;
  setOpen: (index: number) => void;
}

// 1. Extract static array generation OUTSIDE the component.
// This executes exactly once when the file is loaded, avoiding the need for useMemo entirely.
const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 24 }, (_, k) => ({
  src: `Assets/art-gallery/Images/image_display/${k + 1}.png`,
  thumb: `Assets/art-gallery/Images/image_display_thumb/${k + 1}.webp`,
}));

const LIGHTBOX_SLIDES = GALLERY_IMAGES.map((image) => ({ src: image.src }));

const ImageItem = memo(({ image, index, setOpen }: ImageItemProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const prefersReducedMotion = useReducedMotion();

  // 2. Memoize variants using prefersReducedMotion as the dependency
  const variants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 32 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion
          ? {
              duration: 0.35,
            }
          : {
              delay: i * 0.18,
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            },
      }),
    }),
    [prefersReducedMotion]
  );

  // 3. Prevent inline function recreation inside the Image onClick handler
  const handleClick = useCallback(() => {
    setOpen(index);
  }, [setOpen, index]);

  return (
    <motion.div
      ref={ref}
      className={styles.art_pic}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      <Image
        src={image.thumb}
        alt={`Art piece ${index + 1}`}
        width={350}
        height={350}
        sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, (max-width: 1199px) 33vw, 25vw"
        onClick={handleClick}
        loading="lazy"
        decoding="async"
        quality={20}
        className={styles.galleryImg}
      />
    </motion.div>
  );
});

ImageItem.displayName = "ImageItem";

function SenseiArt() {
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const prefersReducedMotion = useReducedMotion();

  // Changed type to standard KeyboardEvent for better TS support
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      setIndex((i) => (i + 1) % LIGHTBOX_SLIDES.length);
    } else if (event.key === "ArrowLeft") {
      setIndex(
        (i) => (i - 1 + LIGHTBOX_SLIDES.length) % LIGHTBOX_SLIDES.length
      );
    }
  }, []);

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  // 4. Memoize the container/header variants
  const headerVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion
          ? {
              duration: 0.35,
            }
          : {
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            },
      },
    }),
    [prefersReducedMotion]
  );

  const galleryVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: prefersReducedMotion
          ? { duration: 0.4 }
          : {
              staggerChildren: 0.18,
              delayChildren: 0.4,
            },
      },
    }),
    [prefersReducedMotion]
  );

  // 5. Memoize the close handler for Lightbox to prevent re-renders
  const handleCloseLightbox = useCallback(() => {
    setIndex(-1);
  }, []);

  return (
    <section className={styles["art-gallery-section"]} id="ArtGallery">
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={styles["header-section"]}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headerVariants}
        >
          <h2 className={styles.title}>
            <span lang="ja">画廊 •</span>
            <span lang="en"> Art Gallery</span>
          </h2>
        </motion.div>
        <motion.div
          className={styles["art-gallery-content"]}
          initial="hidden"
          animate="visible"
          variants={galleryVariants}
        >
          <div className={styles.Gallery}>
            {GALLERY_IMAGES.map((image, i) => (
              <ImageItem
                key={image.src} /* Using stable unique src instead of array index */
                image={image}
                index={i}
                setOpen={setIndex}
              />
            ))}
          </div>
        </motion.div>
      </div>
      <Lightbox
        slides={LIGHTBOX_SLIDES}
        open={open}
        index={index}
        close={handleCloseLightbox}
      />
    </section>
  );
}

// 6. Wrap main export in memo
export default memo(SenseiArt);