import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { Button } from '@/components/common/button'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { InteractiveHoverButton } from '@/components/common/interactive-hover-button'
import { Badge } from '@/components/common/badge'
import ManchasFloating from '@/components/common/ManchasFloating'
import { partidos, posiciones } from '@/services/partidos'
import {
  Trophy, CalendarDays, MapPin, Users, Clock, ShieldCheck,
  ClipboardList, ChevronRight, Medal, Shirt, Apple, Package,
  QrCode, Check, X, Download, RefreshCw, Swords, UserCheck,
  Smartphone, Scan, Truck
} from 'lucide-react'

const SIDEBAR_KEY = 'techcup_sidebar_collapsed'
type CapitanTab = 'dashboard' | 'equipo' | 'logistica' | 'qr'

interface Jugador {
  id: number; nombre: string; posicion: string; dorsal: number; estaJugando: boolean
}

const equipo = {
  id: 1, nombre: 'Tigres FC', emoji: '🐯', capitan: 'Carlos Martínez',
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

const equiposRefrigerio = ['Tigres FC', 'IA Warriors', 'Code United', 'Sistemas FC', 'Dragones FC']

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

export default function DashboardCapitan() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored ? JSON.parse(stored) : false
  })
  const [activeTab, setActiveTab] = useState<CapitanTab>('dashboard')
  const [posExpandida, setPosExpandida] = useState(false)
  const [calExpandido, setCalExpandido] = useState(false)
  const [qrGenerado, setQrGenerado] = useState(false)
  const [qrEntregado, setQrEntregado] = useState(false)
  const [dotacion, setDotacion] = useState(dotacionItems)
  const [matchModal, setMatchModal] = useState<typeof partidos[0] | null>(null)
  const [teamModal, setTeamModal] = useState<typeof equipo | null>(null)

  const handleCollapse = (val: boolean) => {
    setSidebarCollapsed(val)
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(val))
  }

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'

  // QR data: equipo + timestamp (simula validación)
  const qrData = JSON.stringify({
    equipo: 'Tigres FC',
    capitan: 'Carlos Martínez',
    torneo: 'TechCup 2026-II',
    entrega: 'dotacion-completa',
    timestamp: new Date().toISOString(),
  })
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`

  const getEq = (name: string) => { const e = [equipo, { ...equipo, id:2, nombre:'IA Warriors', emoji:'🦁', capitan:'María López', colorPrimario:'#8B5CF6', colorSecundario:'#A855F7', jugadores:[{ id:12, nombre:'María López', posicion:'Arquero', dorsal:1, estaJugando:true }, { id:13, nombre:'Carlos Ruiz', posicion:'Defensor', dorsal:4, estaJugando:true }, { id:14, nombre:'Ana María Gil', posicion:'Defensor', dorsal:2, estaJugando:true }, { id:15, nombre:'Luis Fernando Díaz', posicion:'Mediocampista', dorsal:5, estaJugando:true }, { id:16, nombre:'Valentina Orozco', posicion:'Mediocampista', dorsal:8, estaJugando:true }, { id:17, nombre:'Esteban Quintero', posicion:'Delantero', dorsal:9, estaJugando:true }, { id:18, nombre:'Manuela Cardona', posicion:'Delantero', dorsal:7, estaJugando:true }, { id:19, nombre:'David Ocampo', posicion:'Defensor', dorsal:3, estaJugando:true }, { id:20, nombre:'Sofía Restrepo', posicion:'Mediocampista', dorsal:10, estaJugando:true }, { id:21, nombre:'Tomás Arango', posicion:'Delantero', dorsal:11, estaJugando:true }] }, { ...equipo, id:3, nombre:'Code United', emoji:'💻', capitan:'Pedro Sánchez', colorPrimario:'#3B82F6', colorSecundario:'#60A5FA', jugadores:[] }, { ...equipo, id:4, nombre:'Sistemas FC', emoji:'⚙️', capitan:'Juan Rangel', colorPrimario:'#22C55E', colorSecundario:'#4ADE80', jugadores:[] }].find(e => e.nombre === name); return e || equipo }
  const posIcon: Record<string, string> = { 'Arquero':'🧤', 'Defensor':'🛡️', 'Mediocampista':'🎯', 'Delantero':'⚡' }

  const tabs: { id: CapitanTab; label: string; icon: typeof Trophy }[] = [
    { id:'dashboard', label:'Dashboard', icon: Trophy },
    { id:'equipo', label:'Mi Equipo', icon: Users },
    { id:'logistica', label:'Logística', icon: Package },
    { id:'qr', label:'QR Dotación', icon: QrCode },
  ]

  // ─── MODALES ────────────────────────────────────────────
  const renderMatchModal = () => {
    if (!matchModal) return null
    const eq1 = getEq(matchModal.eq1)
    const eq2 = getEq(matchModal.eq2)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMatchModal(null)}
        style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
        <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A14] shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Card con cancha de fondo como pide */}
          <div className="relative h-[280px] rounded-t-2xl overflow-hidden">
            <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
            <button onClick={() => setMatchModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
            {/* Texto overlay como el HTML que pasaste */}
            <div className="relative w-full h-full flex flex-col justify-between p-5 z-10">
              <div>
                <span className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 bg-white/15 text-white border border-white/20 backdrop-blur-sm">Finalizado</span>
                <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">Torneo oficial</span>
                <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">{matchModal.eq1} vs {matchModal.eq2}</h3>
                <p className="text-[12px] text-white/60 mt-1">{matchModal.dia} de {matchModal.mes} • {matchModal.hora}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3">
                  <MapPin size={14} /> {matchModal.lugar}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/60"><strong className="text-white/90">{eq1.emoji}</strong> {matchModal.eq1}</span>
                    <span className="text-[10px] text-gold font-bold">VS</span>
                    <span className="text-[11px] text-white/60"><strong className="text-white/90">{eq2.emoji}</strong> {matchModal.eq2}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full transition-colors">Ver resumen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipos clickeables */}
          <div className="p-5 space-y-3">
            <h3 className="text-[13px] font-semibold text-white/70 uppercase tracking-[.5px] flex items-center gap-2">
              <Users size={14} className="text-gold" /> Equipos — click para ver plantilla
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[eq1, eq2].map(eq => (
                <button key={eq.nombre} onClick={() => { setMatchModal(null); setTeamModal(eq) }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all text-left">
                  <span className="text-2xl">{eq.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[13px]">{eq.nombre}</span>
                    <div className="text-[10px] text-text-muted"><Medal size={10} className="text-gold inline" /> {eq.capitan} • {eq.jugadores.length} jug.</div>
                  </div>
                  <ChevronRight size={14} className="text-text-faint" />
                </button>
              ))}
            </div>

            {/* Alineación rápida */}
            <h3 className="text-[13px] font-semibold text-white/70 uppercase tracking-[.5px] flex items-center gap-2 mt-5">
              <Swords size={14} className="text-gold" /> Posible alineación
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {eq1.jugadores.filter(j => j.estaJugando).slice(0, 7).map(j => (
                <div key={j.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: eq1.colorPrimario + '44' }}>{j.dorsal}</div>
                  <span className="text-[11px] truncate">{j.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTeamModal = () => {
    if (!teamModal) return null
    const t = teamModal
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setTeamModal(null)}
        style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
        <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A14] shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="relative h-[140px] rounded-t-2xl overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.colorPrimario}33, ${t.colorSecundario}22)` }} />
            <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(at 70% 30%, ${t.colorPrimario} 0%, transparent 60%)` }} />
            <button onClick={() => setTeamModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
              <span className="text-4xl">{t.emoji}</span>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">{t.nombre}</h2>
                <div className="text-[11px] text-white/60 mt-0.5"><Medal size={11} className="text-gold inline" /> Capitán: {t.capitan} • {t.jugadores.length} jug.</div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-2">
              {t.jugadores.map(j => (
                <div key={j.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ backgroundColor: t.colorPrimario + '44' }}>{j.dorsal}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-semibold">{j.nombre}</span>
                    <span className="text-[9px] text-text-muted block">{posIcon[j.posicion] || '⚽'} {j.posicion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={handleCollapse} />
      <div className="min-w-0 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title="Panel Capitán" sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-8 pb-[60px] max-md:p-5 relative">
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />

          {/* Hero */}
          <section className="relative rounded-2xl overflow-hidden mb-5 border border-white/10">
            <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-black/95 via-purple-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-purple-black/40" />
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 60% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
            <div className="relative z-10 p-8 max-md:p-5 flex items-center justify-between max-md:flex-col max-md:gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl leading-tight mb-1">
                  {equipo.emoji} Panel de <span className="text-gold">Capitán</span>
                </h2>
                <p className="text-sm text-white/60">{equipo.nombre} — Gestioná tu equipo, logística y validaciones.</p>
              </div>
              <Badge className="rounded-full bg-gold/20 text-gold border border-gold/30 h-auto px-3 py-1.5 text-[11px] font-bold">
                {equipo.emoji} {equipo.capitan}
              </Badge>
            </div>
          </section>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all whitespace-nowrap ${
                  activeTab === t.id ? 'bg-gold text-[#1A1206]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* ═══════════════ DASHBOARD ═══════════════ */}
          {activeTab === 'dashboard' && (
            <>
              <section className="grid grid-cols-4 max-lg:grid-cols-2 gap-[18px] mb-[26px]">
                {[
                  { icon:'👥', num:equipo.jugadores.length.toString(), label:'Jugadores', accent:'purple' },
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
                    <button key={i} onClick={() => setMatchModal(m)}
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

                <div className="space-y-5">
                  <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
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
                        {posiciones.slice(0, posExpandida ? posiciones.length : 4).map((r, i) => {
                          const isMine = r.equipo === 'Tigres FC'
                          return (
                            <tr key={i} className={`text-[13px] ${isMine ? 'text-gold font-bold bg-gold/5' : ''} ${i === 0 ? '' : ''}`}>
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

                  <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                    <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                      <Package size={16} className="text-gold" /> Dotación
                    </h3>
                    <div className="space-y-2">
                      {dotacion.filter(d => d.estado === 'pendiente').length > 0 ? (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Items pendientes:</span>
                            <span className="text-yellow-400 font-bold">{dotacion.filter(d => d.estado === 'pendiente').length}</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full" style={{ width: `${(dotacion.filter(d => d.estado === 'entregado').length / dotacion.length) * 100}%` }} />
                          </div>
                          <Button onClick={() => setActiveTab('qr')} size="sm"
                            className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-[11px] h-8 font-bold mt-2">
                            <QrCode size={13} className="mr-1" /> Generar QR para entrega
                          </Button>
                        </>
                      ) : (
                        <div className="text-center py-3">
                          <span className="text-green-400 text-sm font-bold">✅ Toda la dotación entregada</span>
                        </div>
                      )}
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ MI EQUIPO ═══════════════ */}
          {activeTab === 'equipo' && (
            <div className="grid grid-cols-[1.3fr_1fr] gap-5 items-start max-lg:grid-cols-1">
              <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{equipo.emoji}</span>
                  <div>
                    <h3 className="text-[16px] font-bold">{equipo.nombre}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <Medal size={11} className="text-gold" /> Capitán: {equipo.capitan}
                      <span>• {equipo.jugadores.length} jug.</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label:'🧤 Arqueros', value:equipo.jugadores.filter(j => j.posicion === 'Arquero').length },
                    { label:'🛡️ Defensas', value:equipo.jugadores.filter(j => j.posicion === 'Defensor').length },
                    { label:'🎯 Medios', value:equipo.jugadores.filter(j => j.posicion === 'Mediocampista').length },
                    { label:'⚡ Delanteros', value:equipo.jugadores.filter(j => j.posicion === 'Delantero').length },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-black/30">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[9px] text-text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                  {equipo.jugadores.map(j => (
                    <div key={j.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ backgroundColor: equipo.colorPrimario + '44' }}>{j.dorsal}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[12.5px] font-semibold">{j.nombre}</span>
                          {j.nombre === equipo.capitan && <Medal size={9} className="text-gold" />}
                        </div>
                        <span className="text-[9.5px] text-text-muted">
                          {j.posicion === 'Arquero' ? '🧤' : j.posicion === 'Defensor' ? '🛡️' : j.posicion === 'Mediocampista' ? '🎯' : '⚡'} {j.posicion}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Button className="flex-1 rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-[11px] h-8 font-bold">
                    <Swords size={13} className="mr-1" /> Elegir alineación
                  </Button>
                  <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 text-[11px] h-8">
                    <UserCheck size={13} className="mr-1" /> Invitar jugador
                  </Button>
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
                    <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-sm">
                      {s.posicion === 'Defensor' ? '🛡️' : '🎯'}
                    </div>
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

          {/* ═══════════════ LOGÍSTICA ═══════════════ */}
          {activeTab === 'logistica' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-display)] uppercase text-lg tracking-[.5px]">
                  Logística: <span className="text-gold">refrigerios y kits</span>
                </h3>
                <Button onClick={() => setActiveTab('qr')}
                  className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-9 px-4 font-bold">
                  <QrCode size={14} className="mr-1.5" /> Generar QR
                </Button>
              </div>

              <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                {[
                  { label:'Total items', value:dotacion.length, icon:'📦', color:'text-white' },
                  { label:'Entregados', value:dotacion.filter(d => d.estado === 'entregado').length, icon:'✅', color:'text-green-400' },
                  { label:'Pendientes', value:dotacion.filter(d => d.estado === 'pendiente').length, icon:'⏳', color:'text-yellow-400' },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 text-center">
                    <div className={`text-2xl font-bold ${r.color}`}>{r.value}</div>
                    <div className="text-[11px] text-text-muted mt-1">{r.icon} {r.label}</div>
                  </div>
                ))}
              </div>

              <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                  <Package size={16} className="text-gold" /> Dotación del equipo
                </h3>
                <div className="space-y-2">
                  {dotacion.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-gold/20 transition-all">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.tipo === 'kit' ? 'bg-purple-mid/20 text-[#b39ef2]' : 'bg-gold/15 text-gold'
                      }`}>
                        {item.tipo === 'kit' ? <Shirt size={18} /> : <Apple size={18} />}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-[13px]">{item.nombre}</span>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                          <span>{item.tipo === 'kit' ? '👕 Kit' : '🍎 Refrigerio'}</span>
                          <span>• {item.cantidad} unidades</span>
                        </div>
                      </div>
                      <Badge className={`rounded-full text-[9px] px-2 py-0.5 h-auto ${
                        item.estado === 'entregado' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>{item.estado === 'entregado' ? '✅ Entregado' : '⏳ Pendiente'}</Badge>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              {/* Info on how QR works */}
              <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <Smartphone size={22} className="text-gold" />
                  </div>
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

          {/* ═══════════════ QR DOTACIÓN ═══════════════ */}
          {activeTab === 'qr' && (
            <div className="max-w-lg mx-auto space-y-6">
              <div className="text-center">
                <h3 className="font-[family-name:var(--font-display)] uppercase text-xl tracking-[.5px] mb-2">
                  QR de <span className="text-gold">dotación</span>
                </h3>
                <p className="text-[12px] text-text-muted">
                  Generá el código QR para que el administrador escanee y valide la entrega.
                </p>
              </div>

              <SpotlightCard accent="gold" className="p-8 bg-surface border-border rounded-2xl">
                <div className="flex flex-col items-center gap-5">
                  {/* QR Code */}
                  {!qrGenerado ? (
                    <div className="w-[250px] h-[250px] rounded-2xl bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
                      <QrCode size={48} className="text-white/20" />
                      <span className="text-[12px] text-text-muted">QR no generado</span>
                      <Button onClick={() => setQrGenerado(true)}
                        className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-9 px-5 font-bold">
                        <RefreshCw size={14} className="mr-1.5" /> Generar QR ahora
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <img src={qrUrl} alt="QR de dotación" className="w-[250px] h-[250px] rounded-2xl border-2 border-gold/30 bg-white p-3" />
                        {qrEntregado && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-2">
                                <Check size={36} className="text-green-400" />
                              </div>
                              <span className="text-green-400 font-bold text-sm">✅ Validado</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-white/60 mb-1">Escaneá con el admin o árbitro</p>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted">
                          <span>{equipo.emoji} {equipo.nombre}</span>
                          <span>•</span>
                          <span>📅 {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!qrEntregado ? (
                          <>
                            <Button onClick={() => setQrEntregado(true)}
                              className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 text-xs h-9 px-5 font-bold">
                              <Scan size={14} className="mr-1.5" /> Simular escaneo (admin)
                            </Button>
                            <Button variant="outline" size="sm"
                              className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs h-9 px-4">
                              <Download size={13} className="mr-1" /> Descargar
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              <Check size={14} /> ¡Dotación validada!
                            </div>
                            <Button onClick={() => { setQrGenerado(false); setQrEntregado(false) }}
                              variant="outline" size="sm"
                              className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs h-9 px-4">
                              <RefreshCw size={13} className="mr-1" /> Generar nuevo
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </SpotlightCard>

              {/* Historial de entregas */}
              <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px] flex items-center gap-2 mb-4">
                  <Truck size={16} className="text-gold" /> Historial de entregas
                </h3>
                <div className="space-y-2">
                  {[
                    { fecha:'12/07/2026', items:'Medias, Barras energéticas', responsable:'Roberto Gómez (Admin)', estado:'entregado' as const },
                    { fecha:'Hoy', items:'Resto de dotación', responsable:'Pendiente de escaneo', estado:'pendiente' as const },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
                        {h.estado === 'entregado' ? <Check size={16} className="text-green-400" /> : <Clock size={16} className="text-yellow-400" />}
                      </div>
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

          {/* CTA */}
          <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-gradient-to-r from-purple-deep2 to-purple-black border border-white/10 mt-6 max-md:flex-col max-md:items-start">
            <div>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1">¿Necesitás ayuda?</h3>
              <p className="text-[13px] text-text-muted">Contactá al organizador o revisá el reglamento del torneo.</p>
            </div>
            <InteractiveHoverButton onClick={() => navigate('/soporte')}>Ir a soporte</InteractiveHoverButton>
          </section>
        </main>
        <Footer />
      </div>
      <ManchasFloating />
      {renderMatchModal()}
      {renderTeamModal()}
    </div>
  )
}
