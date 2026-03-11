"use client";
import { useRef, memo } from "react";
import styles from "./animated_background.module.css";
import { useAnimatedBackground } from "@/app/core/hooks/useAnimatedBackground";

/**
 * @Author: Ahmed Emad Nasr
 * @Description: A component that displays an animated background with bubbles and meteors.
 */
const AnimatedBackground = memo(function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hook manages the requestAnimationFrame loop internally.
  useAnimatedBackground(canvasRef);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
});

export default AnimatedBackground;