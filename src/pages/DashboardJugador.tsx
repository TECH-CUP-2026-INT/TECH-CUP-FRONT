import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { InteractiveHoverButton } from '@/components/common/interactive-hover-button'
import { Badge } from '@/components/common/badge'
import { useAuth } from '@/hooks/auth/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/common/avatar'
import ManchasFloating from '@/components/common/ManchasFloating'
import FallingBalls from '@/components/FallingBalls'
import { partidos, posiciones } from '@/services/partidos'
import { torneos } from '@/services/torneos'
import {
  Camera, Lock, CheckCircle, X, CalendarDays, Trophy, Clock, MapPin, Download, Medal, Users, Package, QrCode, Check, RefreshCw, Swords, Shirt, Apple, Smartphone, Truck, ChevronRight, UserCheck, ClipboardList, Search, Plus, ArrowLeft, UserPlus, Send, Trash2, Edit3
} from 'lucide-react'
import type { Torneo } from '@/services/torneos'

const SIDEBAR_KEY = 'techcup_sidebar_collapsed'

/* ─── equipo mock ─── */
const MI_EQUIPO = {
  id: 1, nombre: 'Tigres FC', emoji: '🐯', capitan: 'Juan Camilo Rivera',
  colorPrimario: '#EF4444', colorSecundario: '#F97316',
  jugadores: [
    { id:1, nombre:'Carlos Martínez', posicion:'Arquero', dorsal:1, estaJugando:true },
    { id:2, nombre:'Andrés López', posicion:'Defensor', dorsal:4, estaJugando:true },
    { id:3, nombre:'Miguel Ángel Ruiz', posicion:'Defensor', dorsal:2, estaJugando:true },
    { id:4, nombre:'Felipe Torres', posicion:'Defensor', dorsal:3, estaJugando:true },
    { id:5, nombre:'Jorge Hernández', posicion:'Mediocampista', dorsal:5, estaJugando:true },
    { id:6, nombre:'Santiago Pérez', posicion:'Mediocampista', dorsal:8, estaJugando:true },
    { id:7, nombre:'Daniel Castro', posicion:'Mediocampista', dorsal:10, estaJugando:true },
    { id:8, nombre:'Laura Gómez', posicion:'Delantero', dorsal:7, estaJugando:true },
    { id:9, nombre:'Juan Pablo Mora', posicion:'Delantero', dorsal:9, estaJugando:true },
    { id:10, nombre:'Camila Rojas', posicion:'Delantero', dorsal:11, estaJugando:true },
    { id:11, nombre:'Pedro Infante', posicion:'Defensor', dorsal:6, estaJugando:true },
  ],
}

const dotacionItems = [
  { id:1, nombre:'Camiseta titular', tipo:'kit', cantidad:11, estado:'pendiente' as const },
  { id:2, nombre:'Camiseta suplente', tipo:'kit', cantidad:11, estado:'pendiente' as const },
  { id:3, nombre:'Short deportivo', tipo:'kit', cantidad:11, estado:'pendiente' as const },
  { id:4, nombre:'Medias', tipo:'kit', cantidad:22, estado:'entregado' as const },
  { id:5, nombre:'Petos entrenamiento', tipo:'kit', cantidad:11, estado:'pendiente' as const },
  { id:6, nombre:'Hidratación (botellas)', tipo:'refrigerio', cantidad:24, estado:'pendiente' as const },
  { id:7, nombre:'Frutas', tipo:'refrigerio', cantidad:24, estado:'pendiente' as const },
  { id:8, nombre:'Barras energéticas', tipo:'refrigerio', cantidad:24, estado:'entregado' as const },
]

type CapitanTab = 'dashboard' | 'equipo' | 'logistica' | 'qr'

