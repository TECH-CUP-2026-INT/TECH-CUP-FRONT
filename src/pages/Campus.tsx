import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Badge } from '@/components/common/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, Clock, Trophy, Fence, Goal, ShieldCheck, X, Activity } from 'lucide-react'

const divisiones = [
  { nombre: 'Cancha 1', eq1: 'Tigres FC', eq2: 'IA Warriors', hora: '8:00 PM', resultado: '3 - 1' },
  { nombre: 'Cancha 2', eq1: 'Code United', eq2: 'Sistemas FC', hora: '8:00 PM', resultado: '2 - 2' },
  { nombre: 'Cancha 3', eq1: 'Dragones FC', eq2: 'Los Bits', hora: '8:00 PM' },
  { nombre: 'Cancha 4', eq1: 'Titanes', eq2: 'Fénix', hora: '8:00 PM' },
]

interface MatchEvent {
  tipo: 'gol' | 'amarilla' | 'roja' | 'sustitucion'
  jugador: string
  equipo: string
  minuto: number
}

const matchEvents: MatchEvent[] = [
  { tipo: 'gol', jugador: 'Laura Gómez', equipo: 'Tigres FC', minuto: 12 },
  { tipo: 'gol', jugador: 'Esteban Quintero', equipo: 'IA Warriors', minuto: 28 },
  { tipo: 'amarilla', jugador: 'Carlos Ruiz', equipo: 'IA Warriors', minuto: 35 },
  { tipo: 'gol', jugador: 'Juan Pablo Mora', equipo: 'Tigres FC', minuto: 52 },
  { tipo: 'roja', jugador: 'David Ocampo', equipo: 'IA Warriors', minuto: 72 },
  { tipo: 'gol', jugador: 'Daniel Castro', equipo: 'Tigres FC', minuto: 85 },
]

const TIPO_ICON: Record<string, { icon: string; color: string }> = {
  'gol': { icon: '⚽', color: 'text-green-400' },
  'amarilla': { icon: '🟨', color: 'text-yellow-400' },
  'roja': { icon: '🟥', color: 'text-red-400' },
  'sustitucion': { icon: '🔄', color: 'text-blue-400' },
}

export default function Campus() {
  const navigate = useNavigate()
  const [matchModal, setMatchModal] = useState<{ eq1: string; eq2: string; hora: string; resultado?: string } | null>(null)

  return (
    <DashboardLayout title="Campus Deportivo">
      <main className="p-8 pb-[60px] max-md:p-5 relative">
        {/* Hero con foto real */}
        <section className="rounded-2xl p-8 max-md:p-6 mb-[26px] relative overflow-hidden border border-white/10 min-h-[300px] flex items-end">
          <img src="/canchas.jpeg" alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 30%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center">
                <Fence className="text-gold" size={20} />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] text-white">
                  Campus <span className="text-gold">Deportivo</span>
                </h1>
                <p className="text-sm text-white/60">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm text-white/80 leading-relaxed">
                El torneo se juega en la <strong className="text-gold">Cancha Principal de la Universidad</strong>. 
                Este campo de fútbol 11 se divide en <strong className="text-gold">4 canchas</strong> para que los partidos 
                se jueguen de manera <strong className="text-gold">simultánea</strong>, permitiendo que hasta 8 equipos 
                compitan al mismo tiempo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                <Trophy size={16} className="text-gold" />
                <span className="text-sm text-white/70">Torneo oficial TechCup</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                <Users size={16} className="text-gold" />
                <span className="text-sm text-white/70">4 canchas simultáneas</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                <Clock size={16} className="text-gold" />
                <span className="text-sm text-white/70">Jornada: 8:00 PM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Grid 2x2 de las 4 canchas simultáneas */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.5px] text-white">
              🔴 Partidos <span className="text-gold">en vivo</span>
            </h2>
            <span className="text-[10px] text-gold font-bold uppercase tracking-[.5px] bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">
              Simultáneo · 8:00 PM
            </span>
          </div>
          <div className="rounded-2xl border border-white/10 p-6 bg-black/40 backdrop-blur-sm">
            <p className="text-sm text-white/80 leading-relaxed">
              Solo se realizan torneos en la cancha principal, este se divide en 4 partes para jugar varios partidos a la vez.
            </p>
          </div>
        </section>

        {/* Leyenda */}
        <div className="mt-6 flex items-center gap-5 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> En vivo</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold" /> Resultado final</span>
        </div>

        {/* Modal detalle partido */}
        <AnimatePresence>
          {matchModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMatchModal(null)}
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A14] shadow-2xl" onClick={e => e.stopPropagation()}>
                
                {/* Header VS con cancha */}
                <div className="relative h-[180px] rounded-t-2xl overflow-hidden">
                  <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                  <button onClick={() => setMatchModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <span className="text-3xl">🐯</span>
                        <p className="text-sm font-semibold mt-1 text-white">{matchModal.eq1}</p>
                      </div>
                      <div className="text-center px-6">
                        <div className="text-3xl font-bold font-[family-name:var(--font-display)] text-gold">{matchModal.resultado || 'vs'}</div>
                        <Badge className="mt-1 rounded-full bg-red-500/20 text-red-400 border-red-500/30 text-[9px] px-2 py-0.5 h-auto">🔴 En vivo</Badge>
                      </div>
                      <div className="text-center flex-1">
                        <span className="text-3xl">🦁</span>
                        <p className="text-sm font-semibold mt-1 text-white">{matchModal.eq2}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-white/50 mt-3">
                      <MapPin size={10} /> Cancha Principal · Sede Norte
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <Clock size={10} /> {matchModal.hora}
                    </div>
                  </div>
                </div>

                {/* Timeline eventos */}
                <div className="p-5">
                  <h3 className="text-[13px] font-semibold text-white/70 uppercase tracking-[.5px] mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-gold" /> Cronología del partido
                  </h3>
                  <div className="space-y-1 relative before:absolute before:left-[18px] before:top-0 before:bottom-0 before:w-[2px] before:bg-white/10">
                    {matchEvents.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 py-1.5 relative">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 border border-white/10 flex-shrink-0 z-10 text-sm">
                          {TIPO_ICON[ev.tipo]?.icon || '⚽'}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <span className="text-[12.5px] font-semibold text-white">{ev.jugador}</span>
                          <div className="text-[10px] text-white/50">
                            <span className={TIPO_ICON[ev.tipo]?.color || ''}>
                              {ev.tipo === 'gol' ? 'Gol' : ev.tipo === 'amarilla' ? 'Amarilla' : ev.tipo === 'roja' ? 'Roja' : 'Sustitución'}
                            </span>
                            <span> • Min {ev.minuto}'</span>
                            <span className="ml-1.5">· {ev.equipo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats rápidas */}
                <div className="grid grid-cols-2 gap-3 px-5 pb-5">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <Goal size={14} className="text-gold mb-1" />
                    <div className="text-lg font-bold text-white">{matchEvents.filter(e => e.tipo === 'gol').length}</div>
                    <div className="text-[10px] text-white/50">Goles totales</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck size={14} className="text-gold mb-1" />
                    <div className="text-lg font-bold text-white">{matchEvents.filter(e => e.tipo === 'amarilla' || e.tipo === 'roja').length}</div>
                    <div className="text-[10px] text-white/50">Tarjetas</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </DashboardLayout>
  )
}
