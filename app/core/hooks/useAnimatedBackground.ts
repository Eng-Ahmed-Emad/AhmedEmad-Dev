"use client";
import { useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import type { RefObject } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

// Flat typed arrays for cache-friendly iteration (no object allocation per frame)
// Layout per bubble (8 floats): x, y, radius, vx, vy, originalRadius, phase, pulseSpeed
// Layout per meteor (5 floats): x, y, size, speed, directionCode (0=H,1=V,2=D)
// Layout per star   (5 floats): x, y, radius, phase, speed
// Layout per particle(4 floats): x, y, vx, vy

const B_STRIDE = 8;  // bubble stride
const M_STRIDE = 5;  // meteor stride
const S_STRIDE = 5;  // star stride
const P_STRIDE = 4;  // particle stride

// Trail stored separately — small object arrays are fine since meteors are few
interface MeteorTrail { x: number; y: number; }
interface MousePosition { x: number; y: number; active: boolean; }

// ─── Constants ────────────────────────────────────────────────────────────────

const GRID_SIZE                = 50;
const MOUSE_INFLUENCE_RADIUS   = 200;
const MOUSE_INFLUENCE_RADIUS_SQ= MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS;
const MOUSE_INFLUENCE_STRENGTH = 1.0;
const MAX_RADIUS               = 120;
const MIN_RADIUS               = 60;
const BUBBLE_EXPANSION_FACTOR  = 1.2;
const MAX_SPEED_LIMIT          = 5;
const MAX_SPEED_SQ             = MAX_SPEED_LIMIT * MAX_SPEED_LIMIT;
const TARGET_FRAME_TIME        = 1000 / 60;
const TARGET_FRAME_TIME_MOBILE = 1000 / 30;
const MOBILE_MAX_BUBBLES       = 3;
const MOBILE_MAX_METEORS       = 12;
const TRAIL_MAX_LENGTH         = 12;
const TRAIL_MAX_LENGTH_MOBILE  = 6;
const TWO_PI                   = Math.PI * 2;
const METEOR_DENSITY_DIVISOR   = 120;
const STAR_COUNT               = 80;
const STAR_COUNT_MOBILE        = 40;
const PARTICLE_COUNT           = 35;

// ─── Offscreen builders (module-level, never recreated per frame) ─────────────

const buildBackground = (w: number, h: number): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { alpha: false });
  if (ctx) { ctx.fillStyle = "black"; ctx.fillRect(0, 0, w, h); }
  return c;
};

const buildGridOffscreen = (w: number, h: number): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth   = 0.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += GRID_SIZE) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y <= h; y += GRID_SIZE) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  }
  return c;
};

const buildVignetteOffscreen = (w: number, h: number): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) {
    const cx = w / 2, cy = h / 2;
    const r  = Math.sqrt(cx * cx + cy * cy);
    const g  = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  return c;
};

// ─── Pure draw helpers ────────────────────────────────────────────────────────

const drawBubble = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, radius: number,
  offscreen: HTMLCanvasElement
): void => {
  const drawSize = offscreen.width * (radius / MAX_RADIUS);
  ctx.drawImage(offscreen, ~~(x - drawSize / 2), ~~(y - drawSize / 2), ~~drawSize, ~~drawSize);
};

