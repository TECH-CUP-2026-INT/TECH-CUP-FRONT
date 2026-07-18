import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { X, MapPin, Clock, Trophy, Swords, CalendarDays, Shirt } from 'lucide-react'
import SoccerField3D from '@/components/employees/SoccerField3D'

type Tab = 'proximos' | 'envivo' | 'finalizados'

const partidos = [
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Tigres FC', fecha: '24 MAY', hora: '8:00 PM', cancha: 'Cancha 1', estado: 'upcoming', detalle: 'En 2 días' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Code United', fecha: '18 MAY', hora: '8:00 PM', cancha: 'Cancha 2', estado: 'final', resultado: '3 - 1' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'IA Warriors', fecha: '11 MAY', hora: '5:00 PM', cancha: 'Cancha 1', estado: 'final', resultado: '2 - 2' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Los Bits', fecha: '28 MAY', hora: '7:00 PM', cancha: 'Cancha 3', estado: 'upcoming', detalle: 'En 5 días' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Dragones FC', fecha: '20 MAY', hora: '6:00 PM', cancha: 'Cancha 1', estado: 'live', resultado: '1 - 0' },
]

export default function MisPartidos() {
  const [tab, setTab] = useState<Tab>('proximos')
  const [selectedMatch, setSelectedMatch] = useState<typeof partidos[0] | null>(null)
  const [detailTab, setDetailTab] = useState<'resumen' | 'estadisticas' | 'alineaciones'>('resumen')

  const filtrados = partidos.filter(p => p.estado === (tab === 'proximos' ? 'upcoming' : tab === 'envivo' ? 'live' : 'final'))

  return (
    <DashboardLayout title="Mis partidos">
      <main className="max-w-[800px] mx-auto px-8 py-8 pb-[60px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6">
            {(['proximos', 'envivo', 'finalizados'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}>
                {t === 'proximos' ? 'Próximos' : t === 'envivo' ? 'En vivo' : 'Finalizados'}
                {t === 'envivo' && <span className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />}
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-16">
              <Swords size={40} className="mx-auto text-text-faint mb-4" />
              <p className="text-text-muted">No hay partidos en esta categoría.</p>
            </div>
          )}

          <div className="space-y-3">
            {filtrados.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SpotlightCard accent={p.estado === 'live' ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <span className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold">{p.torneo}</span>
                      <Badge className={`rounded-full text-[10px] px-2.5 py-0.5 h-auto uppercase font-bold ${
                        p.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse' :
                        p.estado === 'upcoming' ? 'bg-gold/15 text-gold border border-gold/40' : 'bg-white/10 text-text-muted border border-white/15'
                      }`}>
                        {p.estado === 'live' ? '🔴 En vivo' : p.estado === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base">{p.eq1}</span>
                          <span className="text-xs text-text-faint font-bold">VS</span>
                          <span className="font-bold text-base">{p.eq2}</span>
                        </div>
                      </div>
                      {p.resultado && (
                        <span className={`font-[family-name:var(--font-display)] text-xl ${p.estado === 'live' ? 'text-green-400' : 'text-text-muted'}`}>
                          {p.resultado}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {p.fecha}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.hora}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {p.cancha}</span>
                      {p.detalle && <span className="text-gold font-semibold">{p.detalle}</span>}
                    </div>

                    <div className="mt-3">
                      <Button size="sm" onClick={() => setSelectedMatch(p)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 px-4">Ver detalle</Button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </main>

      {/* Modal flotante — detalle completo del partido como en MatchDetail */}
      <AnimatePresence>
        {selectedMatch && (() => {
          const localColor = '#22C55E'
          const visitorColor = '#EF4444'
          return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-purple-deep2 to-purple-black border border-gold/30 rounded-3xl w-full max-w-2xl shadow-2xl shadow-purple-900/40 relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-red-500/30 hover:border-red-500/50 transition-colors">
                <X size={16} className="text-white" />
              </button>

              {/* VS Hero */}
              <div className="pt-12 pb-6 px-6 relative overflow-hidden rounded-t-3xl">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-deep/60 to-transparent" />
                <div className="relative z-10 text-center mb-3">
                  <p className="text-xs text-gold/60 uppercase tracking-wider mb-1">{selectedMatch.torneo}</p>
                  <span className="text-[10px] bg-gold/15 text-gold border border-gold/30 px-3 py-0.5 rounded-full font-bold uppercase">Semifinal</span>
                </div>
                <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8 py-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-surface border-2 flex items-center justify-center mb-2" style={{ borderColor: `${localColor}40`, boxShadow: `0 0 30px -8px ${localColor}40` }}>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black uppercase" style={{ backgroundColor: localColor, color: '#fff' }}>
                        {selectedMatch.eq1[0]}
                      </div>
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-sm md:text-base uppercase max-w-[120px] leading-tight text-white">{selectedMatch.eq1}</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_25px_-5px_rgba(245,166,35,.4)]">
                      <Swords size={18} className="text-[#1A1206]" />
                    </div>
                    <span className="font-[family-name:var(--font-display)] text-xl md:text-3xl font-bold text-gold mt-1 tracking-wider">VS</span>
                    {selectedMatch.resultado && <span className="text-lg font-bold text-white -mt-1">{selectedMatch.resultado}</span>}
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-surface border-2 flex items-center justify-center mb-2" style={{ borderColor: `${visitorColor}40`, boxShadow: `0 0 30px -8px ${visitorColor}40` }}>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black uppercase" style={{ backgroundColor: visitorColor, color: '#fff' }}>
                        {selectedMatch.eq2[0]}
                      </div>
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-sm md:text-base uppercase max-w-[120px] leading-tight text-white">{selectedMatch.eq2}</h2>
                  </div>
                </div>

                {/* Info bar */}
                <div className="relative z-10 flex items-center justify-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
                  <span className="flex items-center gap-1"><CalendarDays size={12} /> {selectedMatch.fecha} · {selectedMatch.hora}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {selectedMatch.cancha}</span>
                  <Badge className={`rounded-full text-[10px] ${
                    selectedMatch.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-400/30 animate-pulse' :
                    selectedMatch.estado === 'upcoming' ? 'bg-gold/20 text-gold border border-gold/30' :
                    'bg-purple-mid/20 text-purple-mid border border-purple-mid/30'
                  }`}>
                    {selectedMatch.estado === 'live' ? '🔴 En vivo' : selectedMatch.estado === 'upcoming' ? '⏳ Próximo' : '✅ Finalizado'}
                  </Badge>
                </div>
              </div>

              {/* Tabs: Resumen | Estadísticas | Alineaciones */}
              <div className="px-6">
                <div className="flex rounded-2xl mb-4 overflow-hidden mx-auto"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 1px 1px 4px rgba(255,255,255,0.2), inset -1px -1px 6px rgba(0,0,0,0.3)",
                    width: "fit-content",
                  }}>
                  {(['resumen', 'estadisticas', 'alineaciones'] as const).map((tab, i) => (
                    <button key={tab}
                      onClick={() => setDetailTab(tab)}
                      className="py-2.5 px-5 text-sm font-semibold capitalize relative transition-colors"
                      style={{ color: detailTab === tab ? '#fff' : '#aaa' }}
                    >
                      {tab === 'resumen' ? 'Resumen' : tab === 'estadisticas' ? 'Estadísticas' : 'Alineaciones'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Resumen */}
                {detailTab === 'resumen' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                      <h3 className="font-[family-name:var(--font-display)] text-base uppercase tracking-[.3px] mb-3 text-white">Previo del <span className="text-gold">partido</span></h3>
                      <div className="space-y-2.5">
                        {[
                          { time: selectedMatch.hora, event: 'Inicio del partido', icon: '⚽' },
                          { time: '—', event: 'Posible formación titular', icon: '📋' },
                          { time: '—', event: 'Medio tiempo', icon: '⏸️' },
                          { time: '—', event: 'Fin del partido', icon: '⏹️' },
                        ].map((e, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-base">{e.icon}</span>
                            <div><p className="text-sm font-semibold text-white">{e.event}</p><p className="text-xs text-text-muted">{e.time}</p></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-3"><Trophy size={18} className="text-gold" /><div><p className="text-xs text-text-muted">Último encuentro</p><p className="text-sm font-semibold text-white">{selectedMatch.eq1} vs {selectedMatch.eq2}</p></div></div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-3"><MapPin size={18} className="text-gold" /><div><p className="text-xs text-text-muted">{selectedMatch.cancha}</p><p className="text-sm font-semibold text-green-400">{selectedMatch.hora}</p></div></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Estadísticas */}
                {detailTab === 'estadisticas' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                      <h3 className="font-[family-name:var(--font-display)] text-base uppercase tracking-[.3px] mb-5 text-center text-white"><span className="text-gold">Estadísticas</span> del torneo</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Partidos jugados', local: '5', visitor: '5' },
                          { label: 'Goles a favor', local: '12', visitor: '8' },
                          { label: 'Goles en contra', local: '3', visitor: '7' },
                          { label: 'Tarjetas amarillas', local: '4', visitor: '6' },
                          { label: 'Tarjetas rojas', local: '0', visitor: '1' },
                        ].map((s, i) => {
                          const total = parseInt(s.local) + parseInt(s.visitor)
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="font-semibold text-xs" style={{ color: localColor }}>{s.local}</span>
                                <span className="text-[11px] text-text-muted uppercase tracking-wide">{s.label}</span>
                                <span className="font-semibold text-xs" style={{ color: visitorColor }}>{s.visitor}</span>
                              </div>
                              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-black/30">
                                <div className="h-full rounded-full transition-all" style={{ width: `${(parseInt(s.local) / total) * 100}%`, backgroundColor: localColor }} />
                                <div className="h-full rounded-full transition-all" style={{ width: `${(parseInt(s.visitor) / total) * 100}%`, backgroundColor: visitorColor }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Alineaciones */}
                {detailTab === 'alineaciones' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black uppercase" style={{ backgroundColor: localColor, color: '#fff' }}>{selectedMatch.eq1[0]}</div><p className="text-xs text-text-muted">{selectedMatch.eq1}</p></div>
                      <span className="text-[10px] text-text-muted">2-3-1</span>
                      <div className="flex items-center gap-2"><p className="text-xs text-text-muted">{selectedMatch.eq2}</p><div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black uppercase" style={{ backgroundColor: visitorColor, color: '#fff' }}>{selectedMatch.eq2[0]}</div></div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black/40">
                      <SoccerField3D
                        homePlayers={[
                          { name:"Carlos Ruiz", number:4, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=4", x:-80, z:-100 },
                          { name:"Miguel Díaz", number:5, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=5", x:0, z:-100 },
                          { name:"Andrés Paz", number:3, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=6", x:80, z:-100 },
                          { name:"Luis Rojas", number:8, posicion:"Volante", img:"https://i.pravatar.cc/72?img=8", x:-40, z:0 },
                          { name:"David Gil", number:6, posicion:"Volante", img:"https://i.pravatar.cc/72?img=9", x:40, z:0 },
                          { name:"Juan Vega", number:9, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=12", x:0, z:100 },
                          { name:"Luis Torres", number:1, posicion:"Portero", img:"https://i.pravatar.cc/72?img=14", x:0, z:-200 },
                        ]}
                        awayPlayers={[
                          { name:"Pedro Gil", number:4, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=15", x:-80, z:-100 },
                          { name:"Mario Ríos", number:5, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=16", x:0, z:-100 },
                          { name:"Alex Torres", number:3, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=17", x:80, z:-100 },
                          { name:"Iván Duque", number:8, posicion:"Volante", img:"https://i.pravatar.cc/72?img=19", x:-40, z:0 },
                          { name:"Óscar Paz", number:6, posicion:"Volante", img:"https://i.pravatar.cc/72?img=20", x:40, z:0 },
                          { name:"Henry Vargas", number:9, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=23", x:0, z:100 },
                          { name:"Camilo Rojas", number:1, posicion:"Portero", img:"https://i.pravatar.cc/72?img=25", x:0, z:-200 },
                        ]}
                        homeColor={localColor}
                        awayColor={visitorColor}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ color: localColor }}>{selectedMatch.eq1}</p>
                        <div className="flex gap-3 text-xs"><span className="text-green-400">4V</span><span className="text-yellow-400">1E</span><span className="text-red-400">0D</span></div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1" style={{ color: visitorColor }}>{selectedMatch.eq2}</p>
                        <div className="flex gap-3 text-xs"><span className="text-green-400">3V</span><span className="text-yellow-400">0E</span><span className="text-red-400">2D</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
          )
        })()}
      </AnimatePresence>
    </DashboardLayout>
  )
}
