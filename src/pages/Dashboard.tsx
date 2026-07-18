import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { Button } from '@/components/common/button'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { InteractiveHoverButton } from '@/components/common/interactive-hover-button'
import ManchasFloating from '@/components/common/ManchasFloating'
import { partidos, posiciones, fetchPartidos } from '@/services/partidos'
import { Input } from '@/components/common/input'
import { torneos, type Torneo, fetchTorneos } from '@/services/torneos'
import { Badge } from '@/components/common/badge'
import { CalendarDays, MapPin, Users, Trophy, Clock, Download } from 'lucide-react'

const SIDEBAR_KEY = 'techcup_sidebar_collapsed'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored ? JSON.parse(stored) : false
  })
  const [posExpandida, setPosExpandida] = useState(false)
  const [calExpandido, setCalExpandido] = useState(false)
  const [torneoModal, setTorneoModal] = useState<Torneo | null>(null)
  const [modalTab, setModalTab] = useState('info')
  const navigate = useNavigate()

  useEffect(() => { fetchTorneos(); fetchPartidos() }, [])

  const handleCollapse = (val: boolean) => {
    setSidebarCollapsed(val)
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(val))
  }

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={handleCollapse} />

      <div className={`min-w-0 transition-all duration-300`} style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title="Inicio" sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 pb-[60px] max-md:p-5 relative">
          {/* Background glow - más intenso */}
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
          <div className="fixed top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-deep/10 blur-[100px] pointer-events-none" />
          
          {/* Hero */}
          <section className="rounded-2xl p-10 max-md:p-6 mb-[26px] relative overflow-hidden border border-white/10">
            <img src="/banner-soccer.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-black/90 via-purple-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-purple-black/30" />
            <div className="relative z-10">
              <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl leading-tight max-w-[480px] mb-5">
                LA PASIÓN NOS UNE,<br />LA <span className="text-gold">INGENIERÍA</span> NOS IMPULSA.
              </h2>
              <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold">
                Explorar torneos →
              </Button>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-4 max-lg:grid-cols-2 gap-[18px] mb-[26px]">
            {[
              { icon:'🏆', num:'4', label:'Torneos activos', accent:'purple' },
              { icon:'👥', num:'32', label:'Equipos inscritos', accent:'gold' },
              { icon:'📅', num:'6', label:'Próximos partidos', accent:'purple' },
              { icon:'📊', num:'128', label:'Goles marcados', accent:'gold' },
            ].map((s, i) => (
              <SpotlightCard key={i} accent={s.accent as 'gold' | 'purple'} className="p-5 flex gap-3.5 items-center bg-surface border-border rounded-2xl">
                <span className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center flex-shrink-0 ${s.accent === 'purple' ? 'bg-purple-mid/20 text-[#b39ef2]' : 'bg-gold/15 text-gold'}`}>
                  {s.icon}
                </span>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-[26px] leading-none">{s.num}</div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              </SpotlightCard>
            ))}
          </section>

          {/* Torneos */}
          <section className="mb-[26px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2"><Trophy size={16} className="text-gold" /> Torneos</h3>
              <Link to="/torneos" className="text-xs text-gold font-bold hover:text-gold-dark">Ver todos →</Link>
            </div>
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
              {torneos.filter(t => t.estado !== 'closed').slice(0, 3).map(t => (
                <button key={t.id} onClick={() => { setTorneoModal(t); setModalTab('info') }}
                  className="text-left w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all group">
                  <Badge className={`rounded-full text-[9px] px-2 py-0.5 h-auto font-bold mb-3 ${
                    t.estado === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>{t.estado === 'live' ? '🔴 En curso' : '📅 Próximo'}</Badge>
                  <h4 className="font-semibold text-[14px] group-hover:text-gold transition-colors">{t.nombre}</h4>
                  <p className="text-[11px] text-text-muted mt-1">{t.fecha} · {t.categoria}</p>
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-text-muted">
                    <span>👥 {t.equipos} equipos</span>
                    <span>🏟️ {t.canchas} canchas</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Matches + Standings */}
          <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
            <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">Próximos partidos</h3>
                <button onClick={() => setCalExpandido(!calExpandido)} className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  {calExpandido ? 'Ver menos ↑' : 'Ver calendario completo →'}
                </button>
              </div>
              {partidos.slice(0, calExpandido ? partidos.length : 2).map((m, i) => (
                <Link key={i} to={`/partido/${i + 1}`} className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0 hover:bg-white/[0.03] transition-colors rounded-lg -mx-2 px-2">
                  <div className="w-[52px] text-center flex-shrink-0">
                    <b className="block font-[family-name:var(--font-display)] text-lg">{m.dia}</b>
                    <span className="text-[10px] text-text-muted uppercase">{m.mes}</span>
                  </div>
                  <div className="flex-1 text-[13.5px] font-semibold">
                    {m.eq1} <span className="text-text-faint">vs</span> {m.eq2}
                    <small className="block font-normal text-text-muted text-[11.5px] mt-0.5">{m.lugar}</small>
                  </div>
                  <div className="text-xs text-gold font-bold">{m.hora}</div>
                </Link>
              ))}
            </SpotlightCard>

            <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">Tabla de posiciones</h3>
                <button onClick={() => setPosExpandida(!posExpandida)} className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  {posExpandida ? 'Ver menos ↑' : 'Ver completa →'}
                </button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[10.5px] text-text-faint uppercase tracking-[.5px] font-semibold text-left">
                    <th className="pb-2.5">Pos</th><th className="pb-2.5">Equipo</th><th className="pb-2.5">PJ</th><th className="pb-2.5">DG</th><th className="pb-2.5 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {posiciones.slice(0, posExpandida ? posiciones.length : 3).map((r, i) => (
                    <tr key={i} className={`text-[13px] ${i === 0 ? 'text-gold font-bold' : ''}`}>
                      <td className="py-2 text-text-muted w-[26px]">{r.pos}</td>
                      <td className="py-2 border-t border-border">{i === 0 ? '🏆 ' : ''}{r.equipo}</td>
                      <td className="py-2 border-t border-border">{r.pj}</td>
                      <td className="py-2 border-t border-border">{r.dg > 0 ? '+' : ''}{r.dg}</td>
                      <td className="py-2 border-t border-border text-right font-bold">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SpotlightCard>
          </section>

          {/* CTA */}
          <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-gradient-to-r from-purple-deep2 to-purple-black border border-white/10 max-md:flex-col max-md:items-start">
            <div>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1">Forma tu equipo y vive la experiencia</h3>
              <p className="text-[13px] text-text-muted">Invita a tus amigos y compite por la copa.</p>
            </div>
            <InteractiveHoverButton onClick={() => navigate('/crear-equipo')}>
              Crear equipo
            </InteractiveHoverButton>
          </section>
        </main>

        <Footer />
      </div>
      <ManchasFloating />

      {/* Modal detalle torneo */}
      {torneoModal && (() => {
        const t = torneoModal
        const isUpcoming = t.estado === 'upcoming'
        const equiposList = [
          { nom: 'Tigres FC', emoji: '🐯', color: '#EF4444' },
          { nom: 'Sistemas FC', emoji: '⚙️', color: '#22C55E' },
          { nom: 'Code United', emoji: '🔵', color: '#3B82F6' },
          { nom: 'IA Warriors', emoji: '🦁', color: '#8B5CF6' },
          { nom: 'Dragones FC', emoji: '🐉', color: '#F97316' },
          { nom: 'Los Bits', emoji: '⚡', color: '#F5A623' },
          { nom: 'Titanes', emoji: '🛡️', color: '#14B8A6' },
          { nom: 'Fénix', emoji: '🔥', color: '#EC4899' },
        ]
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setTorneoModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative max-w-2xl w-full bg-white dark:bg-[#1D0E33] rounded-2xl overflow-hidden border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTorneoModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><span className="text-lg">✕</span></button>
            <div className="relative h-[200px] overflow-hidden">
              <img src="/cancha-juego.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div>
                  <span className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                    {t.estado === 'live' ? 'En curso' : t.estado === 'upcoming' ? 'Próximo' : 'Finalizado'}
                  </span>
                  <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">{t.tag}</span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white leading-tight">{t.nombre}</h2>
                  <p className="text-[12px] text-white/60 mt-1">{t.categoria} — {t.semestre}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 text-[10px] font-bold transition-all flex-shrink-0">
                  <Download size={12} /> Reglamento
                </button>
              </div>
            </div>
            <div className="flex border-b border-white/10">
              <button onClick={() => setModalTab('info')}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-white/50 hover:text-gold'}`}>Información</button>
              <button onClick={() => setModalTab('equipos')}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'equipos' ? 'text-gold border-b-2 border-gold' : 'text-white/50 hover:text-gold'}`}>Equipos</button>
              <button onClick={() => setModalTab('calendario')}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'calendario' ? 'text-gold border-b-2 border-gold' : 'text-white/50 hover:text-gold'}`}>Calendario</button>
              <button onClick={() => setModalTab('tabla')}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'tabla' ? 'text-gold border-b-2 border-gold' : 'text-white/50 hover:text-gold'}`}>Tabla</button>
              {!isUpcoming && <button onClick={() => setModalTab('llaves')}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'llaves' ? 'text-gold border-b-2 border-gold' : 'text-white/50 hover:text-gold'}`}>Llaves</button>}
            </div>
            <div className="p-5 max-h-[50vh] overflow-y-auto">
              {modalTab === 'info' && (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                  {[
                    { label: 'Formato', value: 'Todos contra todos + Eliminatorias' },
                    { label: 'Categoría', value: t.categoria },
                    { label: 'Duración', value: t.fecha },
                    { label: 'Equipos', value: `${t.equipos} equipos — ${t.jugadores} jugadores` },
                    { label: 'Canchas', value: `${t.canchas} canchas` },
                    { label: 'Estado', value: t.estado === 'live' ? '🔴 En curso' : t.estado === 'upcoming' ? '📅 Próximo' : '✅ Finalizado' },
                  ].map((info, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-[10px] text-white/40 uppercase tracking-[.4px] font-semibold mb-1">{info.label}</p>
                      <p className="text-sm font-semibold text-white">{info.value}</p>
                    </div>
                  ))}
                </div>
              )}
              {modalTab === 'equipos' && (
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                  {equiposList.map(eq => (
                    <div key={eq.nom} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all">
                      <span className="text-2xl">{eq.emoji}</span>
                      <span className="font-semibold text-[13px] text-white">{eq.nom}</span>
                      <span className="w-3 h-3 rounded-full ml-auto" style={{ backgroundColor: eq.color }} />
                    </div>
                  ))}
                </div>
              )}
              {modalTab === 'calendario' && (
                <div className="space-y-3">
                  <p className="text-xs text-white/50 mb-4">Calendario de partidos del torneo</p>
                  {[
                    { dia:'24', mes:'MAY', eq1:'Tigres FC', emoji1:'🐯', eq2:'IA Warriors', emoji2:'🦁', hora:'8:00 PM', lugar:'Cancha Principal Sede Norte', resultado:'3 - 1' },
                    { dia:'24', mes:'MAY', eq1:'Code United', emoji1:'💻', eq2:'Sistemas FC', emoji2:'⚙️', hora:'9:30 PM', lugar:'Cancha Principal Sede Norte', resultado:'2 - 2' },
                    { dia:'25', mes:'MAY', eq1:'Dragones FC', emoji1:'🐉', eq2:'Los Bits', emoji2:'⚡', hora:'5:00 PM', lugar:'Auditorio Principal Sede Norte' },
                    { dia:'28', mes:'MAY', eq1:'Titanes', emoji1:'🛡️', eq2:'Fénix', emoji2:'🔥', hora:'7:00 PM', lugar:'Cancha Principal Sede Norte 2' },
                    { dia:'30', mes:'MAY', eq1:'Tigres FC', emoji1:'🐯', eq2:'Code United', emoji2:'💻', hora:'8:00 PM', lugar:'Cancha Principal Sede Norte' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all">
                      <div className="w-[44px] text-center flex-shrink-0">
                        <b className="block font-[family-name:var(--font-display)] text-base text-white">{m.dia}</b>
                        <span className="text-[8px] text-white/40 uppercase">{m.mes}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[12.5px]">
                          <span>{m.emoji1}</span>
                          <span className="font-semibold text-white truncate">{m.eq1}</span>
                          <span className="text-[9px] text-white/30 font-bold">VS</span>
                          <span className="font-semibold text-white truncate">{m.eq2}</span>
                          <span>{m.emoji2}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                          <Clock size={10} /> {m.hora}
                          <MapPin size={10} /> {m.lugar.slice(0, 18)}...
                        </div>
                      </div>
                      {m.resultado && <span className="text-sm font-bold text-gold">{m.resultado}</span>}
                    </div>
                  ))}
                </div>
              )}
              {modalTab === 'tabla' && !isUpcoming && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-[10px] text-white/40 uppercase tracking-[.5px] border-b border-white/10">
                      <th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">Equipo</th><th className="text-center py-3 px-3">PJ</th><th className="text-center py-3 px-3">G</th><th className="text-center py-3 px-3">E</th><th className="text-center py-3 px-3">P</th><th className="text-center py-3 px-3">DG</th><th className="text-right py-3 px-4">Pts</th>
                    </tr></thead>
                    <tbody>
                      {[
                        { eq: 'Tigres FC', emoji: '🐯', pj: 12, g: 9, e: 2, p: 1, dg: 18, pts: 29 },
                        { eq: 'Code United', emoji: '🔵', pj: 12, g: 8, e: 2, p: 2, dg: 12, pts: 26 },
                        { eq: 'IA Warriors', emoji: '🦁', pj: 12, g: 7, e: 3, p: 2, dg: 8, pts: 24 },
                        { eq: 'Sistemas FC', emoji: '⚙️', pj: 12, g: 6, e: 2, p: 4, dg: 4, pts: 20 },
                      ].map((r, i) => (
                        <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-white/40 w-8">{i + 1}</td>
                          <td className="py-3 px-4 font-semibold text-white">{i === 0 ? '🏆 ' : ''}{r.emoji} {r.eq}</td>
                          <td className="py-3 px-3 text-center text-white/60">{r.pj}</td>
                          <td className="py-3 px-3 text-center text-green-400">{r.g}</td>
                          <td className="py-3 px-3 text-center text-yellow-400">{r.e}</td>
                          <td className="py-3 px-3 text-center text-red-400">{r.p}</td>
                          <td className="py-3 px-3 text-center text-green-400">+{r.dg}</td>
                          <td className="py-3 px-4 text-right font-bold text-gold">{r.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {modalTab === 'llaves' && !isUpcoming && (
                <div>
                  <p className="text-sm text-white/50 mb-4">Fase eliminatoria del torneo</p>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-x-auto">
                    <div className="flex items-center justify-center gap-8 min-w-[500px]">
                      <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-white">🐯 Tigres FC <span className="text-gold">2</span></span></div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-white">⚙️ Sistemas FC <span className="text-gold">1</span></span></div>
                        <div className="text-center text-[10px] text-white/40 uppercase tracking-wider mt-1">Cuartos</div>
                      </div>
                      <div className="text-gold text-2xl">⟶</div>
                      <div className="space-y-4">
                        <div className="p-3 rounded-xl border border-gold/30 bg-gold/10"><span className="text-sm font-semibold text-white">🐯 Tigres FC <span className="text-gold">1</span></span></div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-white">🔵 Code United <span className="text-gold">0</span></span></div>
                        <div className="text-center text-[10px] text-white/40 uppercase tracking-wider mt-1">Semifinal</div>
                      </div>
                      <div className="text-gold text-2xl">⟶</div>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-b from-gold/20 to-gold/5 border border-gold/40"><span className="text-sm font-semibold text-white">🏆🐯 Tigres FC <span className="text-gold">3</span></span></div>
                        <div className="text-center text-[10px] text-white/40 uppercase tracking-wider mt-1">Final</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}

