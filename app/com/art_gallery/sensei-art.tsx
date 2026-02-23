/*
*@Author: Ahmed_emad
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Variants } from "framer-motion";
import dynamic from "next/dynamic";
import styles from "./sensei-art.module.css";

interface GalleryImage {
    src: string;
    thumb: string;
}

interface ImageItemProps {
    image: GalleryImage;
    index: number;
    setOpen: (index: number) => void;
}

const ImageItem = ({ image, index, setOpen }: ImageItemProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variants: Variants = {
        hidden: { opacity: 0, y: 26 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 110,
                damping: 22,
                mass: 1,
                duration: 0.6,
                delay: i * 0.1,
            },
        }),
    };

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
                width={1200}
                height={1200}
                onClick={() => setOpen(index)}
                layout="responsive"
                objectFit="cover"
                placeholder="blur"
                blurDataURL={image.thumb}
            />
        </motion.div>
    );
};

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
    ssr: false,
});

function SenseiArt() {
    const [index, setIndex] = useState(-1);
    const open = index >= 0;

    const images = useMemo(() => [
        ...Array.from({ length: 39 }, (_, k) => ({
            src: `Assets/art-gallery/Images/image_display/${k + 1}.png`,
            thumb: `Assets/art-gallery/Images/image_display_thumb/${k + 1}.webp`,
        })),
    ], []);

    const slides = useMemo(() => images.map(image => ({ src: image.src })), [images]);

    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleKeyDown = useCallback((event: { key: string; }) => {
        if (event.key === 'ArrowRight') {
            setIndex((i) => (i + 1) % slides.length);
        } else if (event.key === 'ArrowLeft') {
            setIndex((i) => (i - 1 + slides.length) % slides.length);
        }
    }, [slides.length]);

    useEffect(() => {
        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, handleKeyDown]);

    const headerVariants: Variants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 110,
                damping: 22,
                duration: 0.6,
            },
        },
    };

    const galleryVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.25,
            },
        },
    };

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
                        {images.map((image, i) => (
                            <ImageItem
                                key={i}
                                image={image}
                                index={i}
                                setOpen={setIndex}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
            {open && (
                <Lightbox
                    slides={slides}
                    open={open}
                    index={index}
                    close={() => setIndex(-1)}
                />
            )}
        </section>
    );
}

export default SenseiArt;
