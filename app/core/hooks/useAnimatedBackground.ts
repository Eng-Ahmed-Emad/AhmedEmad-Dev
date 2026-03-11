"use client";
import { useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import type { RefObject } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bubble {
  x: number; y: number; radius: number; vx: number; vy: number;
  originalRadius: number; phase: number; pulseSpeed: number;
}

interface Meteor {
  x: number; y: number; size: number; speed: number;
  direction: "horizontal" | "vertical";
  trail: { x: number; y: number; alpha: number }[];
}

interface MousePosition { x: number; y: number; active: boolean; }

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_SIZE               = 50;
const MOUSE_INFLUENCE_RADIUS  = 200;
const MOUSE_INFLUENCE_STRENGTH = 1.0;
const MAX_RADIUS              = 120;
const MIN_RADIUS              = 60;
const BUBBLE_EXPANSION_FACTOR = 1.2;
const MAX_SPEED_LIMIT         = 5;
const TARGET_FRAME_TIME       = 1000 / 60;
const TRAIL_MAX_LENGTH        = 12;
const TWO_PI                  = Math.PI * 2; // Avoids recomputing Math.PI * 2 every frame

// ─── Pure render helpers (module-level, never recreated) ──────────────────────

const drawBubble = (
  ctx: CanvasRenderingContext2D,
  bubble: Bubble,
  offscreen: HTMLCanvasElement
): void => {
  const scale    = bubble.radius / MAX_RADIUS;
  const drawSize = offscreen.width * scale;
  ctx.drawImage(
    offscreen,
    ~~(bubble.x - drawSize / 2),
    ~~(bubble.y - drawSize / 2),
    ~~drawSize,
    ~~drawSize
  );
};

const drawMeteor = (ctx: CanvasRenderingContext2D, meteor: Meteor): void => {
  const trailLen = meteor.trail.length;
  if (trailLen < 2) return;

  ctx.beginPath();
  ctx.moveTo(~~meteor.trail[0].x, ~~meteor.trail[0].y);
  for (let i = 1; i < trailLen; i++) {
    ctx.lineTo(~~meteor.trail[i].x, ~~meteor.trail[i].y);
  }

  const last     = meteor.trail[trailLen - 1];
  const gradient = ctx.createLinearGradient(~~meteor.x, ~~meteor.y, ~~last.x, ~~last.y);
  gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)");
  gradient.addColorStop(1, "rgba(254, 242, 226, 0)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth   = meteor.size;
  ctx.lineCap     = "round";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(~~meteor.x, ~~meteor.y, meteor.size / 2, 0, TWO_PI);
  ctx.fillStyle = "rgba(252, 240, 225, 1)";
  ctx.fill();
};

const buildBackground = (w: number, h: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (ctx) {
    ctx.fillStyle   = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth   = 0.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += GRID_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y <= h; y += GRID_SIZE) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  }
  return canvas;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAnimatedBackground = (
  canvasRef: RefObject<HTMLCanvasElement | null>
): void => {
  const contextRef      = useRef<CanvasRenderingContext2D | null>(null);
  const animFrameRef    = useRef<number | null>(null);
  const bubbleOffscreen = useRef<HTMLCanvasElement | null>(null);
  const bgOffscreen     = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef     = useRef<number>(0);
  const bubblesRef      = useRef<Bubble[]>([]);
  const meteorsRef      = useRef<Meteor[]>([]);
  const mouseRef        = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const isMobileRef     = useRef(false);

  // ── Pre-render bubble sprite once on mount ──────────────────────────────────
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size   = MAX_RADIUS * 3;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const center   = size / 2;
      ctx.filter     = "blur(30px)";
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, MAX_RADIUS);
      gradient.addColorStop(0, "rgba(253, 242, 225, 0.8)");
      gradient.addColorStop(1, "rgba(253, 242, 225, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, MAX_RADIUS, 0, TWO_PI);
      ctx.fill();
    }
    bubbleOffscreen.current = canvas;
  }, []);

  // ── Canvas + entity setup (also called on resize) ───────────────────────────
  const setupCanvasEnv = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    isMobileRef.current = w <= 768;

    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      mainCanvas.width  = w;
      mainCanvas.height = h;
      contextRef.current = mainCanvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false,
      });
    }

    bgOffscreen.current = buildBackground(w, h);

    if (isMobileRef.current) {
      bubblesRef.current = [];
      meteorsRef.current = [];
      // Paint static background immediately and halt the loop.
      const ctx = contextRef.current;
      if (ctx && bgOffscreen.current) ctx.drawImage(bgOffscreen.current, 0, 0);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const bubbleCount  = Math.floor((w * h) / 90000);
    const radiusRange  = MAX_RADIUS - MIN_RADIUS;

    bubblesRef.current = Array.from({ length: bubbleCount }, () => {
      const radius = Math.random() * radiusRange + MIN_RADIUS;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        radius,
        originalRadius: radius,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        phase: Math.random() * TWO_PI,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      };
    });

    meteorsRef.current = Array.from({ length: Math.floor(w / 250) }, () => ({
      x:         (~~(Math.random() * (w / GRID_SIZE))) * GRID_SIZE,
      y:         (~~(Math.random() * (h / GRID_SIZE))) * GRID_SIZE,
      size:      Math.random() * 2 + 1,
      speed:     Math.random() * 2 + 1,
      direction: (Math.random() < 0.5 ? "horizontal" : "vertical") as "horizontal" | "vertical",
      trail:     [],
    }));
  }, [canvasRef]);

  // ── Event listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    setupCanvasEnv();

    const debouncedSetup = debounce(setupCanvasEnv, 250);
    window.addEventListener("resize", debouncedSetup, { passive: true });

    const handleMouseMove = (e: MouseEvent): void => {
      if (isMobileRef.current) return;
      mouseRef.current.x      = e.clientX;
      mouseRef.current.y      = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = (): void => { mouseRef.current.active = false; };

    window.addEventListener("mousemove",  handleMouseMove,  { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("resize",      debouncedSetup);
      window.removeEventListener("mousemove",   handleMouseMove);
      window.removeEventListener("mouseleave",  handleMouseLeave);
      debouncedSetup.cancel();
    };
  }, [setupCanvasEnv]);

  // ── Animation loop ───────────────────────────────────────────────────────────
  const animate = useCallback((timestamp: number): void => {
    if (isMobileRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = contextRef.current;
    if (!canvas || !ctx) return;

    // Yield frame while tab is hidden — keeps rAF alive so it resumes instantly.
    if (document.hidden) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;

    // Skip frame if we're ahead of the target frame time.
    if (elapsed < TARGET_FRAME_TIME) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = timestamp - (elapsed % TARGET_FRAME_TIME);
    const dt   = Math.min(elapsed / 16.66, 3);
    const cvsW = canvas.width;
    const cvsH = canvas.height;

    if (bgOffscreen.current) {
      ctx.drawImage(bgOffscreen.current, 0, 0);
    } else {
      ctx.clearRect(0, 0, cvsW, cvsH);
    }

    const mouse        = mouseRef.current;
    const bubbles      = bubblesRef.current;
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
        const dx   = mouse.x - b.x;
        const dy   = mouse.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE_RADIUS) {
          const influence = 1 - dist / MOUSE_INFLUENCE_RADIUS;
          newRadius = pulsingRadius * (1 + influence * BUBBLE_EXPANSION_FACTOR);
          b.vx -= (dx / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
          b.vy -= (dy / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
        }
      }

      b.vx += (Math.random() - 0.5) * 1.2 * dt;
      b.vy += (Math.random() - 0.5) * 1.2 * dt;

      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > MAX_SPEED_LIMIT) {
        const inv = MAX_SPEED_LIMIT / speed; // one division instead of two
        b.vx *= inv;
        b.vy *= inv;
      }

      b.radius = Math.max(10, newRadius);
      if (bubbleSprite) drawBubble(ctx, b, bubbleSprite);
    }

    const meteors = meteorsRef.current;
    for (let i = 0, len = meteors.length; i < len; i++) {
      const m = meteors[i];
      if (m.direction === "horizontal") {
        m.x += m.speed * dt;
        if (m.x > cvsW) { m.x = 0; m.trail = []; }
      } else {
        m.y += m.speed * dt;
        if (m.y > cvsH) { m.y = 0; m.trail = []; }
      }

      if (m.trail.length >= TRAIL_MAX_LENGTH) {
        // Object recycling: reuse the popped trail point instead of allocating a new one.
        const recycled = m.trail.pop()!;
        recycled.x     = m.x;
        recycled.y     = m.y;
        recycled.alpha = 1;
        m.trail.unshift(recycled);
      } else {
        m.trail.unshift({ x: m.x, y: m.y, alpha: 1 });
      }

      drawMeteor(ctx, m);
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  // ── Boot animation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    lastTimeRef.current  = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  // ── Reset time reference on tab re-focus ────────────────────────────────────
  useEffect(() => {
    const handleVisibility = (): void => {
      if (!document.hidden && !isMobileRef.current) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
};