"use client";
import { useEffect, useRef, useCallback } from "react";
// Optimized import: only grab the debounce function to reduce bundle size
import debounce from "lodash/debounce";

interface Bubble {
  x: number; y: number; radius: number; vx: number; vy: number; originalRadius: number;
  phase: number; pulseSpeed: number;
}

interface Meteor {
  x: number; y: number; size: number; speed: number;
  direction: "horizontal" | "vertical";
  trail: { x: number; y: number; alpha: number }[];
}

interface MousePosition { x: number; y: number; active: boolean; }

// Extracted constants to prevent recreation inside the hook
const GRID_SIZE = 50;
const MOUSE_INFLUENCE_RADIUS = 200;
const MOUSE_INFLUENCE_STRENGTH = 1.0;
const MAX_RADIUS = 120;
const MIN_RADIUS = 60;
const BUBBLE_EXPANSION_FACTOR = 1.2;
const MAX_SPEED_LIMIT = 5;

// Pure rendering functions extracted OUTSIDE the hook. 
// This removes closure overhead and memory allocation during the React lifecycle.
const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble, offscreen: HTMLCanvasElement) => {
  const scale = bubble.radius / MAX_RADIUS;
  const drawSize = offscreen.width * scale;
  // Bitwise ~~ used for fast Math.floor equivalent
  ctx.drawImage(offscreen, ~~(bubble.x - drawSize / 2), ~~(bubble.y - drawSize / 2), ~~drawSize, ~~drawSize);
};

