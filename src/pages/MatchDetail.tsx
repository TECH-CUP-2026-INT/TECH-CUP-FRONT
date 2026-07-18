import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { Badge } from '@/components/common/badge'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { CalendarDays, MapPin, Clock, Trophy, Swords, Shirt } from 'lucide-react'
import { partidos, fetchPartidos } from '@/services/partidos'
import SoccerField3D from '@/components/employees/SoccerField3D'

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

function PlayerDot({ name, number, color, x, y, isGoal, image, onClick }: { name: string; number: number; color: string; x: string; y: string; isGoal?: boolean; image?: string; onClick?: () => void }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10" style={{ left: x, top: y }}>
      <div className="relative group" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }} />
        <div
          className="relative flex items-center justify-center font-bold text-white transition-transform group-hover:scale-110 overflow-hidden"
          style={{
            width: isGoal ? '38px' : '32px',
            height: isGoal ? '38px' : '32px',
            borderRadius: '50%',
            border: `2px solid ${color}dd`,
            boxShadow: `0 2px 12px rgba(0,0,0,.6)`,
          }}
        >
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color }}>
              <span className="text-[10px] font-black">{number}</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.8)] whitespace-nowrap leading-tight text-center px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10" style={{ maxWidth: '70px' }}>
        {name.split(' ')[0]}
      </span>
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const partido = partidos.find(p => p.id === id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'resumen' | 'estadisticas' | 'alineaciones'>('resumen')
  const [selectedTeam, setSelectedTeam] = useState<'local' | 'visitor' | 'both'>('both')
  const local = equipos[0]
  const visitor = equipos[1]

  useEffect(() => { fetchPartidos() }, [])

  if (!partido) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Partido no encontrado</p>
          <Link to="/" className="text-gold underline">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1 flex flex-col">
        <AppTopbar title="Detalle del partido" onMenuClick={() => setSidebarOpen(true)} />

        {/* Hero VS — estilo Paramount+ */}
        <div className="relative z-10">
          <Link to="/dashboard" className="absolute top-[100px] left-8 z-20 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Volver
          </Link>
        </div>

      <section className="py-6 pb-[60px] relative">
        <div className="relative w-full max-w-[600px] mx-auto px-4 pt-[90px] pb-[30px] overflow-hidden">
          <div className="relative z-[2]">
            {/* Fecha */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-center mb-4">
              <div className="flex items-center justify-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><CalendarDays size={12} /> {partido.dia} de {partido.mes}</span>
                <span className="w-1 h-1 rounded-full bg-text-faint" />
                <span className="flex items-center gap-1"><Clock size={12} /> {partido.hora}</span>
                <span className="w-1 h-1 rounded-full bg-text-faint" />
                <span className="flex items-center gap-1"><MapPin size={12} /> {partido.lugar}</span>
              </div>
            </motion.div>

            {/* VS compacto */}
            <div className="flex items-center justify-center gap-4 md:gap-8 py-3">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-surface border-2 flex items-center justify-center mb-2"
                  style={{ borderColor: `${local.color}40`, boxShadow: `0 0 30px -8px ${local.color}40` }}>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black uppercase"
                    style={{ backgroundColor: local.color, color: '#fff' }}>
                    {partido.eq1[0]}
                  </div>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-sm md:text-base uppercase max-w-[120px] leading-tight">{partido.eq1}</h2>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                className="flex flex-col items-center">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_25px_-5px_rgba(245,166,35,.4)]">
                  <Swords size={18} className="text-[#1A1206]" />
                </div>
                <span className="font-[family-name:var(--font-display)] text-xl md:text-3xl font-bold text-gold mt-1 tracking-wider">VS</span>
                <Badge className="mt-1 rounded-full bg-gold/15 text-gold border border-gold/40 text-[9px] uppercase font-bold">Semifinal</Badge>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-surface border-2 flex items-center justify-center mb-2"
                  style={{ borderColor: `${visitor.color}40`, boxShadow: `0 0 30px -8px ${visitor.color}40` }}>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black uppercase"
                    style={{ backgroundColor: visitor.color, color: '#fff' }}>
                    {partido.eq2[0]}
                  </div>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-sm md:text-base uppercase max-w-[120px] leading-tight">{partido.eq2}</h2>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles del partido */}
      <section className="py-10 pb-[80px] relative">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />

        <div className="max-w-[900px] mx-auto px-8 relative">
          
          {/* Tabs glass-radio-group centrados */}
          <div className="relative flex rounded-2xl mb-8 overflow-hidden mx-auto"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: "inset 1px 1px 4px rgba(255,255,255,0.2), inset -1px -1px 6px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15)",
              width: "fit-content",
            }}
          >
            {/* Glider */}
            <div
              className="absolute top-0 bottom-0 rounded-2xl z-[1]"
              style={{
                width: "calc(100% / 3)",
                transform: `translateX(${['resumen', 'estadisticas', 'alineaciones'].indexOf(activeTab) * 100}%)`,
                background: "linear-gradient(135deg, #F5A623, #301151)",
                boxShadow: "0 0 18px rgba(255,215,0,0.5), 0 0 10px rgba(255,235,150,0.4) inset",
                transition: "transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56), background 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
              }}
            />
            {(['resumen', 'estadisticas', 'alineaciones'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 px-6 text-sm font-semibold capitalize relative z-[2] transition-colors duration-300 min-w-[90px]"
                style={{
                  color: activeTab === tab ? '#fff' : '#e5e5e5',
                  letterSpacing: "0.3px",
                }}
              >
                {tab === 'resumen' ? 'Resumen' : tab === 'estadisticas' ? 'Estadísticas' : 'Alineaciones'}
              </button>
            ))}
          </div>

          {/* Resumen */}
          {activeTab === 'resumen' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <SpotlightCard accent="gold" className="bg-surface/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] mb-4">
                  Previo del <span className="text-gold">partido</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { time: partido.hora, event: 'Inicio del partido', icon: '⚽' },
                    { time: '—', event: 'Posible formación titular', icon: '📋' },
                    { time: '—', event: 'Medio tiempo', icon: '⏸️' },
                    { time: '—', event: 'Fin del partido', icon: '⏹️' },
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
                <SpotlightCard accent="purple" className="bg-surface/70 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-gold" />
                    <div>
                      <p className="text-xs text-text-muted">Último encuentro</p>
                      <p className="text-sm font-semibold">{partido.eq1} vs {partido.eq2}</p>
                    </div>
                  </div>
                </SpotlightCard>
                <SpotlightCard accent="gold" className="bg-surface/70 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-gold" />
                    <div>
                      <p className="text-xs text-text-muted">{partido.lugar}</p>
                      <p className="text-sm font-semibold text-green-400">{partido.hora}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </motion.div>
          )}

          {/* Estadísticas */}
          {activeTab === 'estadisticas' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SpotlightCard accent="gold" className="bg-surface/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
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

          {/* Alineaciones */}
          {activeTab === 'alineaciones' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                {([local, visitor] as const).map((eq, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black uppercase" style={{ backgroundColor: eq.color, color: '#fff' }}>
                      {eq.short[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{eq.name}</p>
                      <p className="text-[11px] text-text-muted">4-4-2 • {eq.wins + eq.draws + eq.losses} PJ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancha 3D con switcher */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black/40 pt-4">
                <SoccerField3D
                  homePlayers={[
                    { name:"Carlos Ruiz", number:4, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=4", x:-80, z:-100 },
                    { name:"Miguel Díaz", number:5, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=5", x:-20, z:-100 },
                    { name:"Andrés Paz", number:3, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=6", x:40, z:-100 },
                    { name:"Jorge Mora", number:2, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=7", x:100, z:-100 },
                    { name:"Luis Rojas", number:8, posicion:"Volante", img:"https://i.pravatar.cc/72?img=8", x:-90, z:0 },
                    { name:"David Gil", number:6, posicion:"Volante", img:"https://i.pravatar.cc/72?img=9", x:-30, z:0 },
                    { name:"Pablo Cruz", number:10, posicion:"Volante", img:"https://i.pravatar.cc/72?img=10", x:30, z:0 },
                    { name:"Sergio Peña", number:11, posicion:"Volante", img:"https://i.pravatar.cc/72?img=11", x:90, z:0 },
                    { name:"Juan Vega", number:9, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=12", x:-40, z:100 },
                    { name:"Tomás Herrera", number:7, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=13", x:40, z:100 },
                    { name:"Luis Torres", number:1, posicion:"Portero", img:"https://i.pravatar.cc/72?img=14", x:0, z:-200 },
                  ]}
                  awayPlayers={[
                    { name:"Pedro Gil", number:4, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=15", x:-80, z:-100 },
                    { name:"Mario Ríos", number:5, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=16", x:-20, z:-100 },
                    { name:"Alex Torres", number:3, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=17", x:40, z:-100 },
                    { name:"Fabio Mora", number:2, posicion:"Defensa", img:"https://i.pravatar.cc/72?img=18", x:100, z:-100 },
                    { name:"Iván Duque", number:8, posicion:"Volante", img:"https://i.pravatar.cc/72?img=19", x:-90, z:0 },
                    { name:"Óscar Paz", number:6, posicion:"Volante", img:"https://i.pravatar.cc/72?img=20", x:-30, z:0 },
                    { name:"Julián Roa", number:10, posicion:"Volante", img:"https://i.pravatar.cc/72?img=21", x:30, z:0 },
                    { name:"Diego Mesa", number:11, posicion:"Volante", img:"https://i.pravatar.cc/72?img=22", x:90, z:0 },
                    { name:"Henry Vargas", number:9, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=23", x:-40, z:100 },
                    { name:"Andrés Ruiz", number:7, posicion:"Delantero", img:"https://i.pravatar.cc/72?img=24", x:40, z:100 },
                    { name:"Camilo Rojas", number:1, posicion:"Portero", img:"https://i.pravatar.cc/72?img=25", x:0, z:-200 },
                  ]}
                  homeColor={local.color}
                  awayColor={visitor.color}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {([local, visitor] as const).map((eq, i) => (
                  <SpotlightCard key={i} accent={i === 0 ? 'purple' : 'gold'} className="bg-surface/70 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Shirt size={14} /> Suplentes ({i === 0 ? partido.eq1 : partido.eq2})
                    </h4>
                    <div className="space-y-1.5">
                      {[12, 13, 14, 15, 16].map((n) => (
                        <div key={n} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[11px] font-bold">{n}</span>
                          <span className="text-text-muted">Jugador #{n}</span>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      </div>{/* .flex-1 */}
    </div>
  )
}
