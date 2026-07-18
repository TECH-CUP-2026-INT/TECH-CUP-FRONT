"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Users, RotateCcw } from "lucide-react"

/* ============================================================
   LineupBoard — cancha táctica arrastrable con banquillo
   El capitán (DT) arma la alineación arrastrando jugadores
   entre el banquillo y las posiciones de la cancha.
   ============================================================ */

export interface LineupPlayer {
  id: number
  nombre: string
  dorsal: number
  posicion: string
  img: string
}

interface Slot {
  role: "POR" | "DEF" | "VOL" | "DEL"
  x: number // % dentro de la cancha
  y: number // % dentro de la cancha
}

const FORMATIONS: Record<string, Slot[]> = {
  "4-4-2": [
    { role: "POR", x: 50, y: 91 },
    { role: "DEF", x: 15, y: 71 }, { role: "DEF", x: 38, y: 74 }, { role: "DEF", x: 62, y: 74 }, { role: "DEF", x: 85, y: 71 },
    { role: "VOL", x: 15, y: 47 }, { role: "VOL", x: 38, y: 50 }, { role: "VOL", x: 62, y: 50 }, { role: "VOL", x: 85, y: 47 },
    { role: "DEL", x: 36, y: 20 }, { role: "DEL", x: 64, y: 20 },
  ],
  "4-3-3": [
    { role: "POR", x: 50, y: 91 },
    { role: "DEF", x: 15, y: 71 }, { role: "DEF", x: 38, y: 74 }, { role: "DEF", x: 62, y: 74 }, { role: "DEF", x: 85, y: 71 },
    { role: "VOL", x: 30, y: 50 }, { role: "VOL", x: 50, y: 55 }, { role: "VOL", x: 70, y: 50 },
    { role: "DEL", x: 18, y: 20 }, { role: "DEL", x: 50, y: 15 }, { role: "DEL", x: 82, y: 20 },
  ],
  "3-5-2": [
    { role: "POR", x: 50, y: 91 },
    { role: "DEF", x: 26, y: 74 }, { role: "DEF", x: 50, y: 77 }, { role: "DEF", x: 74, y: 74 },
    { role: "VOL", x: 10, y: 50 }, { role: "VOL", x: 31, y: 44 }, { role: "VOL", x: 50, y: 50 }, { role: "VOL", x: 69, y: 44 }, { role: "VOL", x: 90, y: 50 },
    { role: "DEL", x: 36, y: 20 }, { role: "DEL", x: 64, y: 20 },
  ],
  "4-2-3-1": [
    { role: "POR", x: 50, y: 91 },
    { role: "DEF", x: 15, y: 71 }, { role: "DEF", x: 38, y: 74 }, { role: "DEF", x: 62, y: 74 }, { role: "DEF", x: 85, y: 71 },
    { role: "VOL", x: 36, y: 56 }, { role: "VOL", x: 64, y: 56 },
    { role: "VOL", x: 18, y: 34 }, { role: "VOL", x: 50, y: 30 }, { role: "VOL", x: 82, y: 34 },
    { role: "DEL", x: 50, y: 12 },
  ],
}

const ROLE_COLOR: Record<Slot["role"], string> = {
  POR: "#e9cc74",
  DEF: "#5B9CF0",
  VOL: "#4ADE80",
  DEL: "#F87171",
}

const POS_TO_ROLE: Record<string, Slot["role"]> = {
  Portero: "POR",
  Defensa: "DEF",
  Volante: "VOL",
  Delantero: "DEL",
}

type DragSource = { type: "slot"; index: number } | { type: "bench"; id: number }

function autoAssign(jugadores: LineupPlayer[], formation: Slot[]): (number | null)[] {
  const used = new Set<number>()
  const slots: (number | null)[] = formation.map(() => null)
  formation.forEach((slot, i) => {
    const match = jugadores.find(j => !used.has(j.id) && POS_TO_ROLE[j.posicion] === slot.role)
    if (match) { slots[i] = match.id; used.add(match.id) }
  })
  formation.forEach((_, i) => {
    if (slots[i] !== null) return
    const rest = jugadores.find(j => !used.has(j.id))
    if (rest) { slots[i] = rest.id; used.add(rest.id) }
  })
  return slots
}

