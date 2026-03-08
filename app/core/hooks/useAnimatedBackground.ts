"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  originalRadius: number;
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
  
  // Canvases مخفية للرسم المسبق
  const preRenderedBubbleRef = useRef<HTMLCanvasElement | null>(null);
  const preRenderedBgRef = useRef<HTMLCanvasElement | null>(null);
  
  // تتبع الوقت لحركة سلسة (Delta Time)
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

  // 2. التجهيز المسبق للخلفية والشبكة (Layer Separation)
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
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      };
    });
  }, [dimensions, isMobile]);

  const createMeteors = useCallback(() => {
    const numberOfMeteors = Math.floor(dimensions.width / 250);
    meteorsRef.current = Array.from({ length: numberOfMeteors }, () => ({
      x: Math.floor(Math.random() * (dimensions.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (dimensions.height / gridSize)) * gridSize,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      direction: Math.random() < 0.5 ? "horizontal" : "vertical",
      trail: [],
    }));
  }, [dimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth <= 768);
    };
    const debouncedUpdateDimensions = debounce(updateDimensions, 250);
    window.addEventListener("resize", debouncedUpdateDimensions);
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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // منع حسابات البكسلات الفرعية باستخدام Math.floor
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
    meteor.trail.forEach((point, index) => {
      const prevPoint = meteor.trail[index - 1] || { x: meteor.x, y: meteor.y };
      ctx.beginPath();
      ctx.moveTo(Math.floor(point.x), Math.floor(point.y));
      ctx.lineTo(Math.floor(prevPoint.x), Math.floor(prevPoint.y));
      ctx.strokeStyle = `rgba(254, 242, 226, ${point.alpha})`;
      ctx.lineWidth = meteor.size * (1 - index / meteor.trail.length);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(Math.floor(meteor.x), Math.floor(meteor.y));
    const endX = meteor.direction === "horizontal" ? meteor.x - meteor.size * 5 : meteor.x;
    const endY = meteor.direction === "vertical" ? meteor.y - meteor.size * 5 : meteor.y;
    ctx.lineTo(Math.floor(endX), Math.floor(endY));
    ctx.strokeStyle = "rgba(252, 240, 225, 0.7)";
    ctx.lineWidth = meteor.size;
    ctx.stroke();
  }, []);

  // استخدام dtMultiplier لضمان ثبات السرعة
  const updateBubbles = useCallback((canvas: HTMLCanvasElement, dtMultiplier: number) => {
    const mouse = mouseRef.current;
    const bubbles = bubblesRef.current;

    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i];
      // ضرب السرعة في معامل الوقت
      let newX = bubble.x + (bubble.vx * dtMultiplier);
      let newY = bubble.y + (bubble.vy * dtMultiplier);

      if (newX + bubble.radius > canvas.width || newX - bubble.radius < 0) {
        bubble.vx *= -1;
        newX = Math.max(bubble.radius, Math.min(newX, canvas.width - bubble.radius));
      }
      if (newY + bubble.radius > canvas.height || newY - bubble.radius < 0) {
        bubble.vy *= -1;
        newY = Math.max(bubble.radius, Math.min(newY, canvas.height - bubble.radius));
      }

      let newRadius = bubble.originalRadius;
      if (mouse.active) {
        const dx = mouse.x - newX;
        const dy = mouse.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceRadius) {
          const influence = 1 - distance / mouseInfluenceRadius;
          newRadius = bubble.originalRadius * (1 + influence * bubbleExpansionFactor);

          const forceFactor = mouseInfluenceStrength * influence;
          bubble.vx -= (dx / distance) * forceFactor;
          bubble.vy -= (dy / distance) * forceFactor;
          
          const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
          const maxSpeed = 2;
          if (speed > maxSpeed) {
            bubble.vx = (bubble.vx / speed) * maxSpeed;
            bubble.vy = (bubble.vy / speed) * maxSpeed;
          }
        }
      }
      
      // التخميد التدريجي للسرعة
      bubble.vx *= Math.pow(0.99, dtMultiplier);
      bubble.vy *= Math.pow(0.99, dtMultiplier);
      
      bubble.x = newX;
      bubble.y = newY;
      bubble.radius = newRadius;
    }
  }, []);

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
      if (meteor.trail.length > 20) meteor.trail.pop();
      
      for (let j = 0; j < meteor.trail.length; j++) {
        meteor.trail[j].alpha = 1 - j / meteor.trail.length;
      }
    }
  }, [gridSize]);

  const animate = useCallback((timestamp: number) => {
    // حساب Delta Time
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // تأمين ضد التوقف الطويل (مثل تصغير المتصفح)
    const dtMultiplier = Math.min(deltaTime / 16.66, 3);

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    // رسم الخلفية الجاهزة مرة واحدة بدلاً من الشبكة والألوان كل إطار
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
  }, [updateBubbles, updateMeteors, drawBubble, drawMeteor, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && dimensions.width && dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      contextRef.current = canvas.getContext("2d", { alpha: false });
      
      // إعادة تعيين الوقت عند بدء الأنيميشن
      lastTimeRef.current = 0;
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [dimensions, animate]);
};