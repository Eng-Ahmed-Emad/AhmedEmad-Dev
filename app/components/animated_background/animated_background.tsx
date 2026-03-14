"use client";
import { useRef, memo } from "react";
import styles from "./animated_background.module.css";
import { useAnimatedBackground } from "@/app/core/hooks/useAnimatedBackground";

/**
 * @Author:      Ahmed Emad Nasr
 * @Description: Renders the full-viewport canvas background (bubbles & meteors).
 *               All animation logic lives in the `useAnimatedBackground` hook,
 *               which manages the requestAnimationFrame loop and cleans up on
 *               unmount.
 *
 * Performance notes:
 *  • Wrapped in `memo` – props never change so re-renders are effectively zero.
 *  • `aria-hidden="true"` keeps the canvas out of the accessibility tree.
 *  • The CSS sets `pointer-events: none` so the canvas never blocks UI events.
 *  • `will-change: transform` and `translateZ(0)` promote the layer to the GPU.
 */
const AnimatedBackground = memo(function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimatedBackground(canvasRef);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
});

export default AnimatedBackground;