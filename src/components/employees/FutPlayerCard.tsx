"use client"

import { type ReactNode } from "react"
import { cn } from "@/utils/cn"

/* ============================================================
   FutPlayerCard — tarjeta de jugador estilo ECI
   Fondo morado/dorado, número de dorsal gigante de fondo,
   insignia ECI y cápsulas de info sobre la silueta del jugador.
   ============================================================ */

// ── Tipos ────────────────────────────────────────────────

export interface FutPlayerStats {
  goles: number
  asistencias: number
  partidos: number
  amarillas: number
  rojas: number
  faltas: number
}

export interface FutPlayerCardProps {
  nombre: string
  dorsal: number
  posicion: string
  img: string
  stats: FutPlayerStats
  className?: string
  onClick?: () => void
  actions?: ReactNode
  teamName?: string
  /** Si es la carta principal del equipo (TechCup branding) */
  techcup?: boolean
}

const POS_MAP: Record<string, string> = {
  Portero: "POR",
  Defensa: "DEF",
  Volante: "VOL",
  Delantero: "DEL",
}

/** Jugadores cuya imagen ya es una ficha completa (diseño horneado) — se muestran full-bleed, sin la plantilla. */
const FULL_CARD_IMAGES = ["nicolas.png", "thomas.png", "jose.png", "jhonathan.png"]

export function FutPlayerCard({
  nombre,
  dorsal,
  posicion,
  img,
  stats,
  className,
  onClick,
  actions,
}: FutPlayerCardProps) {
  const shortPos = POS_MAP[posicion] || posicion.substring(0, 3).toUpperCase()
  const isFullCard = FULL_CARD_IMAGES.some((f) => img.endsWith(f))

  if (isFullCard) {
    return (
      <div
        className={cn(
          "fut-player-card relative w-[300px] h-[460px] select-none shrink-0 overflow-hidden rounded-[22px]",
          "transition-transform duration-200 ease-in hover:-translate-y-1",
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
        style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}
      >
        <img src={img} alt={nombre} draggable={false} className="w-full h-full object-cover" />
        {actions && <div className="absolute top-2 left-2 z-20">{actions}</div>}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fut-player-card relative w-[300px] h-[460px] select-none shrink-0 overflow-hidden rounded-[22px]",
        "transition-transform duration-200 ease-in hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{
        background: "linear-gradient(150deg, #2A0F4E 0%, #3D1873 42%, #6D28D9 68%, #D4AF37 100%)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        border: "1px solid rgba(233,204,116,0.25)",
      }}
    >
      {/* Número de dorsal gigante de fondo */}
      <span
        aria-hidden
        className="absolute -left-3 top-0 font-black leading-none pointer-events-none select-none"
        style={{
          fontSize: "11rem",
          color: "transparent",
          WebkitTextStroke: "2px rgba(233,204,116,0.35)",
        }}
      >
        {String(dorsal).padStart(2, "0")}
      </span>

      {/* Insignia ECI */}
      <div className="absolute top-3 right-3 w-11 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-md">
        <img src="/assets/logo-eci.png" alt="" className="w-9 h-9 object-contain" />
      </div>

      {/* Foto del jugador */}
      <div className="absolute inset-x-0 top-8 bottom-[100px] flex items-end justify-center">
        <img
          src={img}
          alt={nombre}
          draggable={false}
          className="max-h-full max-w-[85%] object-contain"
          style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))" }}
          onError={(e) => {
            const target = e.currentTarget
            if (target.src !== img) target.src = img
          }}
        />
      </div>

      {/* Info inferior */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 z-10">
        <div className="rounded-full bg-gradient-to-r from-teal-800/90 to-teal-500/80 backdrop-blur-sm px-4 py-2 text-center shadow-lg">
          <p className="text-white font-bold uppercase tracking-wide text-[15px] leading-tight">{nombre}</p>
        </div>
        <div className="rounded-full bg-gradient-to-r from-teal-800/80 to-teal-600/70 px-4 py-1.5 text-center">
          <p className="text-white/85 text-[12px]">{shortPos} · #{dorsal}</p>
        </div>
        <div className="rounded-full bg-gradient-to-r from-teal-800/70 to-teal-600/60 px-4 py-1 text-center">
          <p className="text-white/80 text-[11px]">⚽ {stats.goles} · 🅰 {stats.asistencias}</p>
        </div>
      </div>

      {/* Optional actions */}
      {actions && (
        <div className="absolute top-2 left-2 z-20">{actions}</div>
      )}
    </div>
  )
}
