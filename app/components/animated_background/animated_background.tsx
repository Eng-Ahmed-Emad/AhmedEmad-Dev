"use client";
import React, { useRef, memo } from "react";
import styles from "./animated_background.module.css";
import { useAnimatedBackground } from "@/app/core/hooks/useAnimatedBackground";

/**
 * @Author: Ahmed Emad Nasr
 * @Description: A component that displays an animated background with bubbles and meteors.
 */
const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Custom hook manages the requestAnimationFrame loop internally
  useAnimatedBackground(canvasRef);

  return (
    <canvas 
      ref={canvasRef} 
      className={styles.canvas} 
      aria-hidden="true" 
    />
  );
};

// Wrap the export in React.memo to completely block unnecessary re-renders
export default memo(AnimatedBackground);