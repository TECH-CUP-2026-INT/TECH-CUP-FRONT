"use client";

import { type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  accent?: 'gold' | 'purple';
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className,
  onClick,
}: SpotlightCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick() } } : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        onClick && "cursor-pointer text-left w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
