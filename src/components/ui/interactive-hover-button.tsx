"use client";

import { ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function InteractiveHoverButton({
  children = "Inscribe tu equipo",
  className,
  onClick,
}: InteractiveHoverButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border border-gold/40 bg-gold/5 px-8 py-3 font-bold text-gold transition-all duration-500 hover:bg-gold/15",
        className
      )}
    >
      <div className="relative z-10 flex items-center gap-2">
        <span
          className={cn(
            "inline-block transition-all duration-500",
            hovered ? "translate-x-[-4px] opacity-0" : "translate-x-0 opacity-100"
          )}
        >
          {children}
        </span>
        <ArrowRight
          className={cn(
            "inline-block h-4 w-4 transition-all duration-500",
            hovered ? "translate-x-0 opacity-100" : "translate-x-[-20px] opacity-0"
          )}
        />
      </div>
      
      {/* Shine effect */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-all duration-500",
          hovered
            ? "opacity-100"
            : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)",
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
        }}
      />
    </button>
  );
}
