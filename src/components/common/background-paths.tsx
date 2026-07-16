"use client";

import { useCallback, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BackgroundPathsProps {
  children?: ReactNode;
  className?: string;
}

export function BackgroundPaths({ children, className }: BackgroundPathsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(245, 166, 35, 0.06)";
    ctx.lineWidth = 1;

    const seed = 42;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      let x = (i * 137 + seed) % w;
      let y = ((i * 89 + seed * 2) % (h * 2)) - h * 0.5;

      for (let j = 0; j < 40; j++) {
        const angle = Math.sin((j * 0.3 + time * 0.0003 + i * 1.2)) * 2;
        const dx = Math.cos(angle) * 4;
        const dy = Math.sin(angle) * 4 + 2;
        x += dx;
        y += dy;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animId: number;
    const render = (time: number) => {
      draw(ctx, time);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const cleanup = animate();
    return () => {
      window.removeEventListener("resize", resize);
      cleanup?.();
    };
  }, [animate]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />
      {children}
    </div>
  );
}
