"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface DisplayCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  className?: string;
}

interface DisplayCardsProps {
  cards: DisplayCardProps[];
  className?: string;
}

export function DisplayCards({ cards, className }: DisplayCardsProps) {
  return (
    <div className={cn("relative", className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={cn(
            "relative rounded-2xl border border-border bg-surface p-6 transition-all duration-500",
            "hover:!translate-y-0 hover:!scale-100",
            "[grid-area:stack]",
            index === 0 && "hover:-translate-y-10",
            index === 1 && "translate-x-12 translate-y-10 hover:-translate-y-1",
            index === 2 && "translate-x-24 translate-y-20 hover:translate-y-10",
            "before:absolute before:inset-0 before:rounded-2xl before:border before:border-border before:content-[''] before:bg-black/50 before:transition-opacity before:duration-500",
            "hover:before:opacity-0",
            "grayscale hover:grayscale-0",
            card.className
          )}
          style={{ zIndex: cards.length - index }}
        >
          {/* Accent top line */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="relative z-10">
            {card.icon && (
              <span className={cn(
                "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                card.iconClassName || "bg-purple-mid/20 text-purple-mid"
              )}>
                {card.icon}
              </span>
            )}
            <h3 className={cn(
              "text-base font-bold mb-1",
              card.titleClassName || "text-white"
            )}>
              {card.title}
            </h3>
            <p className="text-sm text-text-muted">{card.description}</p>
            {card.date && (
              <p className="mt-3 text-xs text-text-faint">{card.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
