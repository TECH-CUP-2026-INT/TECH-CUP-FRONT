import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { useAuth } from '@/lib/auth'
import ManchasFloating from '@/components/shared/ManchasFloating'
import { partidos, posiciones } from '@/data/partidos'
import { torneos } from '@/data/torneos'
import { Camera, Lock, CheckCircle, X, ArrowLeft, CalendarDays, Trophy, Clock, MapPin, Download } from 'lucide-react'
import type { Torneo } from '@/data/torneos'

const SIDEBAR_KEY = 'techcup_sidebar_collapsed'

export default function DashboardJugador() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored ? JSON.parse(stored) : false
  })
  const navigate = useNavigate()
  const { user } = useAuth()

  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editProgram, setEditProgram] = useState('Ing. Sistemas')
  const [editSemester, setEditSemester] = useState('6')
  const [editSaved, setEditSaved] = useState(false)
  const [torneoModal, setTorneoModal] = useState<Torneo | null>(null)
  const [modalTab, setModalTab] = useState('info')

  const handleSaveProfile = () => {
    if (user) {
      const updated = { ...user, name: editName }
      localStorage.setItem('techcup_user', JSON.stringify(updated))
    }
    localStorage.setItem('techcup_profile', JSON.stringify({ name: editName, program: editProgram, semester: editSemester }))
    setEditSaved(true)
    setTimeout(() => { setEditSaved(false); setEditingProfile(false) }, 1500)
  }

  const handleCollapse = (val: boolean) => {
    setSidebarCollapsed(val)
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(val))
  }

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'
  const torneosDisponibles = torneos.filter(t => t.estado === 'live' || t.estado === 'upcoming').slice(0, 3)
  const misPartidos = partidos.slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={handleCollapse} />

      <div className={`min-w-0 transition-all duration-300`} style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title="Panel Jugador" sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 pb-[60px] max-md:p-5 relative">
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />

          {/* Perfil deportivo — resumen */}
          <section className="rounded-2xl mb-[26px] relative overflow-hidden border border-gold/20" style={{ minHeight: '280px' }}>
            <img src="/dash-board.jpg" alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover', objectPosition: 'center center' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-deep2/60 via-purple-black/40 to-transparent" />
            <div className="relative z-10 flex items-center gap-6 flex-wrap px-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-purple-mid flex items-center justify-center text-3xl font-bold text-white ring-2 ring-gold/40">
                <span>7</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Juan Camilo Rivera</h2>
                <p className="text-sm text-gold/70">Delantero · Camiseta #7</p>
                <div className="flex gap-4 mt-2 text-xs text-text-muted">
                  <span>⚽ 12 goles</span>
                  <span>📋 8 partidos</span>
                  <span>🟨 2 tarjetas</span>
                </div>
              </div>
              <Button onClick={() => { setEditingProfile(true); setEditName(user?.name || '') }} className="rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 text-sm">
                Editar perfil
              </Button>
            </div>
          </section>

          {/* Grid: Equipo + Estadísticas + Torneos */}
          <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-5 mb-[26px]">

            {/* Equipo */}
            <SpotlightCard accent="gold" className="p-5 bg-gradient-to-br from-purple-deep2/80 to-purple-black/80 border border-gold/20 rounded-2xl shadow-lg shadow-purple-900/20">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
                <span className="text-gold">👥</span> <span className="text-gold">Mi equipo</span>
              </h3>
              <div className="text-center py-4">
                <p className="text-4xl mb-2 opacity-60">🏠</p>
                <p className="text-sm text-text-muted mb-4">No pertenecés a ningún equipo aún</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/torneos')} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs font-bold px-4 shadow-lg shadow-gold/20">
                    Buscar equipo
                  </Button>
                  <Button onClick={() => navigate('/crear-equipo')} variant="outline" className="rounded-full border-gold/30 text-gold hover:bg-gold/10 text-xs px-4">
                    Crear equipo
                  </Button>
                </div>
              </div>
            </SpotlightCard>

            {/* Estadísticas rápidas */}
            <SpotlightCard accent="purple" className="p-5 bg-gradient-to-br from-purple-deep/70 to-purple-black/80 border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-900/20">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
                <span>📊</span> Mis estadísticas
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Partidos jugados', value: '8', color: 'text-purple-300' },
                  { label: 'Goles marcados', value: '12', color: 'text-gold' },
                  { label: 'Asistencias', value: '4', color: 'text-purple-300' },
                  { label: 'Tarjetas amarillas', value: '2', color: 'text-yellow-400' },
                  { label: 'Minutos jugados', value: '620\'', color: 'text-gray-400' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between text-sm bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
                    <span className="text-text-muted">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Solicitudes / Invitaciones */}
            <SpotlightCard accent="gold" className="p-5 bg-gradient-to-br from-purple-deep2/80 to-purple-black/80 border border-gold/20 rounded-2xl shadow-lg shadow-purple-900/20">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
                <span className="text-gold">📨</span> <span className="text-gold">Invitaciones</span>
              </h3>
              <div className="text-center py-4">
                <p className="text-4xl mb-2 opacity-60">🔔</p>
                <p className="text-sm text-text-muted">No tenés invitaciones pendientes</p>
                <p className="text-xs text-text-faint mt-1">Las invitaciones de capitanes aparecerán acá</p>
              </div>
            </SpotlightCard>
          </section>

          {/* Torneos disponibles + Próximos partidos */}
          <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
            
            {/* Torneos disponibles */}
            <SpotlightCard accent="purple" className="p-[22px_24px] bg-gradient-to-br from-purple-deep/70 to-purple-black/80 border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-900/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">🏆 Torneos disponibles</h3>
                <Link to="/torneos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-3">
                {torneosDisponibles.map((t) => (
                  <button key={t.id} onClick={() => { setTorneoModal(t); setModalTab('info') }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-mid/20 hover:border-gold/40 hover:bg-purple-deep/40 transition-all cursor-pointer group text-left">
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{t.nombre}</p>
                      <p className="text-xs text-text-muted">{t.fecha} · {t.categoria}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      t.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-400/30' : 'bg-gold/20 text-gold border border-gold/30'
                    }`}>
                      {t.estado === 'live' ? 'En vivo' : 'Próximo'}
                    </span>
                  </button>
                ))}
              </div>
            </SpotlightCard>

            {/* Próximos partidos */}
            <SpotlightCard accent="gold" className="p-[22px_24px] bg-gradient-to-br from-purple-deep2/70 to-purple-black/80 border border-gold/20 rounded-2xl shadow-lg shadow-purple-900/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">📅 Próximos partidos</h3>
                <Link to="/mis-partidos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  Ver todos →
                </Link>
              </div>
              {misPartidos.length > 0 ? (
                misPartidos.map((m, i) => (
                  <Link key={i} to={`/partido/${i + 1}`} className="flex items-center gap-3.5 py-3 border-b border-gold/10 last:border-b-0 hover:bg-white/[0.05] transition-all rounded-lg -mx-2 px-2 group">
                    <div className="w-[52px] text-center flex-shrink-0 bg-purple-deep/40 rounded-lg py-1 border border-purple-mid/20">
                      <b className="block font-[family-name:var(--font-display)] text-lg text-white">{m.dia}</b>
                      <span className="text-[10px] text-text-muted uppercase">{m.mes}</span>
                    </div>
                    <div className="flex-1 text-[13.5px] font-semibold text-white">
                      {m.eq1} <span className="text-text-faint">vs</span> {m.eq2}
                      <small className="block font-normal text-text-muted text-[11.5px] mt-0.5">{m.lugar}</small>
                    </div>
                    <div className="text-xs text-gold font-bold bg-gold/10 px-2.5 py-1 rounded-full">{m.hora}</div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-text-muted">
                  No hay partidos programados aún
                </div>
              )}
            </SpotlightCard>
          </section>

          {/* CTA: Chat de equipo */}
          <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-gradient-to-r from-purple-deep2 to-purple-black border border-white/10 max-md:flex-col max-md:items-start">
            <div>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1">Chat de equipo</h3>
              <p className="text-[13px] text-text-muted">Comunicate con tu equipo, coordiná estrategias y recibí novedades del torneo.</p>
            </div>
            <InteractiveHoverButton onClick={() => navigate('/chat')}>
              Ir al chat
            </InteractiveHoverButton>
          </section>
        </main>

        <Footer />
      </div>
      <ManchasFloating />

      {/* Modal editar perfil */}
      <AnimatePresence>
        {editingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditingProfile(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-purple-deep2 to-purple-black border border-gold/30 rounded-3xl w-full max-w-lg shadow-2xl shadow-purple-900/40 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-white">Editar <span className="text-gold">perfil</span></h2>
                <button onClick={() => setEditingProfile(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors">
                  <X size={16} className="text-gray-light" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold/40">
                    <img src={user?.avatar || 'https://i.pravatar.cc/150?img=13'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-mid border-2 border-black flex items-center justify-center"><Camera size={10} className="text-white" /></button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gold/60 capitalize">{user?.role || 'jugador'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Nombre completo</label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/40 border-gold/20 text-white rounded-xl h-11 focus-visible:border-gold" />
                </div>
                <div className="relative">
                  <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Correo</label>
                  <Input defaultValue={user?.email || 'correo@escuelaing.edu.co'} className="bg-black/40 border-gold/20 text-white/60 rounded-xl h-11 pr-10" disabled />
                  <Lock size={14} className="absolute right-3 top-[38px] text-text-faint" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Programa</label>
                    <select value={editProgram} onChange={e => setEditProgram(e.target.value)} className="w-full bg-black/40 border border-gold/20 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                      <option>Ing. Sistemas</option><option>Ing. Industrial</option><option>Ing. Civil</option><option>Matemáticas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
                    <select value={editSemester} onChange={e => setEditSemester(e.target.value)} className="w-full bg-black/40 border border-gold/20 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                      {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}°</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {editSaved && (
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
                  <CheckCircle size={16} /> Cambios guardados
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditingProfile(false)} className="rounded-full border-gold/30 text-gold hover:bg-gold/10 h-11 px-6 text-sm">Cancelar</Button>
                <Button onClick={handleSaveProfile} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-11 px-6 text-sm">Guardar cambios</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="relative max-w-2xl w-full bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
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

