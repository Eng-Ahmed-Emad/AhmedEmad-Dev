/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */
"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';// Import necessary dependencies
import { debounce } from 'lodash';
import styles from './animated_background.module.css';


// Define the Bubble and Meteor interfaces
interface Bubble {
    //x and y are the coordinates of the center of the bubble
    //radius is the radius of the bubble
    //vx and vy are the velocities of the bubble
    //x and y are the coordinates of the center of the bubble
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
}

// Define the Meteor interface
interface Meteor {
    //x and y are the coordinates of the center of the meteor
    //size is the size of the meteor
    //speed is the speed of the meteor
    //direction is the direction of the meteor
    //trail is the trail of the meteor
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: 'horizontal' | 'vertical';
    trail: { x: number; y: number; alpha: number }[];
}

// Define the AnimatedBackground component
// The component is a canvas with a background image
// The background image is animated
// The component is a child of the root component
const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);// Define the canvasRef
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);// Define the contextRef
    const animationFrameIdRef = useRef<number | null>(null);// Define the animationFrameIdRef
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });// Define the dimensions
    const [bubbles, setBubbles] = useState<Bubble[]>([]);// Define the bubbles
    const [meteors, setMeteors] = useState<Meteor[]>([]);// Define the meteors
    const [isMobile, setIsMobile] = useState(false);

    // Define the createBubbles and createMeteors functions
    // The functions are used to create the bubbles and meteors
    // The functions are called in the useEffect hook
    // The functions are called in the createBubbles and createMeteors functions
    const gridSize = 50;
    // Slightly reduce counts to keep background lightweight on large screens
    const numberOfBubbles = Math.floor(dimensions.width * dimensions.height / 120000);
    const numberOfMeteors = Math.floor(dimensions.width / 320);
    const maxRadius = 120;
    const minRadius = 60;

    const createBubbles = useCallback(() => {
        if (isMobile) return [];
        return Array.from({ length: numberOfBubbles }, () => ({
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            radius: Math.random() * (maxRadius - minRadius) + minRadius,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7
        }));
    }, [dimensions, numberOfBubbles, isMobile]);

    const createMeteors = useCallback(() => {
        return Array.from({ length: numberOfMeteors }, () => ({
            x: Math.floor(Math.random() * (dimensions.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (dimensions.height / gridSize)) * gridSize,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2.2 + 1.2,
            direction: Math.random() < 0.5 ? 'horizontal' : 'vertical',
            trail: []
        })) as Meteor[];
    }, [dimensions, numberOfMeteors]);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
            setIsMobile(window.innerWidth <= 500);
        };

        const debouncedUpdateDimensions = debounce(updateDimensions, 200);

        window.addEventListener('resize', debouncedUpdateDimensions);
        updateDimensions();

        return () => {
            window.removeEventListener('resize', debouncedUpdateDimensions);
        };
    }, []);

    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            setBubbles(createBubbles());
            setMeteors(createMeteors());
        }
    }, [dimensions, createBubbles, createMeteors]);

    const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.4;

        for (let x = 0; x <= dimensions.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, dimensions.height);
            ctx.stroke();
        }

        for (let y = 0; y <= dimensions.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(dimensions.width, y);
            ctx.stroke();
        }
    }, [dimensions]);

    const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
        ctx.filter = 'blur(30px)';
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius);
        gradient.addColorStop(0, 'rgba(253, 242, 225, 0.8)');
        gradient.addColorStop(1, 'rgba(253, 242, 225, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
    };

    const drawMeteor = (ctx: CanvasRenderingContext2D, meteor: Meteor) => {
        meteor.trail.forEach((point, index) => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            const prevPoint = meteor.trail[index - 1] || { x: meteor.x, y: meteor.y };
            ctx.lineTo(prevPoint.x, prevPoint.y);
            ctx.strokeStyle = `rgba(254, 242, 226, ${point.alpha})`;
            ctx.lineWidth = meteor.size * (1 - index / meteor.trail.length);
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        const endX = meteor.direction === 'horizontal' ? meteor.x - meteor.size * 5 : meteor.x;
        const endY = meteor.direction === 'vertical' ? meteor.y - meteor.size * 5 : meteor.y;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(252, 240, 225, 0.7)';
        ctx.lineWidth = meteor.size;
        ctx.stroke();
    };

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        backgroundGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawGrid(ctx);

        if (!isMobile) {
            bubbles.forEach(bubble => {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;
                if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) bubble.vx *= -1;
                if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) bubble.vy *= -1;
                drawBubble(ctx, bubble);
            });
        }

        meteors.forEach(meteor => {
            if (meteor.direction === 'horizontal') {
                meteor.x += meteor.speed;
                if (meteor.x > canvas.width) {
                    meteor.x = 0;
                    meteor.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
                    meteor.trail = [];
                }
            } else {
                meteor.y += meteor.speed;
                if (meteor.y > canvas.height) {
                    meteor.y = 0;
                    meteor.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
                    meteor.trail = [];
                }
            }

            meteor.trail.unshift({ x: meteor.x, y: meteor.y, alpha: 1 });
            if (meteor.trail.length > 20) meteor.trail.pop();
            meteor.trail.forEach((point, index) => {
                point.alpha = 1 - index / meteor.trail.length;
            });

            drawMeteor(ctx, meteor);
        });

        animationFrameIdRef.current = requestAnimationFrame(animate);
    }, [bubbles, meteors, drawGrid, isMobile]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            contextRef.current = canvas.getContext('2d');
            animate();
        }
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [dimensions, animate]);

    return (
        <canvas ref={canvasRef} className={styles.canvas} />
    );
};

export default AnimatedBackground;