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
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        onClick && "cursor-pointer text-left w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}
