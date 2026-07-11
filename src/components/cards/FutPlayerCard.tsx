"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ============================================================
   FutPlayerCard — réplica fiel del diseño FIFA Ultimate Team
   Basado exactamente en: https://codepen.io/selimdoyranli/pen/qvNEzv
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

// ── Constantes TechCup ───────────────────────────────────

const GOLD = "#e9cc74"
const PURPLE = "#6D28D9"
const CARD_BG = "https://selimdoyranli.com/cdn/fut-player-card/img/card_bg.png"

const POS_MAP: Record<string, string> = {
  Portero: "POR",
  Defensa: "DEF",
  Volante: "VOL",
  Delantero: "DEL",
}

// ── Helpers ──────────────────────────────────────────────

function computeRating(s: FutPlayerStats): number {
  let r = 50
  r += Math.min(s.goles * 5, 25)
  r += Math.min(s.asistencias * 5, 15)
  r += Math.min(s.partidos * 2, 10)
  r -= Math.min(s.amarillas * 2 + s.rojas * 5, 15)
  return Math.max(40, Math.min(99, r))
}

function stat99(value: number, maxRef: number): number {
  if (maxRef <= 0) return 40
  return Math.min(99, Math.max(30, Math.round((value / maxRef) * 99)))
}

// ── Componente principal ─────────────────────────────────

