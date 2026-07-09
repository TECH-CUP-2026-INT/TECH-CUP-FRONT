"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] [--duration:40s]",
        className
      )}
      style={{ ["--duration" as string]: `${speed}s` }}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-[var(--gap)]",
          "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-[var(--gap)]",
          "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
