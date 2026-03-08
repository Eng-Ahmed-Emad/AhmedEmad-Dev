"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";

const FPS_LIMIT = 60; 
const FRAME_MIN_TIME = 1000 / FPS_LIMIT;

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  originalRadius: number;
  phase: number;       // للتحكم في دورة تكبير وتصغير الفقاعة
  pulseSpeed: number;  // سرعة النبض (التكبير والتصغير)
}

interface Meteor {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: "horizontal" | "vertical";
  trail: { x: number; y: number; alpha: number }[];
}

interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}

export const useAnimatedBackground = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const preRenderedBubbleRef = useRef<HTMLCanvasElement | null>(null);
  const preRenderedBgRef = useRef<HTMLCanvasElement | null>(null);
  
  const lastTimeRef = useRef<number>(0);

  const bubblesRef = useRef<Bubble[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, active: false });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const gridSize = 50;
  const mouseInfluenceRadius = 200;
  const mouseInfluenceStrength = 0.8;
  const maxRadius = 120;
  const minRadius = 60;
  const bubbleExpansionFactor = 1.2;

  // 1. التجهيز المسبق للفقاعة
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = maxRadius * 3; 
    canvas.width = size;
    canvas.height = size;
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
      ctx.filter = "none";
    }
    preRenderedBubbleRef.current = canvas;
  }, []);

  // 2. التجهيز المسبق للخلفية والشبكة
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = dimensions.width;
    bgCanvas.height = dimensions.height;
    const bgCtx = bgCanvas.getContext("2d", { alpha: false });
    
    if (bgCtx) {
      const backgroundGradient = bgCtx.createLinearGradient(0, 0, 0, dimensions.height);
      backgroundGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
      bgCtx.fillStyle = backgroundGradient;
      bgCtx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      bgCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      bgCtx.lineWidth = 0.4;
      bgCtx.beginPath();
      for (let x = 0; x <= dimensions.width; x += gridSize) {
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, dimensions.height);
      }
      for (let y = 0; y <= dimensions.height; y += gridSize) {
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(dimensions.width, y);
      }
      bgCtx.stroke();
    }
    preRenderedBgRef.current = bgCanvas;
  }, [dimensions, gridSize]);

  const createBubbles = useCallback(() => {
    if (isMobile) return;

    const numberOfBubbles = Math.floor((dimensions.width * dimensions.height) / 80000);
    bubblesRef.current = Array.from({ length: numberOfBubbles }, () => {
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      return {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius,
        originalRadius: radius,
        // سرعة ابتدائية عالية
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        // متغيرات تأثير النبض والحجم
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
      };
    });
  }, [dimensions, isMobile]);

  const createMeteors = useCallback(() => {
    const multiplier = isMobile ? 0.7 : 0.9; 
    const numberOfMeteors = Math.floor((dimensions.width / 250) * multiplier);
    meteorsRef.current = Array.from({ length: numberOfMeteors }, () => ({
      x: Math.floor(Math.random() * (dimensions.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (dimensions.height / gridSize)) * gridSize,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      direction: Math.random() < 0.5 ? "horizontal" : "vertical",
      trail: [],
    }));
  }, [dimensions, isMobile]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth <= 768);
    };

    const debouncedUpdateDimensions = debounce(updateDimensions, 250);
    window.addEventListener("resize", debouncedUpdateDimensions, { passive: true });
    updateDimensions();
    
    return () => {
      window.removeEventListener("resize", debouncedUpdateDimensions);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      createBubbles();
      createMeteors();
    }
  }, [dimensions, createBubbles, createMeteors]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, bubble: Bubble) => {
    const offscreenCanvas = preRenderedBubbleRef.current;
    if (!offscreenCanvas) return;

    const scale = bubble.radius / maxRadius;
    const drawSize = offscreenCanvas.width * scale;

    ctx.drawImage(
      offscreenCanvas,
      Math.floor(bubble.x - drawSize / 2),
      Math.floor(bubble.y - drawSize / 2),
      Math.floor(drawSize),
      Math.floor(drawSize)
    );
  }, []);

  const drawMeteor = useCallback((ctx: CanvasRenderingContext2D, meteor: Meteor) => {
    if (meteor.trail.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(Math.floor(meteor.trail[0].x), Math.floor(meteor.trail[0].y));

    for (let i = 1; i < meteor.trail.length; i++) {
      ctx.lineTo(Math.floor(meteor.trail[i].x), Math.floor(meteor.trail[i].y));
    }

    const lastPoint = meteor.trail[meteor.trail.length - 1];
    const gradient = ctx.createLinearGradient(
      Math.floor(meteor.x), Math.floor(meteor.y),
      Math.floor(lastPoint.x), Math.floor(lastPoint.y)
    );
    
    gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)");
    gradient.addColorStop(1, "rgba(254, 242, 226, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = meteor.size;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(Math.floor(meteor.x), Math.floor(meteor.y), meteor.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(252, 240, 225, 1)";
    ctx.fill();
  }, []);

  const updateBubbles = useCallback((canvas: HTMLCanvasElement, dtMultiplier: number) => {
    const mouse = mouseRef.current;
    const bubbles = bubblesRef.current;

    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i];
      
      let newX = bubble.x + (bubble.vx * dtMultiplier);
      let newY = bubble.y + (bubble.vy * dtMultiplier);

      // ارتداد مرن عند الاصطدام بالحواف
      if (newX + bubble.radius > canvas.width || newX - bubble.radius < 0) {
        bubble.vx *= -1;
        newX = Math.max(bubble.radius, Math.min(newX, canvas.width - bubble.radius));
      }
      if (newY + bubble.radius > canvas.height || newY - bubble.radius < 0) {
        bubble.vy *= -1;
        newY = Math.max(bubble.radius, Math.min(newY, canvas.height - bubble.radius));
      }

      // =====================================
      // حساب الحجم الجديد (تأثير النبض)
      // =====================================
      bubble.phase += bubble.pulseSpeed * dtMultiplier;
      // تتغير مساحة الفقاعة بنسبة تصل إلى 20% زيادة أو نقصاناً
      const pulsingRadius = bubble.originalRadius + Math.sin(bubble.phase) * (bubble.originalRadius * 0.2);
      let newRadius = pulsingRadius;

      if (mouse.active) {
        const dx = mouse.x - newX;
        const dy = mouse.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceRadius) {
          const influence = 1 - distance / mouseInfluenceRadius;
          // إضافة تأثير الماوس فوق تأثير النبض
          newRadius = pulsingRadius * (1 + influence * bubbleExpansionFactor);

          const forceFactor = mouseInfluenceStrength * influence;
          bubble.vx -= (dx / distance) * forceFactor;
          bubble.vy -= (dy / distance) * forceFactor;
        }
      }
      
      // =====================================
      // إضافة الحركة العشوائية السريعة المستمرة
      // =====================================
      const randomJitter = 1.2; 
      bubble.vx += (Math.random() - 0.5) * randomJitter * dtMultiplier;
      bubble.vy += (Math.random() - 0.5) * randomJitter * dtMultiplier;

      const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
      const maxSpeedLimit = 5; // الحد الأقصى للسرعة
      
      if (currentSpeed > maxSpeedLimit) {
        bubble.vx = (bubble.vx / currentSpeed) * maxSpeedLimit;
        bubble.vy = (bubble.vy / currentSpeed) * maxSpeedLimit;
      }

      bubble.x = newX;
      bubble.y = newY;
      bubble.radius = Math.max(10, newRadius); // ضمان عدم اختفاء الفقاعة أو صغرها جداً
    }
  }, [mouseInfluenceRadius, mouseInfluenceStrength, bubbleExpansionFactor]);

  const updateMeteors = useCallback((canvas: HTMLCanvasElement, dtMultiplier: number) => {
    const meteors = meteorsRef.current;
    
    for (let i = 0; i < meteors.length; i++) {
      const meteor = meteors[i];
      if (meteor.direction === "horizontal") {
        meteor.x += meteor.speed * dtMultiplier;
        if (meteor.x > canvas.width) {
          meteor.x = 0;
          meteor.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
          meteor.trail = [];
        }
      } else {
        meteor.y += meteor.speed * dtMultiplier;
        if (meteor.y > canvas.height) {
          meteor.y = 0;
          meteor.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
          meteor.trail = [];
        }
      }
      
      meteor.trail.unshift({ x: meteor.x, y: meteor.y, alpha: 1 });
      
      if (meteor.trail.length > 12) meteor.trail.pop();
      
      for (let j = 0; j < meteor.trail.length; j++) {
        meteor.trail[j].alpha = 1 - j / meteor.trail.length;
      }
    }
  }, [gridSize]);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;

    if (elapsed < FRAME_MIN_TIME) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = timestamp - (elapsed % FRAME_MIN_TIME);
    const dtMultiplier = Math.min(elapsed / 16.66, 3);

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    if (preRenderedBgRef.current) {
      ctx.drawImage(preRenderedBgRef.current, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (!isMobile) {
      updateBubbles(canvas, dtMultiplier);
      for (let i = 0; i < bubblesRef.current.length; i++) {
        drawBubble(ctx, bubblesRef.current[i]);
      }
    }
    
    updateMeteors(canvas, dtMultiplier);
    for (let i = 0; i < meteorsRef.current.length; i++) {
      drawMeteor(ctx, meteorsRef.current[i]);
    }
    
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [updateBubbles, updateMeteors, drawBubble, drawMeteor, isMobile, FRAME_MIN_TIME]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && dimensions.width && dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      contextRef.current = canvas.getContext("2d", { alpha: false });
      
      lastTimeRef.current = 0;
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [dimensions, animate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      } else {
        lastTimeRef.current = performance.now();
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [animate]);
};