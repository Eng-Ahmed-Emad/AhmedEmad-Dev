"use client";
import { useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";

interface Bubble {
  x: number; y: number; radius: number; vx: number; vy: number;
  originalRadius: number; phase: number; pulseSpeed: number;
}

interface Meteor {
  x: number; y: number; size: number; speed: number;
  direction: "horizontal" | "vertical";
  trail: { x: number; y: number }[];
}

interface MousePosition { x: number; y: number; active: boolean; }

const GRID_SIZE = 50;
const MOUSE_INFLUENCE_RADIUS = 200;
const MOUSE_INFLUENCE_RADIUS_SQ = MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS;
const MOUSE_INFLUENCE_STRENGTH = 1.0;
const MAX_RADIUS = 120;
const MIN_RADIUS = 60;
const BUBBLE_EXPANSION_FACTOR = 1.2;
const MAX_SPEED_LIMIT = 5;
const MAX_SPEED_LIMIT_SQ = MAX_SPEED_LIMIT * MAX_SPEED_LIMIT;
const TARGET_FRAME_TIME = 1000 / 60;
const TRAIL_MAX_LENGTH = 12;

const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble, offscreen: HTMLCanvasElement) => {
  const scale = bubble.radius / MAX_RADIUS;
  const drawSize = offscreen.width * scale;
  // Use bitwise OR 0 (equivalent to ~~) for rapid flooring, slightly cleaner standard. 
  ctx.drawImage(
    offscreen, 
    (bubble.x - drawSize / 2) | 0, 
    (bubble.y - drawSize / 2) | 0, 
    drawSize | 0, 
    drawSize | 0
  );
};

const drawMeteor = (ctx: CanvasRenderingContext2D, meteor: Meteor) => {
  const trail = meteor.trail;
  const trailLen = trail.length;
  if (trailLen < 2) return;

  ctx.beginPath();
  ctx.moveTo(trail[0].x | 0, trail[0].y | 0);
  for (let i = 1; i < trailLen; i++) {
    ctx.lineTo(trail[i].x | 0, trail[i].y | 0);
  }

  const last = trail[trailLen - 1];
  const gradient = ctx.createLinearGradient(meteor.x | 0, meteor.y | 0, last.x | 0, last.y | 0);
  gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)");
  gradient.addColorStop(1, "rgba(254, 242, 226, 0)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = meteor.size;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(meteor.x | 0, meteor.y | 0, meteor.size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(252, 240, 225, 1)";
  ctx.fill();
};

const buildBackground = (existingCanvas: HTMLCanvasElement | null, w: number, h: number): HTMLCanvasElement => {
  const canvas = existingCanvas || document.createElement("canvas");
  
  // Only resize if dimensions changed to prevent unnecessary re-allocations of the backing store
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  if (ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += GRID_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y <= h; y += GRID_SIZE) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  }
  return canvas;
};

