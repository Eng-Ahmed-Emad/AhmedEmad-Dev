"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";
const FPS_LIMIT = 60; // يمكنك تغييرها لـ 120 حسب رغبتك
const FRAME_MIN_TIME = 1000 / FPS_LIMIT;

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
    const numberOfMeteors = Math.floor((dimensions.width / 250) * 0.85);
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
    
    // تمت إضافة { passive: true } هنا كمعامل ثالث
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

    // تمت إضافة { passive: true } هنا كمعامل ثالث
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    
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
  if (meteor.trail.length < 2) return;

  ctx.beginPath();
  // ابدأ من أول نقطة في الذيل
  ctx.moveTo(Math.floor(meteor.trail[0].x), Math.floor(meteor.trail[0].y));

  // ارسم خطوط متصلة لكل النقاط الباقية في المسار
  for (let i = 1; i < meteor.trail.length; i++) {
    ctx.lineTo(Math.floor(meteor.trail[i].x), Math.floor(meteor.trail[i].y));
  }

  // بدل ما نغير الشفافية لكل قطعة، هنعمل Gradient (تدرج) للخط كله
  const lastPoint = meteor.trail[meteor.trail.length - 1];
  const gradient = ctx.createLinearGradient(
    Math.floor(meteor.x), Math.floor(meteor.y),
    Math.floor(lastPoint.x), Math.floor(lastPoint.y)
  );
  
  gradient.addColorStop(0, "rgba(254, 242, 226, 0.8)"); // البداية قوية
  gradient.addColorStop(1, "rgba(254, 242, 226, 0)");   // النهاية تختفي

  ctx.strokeStyle = gradient;
  ctx.lineWidth = meteor.size;
  ctx.lineCap = "round"; // بيخلي شكل الخط أنعم في الأطراف
  
  // أمر الرسم "مرة واحدة" فقط للذيل كله
  ctx.stroke();

  // رسم رأس النيزك (نقطة مضيئة في البداية)
  ctx.beginPath();
  ctx.arc(Math.floor(meteor.x), Math.floor(meteor.y), meteor.size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(252, 240, 225, 1)";
  ctx.fill();
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
      
      // تقليل طول المسار من 20 إلى 12 لتوفير عمليات الرسم
      if (meteor.trail.length > 12) meteor.trail.pop();
      
      for (let j = 0; j < meteor.trail.length; j++) {
        meteor.trail[j].alpha = 1 - j / meteor.trail.length;
      }
    }
  }, [gridSize]);

const animate = useCallback((timestamp: number) => {
    // 1. حساب الوقت المنقضي منذ آخر إطار
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;

    // 2. إذا لم يمر وقت كافٍ (حسب الـ FPS المحدد)، اطلب الإطار القادم وانتظر
    if (elapsed < FRAME_MIN_TIME) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    // 3. تحديث الوقت الأخير (مع خصم "الباقي" لضمان دقة التوقيت)
    lastTimeRef.current = timestamp - (elapsed % FRAME_MIN_TIME);
    
    // حساب dtMultiplier بناءً على الـ 60 فريم القياسية (16.66ms)
    // نستخدم 'elapsed' هنا لضمان سلاسة الحركة مهما كان الـ FPS
    const dtMultiplier = Math.min(elapsed / 16.66, 3);

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    // رسم الخلفية
    if (preRenderedBgRef.current) {
      ctx.drawImage(preRenderedBgRef.current, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // تحديث ورسم الفقاعات
    if (!isMobile) {
      updateBubbles(canvas, dtMultiplier);
      for (let i = 0; i < bubblesRef.current.length; i++) {
        drawBubble(ctx, bubblesRef.current[i]);
      }
    }
    
    // تحديث ورسم النيازك
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

  // أضف هذا الجزء تحت الـ useEffect الخاص بالـ resize والـ mouse
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // إيقاف الأنيميشن فوراً عند خروج المستخدم من التبويب لتوفير المعالج
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    } else {
      // إعادة تشغيل الأنيميشن عند العودة مع إعادة ضبط الوقت لتجنب القفزات المفاجئة
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