"use client"

import { useState, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FutPlayerCard, type FutPlayerStats } from "./FutPlayerCard"

/* ============================================================
   SoccerField3D — Cancha 3D con drag & drop
   Basado en: https://codepen.io/dstnation/pen/VLagoL
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
  onSwap?: (players: FieldPlayer[]) => void
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
  onSwap,
}: SoccerField3DProps) {
  const [home, setHome] = useState(true)
  const [selected, setSelected] = useState<FieldPlayer | null>(null)
  const [rotating, setRotating] = useState(false)
  const [homePlayers, setHomePlayers] = useState(initialHome)
  const [awayPlayers, setAwayPlayers] = useState(initialAway)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const activePlayers = home ? homePlayers : awayPlayers
  const setActivePlayers = home ? setHomePlayers : setAwayPlayers
  const activeColor = home ? homeColor : awayColor

  const switchSide = () => {
    if (rotating) return
    setRotating(true)
    setHome(!home)
    setTimeout(() => setRotating(false), 1400)
  }

  // ── Drag & Drop handlers ──
  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setDragOverIdx(idx)
  }, [])

  const handleDrop = useCallback((idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null)
      setDragOverIdx(null)
      return
    }
    const updated = [...activePlayers]
    const temp = updated[dragIdx]
    updated[dragIdx] = { ...updated[idx], x: updated[dragIdx].x, z: updated[dragIdx].z }
    updated[idx] = { ...temp, x: updated[idx].x, z: updated[idx].z }
    // swap positions
    const tx = updated[dragIdx].x
    const tz = updated[dragIdx].z
    updated[dragIdx] = { ...updated[dragIdx], x: updated[idx].x, z: updated[idx].z }
    updated[idx] = { ...updated[idx], x: tx, z: tz }

    setActivePlayers(updated)
    setDragIdx(null)
    setDragOverIdx(null)
    onSwap?.(updated)
  }, [dragIdx, activePlayers, setActivePlayers, onSwap])

  const handleDragEnd = useCallback(() => {
    setDragIdx(null)
    setDragOverIdx(null)
  }, [])

  return (
    <>
      {/* ── Switcher ── */}
      <div className="flex items-center justify-center gap-0 mb-2">
        <button
          onClick={() => { if (!home) switchSide() }}
          disabled={home || rotating}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-l-lg border ${
            home
              ? "bg-white/20 text-white border-white/30 cursor-default"
              : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40 cursor-pointer"
          }`}
        >
          LOCAL
        </button>
        <button
          onClick={() => { if (home) switchSide() }}
          disabled={!home || rotating}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-r-lg border-l-0 ${
            !home
              ? "bg-white/20 text-white border-white/30 cursor-default"
              : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/40 cursor-pointer"
          }`}
        >
          VISITA
        </button>
      </div>

      <p className="text-center text-[10px] text-text-muted mb-3">Arrastrá los jugadores para intercambiar posiciones</p>

      {/* ── Stage 3D ── */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% -200px",
          height: "520px",
        }}
      >
        <div
          className="absolute left-1/2"
          style={{
            width: "600px",
            height: "700px",
            marginLeft: "-300px",
            top: "20px",
            transformStyle: "preserve-3d",
            transition: "transform 1.2s ease-in-out",
            transform: home
              ? "translateZ(-200px)"
              : "translateZ(-200px) rotateY(180deg)",
          }}
        >
          {/* ── Campo ── */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(90deg) translateZ(0)",
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute" style={{ width: "80%", left: "10%", height: "100%", background: "rgba(0,0,0,0.3)", transform: "rotateX(90deg) translateZ(-10px)", boxShadow: "0 0 40px 30px #000" }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.2), transparent), repeating-linear-gradient(65deg, #2a7a35 0px, #2a7a35 25px, #328c3e 25px, #328c3e 50px)` }} />
            <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full" style={{ zIndex: 4 }}>
              <filter id="g3d"><feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="white" floodOpacity="0.15" /></filter>
              <rect x="24" y="28" width="552" height="644" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" filter="url(#g3d)" />
              <line x1="24" y1="350" x2="576" y2="350" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
              <circle cx="300" cy="350" r="120" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
              <rect x="168" y="530" width="264" height="115" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" rx="4" />
              <rect x="222" y="550" width="156" height="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" rx="2" />
              <rect x="168" y="55" width="264" height="115" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" rx="4" />
              <rect x="222" y="90" width="156" height="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" rx="2" />
              <circle cx="300" cy="145" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="300" cy="555" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="300" cy="350" r="2" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>

          {/* ── Jugadores (drag & drop) ── */}
          {activePlayers.map((p, i) => {
            const isDragging = dragIdx === i
            const isOver = dragOverIdx === i && dragIdx !== null && dragIdx !== i
            return (
              <div
                key={i}
                className="absolute cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
                style={{
                  width: "56px",
                  height: "56px",
                  zIndex: isDragging ? 20 : 10,
                  left: "50%",
                  bottom: "50%",
                  marginLeft: "-28px",
                  transform: `translateX(${p.x}px) translateZ(${p.z}px)`,
                  transformStyle: "preserve-3d",
                  transition: isDragging ? "none" : "all 0.3s ease",
                  opacity: isDragging ? 0.6 : 1,
                }}
                onClick={() => !dragIdx && setSelected(p)}
              >
                {/* Indicador hover drop */}
                {isOver && (
                  <div className="absolute inset-0 rounded-full bg-white/20 border-2 border-dashed border-white/50 z-20 scale-110" />
                )}
                {/* Glow */}
                <div className="absolute inset-0 rounded-full blur-md opacity-50" style={{ backgroundColor: activeColor }} />
                {/* Avatar */}
                <div
                  className="relative w-full h-full rounded-full overflow-hidden border-2"
                  style={{ borderColor: `${activeColor}dd`, boxShadow: "0 2px 12px rgba(0,0,0,.6)" }}
                >
                  <img
                    src={p.img.replace("72", "150")}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { const t = e.currentTarget; if (t.src !== p.img) t.src = p.img }}
                  />
                </div>
                {/* Nombre */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                  <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.8)] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    {p.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            )
          })}

          {/* ── Borde 3D ── */}
          <div className="absolute" style={{ top: "50%", left: 0, width: "100%", height: "8px", transform: "rotateX(180deg) translateZ(-350px)", transformOrigin: "50% 50%", background: "#141d2b", zIndex: 9 }} />
        </div>
      </div>

      {/* ── Modal FUT card ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FutPlayerCard
                nombre={selected.name}
                dorsal={selected.number}
                posicion={selected.posicion}
                img={selected.img}
                stats={stats}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