export default function DashboardJugador() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored ? JSON.parse(stored) : false
  })
  const navigate = useNavigate()
  const { user, becomeCaptain } = useAuth()

  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editProgram, setEditProgram] = useState('Ing. Sistemas')
  const [editSemester, setEditSemester] = useState('6')
  const [editSaved, setEditSaved] = useState(false)
  const [torneoModal, setTorneoModal] = useState<Torneo | null>(null)
  const [modalTab, setModalTab] = useState('info')
  const [browseTeamsOpen, setBrowseTeamsOpen] = useState(false)
  const [teamSearch, setTeamSearch] = useState('')

  const equiposDisponibles = [
    { nom: 'Tigres FC', img: '/images/logo1.png', jug: '8/12', vac: 4, cap: 'Carlos M.', desc: 'Equipo competitivo buscando delantero y defensas.' },
    { nom: 'Code United', img: '/images/logo2.png', jug: '10/12', vac: 2, cap: 'Ana G.', desc: 'Buscamos mediocampista y portero para la temporada.' },
    { nom: 'Sistemas FC', img: '/images/logo3.png', jug: '7/12', vac: 5, cap: 'Pedro L.', desc: 'Equipo nuevo, abiertos a todas las posiciones.' },
    { nom: 'IA Warriors', img: '/images/logo4.png', jug: '9/12', vac: 3, cap: 'Laura R.', desc: 'Refuerzos para ataque y defensa.' },
    { nom: 'Dragones FC', img: '/images/logo1.png', jug: '11/12', vac: 1, cap: 'Jorge H.', desc: 'Buscamos un extremo rápido.' },
    { nom: 'Los Bits', img: '/images/logo2.png', jug: '6/12', vac: 6, cap: 'Diana F.', desc: 'Equipo en formación, todas las posiciones disponibles.' },
  ]

  /* ─── captain state ─── */
  const [capitanTab, setCapitanTab] = useState<CapitanTab>('dashboard')
  const [calExpandido, setCalExpandido] = useState(false)
  const [qrGenerado, setQrGenerado] = useState(false)
  const [qrEntregado, setQrEntregado] = useState(false)
  const [dotacion, setDotacion] = useState(dotacionItems)

  const isCaptain = user?.isCaptain ?? false

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

  const handleCrearEquipo = () => {
    becomeCaptain()
    navigate('/crear-equipo')
  }

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'
  const torneosDisponibles = torneos.filter(t => t.estado === 'live' || t.estado === 'upcoming').slice(0, 3)
  const misPartidos = partidos.slice(0, 3)

  /* QR data */
  const qrData = JSON.stringify({
    equipo: MI_EQUIPO.nombre,
    capitan: MI_EQUIPO.capitan,
    torneo: 'TechCup 2026-II',
    entrega: 'dotacion-completa',
    timestamp: new Date().toISOString(),
  })
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`

  return (
    <div className="min-h-screen bg-black">
      <FallingBalls count={40} duration={20000} startDelay={2000} triggerOnScroll={true} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={handleCollapse} />

      <div className="min-w-0 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title={isCaptain ? `Panel Capitán — ${MI_EQUIPO.nombre}` : 'Panel Jugador'} sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 pb-[60px] max-md:p-5 relative" style={{ backgroundImage: 'linear-gradient(rgba(30,10,60,0.65), rgba(30,10,60,0.65)), url(/images/fondo3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>

          {/* ═══════════ PERFIL ═══════════ */}
          <section className="rounded-2xl mb-[26px] relative overflow-hidden border border-purple-mid/30" style={{ minHeight: '280px' }}>
            <img src="/dash-board.jpg" alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover', objectPosition: 'center center' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 flex items-center gap-6 flex-wrap px-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-purple-mid flex items-center justify-center text-3xl font-bold text-white ring-2 ring-gold/40">
                <span>7</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{user?.name || 'Juan Camilo Rivera'}</h2>
                <p className="text-sm text-gold/70">Delantero · Camiseta #7{isCaptain ? ` · ${MI_EQUIPO.emoji} Capitán de ${MI_EQUIPO.nombre}` : ''}</p>
                <div className="flex gap-4 mt-2 text-xs text-text-muted">
                  <span>⚽ 12 goles</span>
                  <span>📋 8 partidos</span>
                  <span>🟨 2 tarjetas</span>
                </div>
              </div>
              <Button onClick={() => { setEditingProfile(true); setEditName(user?.name || '') }} className="rounded-full bg-gold/10 border border-purple-mid/40 text-gold hover:bg-gold/20 text-sm">
                Editar perfil
              </Button>
            </div>
          </section>

          {/* ═══════════ PLAYER GRID (no capitán o siempre visible) ═══════════ */}
          <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-5 mb-[26px]">
            {/* Equipo */}
            <SpotlightCard accent="purple" className="p-5 bg-black/40 backdrop-blur-sm border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-mid/10">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
                <span className="text-gold">{isCaptain ? MI_EQUIPO.emoji : '👥'}</span> <span className="text-gold">{isCaptain ? MI_EQUIPO.nombre : 'Mi equipo'}</span>
              </h3>
              {isCaptain ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Jugadores:</span>
                    <span className="font-bold text-white">{MI_EQUIPO.jugadores.length}/12</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Medal size={12} className="text-gold" /> Capitán: {MI_EQUIPO.capitan}
                  </div>
                  <Button onClick={() => navigate('/mi-equipo')} size="sm" className="w-full rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 text-xs h-8 font-bold mt-1">
                    <Users size={13} className="mr-1" /> Gestionar equipo
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-4xl mb-2 opacity-60">🏠</p>
                  <p className="text-sm text-text-muted mb-4">No pertenecés a ningún equipo aún</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setBrowseTeamsOpen(true)} className="rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 text-xs font-bold px-4">Buscar equipo</Button>
                    <Button onClick={handleCrearEquipo} variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border border-purple-mid/40 text-gold hover:bg-gold/15 hover:border-gold/60 hover:text-white text-xs px-4">Crear equipo</Button>
                  </div>
                </div>
              )}
            </SpotlightCard>



            {/* Invitaciones */}
            <SpotlightCard accent="purple" className="p-5 bg-black/40 backdrop-blur-sm border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-mid/10">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white"><span className="text-gold">📨</span> <span className="text-gold">Invitaciones</span></h3>
              <div className="text-center py-4">
                <p className="text-4xl mb-2 opacity-60">🔔</p>
                <p className="text-sm text-text-muted">No tenés invitaciones pendientes</p>
                <p className="text-xs text-text-faint mt-1">{isCaptain ? 'Las solicitudes de jugadores aparecen en tu panel de capitán' : 'Las invitaciones de capitanes aparecerán acá'}</p>
              </div>
            </SpotlightCard>
          </section>

          {/* ═══════════ TORNEOS + PARTIDOS ═══════════ */}
          <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
            <SpotlightCard accent="purple" className="p-[22px_24px] bg-black/30 backdrop-blur-sm border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-mid/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">🏆 Torneos disponibles</h3>
                <Link to="/torneos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">Ver todos →</Link>
              </div>
              <div className="space-y-3">
                {torneosDisponibles.map((t) => (
                  <button key={t.id} onClick={() => { setTorneoModal(t); setModalTab('info') }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-mid/20 hover:border-gold/40 hover:bg-purple-deep/40 transition-all cursor-pointer group text-left">
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{t.nombre}</p>
                      <p className="text-xs text-text-muted">{t.fecha} · {t.categoria}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${t.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-400/30' : 'bg-gold/20 text-gold border border-purple-mid/40'}`}>
                      {t.estado === 'live' ? 'En vivo' : 'Próximo'}
                    </span>
                  </button>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard accent="purple" className="p-[22px_24px] bg-black/40 backdrop-blur-sm border border-purple-mid/30 rounded-2xl shadow-lg shadow-purple-mid/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">📅 Próximos partidos</h3>
                <Link to="/mis-partidos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">Ver todos →</Link>
              </div>
              {misPartidos.map((m, i) => (
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
              ))}
            </SpotlightCard>
          </section>

          {/* ═══════════════════ CAPITÁN FEATURES ═══════════════════ */}
          {isCaptain && (
            <>
              {/* Hero capitán */}
              <section className="relative rounded-2xl overflow-hidden mb-5 border border-white/10">
                <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 60% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                <div className="relative z-10 p-8 max-md:p-5 flex items-center justify-between max-md:flex-col max-md:gap-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl leading-tight mb-1">
                      {MI_EQUIPO.emoji} Panel de <span className="text-gold">Capitán</span>
                    </h2>
                    <p className="text-sm text-white/60">Gestioná tu equipo, logística y validaciones de {MI_EQUIPO.nombre}.</p>
                  </div>
                  <Badge className="rounded-full bg-gold/20 text-gold border border-purple-mid/40 h-auto px-3 py-1.5 text-[11px] font-bold">
                    {MI_EQUIPO.emoji} {MI_EQUIPO.capitan}
                  </Badge>
                </div>
              </section>

              {/* Tabs capitán */}
              <div className="flex items-center gap-1 mb-6 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
                {([
                  { id:'dashboard' as CapitanTab, label:'Dashboard', icon: Trophy },
                  { id:'equipo' as CapitanTab, label:'Mi Equipo', icon: Users },
                  { id:'logistica' as CapitanTab, label:'Logística', icon: Package },
                  { id:'qr' as CapitanTab, label:'QR Dotación', icon: QrCode },
                ]).map(t => (
                  <button key={t.id} onClick={() => setCapitanTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all whitespace-nowrap ${
                      capitanTab === t.id ? 'bg-gold/20 backdrop-blur-md border border-gold/40 text-gold' : 'text-white/50 backdrop-blur-sm hover:text-white hover:bg-white/10'
                    }`}>
                    <t.icon size={16} /> {t.label}
                  </button>
                ))}
              </div>

              {/* ─── CAPITÁN DASHBOARD ─── */}
              {capitanTab === 'dashboard' && (
                <>
                  <section className="grid grid-cols-4 max-lg:grid-cols-2 gap-[18px] mb-[26px]">
                    {[
                      { icon:'👥', num:MI_EQUIPO.jugadores.length.toString(), label:'Jugadores', accent:'purple' },
                      { icon:'📅', num:'6', label:'Próximos partidos', accent:'gold' },
                      { icon:'🥇', num:'3º', label:'Posición', accent:'purple' },
                      { icon:'📋', num:`${dotacion.filter(d => d.estado === 'entregado').length}/${dotacion.length}`, label:'Dotación recibida', accent:'gold' },
                    ].map((s, i) => (
                      <SpotlightCard key={i} accent={s.accent as 'gold'|'purple'} className="p-5 flex gap-3.5 items-center bg-surface border-border rounded-2xl">
                        <span className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center flex-shrink-0 ${s.accent === 'purple' ? 'bg-purple-mid/20 text-[#b39ef2]' : 'bg-gold/15 text-gold'}`}>{s.icon}</span>
                        <div><div className="font-[family-name:var(--font-display)] text-[26px] leading-none">{s.num}</div><div className="text-xs text-text-muted mt-1">{s.label}</div></div>
                      </SpotlightCard>
                    ))}
                  </section>

                  <div className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
                    <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2"><CalendarDays size={16} className="text-gold" /> Próximos partidos</h3>
                        <button onClick={() => setCalExpandido(!calExpandido)} className="text-xs text-gold font-bold">{calExpandido ? 'Ver menos ↑' : 'Ver todos →'}</button>
                      </div>
                      {partidos.slice(0, calExpandido ? partidos.length : 2).map((m, i) => (
                        <button key={i} onClick={() => navigate(`/partido/${i + 1}`)}
                          className="w-full flex items-center gap-3.5 py-3 border-b border-border last:border-b-0 hover:bg-white/[0.03] transition-colors rounded-lg -mx-2 px-2 text-left">
                          <div className="w-[52px] text-center flex-shrink-0">
                            <b className="block font-[family-name:var(--font-display)] text-lg text-white">{m.dia}</b>
                            <span className="text-[10px] text-text-muted uppercase">{m.mes}</span>
                          </div>
                          <div className="flex-1 text-[13.5px] font-semibold text-white">
                            {m.eq1} <span className="text-text-faint">vs</span> {m.eq2}
                            <small className="block font-normal text-text-muted text-[11.5px] mt-0.5">{m.lugar}</small>
                          </div>
                          <div className="text-xs text-gold font-bold">{m.hora}</div>
                        </button>
                      ))}
                    </SpotlightCard>

                    <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                      <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                        <Trophy size={16} className="text-gold" /> Posiciones
                      </h3>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-[10.5px] text-text-faint uppercase tracking-[.5px] font-semibold text-left">
                            <th className="pb-2.5">Pos</th><th className="pb-2.5">Equipo</th><th className="pb-2.5">PJ</th><th className="pb-2.5">DG</th><th className="pb-2.5 text-right">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posiciones.slice(0, 5).map((r, i) => {
                            const isMine = r.equipo === MI_EQUIPO.nombre
                            return (
                              <tr key={i} className={`text-[13px] ${isMine ? 'text-gold font-bold bg-gold/5' : ''}`}>
                                <td className="py-2 text-text-muted w-[26px]">{r.pos}</td>
                                <td className="py-2 border-t border-border">{i === 0 ? '🏆 ' : ''}{r.equipo} {isMine && '👈'}</td>
                                <td className="py-2 border-t border-border">{r.pj}</td>
                                <td className="py-2 border-t border-border">{r.dg > 0 ? '+' : ''}{r.dg}</td>
                                <td className="py-2 border-t border-border text-right font-bold">{r.pts}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </SpotlightCard>
                  </div>
                </>
              )}

              {/* ─── MI EQUIPO ─── */}
              {capitanTab === 'equipo' && (
                <div className="grid grid-cols-[1.3fr_1fr] gap-5 items-start max-lg:grid-cols-1">
                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{MI_EQUIPO.emoji}</span>
                      <div>
                        <h3 className="text-[16px] font-bold">{MI_EQUIPO.nombre}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          <Medal size={11} className="text-gold" /> Capitán: {MI_EQUIPO.capitan}
                          <span>• {MI_EQUIPO.jugadores.length} jug.</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        { label:'🧤 Arqueros', value:MI_EQUIPO.jugadores.filter(j => j.posicion === 'Arquero').length },
                        { label:'🛡️ Defensas', value:MI_EQUIPO.jugadores.filter(j => j.posicion === 'Defensor').length },
                        { label:'🎯 Medios', value:MI_EQUIPO.jugadores.filter(j => j.posicion === 'Mediocampista').length },
                        { label:'⚡ Delanteros', value:MI_EQUIPO.jugadores.filter(j => j.posicion === 'Delantero').length },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-2 rounded-lg bg-black/30">
                          <div className="text-lg font-bold text-white">{s.value}</div>
                          <div className="text-[9px] text-text-muted">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                      {MI_EQUIPO.jugadores.map(j => (
                        <div key={j.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ backgroundColor: MI_EQUIPO.colorPrimario + '44' }}>{j.dorsal}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[12.5px] font-semibold">{j.nombre}</span>
                              {j.nombre === MI_EQUIPO.capitan && <Medal size={9} className="text-gold" />}
                            </div>
                            <span className="text-[9.5px] text-text-muted">{j.posicion === 'Arquero' ? '🧤' : j.posicion === 'Defensor' ? '🛡️' : j.posicion === 'Mediocampista' ? '🎯' : '⚡'} {j.posicion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                      <Button className="flex-1 rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 text-[11px] h-8 font-bold"><Swords size={13} className="mr-1" /> Elegir alineación</Button>
                      <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 text-[11px] h-8"><UserPlus size={13} className="mr-1" /> Invitar jugador</Button>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                      <ClipboardList size={16} className="text-gold" /> Solicitudes
                    </h3>
                    {[
                      { id:1, jugador:'Jorge Hernández', posicion:'Defensor', estado:'pendiente' as const },
                      { id:2, jugador:'Valentina Orozco', posicion:'Mediocampista', estado:'pendiente' as const },
                    ].map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-sm">{s.posicion === 'Defensor' ? '🛡️' : '🎯'}</div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[12.5px] font-semibold">{s.jugador}</span>
                          <span className="text-[10px] text-text-muted ml-2">{s.posicion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30"><Check size={13} /></button>
                          <button className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30"><X size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </SpotlightCard>
                </div>
              )}

              {/* ─── LOGÍSTICA ─── */}
              {capitanTab === 'logistica' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-display)] uppercase text-lg tracking-[.5px]">
                      Logística: <span className="text-gold">refrigerios y kits</span>
                    </h3>
                    <Button onClick={() => setCapitanTab('qr')} className="rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 text-xs h-9 px-4 font-bold">
                      <QrCode size={14} className="mr-1.5" /> Generar QR
                    </Button>
                  </div>
                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                      <Package size={16} className="text-gold" /> Dotación del equipo
                    </h3>
                    <div className="space-y-2">
                      {dotacion.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-purple-mid/30 transition-all">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.tipo === 'kit' ? 'bg-purple-mid/20 text-[#b39ef2]' : 'bg-gold/15 text-gold'}`}>
                            {item.tipo === 'kit' ? <Shirt size={18} /> : <Apple size={18} />}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-[13px]">{item.nombre}</span>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                              <span>{item.tipo === 'kit' ? '👕 Kit' : '🍎 Refrigerio'}</span>
                              <span>• {item.cantidad} unidades</span>
                            </div>
                          </div>
                          <Badge className={`rounded-full text-[9px] px-2 py-0.5 h-auto ${item.estado === 'entregado' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {item.estado === 'entregado' ? '✅ Entregado' : '⏳ Pendiente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0"><Smartphone size={22} className="text-gold" /></div>
                      <div>
                        <h3 className="font-semibold text-[14px] mb-1">¿Cómo funciona la validación?</h3>
                        <p className="text-[11.5px] text-text-muted leading-relaxed">
                          1. El capitán genera un código QR desde la sección <strong className="text-white">QR Dotación</strong>.<br />
                          2. El administrador o árbitro escanea el QR con su dispositivo.<br />
                          3. El sistema registra automáticamente la entrega de la dotación completa.<br />
                          4. Ambos reciben una confirmación de la transacción.
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* ─── QR DOTACIÓN ─── */}
              {capitanTab === 'qr' && (
                <div className="max-w-lg mx-auto space-y-6">
                  <div className="text-center">
                    <h3 className="font-[family-name:var(--font-display)] uppercase text-xl tracking-[.5px] mb-2">QR de <span className="text-gold">dotación</span></h3>
                    <p className="text-[12px] text-text-muted">Generá el código QR para que el administrador escanee y valide la entrega.</p>
                  </div>
                  <SpotlightCard accent="purple" className="p-8 bg-surface border-border rounded-2xl">
                    <div className="flex flex-col items-center gap-5">
                      {!qrGenerado ? (
                        <div className="w-[250px] h-[250px] rounded-2xl bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
                          <QrCode size={48} className="text-white/20" />
                          <span className="text-[12px] text-text-muted">QR no generado</span>
                          <Button onClick={() => setQrGenerado(true)} className="rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 text-xs h-9 px-5 font-bold">
                            <RefreshCw size={14} className="mr-1.5" /> Generar QR ahora
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <img src={qrUrl} alt="QR de dotación" className="w-[250px] h-[250px] rounded-2xl border-2 border-purple-mid/40 bg-white p-3" />
                            {qrEntregado && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
                                <div className="text-center">
                                  <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-2"><Check size={36} className="text-green-400" /></div>
                                  <span className="text-green-400 font-bold text-sm">✅ Validado</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {!qrEntregado ? (
                              <>
                                <Button onClick={() => setQrEntregado(true)} className="rounded-full bg-green-500/10 backdrop-blur-md border border-green-400/30 text-green-400 hover:bg-green-500/20 hover:text-green-300 text-xs h-9 px-5 font-bold">
                                  <Smartphone size={14} className="mr-1.5" /> Simular escaneo
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs h-9 px-4">
                                  <Download size={13} className="mr-1" /> Descargar
                                </Button>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"><Check size={14} /> ¡Dotación validada!</div>
                                <Button onClick={() => { setQrGenerado(false); setQrEntregado(false) }} variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs h-9 px-4">
                                  <RefreshCw size={13} className="mr-1" /> Generar nuevo
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </SpotlightCard>
                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4"><Truck size={16} className="text-gold" /> Historial de entregas</h3>
                    <div className="space-y-2">
                      {[
                        { fecha:'12/07/2026', items:'Medias, Barras energéticas', responsable:'Roberto Gómez (Admin)', estado:'entregado' as const },
                        { fecha:'Hoy', items:'Resto de dotación', responsable:'Pendiente de escaneo', estado:'pendiente' as const },
                      ].map((h, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5">
                          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">{h.estado === 'entregado' ? <Check size={16} className="text-green-400" /> : <Clock size={16} className="text-yellow-400" />}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-semibold">{h.fecha}</span>
                              <Badge className={`rounded-full text-[8px] px-2 py-0.5 h-auto ${h.estado === 'entregado' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                {h.estado === 'entregado' ? '✅ Entregado' : '⏳ Pendiente'}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-text-muted">{h.items} — {h.responsable}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-black/50 backdrop-blur-sm border border-white/10 mt-6 max-md:flex-col max-md:items-start">
            <div>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1">Chat de equipo</h3>
              <p className="text-[13px] text-text-muted">Comunicate con tu equipo, coordiná estrategias y recibí novedades del torneo.</p>
            </div>
            <InteractiveHoverButton onClick={() => navigate('/chat')}>Ir al chat</InteractiveHoverButton>
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
              className="bg-black/60 backdrop-blur-lg border border-purple-mid/40 rounded-3xl w-full max-w-lg shadow-2xl shadow-gold/10 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-white">Editar <span className="text-gold">perfil</span></h2>
                <button onClick={() => setEditingProfile(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors"><X size={16} className="text-gray-light" /></button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold/40">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={user?.avatar || ''} alt="" className="w-full h-full object-cover" />
                        <AvatarFallback className="text-sm font-bold">{(user?.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-mid border-2 border-black flex items-center justify-center"><Camera size={10} className="text-white" /></button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-white">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gold/60 capitalize">{user?.role || 'jugador'}{user?.isCaptain ? ' · Capitán' : ''}</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Nombre completo</label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/40 border-purple-mid/30 text-white rounded-xl h-11 focus-visible:border-gold" />
                </div>
                <div className="relative">
                  <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Correo</label>
                  <Input defaultValue={user?.email || 'correo@escuelaing.edu.co'} className="bg-black/40 border-purple-mid/30 text-white/60 rounded-xl h-11 pr-10" disabled />
                  <Lock size={14} className="absolute right-3 top-[38px] text-text-faint" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Programa</label>
                    <select value={editProgram} onChange={e => setEditProgram(e.target.value)} className="w-full bg-black/40 border border-purple-mid/30 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                      <option>Ing. Sistemas</option><option>Ing. Industrial</option><option>Ing. Civil</option><option>Matemáticas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gold/60 font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
                    <select value={editSemester} onChange={e => setEditSemester(e.target.value)} className="w-full bg-black/40 border border-purple-mid/30 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                      {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}°</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {editSaved && (
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4"><CheckCircle size={16} /> Cambios guardados</div>
              )}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditingProfile(false)} className="rounded-full bg-white/5 backdrop-blur-md border border-purple-mid/40 text-gold hover:bg-gold/15 hover:border-gold/60 hover:text-white h-11 px-6 text-sm">Cancelar</Button>
                <Button onClick={handleSaveProfile} className="rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 font-bold h-11 px-6 text-sm">Guardar cambios</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal detalle torneo (simplificado) */}
      {torneoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setTorneoModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative max-w-lg w-full bg-white dark:bg-[#1D0E33] rounded-2xl overflow-hidden border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTorneoModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
            <div className="p-6 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-white">{torneoModal.nombre}</h3>
              <p className="text-text-muted text-sm mt-1">{torneoModal.fecha} · {torneoModal.categoria}</p>
              <Button onClick={() => { setTorneoModal(null); navigate(`/torneo/${torneoModal.id}`) }} className="mt-4 rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10 font-bold">Ver detalle</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Buscar equipo ─── */}
      <AnimatePresence>
        {browseTeamsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setBrowseTeamsOpen(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#1A0D2E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              
              <div className="px-8 pt-10 pb-6 text-center border-b border-white/5">
                <button onClick={() => setBrowseTeamsOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold transition-colors"><X size={16} /></button>
                <span className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-4">
                  👥 Equipos disponibles
                </span>
                <h2 className="font-[family-name:var(--font-display-alt)] font-bold text-[clamp(28px,3.5vw,42px)] leading-[.92] tracking-[.5px] uppercase italic mb-3">
                  <span className="text-white">Explorá los</span> <span className="text-gold">equipos</span>
                </h2>
                <p className="text-base leading-relaxed text-[#7A6B99] max-w-[560px] mx-auto">
                  Descubre los equipos inscritos, mirá sus vacantes y enviá solicitud para unirte.
                </p>
              </div>

              {/* Buscador */}
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-gold/40 transition-all">
                  <Search size={14} className="text-text-faint shrink-0" />
                  <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)} placeholder="Buscar equipo por nombre..." className="bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm w-full" />
                </div>
              </div>
              <div className="max-h-[45vh] overflow-y-auto p-6 pt-2 space-y-3">
                {equiposDisponibles.filter(eq => eq.nom.toLowerCase().includes(teamSearch.toLowerCase())).map((eq, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-purple-mid/20 hover:border-purple-mid/50 transition-all group">
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-gold/30 bg-black/40">
                      <img src={eq.img} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{eq.nom}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${eq.vac > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {eq.vac > 0 ? `${eq.vac} vacante${eq.vac > 1 ? 's' : ''}` : 'Completo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">{eq.desc}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-faint">
                        <span>👥 {eq.jug}</span>
                        <span>👤 Capitán: {eq.cap}</span>
                      </div>
                    </div>
                    <button disabled={eq.vac === 0}
                      onClick={() => { if (eq.vac > 0) { alert(`Solicitud enviada a ${eq.nom} ✅`); setBrowseTeamsOpen(false) } }}
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${eq.vac > 0 ? 'bg-gold/20 text-gold hover:bg-gold/30 cursor-pointer' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                      Unirme
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
