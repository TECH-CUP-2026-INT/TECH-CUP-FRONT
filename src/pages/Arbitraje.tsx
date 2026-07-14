import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button } from '@/components/common/button'

type Evento = { min: string; icon: string; desc: string; equipo: string }
type Accion = 'golA' | 'golB' | 'amarilla' | 'roja' | 'sust' | null

const jugadores = {
  A: [
    { nombre: 'Juan Pérez', dorsal: 10, pos: 'DEL' },
    { nombre: 'Pedro Gómez', dorsal: 7, pos: 'VOL' },
    { nombre: 'Luis Torres', dorsal: 1, pos: 'POR' },
    { nombre: 'Ana Ruiz', dorsal: 5, pos: 'DEF' },
    { nombre: 'Carlos Marín', dorsal: 8, pos: 'VOL' },
  ],
  B: [
    { nombre: 'Sofía López', dorsal: 9, pos: 'DEL' },
    { nombre: 'Miguel Ángel', dorsal: 6, pos: 'VOL' },
    { nombre: 'Daniela Cruz', dorsal: 12, pos: 'POR' },
    { nombre: 'Felipe Rojas', dorsal: 4, pos: 'DEF' },
    { nombre: 'Camila Ríos', dorsal: 11, pos: 'DEL' },
  ],
}