export default function LineupBoard({
  jugadores,
  onSelectPlayer,
}: {
  jugadores: LineupPlayer[]
  onSelectPlayer?: (id: number) => void
}) {
  const [formation, setFormation] = useState("4-4-2")
  const [slots, setSlots] = useState<(number | null)[]>(() => autoAssign(jugadores, FORMATIONS["4-4-2"]))

  const byId = useMemo(() => new Map(jugadores.map(j => [j.id, j])), [jugadores])
  const bench = useMemo(() => jugadores.filter(j => !slots.includes(j.id)), [jugadores, slots])

  const changeFormation = (name: string) => {
    if (name === formation) return
    const current = FORMATIONS[formation]
    const target = FORMATIONS[name]
    // Conserva jugador por índice de slot cuando el conteo coincide con el rol más cercano
    setSlots(prev => {
      const next: (number | null)[] = target.map(() => null)
      const carried = new Set<number>()
      target.forEach((slot, i) => {
        // Prioriza mantener al jugador que ya ocupaba el mismo rol en la formación anterior
        const prevIdx = current.findIndex((s, pi) => s.role === slot.role && prev[pi] !== null && !carried.has(prev[pi] as number))
        if (prevIdx !== -1) { next[i] = prev[prevIdx]; carried.add(prev[prevIdx] as number) }
      })
      // Coloca los que sobraron en huecos libres
      const leftover = prev.filter((id): id is number => id !== null && !carried.has(id))
      let li = 0
      for (let i = 0; i < next.length && li < leftover.length; i++) {
        if (next[i] === null) { next[i] = leftover[li]; li++ }
      }
      return next
    })
    setFormation(name)
  }

  const resetAuto = () => setSlots(autoAssign(jugadores, FORMATIONS[formation]))

  // ── Drag & drop por puntero ──
  const slotRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const benchRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragSource | null>(null)
  const [ghost, setGhost] = useState<{ x: number; y: number; player: LineupPlayer } | null>(null)
  const [dragging, setDragging] = useState<DragSource | null>(null)
  const [hoverTarget, setHoverTarget] = useState<number | "bench" | null>(null)

  const findDropTarget = useCallback((clientX: number, clientY: number): number | "bench" | null => {
    for (const [idx, el] of slotRefs.current) {
      const r = el.getBoundingClientRect()
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return idx
    }
    if (benchRef.current) {
      const r = benchRef.current.getBoundingClientRect()
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return "bench"
    }
    return null
  }, [])

  const startDrag = useCallback((e: React.PointerEvent, source: DragSource, player: LineupPlayer) => {
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    dragRef.current = source
    setDragging(source)
    setGhost({ x: e.clientX, y: e.clientY, player })

    const onMove = (ev: PointerEvent) => {
      setGhost(g => (g ? { ...g, x: ev.clientX, y: ev.clientY } : g))
      setHoverTarget(findDropTarget(ev.clientX, ev.clientY))
    }
    const onUp = (ev: PointerEvent) => {
      const src = dragRef.current
      const target = findDropTarget(ev.clientX, ev.clientY)
      if (src && target !== null) {
        setSlots(prev => {
          const next = [...prev]
          if (src.type === "slot" && typeof target === "number") {
            const tmp = next[target]
            next[target] = next[src.index]
            next[src.index] = tmp
          } else if (src.type === "slot" && target === "bench") {
            next[src.index] = null
          } else if (src.type === "bench" && typeof target === "number") {
            const prevOccupant = next[target]
            next[target] = src.id
            if (prevOccupant !== null) {
              const freeIdx = next.findIndex((v, i) => v === null && i !== target)
              if (freeIdx !== -1) next[freeIdx] = prevOccupant
            }
          }
          return next
        })
      }
      dragRef.current = null
      setDragging(null)
      setGhost(null)
      setHoverTarget(null)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }, [findDropTarget])

  const slotList = FORMATIONS[formation]

  return (
    <div className="relative overflow-hidden text-white bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-4" style={{ touchAction: "none" }}>
      {/* Controles */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {Object.keys(FORMATIONS).map(name => (
            <button key={name} onClick={() => changeFormation(name)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                formation === name ? "bg-purple-mid text-white" : "bg-white/5 text-text-muted border border-white/10 hover:bg-white/10"
              }`}>
              {name}
            </button>
          ))}
        </div>
        <button onClick={resetAuto} className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 hover:text-white transition-all">
          <RotateCcw size={11} /> Auto-alinear
        </button>
      </div>

      <div className="flex gap-4 max-lg:flex-col">
        {/* Cancha */}
        <div className="relative flex-1 min-w-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50" style={{ aspectRatio: "0.72", maxWidth: "460px", margin: "0 auto" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #1a6b30 0%, #238b3e 35%, #2d9e4a 65%, #1f7a36 100%)" }}>
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 11%, rgba(255,255,255,0.045) 11%, rgba(255,255,255,0.045) 22%)`,
            }} />
            <svg viewBox="0 0 300 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <rect x="10" y="10" width="280" height="400" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <line x1="10" y1="210" x2="290" y2="210" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <circle cx="150" cy="210" r="45" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <circle cx="150" cy="210" r="2" fill="rgba(255,255,255,0.5)" />
              {/* área propia (abajo, portero) */}
              <rect x="75" y="340" width="150" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <rect x="105" y="378" width="90" height="32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <path d="M 125 340 A 25 25 0 0 1 175 340" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              {/* área rival (arriba) */}
              <rect x="75" y="10" width="150" height="70" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              <rect x="105" y="10" width="90" height="32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <path d="M 125 80 A 25 25 0 0 0 175 80" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            </svg>

            {slotList.map((slot, i) => {
              const playerId = slots[i]
              const player = playerId !== null ? byId.get(playerId) : undefined
              const isHover = hoverTarget === i
              const isDraggingThis = dragging?.type === "slot" && dragging.index === i
              return (
                <div
                  key={i}
                  ref={el => { if (el) slotRefs.current.set(i, el); else slotRefs.current.delete(i) }}
                  className="absolute"
                  style={{
                    left: `${slot.x}%`, top: `${slot.y}%`, width: "15%", aspectRatio: "1",
                    transform: "translate(-50%, -50%)", zIndex: isDraggingThis ? 1 : 10,
                  }}
                >
                  {player ? (
                    <div
                      onPointerDown={e => startDrag(e, { type: "slot", index: i }, player)}
                      onClick={() => !ghost && onSelectPlayer?.(player.id)}
                      className="relative w-full h-full cursor-grab active:cursor-grabbing"
                      style={{ opacity: isDraggingThis ? 0.35 : 1 }}
                    >
                      <div className={`absolute inset-0 rounded-full blur-md transition-opacity ${isHover ? "opacity-70" : "opacity-40"}`} style={{ backgroundColor: ROLE_COLOR[slot.role] }} />
                      <div className={`relative w-full h-full rounded-full overflow-hidden border-2 transition-transform ${isHover ? "scale-110" : ""}`}
                        style={{ borderColor: `${ROLE_COLOR[slot.role]}dd`, boxShadow: "0 2px 10px rgba(0,0,0,.6)" }}>
                        <img src={player.img.replace("72", "150")} alt={player.nombre} className="w-full h-full object-cover" draggable={false} />
                      </div>
                      <span className="absolute -top-1 -right-1 text-[8px] font-bold text-black rounded-full w-4 h-4 flex items-center justify-center border border-black/20" style={{ backgroundColor: ROLE_COLOR[slot.role] }}>
                        {player.dorsal}
                      </span>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                        <span className="text-[8px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.8)] bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
                          {player.nombre.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-full rounded-full border-2 border-dashed flex items-center justify-center transition-all ${isHover ? "border-gold bg-gold/20 scale-110" : "border-white/25 bg-black/10"}`}>
                      <span className="text-[8px] font-bold text-white/50">{slot.role}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Banquillo */}
        <div
          ref={benchRef}
          className={`lg:w-[190px] flex-shrink-0 rounded-2xl border p-3 transition-colors ${hoverTarget === "bench" ? "border-gold bg-gold/10" : "border-white/10 bg-black/20"}`}
        >
          <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
            <Users size={12} /> Banquillo <span className="text-white/30">({bench.length})</span>
          </h4>
          <div className="flex lg:flex-col gap-2 flex-wrap">
            {bench.map(p => {
              const role = POS_TO_ROLE[p.posicion] ?? "VOL"
              const isDraggingThis = dragging?.type === "bench" && dragging.id === p.id
              return (
                <div
                  key={p.id}
                  onPointerDown={e => startDrag(e, { type: "bench", id: p.id }, p)}
                  onClick={() => !ghost && onSelectPlayer?.(p.id)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 cursor-grab active:cursor-grabbing transition-all"
                  style={{ opacity: isDraggingThis ? 0.35 : 1 }}
                >
                  <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border" style={{ borderColor: `${ROLE_COLOR[role]}aa` }}>
                    <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold truncate">{p.nombre}</p>
                    <p className="text-[9px] text-text-muted">#{p.dorsal} · {p.posicion}</p>
                  </div>
                </div>
              )
            })}
            {bench.length === 0 && (
              <p className="text-[10px] text-text-faint text-center py-4 w-full">Todo el plantel está en cancha</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-text-faint mt-3">Arrastrá a los jugadores entre la cancha y el banquillo para armar tu alineación</p>

      {/* Ghost siguiendo el puntero */}
      <AnimatePresence>
        {ghost && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="fixed pointer-events-none z-[100]" style={{ left: ghost.x - 24, top: ghost.y - 24, width: "48px", height: "48px" }}>
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gold shadow-2xl shadow-gold/50">
              <img src={ghost.player.img.replace("72", "150")} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
