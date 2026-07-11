import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import { Button } from '@/components/ui/button'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const [golA, setGolA] = useState(0)
  const [golB, setGolB] = useState(0)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [finalizado, setFinalizado] = useState(false)
  const [flash, setFlash] = useState('')
  const [modalAccion, setModalAccion] = useState<Accion>(null)
  const [equipoSel, setEquipoSel] = useState<'A' | 'B'>('A')
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
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

  const handleAccion = (accion: Accion) => {
    if (!accion) return
    const nombres: Record<string, string> = { golA: 'Gol', golB: 'Gol', amarilla: '🟨 Amarilla', roja: '🟥 Roja', sust: '🔄 Sustitución' }
    const equipo = equipoSel === 'A' ? 'Tigres FC' : 'Sistemas FC'
    const jug = jugadores[equipoSel].find(j => j.nombre === selectedPlayer)
    const jugText = jug ? ` · ${jug.nombre} #${jug.dorsal}` : ''

    if (accion === 'golA') { setGolA(g => g + 1); addEvent('⚽', `Gol ${equipo}${jugText}`, equipo) }
    else if (accion === 'golB') { setGolB(g => g + 1); addEvent('⚽', `Gol ${equipo}${jugText}`, equipo) }
    else if (accion === 'amarilla') addEvent('🟨', `Amarilla ${equipo}${jugText}`, equipo)
    else if (accion === 'roja') addEvent('🟥', `Roja ${equipo}${jugText}`, equipo)
    else if (accion === 'sust') addEvent('🔄', `Sustitución ${equipo}${jugText}`, equipo)

    setModalAccion(null); setSelectedPlayer(null)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const reset = () => {
    setCorriendo(false); setSegundos(0); setGolA(0); setGolB(0); setEventos([]); setFinalizado(false)
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1 flex flex-col">
        <AppTopbar title="Arbitraje en vivo" onMenuClick={() => setSidebarOpen(true)} />

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

        {/* Botones */}
        <div className="flex-1 p-4 max-w-3xl mx-auto w-full overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => { setEquipoSel('A'); setModalAccion('golA') }}
              className="h-16 rounded-xl bg-gradient-to-b from-green-600 to-green-800 text-white font-bold text-base border-2 border-green-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="text-2xl">⚽</span> GOL TIGRES
            </button>
            <button onClick={() => { setEquipoSel('B'); setModalAccion('golB') }}
              className="h-16 rounded-xl bg-gradient-to-b from-purple-600 to-purple-800 text-white font-bold text-base border-2 border-purple-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="text-2xl">⚽</span> GOL SISTEMAS
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button onClick={() => { setEquipoSel('A'); setModalAccion('amarilla') }}
              className="h-14 rounded-xl bg-yellow-600/20 border-2 border-yellow-500/40 text-yellow-300 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center"><span className="text-xl">🟨</span> Amarilla</button>
            <button onClick={() => { setEquipoSel('B'); setModalAccion('roja') }}
              className="h-14 rounded-xl bg-red-600/20 border-2 border-red-500/40 text-red-300 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center"><span className="text-xl">🟥</span> Roja</button>
            <button onClick={() => { setEquipoSel('A'); setModalAccion('sust') }}
              className="h-14 rounded-xl bg-blue-600/20 border-2 border-blue-500/40 text-blue-300 font-bold text-sm active:scale-95 transition-all flex flex-col items-center justify-center"><span className="text-xl">🔄</span> Sustitución</button>
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

      {/* Modal selector de jugador */}
      <AnimatePresence>
        {modalAccion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalAccion(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="font-[family-name:var(--font-display)] text-lg uppercase mb-1">
                {modalAccion === 'golA' || modalAccion === 'golB' ? '⚽ Anotador' :
                 modalAccion === 'amarilla' ? '🟨 Jugador amonestado' :
                 modalAccion === 'roja' ? '🟥 Jugador expulsado' : '🔄 Sustitución'}
              </h3>
              <p className="text-xs text-text-muted mb-4">
                {equipoSel === 'A' ? 'Tigres FC' : 'Sistemas FC'}
              </p>
              <div className="space-y-1 mb-4 max-h-[250px] overflow-y-auto">
                {jugadores[equipoSel].map(j => (
                  <button key={j.nombre} onClick={() => setSelectedPlayer(j.nombre)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedPlayer === j.nombre ? 'bg-purple-mid/30 border border-purple-mid/50 text-white' : 'bg-white/5 border border-transparent text-gray-light hover:bg-white/10'
                    }`}>
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-deep to-purple-black border border-gold/30 flex items-center justify-center text-xs font-bold text-gold">{j.dorsal}</span>
                    <div className="text-left">
                      <p className="text-sm">{j.nombre}</p>
                      <p className="text-[10px] text-text-muted uppercase">{j.pos}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setModalAccion(null); setSelectedPlayer(null) }}
                  className="flex-1 rounded-full border-border text-gray-light hover:bg-white/5 h-11 text-sm">Cancelar</Button>
                <Button onClick={() => handleAccion(modalAccion)}
                  className="flex-1 rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-11 text-sm font-bold">Confirmar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
