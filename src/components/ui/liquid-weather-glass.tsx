"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type ShadowIntensity = "none" | "xs" | "sm" | "md" | "lg"
type GlowIntensity = "none" | "xs" | "sm" | "md" | "lg"

const shadowMap: Record<ShadowIntensity, string> = {
  none: "shadow-none",
  xs: "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
  sm: "shadow-[0_4px_16px_rgba(0,0,0,0.10)]",
  md: "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
  lg: "shadow-[0_16px_48px_rgba(0,0,0,0.16)]",
}

const glowMap: Record<GlowIntensity, string> = {
  none: "",
  xs: "after:opacity-[0.03]",
  sm: "after:opacity-[0.06]",
  md: "after:opacity-[0.10]",
  lg: "after:opacity-[0.14]",
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  shadowIntensity?: ShadowIntensity
  borderRadius?: string
  glowIntensity?: GlowIntensity
}

export function LiquidGlassCard({
  children,
  className,
  shadowIntensity = "md",
  borderRadius = "16px",
  glowIntensity = "sm",
  ...props
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden text-white",
        "bg-white/[0.06] border border-white/[0.08]",
        "backdrop-blur-xl",
        "after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit]",
        "after:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.10)_0%,transparent_60%)]",
        glowMap[glowIntensity],
        shadowMap[shadowIntensity],
        className,
      )}
      style={{
        borderRadius,
        "--mouse-x": `${mousePos.x}%`,
        "--mouse-y": `${mousePos.y}%`,
      } as React.CSSProperties}
      {...props}
    >
      {/* Animated liquid highlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
        <motion.div
          className="absolute -inset-[100%] opacity-[0.04]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.15), transparent)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {children}
    </div>
  )
}