const drawMeteor = (ctx: CanvasRenderingContext2D, meteor: Meteor) => {
  const trailLen = meteor.trail.length;
  if (trailLen < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(~~meteor.trail[0].x, ~~meteor.trail[0].y);
  for (let i = 1; i < trailLen; i++) { 
    ctx.lineTo(~~meteor.trail[i].x, ~~meteor.trail[i].y); 
  }
  
  const lastPoint = meteor.trail[trailLen - 1];
  const gradient = ctx.createLinearGradient(~~meteor.x, ~~meteor.y, ~~lastPoint.x, ~~lastPoint.y);
  gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)");
  gradient.addColorStop(1, "rgba(254, 242, 226, 0)");
  
  ctx.strokeStyle = gradient; 
  ctx.lineWidth = meteor.size; 
  ctx.lineCap = "round";
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(~~meteor.x, ~~meteor.y, meteor.size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(252, 240, 225, 1)"; 
  ctx.fill();
};

export const useAnimatedBackground = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const preRenderedBubbleRef = useRef<HTMLCanvasElement | null>(null);
  const preRenderedBgRef = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef = useRef<number>(0);

  const bubblesRef = useRef<Bubble[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, active: false });
  
  const isMobileRef = useRef(false);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // 1. Pre-render Bubble (Runs once on mount)
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = MAX_RADIUS * 3;
    canvas.width = size; 
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const center = size / 2;
      ctx.filter = "blur(30px)";
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, MAX_RADIUS);
      gradient.addColorStop(0, "rgba(253, 242, 225, 0.8)");
      gradient.addColorStop(1, "rgba(253, 242, 225, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, MAX_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    preRenderedBubbleRef.current = canvas;
  }, []);

  // Consolidated Setup Function: Replaces useState for dimensions to stop React re-renders.
  // It handles resizing directly via the DOM and resets entities safely.
  const setupCanvasEnv = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    isMobileRef.current = w <= 768;
    dimensionsRef.current = { width: w, height: h };

    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      mainCanvas.width = w;
      mainCanvas.height = h;
      contextRef.current = mainCanvas.getContext("2d", { 
        alpha: false, 
        desynchronized: true,
        willReadFrequently: false 
      });
    }

    // Pre-render Background Grid
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = w;
    bgCanvas.height = h;
    const bgCtx = bgCanvas.getContext("2d", { alpha: false });
    if (bgCtx) {
      bgCtx.fillStyle = "black";
      bgCtx.fillRect(0, 0, w, h);
      bgCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      bgCtx.lineWidth = 0.4;
      bgCtx.beginPath();
      for (let x = 0; x <= w; x += GRID_SIZE) { bgCtx.moveTo(x, 0); bgCtx.lineTo(x, h); }
      for (let y = 0; y <= h; y += GRID_SIZE) { bgCtx.moveTo(0, y); bgCtx.lineTo(w, y); }
      bgCtx.stroke();
    }
    preRenderedBgRef.current = bgCanvas;

    // Entity Generation
    if (isMobileRef.current) {
      bubblesRef.current = [];
      meteorsRef.current = [];
    } else {
      const numberOfBubbles = Math.floor((w * h) / 90000);
      bubblesRef.current = Array.from({ length: numberOfBubbles }, () => {
        const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
        return {
          x: Math.random() * w, y: Math.random() * h,
          radius, originalRadius: radius,
          vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.04,
        };
      });

      const numberOfMeteors = Math.floor((w / 250));
      meteorsRef.current = Array.from({ length: numberOfMeteors }, () => ({
        x: (~~(Math.random() * (w / GRID_SIZE))) * GRID_SIZE,
        y: (~~(Math.random() * (h / GRID_SIZE))) * GRID_SIZE,
        size: Math.random() * 2 + 1, speed: Math.random() * 2 + 1,
        direction: Math.random() < 0.5 ? "horizontal" : "vertical",
        trail: [],
      }));
    }
  }, [canvasRef]);

  // Event Listeners (Resize & Mouse)
  useEffect(() => {
    setupCanvasEnv(); // Initial run

    const debouncedSetup = debounce(setupCanvasEnv, 250);
    window.addEventListener("resize", debouncedSetup, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      mouseRef.current.x = e.clientX; 
      mouseRef.current.y = e.clientY; 
      mouseRef.current.active = true;
    };
    
    const handleMouseLeave = () => { mouseRef.current.active = false; };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedSetup);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      debouncedSetup.cancel(); // Cancel any pending debounces on unmount
    };
  }, [setupCanvasEnv]);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const bgOffscreen = preRenderedBgRef.current;
    const bubbleOffscreen = preRenderedBubbleRef.current;

    if (!canvas || !ctx) return;

    if (isMobileRef.current) {
      if (bgOffscreen) {
        ctx.drawImage(bgOffscreen, 0, 0);
        return; 
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    if (document.hidden) { 
      animationFrameIdRef.current = requestAnimationFrame(animate); 
      return; 
    }

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;
    const targetFPS = 60;
    const frameMinTime = 1000 / targetFPS;

    if (elapsed < frameMinTime) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = timestamp - (elapsed % frameMinTime);
    const dtMultiplier = Math.min(elapsed / 16.66, 3);
    const cvsWidth = canvas.width;
    const cvsHeight = canvas.height;

    if (bgOffscreen) { 
      ctx.drawImage(bgOffscreen, 0, 0); 
    } else { 
      ctx.clearRect(0, 0, cvsWidth, cvsHeight); 
    }

    const mouse = mouseRef.current;
    const bubbles = bubblesRef.current;
    const bubblesCount = bubbles.length;

    // PERFORMANCE: Replaced .forEach with a traditional 'for' loop for raw speed.
    for (let i = 0; i < bubblesCount; i++) {
      const bubble = bubbles[i];
      bubble.x += bubble.vx * dtMultiplier;
      bubble.y += bubble.vy * dtMultiplier;
      
      if (bubble.x + bubble.radius > cvsWidth || bubble.x - bubble.radius < 0) bubble.vx *= -1;
      if (bubble.y + bubble.radius > cvsHeight || bubble.y - bubble.radius < 0) bubble.vy *= -1;
      
      bubble.phase += bubble.pulseSpeed * dtMultiplier;
      const pulsingRadius = bubble.originalRadius + Math.sin(bubble.phase) * (bubble.originalRadius * 0.2);
      let newRadius = pulsingRadius;

      if (mouse.active) {
        const dx = mouse.x - bubble.x;
        const dy = mouse.y - bubble.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE_RADIUS) {
          const influence = 1 - dist / MOUSE_INFLUENCE_RADIUS;
          newRadius = pulsingRadius * (1 + influence * BUBBLE_EXPANSION_FACTOR);
          bubble.vx -= (dx / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
          bubble.vy -= (dy / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
        }
      }
      
      bubble.vx += (Math.random() - 0.5) * 1.2 * dtMultiplier;
      bubble.vy += (Math.random() - 0.5) * 1.2 * dtMultiplier;

      const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
      if (currentSpeed > MAX_SPEED_LIMIT) {
        bubble.vx = (bubble.vx / currentSpeed) * MAX_SPEED_LIMIT;
        bubble.vy = (bubble.vy / currentSpeed) * MAX_SPEED_LIMIT;
      }

      bubble.radius = Math.max(10, newRadius);
      if (bubbleOffscreen) drawBubble(ctx, bubble, bubbleOffscreen);
    }

    const meteors = meteorsRef.current;
    const meteorsCount = meteors.length;

    for (let i = 0; i < meteorsCount; i++) {
      const meteor = meteors[i];
      if (meteor.direction === "horizontal") {
        meteor.x += meteor.speed * dtMultiplier;
        if (meteor.x > cvsWidth) { meteor.x = 0; meteor.trail = []; }
      } else {
        meteor.y += meteor.speed * dtMultiplier;
        if (meteor.y > cvsHeight) { meteor.y = 0; meteor.trail = []; }
      }
      
      // GC OPTIMIZATION: Object Recycling
      // Instead of creating a new object every frame, we reuse the popped object from the trail 
      // if it exceeds the maximum length. This stops the garbage collector from lagging the browser.
      if (meteor.trail.length >= 12) {
        const recycledPoint = meteor.trail.pop()!;
        recycledPoint.x = meteor.x;
        recycledPoint.y = meteor.y;
        meteor.trail.unshift(recycledPoint);
      } else {
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, alpha: 1 });
      }
      
      drawMeteor(ctx, meteor);
    }

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  // Boot the animation loop
  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(animate);
    return () => { 
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current); 
    };
  }, [animate]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && !isMobileRef.current) { lastTimeRef.current = performance.now(); }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
};