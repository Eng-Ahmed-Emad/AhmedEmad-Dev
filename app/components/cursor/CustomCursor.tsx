"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import styles from "./custom-cursor.module.css";

/**
 * @Author Ahmed Emad Nasr
 * @Description High-performance custom cursor with click ripple & magnetic pull effect.
 * @Features
 * - Dot cursor that tracks mouse position
 * - Hover scale animation on interactive elements
 * - Click ripple/burst animation
 * - Magnetic pull effect on buttons & links
 */

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // ── Magnetic pull: track the "pulled" offset ──────────────────────────────
  const magnetX = useSpring(0, { stiffness: 200, damping: 20 });
  const magnetY = useSpring(0, { stiffness: 200, damping: 20 });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getMagneticTarget = (target: HTMLElement) =>
    target.closest<HTMLElement>('a, button, [role="button"]');

  const applyMagnet = useCallback(
    (e: MouseEvent) => {
      const el = getMagneticTarget(e.target as HTMLElement);
      if (!el) {
        magnetX.set(0);
        magnetY.set(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const distX = e.clientX - elCenterX;
      const distY = e.clientY - elCenterY;

      // Pull strength — tweak 0.35 to taste (0 = no pull, 1 = snaps to center)
      const strength = 0.35;
      magnetX.set(distX * strength * -1);
      magnetY.set(distY * strength * -1);
    },
    [magnetX, magnetY]
  );

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsTouchDevice(false);
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4); // -4 to center the 8px dot
      cursorY.set(e.clientY - 4);
      applyMagnet(e);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
        magnetX.set(0);
        magnetY.set(0);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      // Auto-clean after animation completes (600ms)
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY, applyMagnet, magnetX, magnetY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* ── Main dot ── */}
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

      {/* ── Click ripples ── */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}