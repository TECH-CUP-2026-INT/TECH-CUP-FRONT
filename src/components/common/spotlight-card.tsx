"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/utils/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  accent?: 'gold' | 'purple';
}

export function SpotlightCard({
  children,
  className,
  spotlightColor,
  accent = 'gold',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const colors = {
    gold: {
      glow: spotlightColor || 'rgba(245, 166, 35, 0.25)',
      border: 'rgba(245, 166, 35, 0.15)',
      shadow: 'rgba(245, 166, 35, 0.4)',
    },
    purple: {
      glow: spotlightColor || 'rgba(109, 40, 217, 0.25)',
      border: 'rgba(109, 40, 217, 0.15)',
      shadow: 'rgba(109, 40, 217, 0.4)',
    },
  };

  const c = colors[accent];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
        style={{
          opacity: opacity * 0.8,
          background: `linear-gradient(90deg, transparent, ${c.border}, ${c.glow}, ${c.border}, transparent)`,
        }}
      />

      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-400"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${c.glow}, transparent 45%)`,
        }}
      />
      
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: opacity * 0.6,
          boxShadow: `inset 0 1px 0 0 ${c.border}, 0 0 30px -8px ${c.shadow}`,
        }}
      />

      {children}
    </div>
  );
}
