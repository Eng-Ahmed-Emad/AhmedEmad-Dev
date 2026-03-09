"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";

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

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const gridSize = 50;
  const mouseInfluenceRadius = 200;
  const mouseInfluenceStrength = 1.0; 
  const maxRadius = 120;
  const minRadius = 60;
  const bubbleExpansionFactor = 1.2;

  // 1. التجهيز المسبق للفقاعة (Pre-rendering) لتقليل الـ Draw Calls
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = maxRadius * 3;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const center = size / 2;
      ctx.filter = "blur(30px)";
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
      gradient.addColorStop(0, "rgba(253, 242, 225, 0.8)");
      gradient.addColorStop(1, "rgba(253, 242, 225, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    preRenderedBubbleRef.current = canvas;
  }, []);

  // 2. التجهيز المسبق للخلفية والشبكة (Static Background)
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = dimensions.width;
    bgCanvas.height = dimensions.height;
    const bgCtx = bgCanvas.getContext("2d", { alpha: false });
    if (bgCtx) {
      bgCtx.fillStyle = "black";
      bgCtx.fillRect(0, 0, dimensions.width, dimensions.height);
      bgCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      bgCtx.lineWidth = 0.4;
      bgCtx.beginPath();
      for (let x = 0; x <= dimensions.width; x += gridSize) { bgCtx.moveTo(x, 0); bgCtx.lineTo(x, dimensions.height); }
      for (let y = 0; y <= dimensions.height; y += gridSize) { bgCtx.moveTo(0, y); bgCtx.lineTo(dimensions.width, y); }
      bgCtx.stroke();
    }
    preRenderedBgRef.current = bgCanvas;
  }, [dimensions.width, dimensions.height]);

  const createBubbles = useCallback(() => {
    if (isMobileRef.current) { bubblesRef.current = []; return; }
    const { width, height } = dimensionsRef.current;
    const numberOfBubbles = Math.floor((width * height) / 80000);
    bubblesRef.current = Array.from({ length: numberOfBubbles }, () => {
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      return {
        x: Math.random() * width, y: Math.random() * height,
        radius, originalRadius: radius,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      };
    });
  }, []);

  const createMeteors = useCallback(() => {
    const { width, height } = dimensionsRef.current;
    const multiplier = isMobileRef.current ? 0.7 : 1;
    const numberOfMeteors = Math.floor((width / 250) * multiplier);
    meteorsRef.current = Array.from({ length: numberOfMeteors }, () => ({
      x: (~~(Math.random() * (width / gridSize))) * gridSize,
      y: (~~(Math.random() * (height / gridSize))) * gridSize,
      size: Math.random() * 2 + 1, speed: Math.random() * 2 + 1,
      direction: Math.random() < 0.5 ? "horizontal" : "vertical",
      trail: [],
    }));
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isMobileRef.current = w <= 768;
      dimensionsRef.current = { width: w, height: h };
      setDimensions({ width: w, height: h });
    };
    const debouncedUpdateDimensions = debounce(updateDimensions, 250);
    window.addEventListener("resize", debouncedUpdateDimensions, { passive: true });
    updateDimensions();
    return () => window.removeEventListener("resize", debouncedUpdateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width) { createBubbles(); createMeteors(); }
  }, [dimensions.width, createBubbles, createMeteors]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX; 
      mouseRef.current.y = e.clientY; 
      mouseRef.current.active = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", () => { mouseRef.current.active = false; }, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, bubble: Bubble) => {
    const offscreen = preRenderedBubbleRef.current;
    if (!offscreen) return;
    const scale = bubble.radius / maxRadius;
    const drawSize = offscreen.width * scale;
    ctx.drawImage(offscreen, ~~(bubble.x - drawSize / 2), ~~(bubble.y - drawSize / 2), ~~drawSize, ~~drawSize);
  }, []);

  const drawMeteor = useCallback((ctx: CanvasRenderingContext2D, meteor: Meteor) => {
    if (meteor.trail.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(~~meteor.trail[0].x, ~~meteor.trail[0].y);
    for (let i = 1; i < meteor.trail.length; i++) { ctx.lineTo(~~meteor.trail[i].x, ~~meteor.trail[i].y); }
    const lastPoint = meteor.trail[meteor.trail.length - 1];
    const gradient = ctx.createLinearGradient(~~meteor.x, ~~meteor.y, ~~lastPoint.x, ~~lastPoint.y);
    gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)");
    gradient.addColorStop(1, "rgba(254, 242, 226, 0)");
    ctx.strokeStyle = gradient; ctx.lineWidth = meteor.size; ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(~~meteor.x, ~~meteor.y, meteor.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(252, 240, 225, 1)"; ctx.fill();
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (document.hidden) { animationFrameIdRef.current = requestAnimationFrame(animate); return; }
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;

    // تحديد الفريمات (30 للموبايل، 60 للشاشات الكبيرة)
    const targetFPS = isMobileRef.current ? 30 : 60;
    const frameMinTime = 1000 / targetFPS;

    if (elapsed < frameMinTime) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = timestamp - (elapsed % frameMinTime);
    const dtMultiplier = Math.min(elapsed / 16.66, 3);

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    if (preRenderedBgRef.current) { ctx.drawImage(preRenderedBgRef.current, 0, 0); } 
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); }

    if (!isMobileRef.current) {
      const mouse = mouseRef.current;
      bubblesRef.current.forEach(bubble => {
        bubble.x += bubble.vx * dtMultiplier;
        bubble.y += bubble.vy * dtMultiplier;
        
        if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) bubble.vx *= -1;
        if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) bubble.vy *= -1;
        
        bubble.phase += bubble.pulseSpeed * dtMultiplier;
        const pulsingRadius = bubble.originalRadius + Math.sin(bubble.phase) * (bubble.originalRadius * 0.2);
        let newRadius = pulsingRadius;

        if (mouse.active) {
          const dx = mouse.x - bubble.x, dy = mouse.y - bubble.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseInfluenceRadius) {
            const influence = 1 - dist / mouseInfluenceRadius;
            newRadius = pulsingRadius * (1 + influence * bubbleExpansionFactor);
            bubble.vx -= (dx / dist) * mouseInfluenceStrength * influence;
            bubble.vy -= (dy / dist) * mouseInfluenceStrength * influence;
          }
        }
        
        const randomJitter = 1.2; 
        bubble.vx += (Math.random() - 0.5) * randomJitter * dtMultiplier;
        bubble.vy += (Math.random() - 0.5) * randomJitter * dtMultiplier;

        const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
        const maxSpeedLimit = 5; 
        if (currentSpeed > maxSpeedLimit) {
          bubble.vx = (bubble.vx / currentSpeed) * maxSpeedLimit;
          bubble.vy = (bubble.vy / currentSpeed) * maxSpeedLimit;
        }

        bubble.radius = Math.max(10, newRadius);
        drawBubble(ctx, bubble);
      });
    }

    meteorsRef.current.forEach(meteor => {
      if (meteor.direction === "horizontal") {
        meteor.x += meteor.speed * dtMultiplier;
        if (meteor.x > canvas.width) { meteor.x = 0; meteor.trail = []; }
      } else {
        meteor.y += meteor.speed * dtMultiplier;
        if (meteor.y > canvas.height) { meteor.y = 0; meteor.trail = []; }
      }
      meteor.trail.unshift({ x: meteor.x, y: meteor.y, alpha: 1 });
      if (meteor.trail.length > 12) meteor.trail.pop();
      drawMeteor(ctx, meteor);
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawBubble, drawMeteor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && dimensions.width) {
      canvas.width = dimensions.width; canvas.height = dimensions.height;
      contextRef.current = canvas.getContext("2d", { 
        alpha: false, 
        desynchronized: true,
        willReadFrequently: false 
      });
      lastTimeRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
    return () => { if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current); };
  }, [dimensions.width, dimensions.height, animate]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) { lastTimeRef.current = performance.now(); }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
};