export default function Arbitraje() {
  const [segundos, setSegundos] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const [golA, setGolA] = useState(0)
  const [golB, setGolB] = useState(0)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [finalizado, setFinalizado] = useState(false)
  const [flash, setFlash] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [equipoSel, setEquipoSel] = useState<'A' | 'B'>('A')
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [step, setStep] = useState<'player' | 'action'>('player')
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (corriendo) {
      intervalRef.current = setInterval(() => setSegundos(s => s + 1), 1000)
    } else if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current !== undefined) clearInterval(intervalRef.current) }
  }, [corriendo])

  const addEvent = useCallback((icon: string, desc: string, equipo: string) => {
    const min = Math.floor(segundos / 60) + "'"
    setEventos(prev => [{ min, icon, desc, equipo }, ...prev])
    setFlash(icon)
    setTimeout(() => setFlash(''), 600)
  }, [segundos])

  const handleAccion = (tipo: string) => {
    const equipo = equipoSel === 'A' ? 'Tigres FC' : 'Sistemas FC'
    const jug = jugadores[equipoSel].find(j => j.nombre === selectedPlayer)
    const jugText = jug ? ` · ${jug.nombre} #${jug.dorsal}` : ''

    if (tipo === 'gol') { 
      const eq = equipoSel === 'A' ? 'golA' : 'golB'
      if (eq === 'golA') setGolA(g => g + 1); else setGolB(g => g + 1)
      addEvent('⚽', `Gol ${equipo}${jugText}`, equipo)
    } else if (tipo === 'amarilla') addEvent('🟨', `Amarilla ${equipo}${jugText}`, equipo)
    else if (tipo === 'roja') addEvent('🟥', `Roja ${equipo}${jugText}`, equipo)
    else if (tipo === 'sust') addEvent('🔄', `Sustitución ${equipo}${jugText}`, equipo)

    setShowModal(false); setSelectedPlayer(null); setStep('player')
  }

  const selectTeam = (eq: 'A' | 'B') => {
    setEquipoSel(eq)
    setSelectedPlayer(null)
    setStep('player')
    setShowModal(true)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const reset = () => {
    setCorriendo(false); setSegundos(0); setGolA(0); setGolB(0); setEventos([]); setFinalizado(false)
  }

  return (
    <DashboardLayout title="Arbitraje en vivo">
      <div className="flex flex-col min-h-full">

        {/* Scoreboard */}
        <div className="bg-gradient-to-b from-purple-black to-black border-b border-gold/20 py-4 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center w-[120px]">
                <div className="w-14 h-14 rounded-xl bg-surface border-2 border-green-500/40 flex items-center justify-center text-2xl font-black text-green-400">T</div>
                <span className="text-[10px] uppercase tracking-[2px] text-text-muted font-semibold mt-1">Tigres FC</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-6xl font-bold tabular-nums">{golA}</span>
                <span className="font-[family-name:var(--font-display)] text-xl text-gold">VS</span>
                <span className="font-[family-name:var(--font-display)] text-6xl font-bold tabular-nums">{golB}</span>
              </div>
              <div className="flex flex-col items-center w-[120px]">
                <div className="w-14 h-14 rounded-xl bg-surface border-2 border-purple-mid/40 flex items-center justify-center text-2xl font-black text-purple-mid">S</div>
                <span className="text-[10px] uppercase tracking-[2px] text-text-muted font-semibold mt-1">Sistemas FC</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-4">
                <span className={`font-mono text-2xl font-bold tabular-nums ${corriendo ? 'text-green-400' : 'text-gold'}`}>{formatTime(segundos)}</span>
                {finalizado ? (
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">⏹️ FINALIZADO</span>
                ) : corriendo ? (
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> EN VIVO</span>
                ) : (
                  <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">⏸️ PAUSADO</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Flash overlay */}
        <AnimatePresence>{flash && (
          <motion.div key={flash} initial={{ opacity: 0.8, scale: 1.5 }} animate={{ opacity: 0, scale: 2 }} exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center text-8xl">{flash === '⚽' ? '⚽' : flash === '🟨' ? '🟨' : flash === '🟥' ? '🟥' : '🔄'}</motion.div>
        )}</AnimatePresence>

        {/* Alineación visual: ambos equipos con sus jugadores */}
        <div className="flex-1 p-4 max-w-4xl mx-auto w-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Tigres FC */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-sm font-black text-white">T</div>
                <div>
                  <p className="text-sm font-bold text-green-400">Tigres FC</p>
                  <p className="text-[10px] text-text-muted">0 goles</p>
                </div>
              </div>
              <div className="space-y-2">
                {jugadores.A.map((j, i) => (
                  <button key={j.nombre} onClick={() => { selectTeam('A'); setSelectedPlayer(j.nombre); setStep('action') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-green-950/20 border border-green-500/20 hover:border-green-400/50 hover:bg-green-900/30 active:scale-[0.97] transition-all group">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-green-500/30 flex-shrink-0">
                      <img src={`https://i.pravatar.cc/72?img=${i + 30}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors truncate">{j.nombre}</p>
                      <p className="text-[10px] text-text-muted">#{j.dorsal} · {j.pos}</p>
                    </div>
                    <span className="text-green-500/30 group-hover:text-green-400/60 transition-colors text-xs">⚽</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sistemas FC */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-black text-white">S</div>
                <div>
                  <p className="text-sm font-bold text-purple-400">Sistemas FC</p>
                  <p className="text-[10px] text-text-muted">0 goles</p>
                </div>
              </div>
              <div className="space-y-2">
                {jugadores.B.map((j, i) => (
                  <button key={j.nombre} onClick={() => { selectTeam('B'); setSelectedPlayer(j.nombre); setStep('action') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-900/30 active:scale-[0.97] transition-all group">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-500/30 flex-shrink-0">
                      <img src={`https://i.pravatar.cc/72?img=${i + 40}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate">{j.nombre}</p>
                      <p className="text-[10px] text-text-muted">#{j.dorsal} · {j.pos}</p>
                    </div>
                    <span className="text-purple-500/30 group-hover:text-purple-400/60 transition-colors text-xs">⚽</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button onClick={() => setCorriendo(!corriendo)}
              className={`h-12 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 ${corriendo ? 'bg-gold/20 border-2 border-gold/40 text-gold' : 'bg-green-600/20 border-2 border-green-500/40 text-green-400'}`}>
              {corriendo ? <><span className="text-xl">⏸️</span> PAUSAR</> : <><span className="text-xl">▶️</span> REANUDAR</>}
            </button>
            <button onClick={() => { setCorriendo(false); setFinalizado(true) }}
              className="h-12 rounded-xl bg-red-600/20 border-2 border-red-500/40 text-red-300 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="text-xl">⏹️</span> FINALIZAR
            </button>
          </div>

          {/* Eventos */}
          <div className="bg-surface/50 border border-border/60 rounded-xl p-3">
            <h3 className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[.3px] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> EVENTOS
            </h3>
            <div className="space-y-1 max-h-[180px] overflow-y-auto">
              {eventos.length === 0 && <p className="text-xs text-text-muted text-center py-3">No hay eventos</p>}
              {eventos.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-mono text-gold font-bold min-w-[24px]">{e.min}</span>
                  <span>{e.icon}</span>
                  <span className="text-gray-light truncate">{e.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {finalizado && (
            <button onClick={reset} className="w-full mt-3 h-11 rounded-xl bg-gold text-[#1A1206] font-bold text-sm active:scale-95 transition-all">
              🔄 NUEVO PARTIDO
            </button>
          )}
        </div>
      </div>

      {/* Modal flotante: elegir jugador → elegir acción */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => { setShowModal(false); setStep('player'); setSelectedPlayer(null) }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gradient-to-br from-purple-deep2 to-purple-black border border-gold/30 rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-purple-900/40"
              onClick={e => e.stopPropagation()}>

              {/* Step 1: Seleccionar jugador */}
              {step === 'player' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-display)] text-lg uppercase text-white">Elegí un <span className="text-gold">jugador</span></h3>
                    <span className="text-xs text-gold/60 bg-gold/10 px-3 py-1 rounded-full">{equipoSel === 'A' ? 'Tigres FC' : 'Sistemas FC'}</span>
                  </div>
                  <div className="space-y-2 mb-4 max-h-[320px] overflow-y-auto">
                    {jugadores[equipoSel].map((j, i) => (
                      <button key={j.nombre} onClick={() => { setSelectedPlayer(j.nombre); setStep('action') }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          selectedPlayer === j.nombre ? 'bg-purple-mid/30 border border-purple-mid/50 text-white' : 'bg-white/5 border border-transparent text-gray-light hover:bg-white/10 hover:border-gold/30'
                        }`}>
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/30 flex-shrink-0">
                          <img src={`https://i.pravatar.cc/72?img=${i + 10}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold text-white">{j.nombre}</p>
                          <p className="text-[10px] text-text-muted uppercase">#{j.dorsal} · {j.pos}</p>
                        </div>
                        <span className="text-gold/40 text-xs">→</span>
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" onClick={() => { setShowModal(false); setSelectedPlayer(null) }}
                    className="w-full rounded-full border-gold/30 text-gold hover:bg-gold/10 h-11 text-sm">Cancelar</Button>
                </>
              )}

              {/* Step 2: Elegir acción */}
              {step === 'action' && selectedPlayer && (
                <>
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-gold/40 mb-2">
                      <img src={`https://i.pravatar.cc/100?img=${jugadores[equipoSel].findIndex(j => j.nombre === selectedPlayer) + 10}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white font-bold">{selectedPlayer}</p>
                    <p className="text-xs text-text-muted">#{jugadores[equipoSel].find(j => j.nombre === selectedPlayer)?.dorsal} · {equipoSel === 'A' ? 'Tigres FC' : 'Sistemas FC'}</p>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-base uppercase text-center text-white mb-4">¿Qué <span className="text-gold">acción</span>?</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button onClick={() => handleAccion('gol')} className="h-16 rounded-xl bg-gradient-to-br from-green-600 to-green-800 border-2 border-green-500/40 text-white font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-green-900/30">
                      <span className="text-2xl">⚽</span> Gol
                    </button>
                    <button onClick={() => handleAccion('amarilla')} className="h-16 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-800 border-2 border-yellow-500/40 text-yellow-200 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-yellow-900/30">
                      <span className="text-2xl">🟨</span> Amarilla
                    </button>
                    <button onClick={() => handleAccion('roja')} className="h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-500/40 text-red-200 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-red-900/30">
                      <span className="text-2xl">🟥</span> Roja
                    </button>
                    <button onClick={() => handleAccion('sust')} className="h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-500/40 text-blue-200 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-blue-900/30">
                      <span className="text-2xl">🔄</span> Sustitución
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('player')} className="flex-1 rounded-full border-gold/30 text-gold hover:bg-gold/10 h-10 text-xs">← Cambiar jugador</Button>
                    <Button variant="outline" onClick={() => { setShowModal(false); setSelectedPlayer(null); setStep('player') }} className="flex-1 rounded-full border-border text-gray-light hover:bg-white/5 h-10 text-xs">Cancelar</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
