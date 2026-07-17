"use client";

import { useEffect, useRef } from "react";

const BALL_URL =
  "https://cdn.dam.alkosto.com/ecommerce/landings/alkomprar/ofertas/2026/marzo/temporada-futbol/icono-funt-balon.png?w=32&h=32&q=76";

type Ball = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  rotSpeed: number;
  bounced: boolean;
  removing: boolean;
};

export default function FallingBalls({
  count = 14,
  duration = 20000,
  startDelay = 2000,
  triggerOnScroll = true,
  containerSelector = "main",
}: {
  count?: number;
  duration?: number;
  startDelay?: number;
  triggerOnScroll?: boolean;
  containerSelector?: string;
}) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    const origOverflow = container.style.overflow;
    const origPosition = container.style.position;
    if (container.style.position !== "relative" && container.style.position !== "absolute" && container.style.position !== "fixed") {
      container.style.position = "relative";
    }
    container.style.overflow = "hidden";

    const layer = document.createElement("div");
    Object.assign(layer.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      overflow: "hidden",
    });
    container.insertBefore(layer, container.firstChild);

    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    };
    const handleMouseLeave = () => { mouseActive = false; };

    let rafId = 0;
    let balls: Ball[] = [];
    const spawnTimers: ReturnType<typeof setTimeout>[] = [];
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

    const gravity = 0.32;
    const touchRadius = 42;

    const COLOR_FILTERS = [
      "brightness(1.3) sepia(1) hue-rotate(-20deg) saturate(4)", // dorado
      "brightness(1.1) sepia(1) hue-rotate(220deg) saturate(5)", // morado
    ];

    const floorY = () => Math.max(220, Math.min(container.offsetHeight, window.innerHeight) - 30);

    const spawn = () => {
      const el = document.createElement("div");
      const size = Math.random() * 14 + 16;
      Object.assign(el.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: size + "px",
        height: size + "px",
        background: `url(${BALL_URL}) no-repeat center center`,
        backgroundSize: "contain",
        filter: COLOR_FILTERS[Math.random() < 0.5 ? 0 : 1],
        willChange: "transform, opacity",
      });
      layer.appendChild(el);

      balls.push({
        el,
        x: Math.random() * Math.max(1, container.offsetWidth - size),
        y: -size - Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 0,
        size,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 4,
        bounced: false,
        removing: false,
      });
    };

    const startBalls = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      clearTimeout(timer);
      if (triggerOnScroll) window.removeEventListener("scroll", startBalls);

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      for (let i = 0; i < count; i++) {
        spawnTimers.push(setTimeout(spawn, Math.random() * 1600));
      }

      const tick = () => {
        const floor = floorY();
        for (const ball of balls) {
          if (ball.removing) continue;

          ball.vy += gravity;
          ball.x += ball.vx;
          ball.y += ball.vy;
          ball.rot += ball.rotSpeed;

          if (mouseActive && !ball.bounced) {
            const cx = ball.x + ball.size / 2;
            const cy = ball.y + ball.size / 2;
            const dx = cx - mouseX;
            const dy = cy - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < touchRadius) {
              const angle = Math.atan2(dy, dx);
              ball.vx = Math.cos(angle) * 3.2;
              ball.vy = -Math.abs(Math.sin(angle)) * 3.5 - 2.5;
              ball.bounced = true;
            }
          }

          if (ball.y + ball.size >= floor) {
            ball.y = floor - ball.size;
            if (!ball.bounced) {
              ball.vy = -Math.abs(ball.vy) * 0.48;
              ball.vx *= 0.7;
              ball.bounced = true;
            } else {
              ball.removing = true;
              ball.el.style.transition = "opacity .5s ease";
              ball.el.style.opacity = "0";
              const dead = ball;
              setTimeout(() => {
                dead.el.remove();
                balls = balls.filter(b => b !== dead);
              }, 500);
            }
          }

          if (ball.x < 0) { ball.x = 0; ball.vx *= -0.5; }
          if (ball.x > container.offsetWidth - ball.size) { ball.x = container.offsetWidth - ball.size; ball.vx *= -0.5; }

          if (!ball.removing) {
            ball.el.style.transform = `translate(${ball.x}px, ${ball.y}px) rotate(${ball.rot}deg)`;
          }
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      cleanupTimer = setTimeout(() => {
        cancelAnimationFrame(rafId);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        layer.remove();
        container.style.overflow = origOverflow;
        container.style.position = origPosition;
      }, duration + 4000);
    };

    const timer = setTimeout(startBalls, startDelay);
    if (triggerOnScroll) {
      window.addEventListener("scroll", startBalls, { once: true, passive: true });
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
      spawnTimers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      if (triggerOnScroll) window.removeEventListener("scroll", startBalls);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      layer.remove();
      container.style.overflow = origOverflow;
      container.style.position = origPosition;
    };
  }, [count, duration, startDelay, triggerOnScroll, containerSelector]);

  return null;
}
