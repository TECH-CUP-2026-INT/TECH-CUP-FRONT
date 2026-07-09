"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: ReactNode;
  description: string;
  href?: string;
  cta?: string;
  accent?: 'gold' | 'purple';
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  accent = 'gold',
}: BentoCardProps) {
  const isGold = accent === 'gold';
  
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
        "border border-border bg-surface",
        "transition-all duration-300 hover:-translate-y-1",
        isGold ? "hover:border-gold/30" : "hover:border-purple-mid/30",
        className
      )}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        {background}
      </div>

      {/* Accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isGold ? "bg-gradient-to-r from-gold via-gold-2 to-gold" : "bg-gradient-to-r from-purple-mid via-purple-deep2 to-purple-mid"
        )}
      />

      <div className="pointer-events-none z-10 flex flex-col gap-1 p-6">
        {Icon && (
          <span className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center mb-2",
            isGold ? "bg-gold/15 text-gold" : "bg-purple-mid/20 text-purple-mid"
          )}>
            {Icon}
          </span>
        )}
        <h3 className="text-lg font-[family-name:var(--font-display)] uppercase tracking-[.3px]">
          {name}
        </h3>
        <p className="max-w-lg text-sm text-text-muted">{description}</p>
      </div>

      {cta && (
        <div
          className={cn(
            "pointer-events-none z-10 flex items-center gap-2 px-6 pb-6 text-sm font-bold transition-all duration-300",
            isGold ? "text-gold group-hover:translate-x-1" : "text-purple-mid group-hover:translate-x-1"
          )}
        >
          {cta} <ArrowRight size={14} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