export function FutPlayerCard({
  nombre,
  dorsal,
  posicion,
  img,
  stats,
  className,
  onClick,
  actions,
  teamName = "TC",
}: FutPlayerCardProps) {
  const shortPos = POS_MAP[posicion] || posicion.substring(0, 3).toUpperCase()
  const rating = computeRating(stats)
  const firstName = nombre.split(" ")[0]
  const lastName = nombre.split(" ").slice(1).join(" ")

  // Stats normalizados 0-99
  const maxVals = { goles: 8, asistencias: 6, partidos: 10, amarillas: 4, rojas: 2, faltas: 8 }
  const s = {
    gol: stat99(stats.goles, maxVals.goles),
    asi: stat99(stats.asistencias, maxVals.asistencias),
    par: stat99(stats.partidos, maxVals.partidos),
    ama: 99 - stat99(stats.amarillas, maxVals.amarillas),
    roj: 99 - stat99(stats.rojas, maxVals.rojas),
    fal: 99 - stat99(stats.faltas, maxVals.faltas),
  }

  return (
    <div
      className={cn(
        "fut-player-card",
        "relative w-[300px] h-[485px] select-none shrink-0",
        "transition-[200ms_ease-in] hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{
        backgroundImage: `url(${CARD_BG})`,
        backgroundPosition: "center center",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        padding: "3.8rem 0",
      }}
    >
      {/* ── PLAYER CARD TOP ── */}
      <div
        className="player-card-top relative flex"
        style={{ color: GOLD, padding: "0 1.5rem" }}
      >
        {/* Player Master Info */}
        <div
          className="player-master-info"
          style={{
            position: "absolute",
            lineHeight: "2.2rem",
            fontWeight: 300,
            padding: "1.5rem 0",
            textTransform: "uppercase",
          }}
        >
          <div className="player-rating" style={{ fontSize: "2rem", color: GOLD }}>
            <span>{rating}</span>
          </div>
          <div className="player-position" style={{ fontSize: "1.4rem", color: PURPLE }}>
            <span>{shortPos}</span>
          </div>
          {/* Nation = dorsal */}
          <span className="player-nation" style={{ display: "block", width: "2rem", height: "25px", margin: "0.3rem 0" }}>
            <span
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: PURPLE,
                border: `1px solid ${GOLD}60`,
                borderRadius: "3px",
                fontSize: "10px",
                fontWeight: 900,
                color: GOLD,
              }}
            >
              #{dorsal}
            </span>
          </span>
          {/* Club badge */}
          <span className="player-club" style={{ display: "block", width: "2.1rem", height: "40px" }}>
            <span
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: PURPLE,
                border: `1px solid ${GOLD}60`,
                borderRadius: "3px",
                fontSize: "8px",
                fontWeight: 900,
                color: GOLD,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              TC
            </span>
          </span>
        </div>

        {/* Player Picture */}
        <div
          className="player-picture"
          style={{
            width: "200px",
            height: "200px",
            margin: "0 auto",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={img.replace("72", "200")}
            alt={nombre}
            draggable="false"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "relative",
              right: "-1.5rem",
              bottom: 0,
            }}
            onError={(e) => {
              const target = e.currentTarget
              if (target.src !== img) {
                target.src = img
              }
            }}
          />
          {/* Player extra tags */}
          <div
            className="player-extra"
            style={{
              position: "absolute",
              right: 0,
              bottom: "-0.5rem",
              overflow: "hidden",
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              width: "100%",
              height: "2rem",
              padding: "0 1.5rem",
              textAlign: "right",
              background: "none",
            }}
          >
            <span style={{ marginLeft: "0.6rem", textShadow: "2px 2px #333", color: PURPLE }}>
              ⚽ {stats.goles}
            </span>
            <span style={{ marginLeft: "0.6rem", textShadow: "2px 2px #333", color: PURPLE }}>
              🅰 {stats.asistencias}
            </span>
          </div>
        </div>
      </div>

      {/* ── PLAYER CARD BOTTOM ── */}
      <div className="player-card-bottom" style={{ position: "relative" }}>
        <div
          className="player-info"
          style={{
            display: "block",
            padding: "0.3rem 0",
            color: GOLD,
            width: "90%",
            margin: "0 auto",
            height: "auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Player Name */}
          <div
            className="player-name"
            style={{
              width: "100%",
              display: "block",
              textAlign: "center",
              fontSize: "1.6rem",
              textTransform: "uppercase",
              borderBottom: `2px solid ${GOLD}1A`,
              paddingBottom: "0.3rem",
              overflow: "hidden",
            }}
          >
            <span style={{ display: "block", textShadow: "2px 2px #111" }}>
              {firstName}
            </span>
            {lastName && (
              <span
                style={{
                  display: "block",
                  textShadow: "2px 2px #111",
                  fontSize: "1.3rem",
                  marginTop: "-2px",
                }}
              >
                {lastName}
              </span>
            )}
          </div>

          {/* Player Features */}
          <div
            className="player-features"
            style={{
              margin: "0.5rem auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Col 1: GOL / PAR / AMA */}
            <div
              className="player-features-col"
              style={{
                borderRight: `2px solid ${GOLD}1A`,
                padding: "0 2rem",
              }}
            >
              <StatRow value={s.gol} label="GOL" />
              <StatRow value={s.par} label="PAR" />
              <StatRow value={s.ama} label="AMA" />
            </div>

            {/* Col 2: ASI / ROJ / FAL */}
            <div
              className="player-features-col"
              style={{ padding: "0 2rem", border: 0 }}
            >
              <StatRow value={s.asi} label="ASI" />
              <StatRow value={s.roj} label="ROJ" />
              <StatRow value={s.fal} label="FAL" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Optional actions ── */}
      {actions && (
        <div className="absolute top-2 right-2 z-20">{actions}</div>
      )}
    </div>
  )
}

// ── Sub-component: stat row ──

function StatRow({ value, label }: { value: number; label: string }) {
  return (
    <span
      style={{
        display: "flex",
        fontSize: "1.2rem",
        textTransform: "uppercase",
      }}
    >
      <span
        className="player-feature-value"
        style={{ marginRight: "0.3rem", fontWeight: 700, color: PURPLE }}
      >
        {value}
      </span>
      <span
        className="player-feature-title"
        style={{ fontWeight: 300, color: GOLD }}
      >
        {label}
      </span>
    </span>
  )
}