const drawMeteor = (
  ctx: CanvasRenderingContext2D,
  mx: number, my: number, size: number,
  trail: MeteorTrail[]
): void => {
  const trailLen = trail.length;
  if (trailLen < 2) return;

  ctx.beginPath();
  ctx.moveTo(~~trail[0].x, ~~trail[0].y);
  for (let i = 1; i < trailLen; i++) ctx.lineTo(~~trail[i].x, ~~trail[i].y);

  const last = trail[trailLen - 1];
  const g    = ctx.createLinearGradient(~~mx, ~~my, ~~last.x, ~~last.y);
  g.addColorStop(0, "rgba(254,242,226,0.8)");
  g.addColorStop(1, "rgba(254,242,226,0)");
  ctx.strokeStyle = g;
  ctx.lineWidth   = size;
  ctx.lineCap     = "round";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(~~mx, ~~my, size / 2, 0, TWO_PI);
  ctx.fillStyle = "rgba(252,240,225,1)";
  ctx.fill();
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAnimatedBackground = (
  canvasRef: RefObject<HTMLCanvasElement | null>
): void => {
  const contextRef        = useRef<CanvasRenderingContext2D | null>(null);
  const animFrameRef      = useRef<number | null>(null);
  const bubbleSprite      = useRef<HTMLCanvasElement | null>(null);
  const bgOffscreen       = useRef<HTMLCanvasElement | null>(null);
  const gridOffscreen     = useRef<HTMLCanvasElement | null>(null);
  const vignetteOffscreen = useRef<HTMLCanvasElement | null>(null);
  const lastTimeRef       = useRef<number>(0);
  const globalTimeRef     = useRef<number>(0);

  // Flat typed arrays — zero GC pressure per frame
  const bubblesArr   = useRef<Float32Array>(new Float32Array(0));
  const bubbleCount  = useRef(0);
  const starsArr     = useRef<Float32Array>(new Float32Array(0));
  const starCount    = useRef(0);
  const particlesArr = useRef<Float32Array>(new Float32Array(0));
  const particleCount= useRef(0);

  // Meteors stay as objects — trail management requires dynamic arrays
  const meteorsRef   = useRef<{ x:number; y:number; size:number; speed:number; dir:0|1|2; trail:MeteorTrail[] }[]>([]);

  const mouseRef     = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const isMobileRef  = useRef(false);
  const frameTimeRef = useRef<number>(TARGET_FRAME_TIME);

  // ── Pre-render bubble sprite once ────────────────────────────────────────────
  useEffect(() => {
    const c    = document.createElement("canvas");
    const size = MAX_RADIUS * 3;
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    if (ctx) {
      const center = size / 2;
      ctx.filter   = "blur(30px)";
      const g      = ctx.createRadialGradient(center, center, 0, center, center, MAX_RADIUS);
      g.addColorStop(0, "rgba(253,242,225,0.8)");
      g.addColorStop(1, "rgba(253,242,225,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(center, center, MAX_RADIUS, 0, TWO_PI);
      ctx.fill();
    }
    bubbleSprite.current = c;
  }, []);

  // ── Setup / resize ───────────────────────────────────────────────────────────
  const setupCanvasEnv = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    isMobileRef.current  = isMobile;
    frameTimeRef.current = isMobile ? TARGET_FRAME_TIME_MOBILE : TARGET_FRAME_TIME;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const main = canvasRef.current;
    if (main) {
      main.width = w; main.height = h;
      contextRef.current = main.getContext("2d", {
        alpha: false, desynchronized: true, willReadFrequently: false,
      });
    }

    bgOffscreen.current       = buildBackground(w, h);
    gridOffscreen.current     = buildGridOffscreen(w, h);
    vignetteOffscreen.current = buildVignetteOffscreen(w, h);

    // ── Stars ───────────────────────────────────────────────────────────────
    const sc = isMobile ? STAR_COUNT_MOBILE : STAR_COUNT;
    starCount.current = sc;
    const sa = new Float32Array(sc * S_STRIDE);
    for (let i = 0; i < sc; i++) {
      const o = i * S_STRIDE;
      sa[o]   = Math.random() * w;                          // x
      sa[o+1] = Math.random() * h;                          // y
      sa[o+2] = Math.random() < 0.5 ? 1 : 1.5;             // radius
      sa[o+3] = Math.random() * TWO_PI;                     // phase
      sa[o+4] = 0.01 + Math.random() * 0.025;               // speed
    }
    starsArr.current = sa;

    if (isMobile) {
      // Static bubbles baked into bgOffscreen
      const sprite = bubbleSprite.current;
      const bgCtx  = bgOffscreen.current?.getContext("2d") ?? null;
      if (sprite && bgCtx) {
        const rRange = MAX_RADIUS - MIN_RADIUS;
        for (let i = 0; i < MOBILE_MAX_BUBBLES; i++) {
          const r = Math.random() * rRange + MIN_RADIUS;
          drawBubble(bgCtx, Math.random() * w, Math.random() * h, r, sprite);
        }
      }
      bubbleCount.current   = 0;
      particleCount.current = 0;
      bubblesArr.current    = new Float32Array(0);
      particlesArr.current  = new Float32Array(0);

      meteorsRef.current = Array.from({ length: MOBILE_MAX_METEORS }, () => ({
        x:     (~~(Math.random() * (w / GRID_SIZE))) * GRID_SIZE,
        y:     (~~(Math.random() * (h / GRID_SIZE))) * GRID_SIZE,
        size:  Math.random() * 1.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        dir:   (Math.random() < 0.5 ? 0 : 1) as 0|1|2,
        trail: [] as MeteorTrail[],
      }));
      return;
    }

    // ── Desktop bubbles ──────────────────────────────────────────────────────
    const bc     = Math.floor((w * h) / 85000);
    bubbleCount.current = bc;
    const ba     = new Float32Array(bc * B_STRIDE);
    const rRange = MAX_RADIUS - MIN_RADIUS;
    for (let i = 0; i < bc; i++) {
      const o  = i * B_STRIDE;
      const r  = Math.random() * rRange + MIN_RADIUS;
      ba[o]    = Math.random() * w;                          // x
      ba[o+1]  = Math.random() * h;                          // y
      ba[o+2]  = r;                                          // radius
      ba[o+3]  = (Math.random() - 0.5) * 4;                 // vx
      ba[o+4]  = (Math.random() - 0.5) * 4;                 // vy
      ba[o+5]  = r;                                          // originalRadius
      ba[o+6]  = Math.random() * TWO_PI;                    // phase
      ba[o+7]  = 0.02 + Math.random() * 0.04;               // pulseSpeed
    }
    bubblesArr.current = ba;

    // ── Desktop meteors ──────────────────────────────────────────────────────
    const mc = Math.floor(w / METEOR_DENSITY_DIVISOR);
    meteorsRef.current = Array.from({ length: mc }, () => {
      const r   = Math.random();
      const dir = (r < 0.4 ? 0 : r < 0.8 ? 1 : 2) as 0|1|2;
      return {
        x:     (~~(Math.random() * (w / GRID_SIZE))) * GRID_SIZE,
        y:     (~~(Math.random() * (h / GRID_SIZE))) * GRID_SIZE,
        size:  Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
        dir,
        trail: [] as MeteorTrail[],
      };
    });

    // ── Desktop particles ────────────────────────────────────────────────────
    const pc = PARTICLE_COUNT;
    particleCount.current = pc;
    const pa = new Float32Array(pc * P_STRIDE);
    for (let i = 0; i < pc; i++) {
      const o = i * P_STRIDE;
      pa[o]   = Math.random() * w;                           // x
      pa[o+1] = Math.random() * h;                           // y
      pa[o+2] = (Math.random() - 0.5) * 0.3;                // vx
      pa[o+3] = (Math.random() - 0.5) * 0.3;                // vy
    }
    particlesArr.current = pa;
  }, [canvasRef]);

  // ── Event listeners ──────────────────────────────────────────────────────────
  useEffect(() => {
    setupCanvasEnv();
    const debouncedSetup = debounce(setupCanvasEnv, 250);
    window.addEventListener("resize", debouncedSetup, { passive: true });

    const onMove = (e: MouseEvent): void => {
      if (isMobileRef.current) return;
      mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; mouseRef.current.active = true;
    };
    const onLeave = (): void => { mouseRef.current.active = false; };
    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("resize",     debouncedSetup);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      debouncedSetup.cancel();
    };
  }, [setupCanvasEnv]);

  // ── Animation loop ───────────────────────────────────────────────────────────
  const animate = useCallback((timestamp: number): void => {
    const canvas = canvasRef.current;
    const ctx    = contextRef.current;
    if (!canvas || !ctx) return;
    if (document.hidden) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;
    if (elapsed < frameTimeRef.current) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    lastTimeRef.current    = timestamp - (elapsed % frameTimeRef.current);
    globalTimeRef.current += elapsed;

    const dt   = Math.min(elapsed / 16.66, 3);
    const cvsW = canvas.width;
    const cvsH = canvas.height;
    const t    = globalTimeRef.current * 0.0003;

    // 1. Base ─────────────────────────────────────────────────────────────────
    ctx.drawImage(bgOffscreen.current!, 0, 0);

    // 2. Grid Pulse ───────────────────────────────────────────────────────────
    ctx.globalAlpha = 0.03 + 0.04 * (0.5 + 0.5 * Math.sin(t * 1.5));
    ctx.drawImage(gridOffscreen.current!, 0, 0);
    ctx.globalAlpha = 1;

    // 3. Twinkling Stars ──────────────────────────────────────────────────────
    // Batch all same-size stars to minimise state changes
    const sa  = starsArr.current;
    const sc  = starCount.current;
    ctx.fillStyle = "rgba(253,242,225,1)";
    for (let i = 0; i < sc; i++) {
      const o      = i * S_STRIDE;
      sa[o+3]     += sa[o+4] * dt;                           // phase += speed*dt
      const alpha  = 0.15 + 0.6 * (0.5 + 0.5 * Math.sin(sa[o+3]));
      ctx.globalAlpha = alpha;
      ctx.fillRect(~~sa[o], ~~sa[o+1], sa[o+2], sa[o+2]);
    }
    ctx.globalAlpha = 1;

    // 4. Floating Particles (desktop only) ────────────────────────────────────
    const pa = particlesArr.current;
    const pc = particleCount.current;
    if (pc > 0) {
      ctx.fillStyle = "rgba(253,242,225,0.35)";
      for (let i = 0; i < pc; i++) {
        const o  = i * P_STRIDE;
        pa[o]   += pa[o+2] * dt;                             // x += vx*dt
        pa[o+1] += pa[o+3] * dt;                             // y += vy*dt
        if (pa[o]   < 0)    pa[o]   = cvsW;
        if (pa[o]   > cvsW) pa[o]   = 0;
        if (pa[o+1] < 0)    pa[o+1] = cvsH;
        if (pa[o+1] > cvsH) pa[o+1] = 0;
        ctx.fillRect(~~pa[o], ~~pa[o+1], 1.5, 1.5);
      }
    }

    // 5. Bubbles (desktop only) ───────────────────────────────────────────────
    const ba      = bubblesArr.current;
    const bc      = bubbleCount.current;
    const sprite  = bubbleSprite.current;
    const mouse   = mouseRef.current;
    const mActive = mouse.active;
    const mx      = mouse.x;
    const my      = mouse.y;

    for (let i = 0; i < bc; i++) {
      const o = i * B_STRIDE;
      // unpack
      let bx = ba[o], by = ba[o+1], brad = ba[o+2];
      let vx = ba[o+3], vy = ba[o+4];
      const origR = ba[o+5];
      let phase   = ba[o+6];
      const pSpeed= ba[o+7];

      bx += vx * dt; by += vy * dt;
      if (bx + brad > cvsW || bx - brad < 0) vx *= -1;
      if (by + brad > cvsH || by - brad < 0) vy *= -1;

      phase += pSpeed * dt;
      const pulsingR = origR + Math.sin(phase) * (origR * 0.2);
      let newR = pulsingR;

      if (mActive) {
        const dx = mx - bx, dy = my - by;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_INFLUENCE_RADIUS_SQ) {
          const dist     = Math.sqrt(distSq);
          const influence= 1 - dist / MOUSE_INFLUENCE_RADIUS;
          newR = pulsingR * (1 + influence * BUBBLE_EXPANSION_FACTOR);
          vx  -= (dx / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
          vy  -= (dy / dist) * MOUSE_INFLUENCE_STRENGTH * influence;
        }
      }

      vx += (Math.random() - 0.5) * 1.2 * dt;
      vy += (Math.random() - 0.5) * 1.2 * dt;
      const speedSq = vx * vx + vy * vy;
      if (speedSq > MAX_SPEED_SQ) {
        const inv = MAX_SPEED_LIMIT / Math.sqrt(speedSq);
        vx *= inv; vy *= inv;
      }

      brad = Math.max(10, newR);
      // pack back
      ba[o]=bx; ba[o+1]=by; ba[o+2]=brad; ba[o+3]=vx; ba[o+4]=vy; ba[o+6]=phase;

      if (sprite) drawBubble(ctx, bx, by, brad, sprite);
    }

    // 6. Meteors (desktop + mobile) ───────────────────────────────────────────
    const meteors  = meteorsRef.current;
    const trailCap = isMobileRef.current ? TRAIL_MAX_LENGTH_MOBILE : TRAIL_MAX_LENGTH;

    for (let i = 0, len = meteors.length; i < len; i++) {
      const m = meteors[i];
      if (m.dir === 0) {                                     // horizontal
        m.x += m.speed * dt;
        if (m.x > cvsW) { m.x = 0; m.trail = []; }
      } else if (m.dir === 1) {                              // vertical
        m.y += m.speed * dt;
        if (m.y > cvsH) { m.y = 0; m.trail = []; }
      } else {                                               // diagonal
        m.x += m.speed * dt;
        m.y += m.speed * 0.6 * dt;
        if (m.x > cvsW || m.y > cvsH) {
          m.x = (~~(Math.random() * (cvsW / GRID_SIZE))) * GRID_SIZE;
          m.y = 0; m.trail = [];
        }
      }

      // Object pool for trail points
      if (m.trail.length >= trailCap) {
        const recycled = m.trail.pop()!;
        recycled.x = m.x; recycled.y = m.y;
        m.trail.unshift(recycled);
      } else {
        m.trail.unshift({ x: m.x, y: m.y });
      }

      drawMeteor(ctx, m.x, m.y, m.size, m.trail);
    }

    // 7. Vignette Pulse ───────────────────────────────────────────────────────
    ctx.globalAlpha = 0.6 + 0.15 * Math.sin(t * 0.8);
    ctx.drawImage(vignetteOffscreen.current!, 0, 0);
    ctx.globalAlpha = 1;

    animFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef]);

  // ── Boot ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    lastTimeRef.current  = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current); };
  }, [animate]);

  // ── Visibility ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onVis = (): void => {
      if (document.hidden) {
        if (animFrameRef.current !== null) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
      } else {
        lastTimeRef.current  = performance.now();
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [animate]);
};