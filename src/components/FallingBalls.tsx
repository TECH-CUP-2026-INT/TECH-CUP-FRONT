"use client";

import { useEffect, useRef } from "react";

const BALL_URL =
  "https://cdn.dam.alkosto.com/ecommerce/landings/alkomprar/ofertas/2026/marzo/temporada-futbol/icono-funt-balon.png?w=32&h=32&q=76";

export default function FallingBalls({
  count = 40,
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

    // Ensure container has position relative and overflow hidden
    const origOverflow = container.style.overflow;
    const origPosition = container.style.position;
    if (container.style.position !== "relative" && container.style.position !== "absolute" && container.style.position !== "fixed") {
      container.style.position = "relative";
    }
    container.style.overflow = "hidden";

    const fallDistance = Math.max(container.offsetHeight, window.innerHeight) + 50;

    const snow = document.createElement("div");
    snow.id = "snow";
    Object.assign(snow.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      zIndex: "0",
      overflow: "hidden",
      transition: "opacity 1s ease",
    });
    container.insertBefore(snow, container.firstChild);

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .snowflake {
        position: absolute;
        top: -10px;
        background: url(${BALL_URL}) no-repeat center center;
        background-size: contain;
        width: 32px;
        height: 32px;
        user-select: none;
        animation: fall linear infinite;
        filter: brightness(1.3) sepia(1) hue-rotate(-20deg) saturate(4);
      }
      @keyframes fall {
        to { transform: translateY(${fallDistance}px); }
      }
    `;
    document.head.appendChild(styleEl);

    const startSnow = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      clearTimeout(timer);
      if (triggerOnScroll) {
        window.removeEventListener("scroll", startSnow);
      }

      const flakes: HTMLDivElement[] = [];
      for (let i = 0; i < count; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.style.left = Math.random() * 100 + "%";
        const size = Math.random() * 20 + 10;
        flake.style.width = size + "px";
        flake.style.height = size + "px";
        flake.style.animationDuration = Math.random() * 4 + 3 + "s";
        flake.style.opacity = String(Math.random());
        flakes.push(flake);
        snow.appendChild(flake);
      }

      let removed = 0;
      const removeInterval = setInterval(() => {
        if (removed < flakes.length) {
          const idx = Math.floor(Math.random() * flakes.length);
          const f = flakes[idx];
          if (f && f.parentNode) {
            f.style.transition = "opacity 0.5s ease";
            f.style.opacity = "0";
            setTimeout(() => f.remove(), 500);
            flakes.splice(idx, 1);
          }
          removed++;
        }
        if (flakes.length === 0) {
          clearInterval(removeInterval);
          snow.remove();
          // Restore original container styles
          container.style.overflow = origOverflow;
          container.style.position = origPosition;
        }
      }, duration / count);
    };

    const timer = setTimeout(startSnow, startDelay);

    if (triggerOnScroll) {
      window.addEventListener("scroll", startSnow, { once: true, passive: true });
    }

    return () => {
      clearTimeout(timer);
      if (triggerOnScroll) {
        window.removeEventListener("scroll", startSnow);
      }
      snow.remove();
      styleEl.remove();
      container.style.overflow = origOverflow;
      container.style.position = origPosition;
    };
  }, [count, duration, startDelay, triggerOnScroll, containerSelector]);

  return null;
}
