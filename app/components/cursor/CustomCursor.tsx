"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import styles from "./custom-cursor.module.css";

/**
 * @Description Lightweight custom cursor.
 * @Features
 * - Dot cursor that tracks mouse position smoothly
 * - Hover scale animation on interactive elements
 */

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // التأكد من أن الجهاز يدعم الماوس (ليس شاشة لمس)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsTouchDevice(false);
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4); // -4 to center the 8px dot
      cursorY.set(e.clientY - 4);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // تفعيل الأنيميشن عند المرور على العناصر القابلة للتفاعل
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className={styles.cursorDot}
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering
          ? "rgba(var(--main-color-rgb), 0.5)"
          : "var(--main-color)",
        boxShadow: isHovering
          ? "0 0 20px rgba(var(--main-color-rgb), 0.8)"
          : "0 0 10px var(--main-color)",
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    />
  );
}