export const useAnimatedBackground = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const contextRef       = useRef<CanvasRenderingContext2D | null>(null);
  const animFrameRef     = useRef<number | null>(null);
  const bubbleOffscreen  = useRef<HTMLCanvasElement | null>(null);
  const bgOffscreen      = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef      = useRef<number>(0);
  const bubblesRef       = useRef<Bubble[]>([]);
  const meteorsRef       = useRef<Meteor[]>([]);
  const mouseRef         = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const isMobileRef      = useRef(false);
  const dimensionsRef    = useRef({ width: 0, height: 0 });

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
    bubbleOffscreen.current = canvas;
  }, []);

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
        willReadFrequently: false,
      });
    }

    // Reuse existing offscreen canvas to prevent memory leaks on resize
    bgOffscreen.current = buildBackground(bgOffscreen.current, w, h);

    if (isMobileRef.current) {
      bubblesRef.current = [];
      meteorsRef.current = [];

      const ctx = contextRef.current;
      if (ctx && bgOffscreen.current) {
        ctx.drawImage(bgOffscreen.current, 0, 0);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const bubbleCount = Math.floor((w * h) / 90000);
    bubblesRef.current = Array.from({ length: bubbleCount }, () => {
      const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
      return {
        x: Math.random() * w, y: Math.random() * h,
        radius, originalRadius: radius,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      };
    });

    meteorsRef.current = Array.from({ length: Math.floor(w / 250) }, () => ({
      x: ((Math.random() * (w / GRID_SIZE)) | 0) * GRID_SIZE,
      y: ((Math.random() * (h / GRID_SIZE)) | 0) * GRID_SIZE,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      direction: (Math.random() < 0.5 ? "horizontal" : "vertical") as "horizontal" | "vertical",
      trail: [],
    }));
  }, [canvasRef]);

  useEffect(() => {
    setupCanvasEnv();

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
      debouncedSetup.cancel();
    };
  }, [setupCanvasEnv]);

  const animate = useCallback((timestamp: number) => {
    if (isMobileRef.current) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;

    // Combined early return to reduce nesting
    if (document.hidden || elapsed < TARGET_FRAME_TIME) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = timestamp - (elapsed % TARGET_FRAME_TIME);
    const dt = Math.min(elapsed / 16.66, 3);
    const cvsW = canvas.width;
    const cvsH = canvas.height;

    if (bgOffscreen.current) {
      ctx.drawImage(bgOffscreen.current, 0, 0);
    } else {
      ctx.clearRect(0, 0, cvsW, cvsH);
    }

    const mouse = mouseRef.current;
    const bubbles = bubblesRef.current;
    const bubbleSprite = bubbleOffscreen.current;

    for (let i = 0, len = bubbles.length; i < len; i++) {
      const b = bubbles[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x + b.radius > cvsW || b.x - b.radius < 0) b.vx *= -1;
      if (b.y + b.radius > cvsH || b.y - b.radius < 0) b.vy *= -1;

      b.phase += b.pulseSpeed * dt;
      const pulsingRadius = b.originalRadius + Math.sin(b.phase) * (b.originalRadius * 0.2);
      let newRadius = pulsingRadius;

      if (mouse.active) {
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        
        // Use squared distance to avoid Math.sqrt() on every single bubble every frame
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_INFLUENCE_RADIUS_SQ) {
          const dist = Math.sqrt(distSq); // Only calc root if inside radius
          const influence = 1 - dist / MOUSE_INFLUENCE_RADIUS;
          newRadius = pulsingRadius * (1 + influence * BUBBLE_EXPANSION_FACTOR);
          b.vx -= (dx / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
          b.vy -= (dy / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
        }
      }

      b.vx += (Math.random() - 0.5) * 1.2 * dt;
      b.vy += (Math.random() - 0.5) * 1.2 * dt;

      // Use squared speed to avoid Math.sqrt() on speed limits
      const speedSq = b.vx * b.vx + b.vy * b.vy;
      if (speedSq > MAX_SPEED_LIMIT_SQ) {
        const speed = Math.sqrt(speedSq);
        b.vx = (b.vx / speed) * MAX_SPEED_LIMIT;
        b.vy = (b.vy / speed) * MAX_SPEED_LIMIT;
      }

      b.radius = Math.max(10, newRadius);
      if (bubbleSprite) drawBubble(ctx, b, bubbleSprite);
    }

    const meteors = meteorsRef.current;
    for (let i = 0, len = meteors.length; i < len; i++) {
      const m = meteors[i];
      let wrapped = false;
      
      if (m.direction === "horizontal") {
        m.x += m.speed * dt;
        if (m.x > cvsW) { 
          m.x = 0; 
          m.trail.length = 0; // Empty without destroying the array reference
          wrapped = true; 
        }
      } else {
        m.y += m.speed * dt;
        if (m.y > cvsH) { 
          m.y = 0; 
          m.trail.length = 0; 
          wrapped = true; 
        }
      }

      if (!wrapped) {
        if (m.trail.length >= TRAIL_MAX_LENGTH) {
          const recycled = m.trail.pop()!;
          recycled.x = m.x;
          recycled.y = m.y;
          m.trail.unshift(recycled);
        } else {
          m.trail.unshift({ x: m.x, y: m.y });
        }
      }

      drawMeteor(ctx, m);
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && !isMobileRef.current) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
};