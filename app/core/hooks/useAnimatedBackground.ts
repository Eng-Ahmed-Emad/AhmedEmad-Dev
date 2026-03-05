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

  const createBubbles = useCallback(() => {
    if (isMobile) return [];

    // reduce bubble count by 20% by increasing the divisor from 37037 to 46296
    const numberOfBubbles = Math.floor(
      (dimensions.width * dimensions.height) / 46296,
    );
    const bubbles = Array.from({ length: numberOfBubbles }, () => {
      // slightly smaller radii range to avoid overcrowding with huge bubbles
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

    bubblesRef.current = bubbles;
    return bubbles;
  }, [dimensions, isMobile]);

  const createMeteors = useCallback(() => {
    const reductionFactor = isMobile ? 0.9 : 0.9;
    const numberOfMeteors = Math.floor((dimensions.width / 250) * reductionFactor);
    const meteors = Array.from({ length: numberOfMeteors }, () => ({
      x: Math.floor(Math.random() * (dimensions.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (dimensions.height / gridSize)) * gridSize,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      direction: Math.random() < 0.5 ? "horizontal" : "vertical",
      trail: [],
    })) as Meteor[];

    meteorsRef.current = meteors;
    return meteors;
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
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
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

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let x = 0; x <= dimensions.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
      }
      for (let y = 0; y <= dimensions.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
      }
      ctx.stroke();
    },
    [dimensions],
  );

  const drawBubble = useCallback(
    (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
      ctx.filter = "blur(33px)";
      const gradient = ctx.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        bubble.radius,
      );
      gradient.addColorStop(0, "rgba(253, 242, 225, 0.8)");
      gradient.addColorStop(1, "rgba(253, 242, 225, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
    },
    [],
  );

  const drawMeteor = useCallback(
    (ctx: CanvasRenderingContext2D, meteor: Meteor) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      meteor.trail.forEach((point, index) => {
        const prevPoint = meteor.trail[index - 1] || {
          x: meteor.x,
          y: meteor.y,
        };
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(prevPoint.x, prevPoint.y);
        ctx.strokeStyle = `rgba(254, 242, 226, ${point.alpha})`;
        ctx.lineWidth = meteor.size * (1 - index / meteor.trail.length);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      const endX =
        meteor.direction === "horizontal"
          ? meteor.x - meteor.size * 5
          : meteor.x;
      const endY =
        meteor.direction === "vertical" ? meteor.y - meteor.size * 5 : meteor.y;
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(252, 240, 225, 0.7)";
      ctx.lineWidth = meteor.size;
      ctx.stroke();
    },
    [],
  );

  const updateBubbles = useCallback(
    (bubbles: Bubble[], canvas: HTMLCanvasElement) => {
      const mouse = mouseRef.current;

      return bubbles.map((bubble) => {
        let newX = bubble.x + bubble.vx;
        let newY = bubble.y + bubble.vy;

        if (newX + bubble.radius > canvas.width || newX - bubble.radius < 0) {
          bubble.vx *= -1;
          newX = Math.max(
            bubble.radius,
            Math.min(newX, canvas.width - bubble.radius),
          );
        }
        if (newY + bubble.radius > canvas.height || newY - bubble.radius < 0) {
          bubble.vy *= -1;
          newY = Math.max(
            bubble.radius,
            Math.min(newY, canvas.height - bubble.radius),
          );
        }

        let newRadius = bubble.originalRadius;
        if (mouse.active) {
          const dx = mouse.x - newX;
          const dy = mouse.y - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseInfluenceRadius) {
            const influence = 1 - distance / mouseInfluenceRadius;
            newRadius =
              bubble.originalRadius * (1 + influence * bubbleExpansionFactor);

            const forceFactor = mouseInfluenceStrength * influence;
            bubble.vx -= (dx / distance) * forceFactor;
            bubble.vy -= (dy / distance) * forceFactor;
            const speed = Math.sqrt(
              bubble.vx * bubble.vx + bubble.vy * bubble.vy,
            );
            const maxSpeed = 2;
            if (speed > maxSpeed) {
              bubble.vx = (bubble.vx / speed) * maxSpeed;
              bubble.vy = (bubble.vy / speed) * maxSpeed;
            }
          }
        }
        bubble.vx *= 0.99;
        bubble.vy *= 0.99;
        return {
          ...bubble,
          x: newX,
          y: newY,
          radius: newRadius,
        };
      });
    },
    [mouseInfluenceRadius, bubbleExpansionFactor, mouseInfluenceStrength],
  );

  const updateMeteors = useCallback(
    (meteors: Meteor[], canvas: HTMLCanvasElement) => {
      return meteors.map((meteor) => {
        if (meteor.direction === "horizontal") {
          meteor.x += meteor.speed;
          if (meteor.x > canvas.width) {
            meteor.x = 0;
            meteor.y =
              Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
            meteor.trail = [];
          }
        } else {
          meteor.y += meteor.speed;
          if (meteor.y > canvas.height) {
            meteor.y = 0;
            meteor.x =
              Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
            meteor.trail = [];
          }
        }
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, alpha: 1 });
        if (meteor.trail.length > 20) meteor.trail.pop();
        meteor.trail.forEach((point, index) => {
          point.alpha = 1 - index / meteor.trail.length;
        });
        return meteor;
      });
    },
    [gridSize],
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
    if (!isMobile) {
      const updatedBubbles = updateBubbles(bubblesRef.current, canvas);
      updatedBubbles.forEach((bubble) => drawBubble(ctx, bubble));
      bubblesRef.current = updatedBubbles;
    }
    const updatedMeteors = updateMeteors(meteorsRef.current, canvas);
    updatedMeteors.forEach((meteor) => drawMeteor(ctx, meteor));
    meteorsRef.current = updatedMeteors;
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [
    drawGrid,
    updateBubbles,
    updateMeteors,
    drawBubble,
    drawMeteor,
    isMobile,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && dimensions.width && dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      contextRef.current = canvas.getContext("2d", { alpha: false });
      animate();
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [dimensions, animate]);
};
