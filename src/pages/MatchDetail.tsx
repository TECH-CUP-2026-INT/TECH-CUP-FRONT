import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { CalendarDays, MapPin, Clock, Trophy, Swords } from 'lucide-react'

interface TeamInfo {
  name: string
  short: string
  color: string
  program: string
  wins: number
  draws: number
  losses: number
}

const equipos: [TeamInfo, TeamInfo] = [
  { name: 'Ingeniería de Sistemas', short: 'SISTEMAS', color: '#22C55E', program: 'Ing. Sistemas', wins: 4, draws: 1, losses: 0 },
  { name: 'Ingeniería Civil', short: 'CIVIL', color: '#EF4444', program: 'Ing. Civil', wins: 3, draws: 0, losses: 2 },
]

export default function MatchDetail() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'estadisticas' | 'alineaciones'>('resumen')
  const local = equipos[0]
  const visitor = equipos[1]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero VS — estilo Paramount+ */}
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[140px] pb-[80px] overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(600px 500px at 50% 50%, black 10%, transparent 70%)',
            }} 
          />

          {/* VS Banner — estilo Paramount+ */}
          <div className="relative z-[2]">
            {/* Fecha y hora arriba */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Sábado 24 de Mayo, 2026</span>
                <span className="w-1 h-1 rounded-full bg-text-faint" />
                <span className="flex items-center gap-1.5"><Clock size={14} /> 8:00 PM</span>
                <span className="w-1 h-1 rounded-full bg-text-faint" />
                <span className="flex items-center gap-1.5"><MapPin size={14} /> Cancha Principal</span>
              </div>
            </motion.div>

            {/* VS principal */}
            <div className="flex items-center justify-center gap-6 md:gap-16 py-6">
              {/* Local */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-surface border-2 flex items-center justify-center mb-4"
                     style={{ borderColor: `${local.color}40`, boxShadow: `0 0 40px -10px ${local.color}40` }}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black uppercase tracking-wider"
                       style={{ backgroundColor: local.color, color: '#fff' }}>
                    {local.short[0]}
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[2px] text-text-faint font-semibold mb-1">{local.program}</span>
                <h2 className="font-[family-name:var(--font-display)] text-lg md:text-2xl uppercase tracking-[.5px] max-w-[180px]">
                  {local.short}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span>{local.wins}G</span>
                  <span className="w-1 h-1 rounded-full bg-text-faint" />
                  <span>{local.draws}E</span>
                  <span className="w-1 h-1 rounded-full bg-text-faint" />
                  <span>{local.losses}P</span>
                </div>
              </motion.div>

              {/* VS central */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_40px_-5px_rgba(245,166,35,.5)]">
                  <Swords size={28} className="text-[#1A1206]" />
                </div>
                <span className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-gold mt-2 tracking-wider drop-shadow-[0_0_20px_rgba(245,166,35,.3)]">
                  VS
                </span>
                <Badge className="mt-2 rounded-full bg-gold/15 text-gold border border-gold/40 text-[10px] uppercase tracking-widest font-bold">
                  Semifinal
              </Badge>
              </motion.div>

              {/* Visitante */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-surface border-2 flex items-center justify-center mb-4"
                     style={{ borderColor: `${visitor.color}40`, boxShadow: `0 0 40px -10px ${visitor.color}40` }}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black uppercase tracking-wider"
                       style={{ backgroundColor: visitor.color, color: '#fff' }}>
                    {visitor.short[0]}
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[2px] text-text-faint font-semibold mb-1">{visitor.program}</span>
                <h2 className="font-[family-name:var(--font-display)] text-lg md:text-2xl uppercase tracking-[.5px] max-w-[180px]">
                  {visitor.short}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span>{visitor.wins}G</span>
                  <span className="w-1 h-1 rounded-full bg-text-faint" />
                  <span>{visitor.draws}E</span>
                  <span className="w-1 h-1 rounded-full bg-text-faint" />
                  <span>{visitor.losses}P</span>
                </div>
              </motion.div>
            </div>

            {/* Countdown o estado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-4"
            >
              <span className="inline-flex items-center gap-2 text-sm text-gold font-semibold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                Comienza en 2 días
              </span>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>

      {/* Detalles del partido */}
      <section className="py-10 pb-[80px] relative">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />

        <div className="max-w-[900px] mx-auto px-8 relative">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-8">
            {(['resumen', 'estadisticas', 'alineaciones'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                {tab === 'resumen' ? 'Resumen' : tab === 'estadisticas' ? 'Estadísticas' : 'Alineaciones'}
              </button>
            ))}
          </div>

          {/* Resumen - Timeline de eventos */}
          {activeTab === 'resumen' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] mb-4">
                  Previo del <span className="text-gold">partido</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { time: '8:00 PM', event: 'Inicio del partido', icon: '⚽' },
                    { time: '8:15 PM', event: 'Posible formación titular', icon: '📋' },
                    { time: '8:45 PM', event: 'Medio tiempo', icon: '⏸️' },
                    { time: '9:30 PM', event: 'Fin del partido', icon: '⏹️' },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-lg">{e.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{e.event}</p>
                        <p className="text-xs text-text-muted">{e.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              <div className="grid grid-cols-2 gap-4">
                <SpotlightCard accent="purple" className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-gold" />
                    <div>
                      <p className="text-xs text-text-muted">Último encuentro</p>
                      <p className="text-sm font-semibold">Sistemas 2 - 1 Civil</p>
                    </div>
                  </div>
                </SpotlightCard>
                <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-gold" />
                    <div>
                      <p className="text-xs text-text-muted">Racha local</p>
                      <p className="text-sm font-semibold text-green-400">4 victorias consecutivas</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </motion.div>
          )}

          {/* Estadísticas */}
          {activeTab === 'estadisticas' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] mb-6 text-center">
                  <span className="text-gold">Estadísticas</span> del torneo
                </h3>
                <div className="space-y-5">
                  {[
                    { label: 'Partidos jugados', local: '5', visitor: '5' },
                    { label: 'Goles a favor', local: '12', visitor: '8' },
                    { label: 'Goles en contra', local: '3', visitor: '7' },
                    { label: 'Tarjetas amarillas', local: '4', visitor: '6' },
                    { label: 'Tarjetas rojas', local: '0', visitor: '1' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-semibold" style={{ color: local.color }}>{s.local}</span>
                        <span className="text-xs text-text-muted uppercase tracking-wide">{s.label}</span>
                        <span className="font-semibold" style={{ color: visitor.color }}>{s.visitor}</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(parseInt(s.local) / (parseInt(s.local) + parseInt(s.visitor))) * 100}%`, backgroundColor: local.color }} />
                        <div className="h-full rounded-full transition-all" style={{ width: `${(parseInt(s.visitor) / (parseInt(s.local) + parseInt(s.visitor))) * 100}%`, backgroundColor: visitor.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {/* Alineaciones placeholder */}
          {activeTab === 'alineaciones' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-text-muted">Las alineaciones se publicarán 1 hora antes del partido.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
