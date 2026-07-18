"use client"

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FutPlayerCard, type FutPlayerStats } from "./FutPlayerCard"

/* ============================================================
   SoccerField3D — Cancha 3D con drag por pointer events
   ============================================================ */

interface FieldPlayer {
  id?: number
  name: string
  number: number
  posicion: string
  img: string
  x: number
  z: number
}

interface SoccerField3DProps {
  homePlayers: FieldPlayer[]
  awayPlayers: FieldPlayer[]
  homeColor?: string
  awayColor?: string
  stats?: FutPlayerStats
}

const defaultStats: FutPlayerStats = {
  goles: 3, asistencias: 2, partidos: 8,
  amarillas: 1, rojas: 0, faltas: 4,
}

export default function SoccerField3D({
  homePlayers: initialHome,
  awayPlayers: initialAway,
  homeColor = "#22C55E",
  awayColor = "#EF4444",
  stats = defaultStats,
}: SoccerField3DProps) {
  const FORMACIONES: Record<string, { x: number; z: number }[]> = {
    "3-2-1": [
      { x: 0, z: -250 }, { x: -140, z: -140 }, { x: 0, z: -160 }, { x: 140, z: -140 },
      { x: -80, z: -40 }, { x: 80, z: -40 },
      { x: 0, z: 80 },
    ],
    "2-3-1": [
      { x: 0, z: -250 }, { x: -100, z: -140 }, { x: 100, z: -140 },
      { x: -150, z: -40 }, { x: 0, z: -50 }, { x: 150, z: -40 },
      { x: 0, z: 80 },
    ],
    "3-1-2": [
      { x: 0, z: -250 }, { x: -140, z: -140 }, { x: 0, z: -160 }, { x: 140, z: -140 },
      { x: 0, z: -40 },
      { x: -70, z: 80 }, { x: 70, z: 80 },
    ],
    "2-2-2": [
      { x: 0, z: -250 }, { x: -100, z: -140 }, { x: 100, z: -140 },
      { x: -80, z: -40 }, { x: 80, z: -40 },
      { x: -70, z: 80 }, { x: 70, z: 80 },
    ],
  }

  const [home, setHome] = useState(true)
  const [selected, setSelected] = useState<FieldPlayer | null>(null)
  const [rotating, setRotating] = useState(false)
  const [formacion, setFormacion] = useState("3-2-1")
  const [players, setPlayers] = useState(initialHome.map((p, i) => ({
    ...p, x: FORMACIONES["3-2-1"][i]?.x ?? p.x, z: FORMACIONES["3-2-1"][i]?.z ?? p.z
  })))

  const activeColor = home ? homeColor : awayColor

  const switchSide = () => {
    if (rotating) return
    setRotating(true)
    setHome(!home)
    const next = !home ? initialHome : initialAway
    setPlayers(next.map((p, i) => ({
      ...p, x: FORMACIONES[formacion][i]?.x ?? p.x, z: FORMACIONES[formacion][i]?.z ?? p.z
    })))
    setTimeout(() => setRotating(false), 1400)
  }

  const applyFormacion = (name: string) => {
    setFormacion(name)
    setPlayers(prev => prev.map((p, i) => ({
      ...p, x: FORMACIONES[name][i]?.x ?? p.x, z: FORMACIONES[name][i]?.z ?? p.z
    })))
  }

  // ── Pointer Drag ──
  const dragRef = useRef<{ idx: number; startX: number; startY: number; origX: number; origZ: number } | null>(null)
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null)
  const worldRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    dragRef.current = { idx, startX: e.clientX, startY: e.clientY, origX: players[idx].x, origZ: players[idx].z }
    setGhostPos({ x: e.clientX, y: e.clientY })

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return
      setGhostPos({ x: ev.clientX, y: ev.clientY })
    }
    const onUp = (ev: PointerEvent) => {
      if (!dragRef.current) { dragRef.current = null; setGhostPos(null); return }
      const { idx: i, startX, startY, origX, origZ } = dragRef.current
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      // Mapear movimiento del mouse a coordenadas del campo
      const newX = Math.max(-240, Math.min(240, origX + dx * 0.8))
      const newZ = Math.max(-280, Math.min(200, origZ - dy * 0.8))
      const updated = [...players]
      updated[i] = { ...updated[i], x: newX, z: newZ }
      setPlayers(updated)
      dragRef.current = null
      setGhostPos(null)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }, [players])

  const draggingPlayer = ghostPos ? players[dragRef.current?.idx ?? -1] : null

  return (
    <GlassWrapper>
      <div className="flex gap-4" style={{ touchAction: "none" }}>
        <div className="flex-1 min-w-0">
          {/* Switcher + Formaciones */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-0">
              <button onClick={switchSide}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all rounded-lg border ${home ? "bg-white/20 text-white border-white/30" : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40"}`}>
                {home ? "LOCAL" : "VISITA"}
              </button>
            </div>
            <div className="flex items-center gap-1">
              {Object.keys(FORMACIONES).map((name) => (
                <button key={name} onClick={() => applyFormacion(name)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                    formacion === name
                      ? "bg-purple-mid text-white"
                      : "bg-white/5 text-text-muted border border-white/10 hover:bg-white/10"
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

        {/* Stage cancha — vista superior */}
        <div className="relative w-full overflow-hidden select-none rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
          style={{ height: "560px" }}>
          <div ref={worldRef} className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1a6b30 0%, #238b3e 30%, #2d9e4a 60%, #1f7a36 100%)' }}>
            
            {/* Líneas de la cancha */}
            <div className="absolute inset-0" style={{ 
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0px, transparent 49px, rgba(255,255,255,0.06) 49px, rgba(255,255,255,0.06) 50px),
                repeating-linear-gradient(0deg, transparent 0px, transparent 49px, rgba(255,255,255,0.06) 49px, rgba(255,255,255,0.06) 50px)
              `
            }}>
              <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full" style={{ zIndex: 4 }}>
                <rect x="24" y="28" width="552" height="644" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
                <line x1="24" y1="350" x2="576" y2="350" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
                <circle cx="300" cy="350" r="120" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
                <rect x="168" y="530" width="264" height="115" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" rx="4" />
                <rect x="222" y="550" width="156" height="60" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" rx="2" />
                <rect x="168" y="55" width="264" height="115" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" rx="4" />
                <rect x="222" y="90" width="156" height="60" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" rx="2" />
                <circle cx="300" cy="350" r="2" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>

            {/* Players — posicionados en el campo 2D */}
            {players.map((p, i) => {
              // Mapear coordenadas a píxeles (campo 600x700)
              const px = 300 + p.x
              const py = 350 - p.z
              return (
              <div key={i}
                className="absolute cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, i)}
                style={{
                  width: "52px", height: "52px", zIndex: 10,
                  left: `${px}px`, top: `${py}px`,
                  marginLeft: "-26px", marginTop: "-26px",
                  transition: ghostPos ? "none" : "all 0.3s ease",
                  opacity: dragRef.current?.idx === i ? 0.4 : 1,
                }}
                onClick={() => !ghostPos && setSelected(p)}
              >
                <div className="absolute inset-0 rounded-full blur-md opacity-40" style={{ backgroundColor: activeColor }} />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2"
                  style={{ borderColor: `${activeColor}dd`, boxShadow: "0 2px 10px rgba(0,0,0,.6)" }}>
                  <img src={p.img.replace("72", "150")} alt={p.name} className="w-full h-full object-cover"
                    onError={(e) => { const t = e.currentTarget; if (t.src !== p.img) t.src = p.img }} />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                  <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.8)] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    {p.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Ghost */}
      <AnimatePresence>
        {ghostPos && draggingPlayer && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="fixed pointer-events-none z-[100]" style={{ left: ghostPos.x - 28, top: ghostPos.y - 28, width: "56px", height: "56px" }}>
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gold shadow-2xl shadow-gold/50"
              style={{ borderColor: `${activeColor}dd` }}>
              <img src={draggingPlayer.img.replace("72", "150")} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal FUT card */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <FutPlayerCard nombre={selected.name} dorsal={selected.number} posicion={selected.posicion} img={selected.img} stats={stats} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </GlassWrapper>
  )
}

// ── Glass Wrapper matching login card style ──

function GlassWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden text-white bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
        <div
          className="absolute -inset-[100%] opacity-[0.04]"
          style={{
            background: "conic-gradient(transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.15), transparent)",
            transform: "rotate(258deg)",
          }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
          transform: "translateX(-78%)",
        }}
      />
      {children}
    </div>
  )
}
