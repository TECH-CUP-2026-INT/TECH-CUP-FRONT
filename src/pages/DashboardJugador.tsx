import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import ManchasFloating from '@/components/shared/ManchasFloating'
import { partidos, posiciones } from '@/data/partidos'
import { torneos } from '@/data/torneos'

export default function DashboardJugador() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'
  const torneosDisponibles = torneos.filter(t => t.estado === 'live' || t.estado === 'upcoming').slice(0, 3)
  const misPartidos = partidos.slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div className={`min-w-0 transition-all duration-300`} style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title="Panel Jugador" sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />

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
              <Button onClick={() => navigate('/perfil/editar')} className="rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 text-sm">
                Editar perfil
              </Button>
            </div>
          </section>

          {/* Grid: Equipo + Estadísticas + Torneos */}
          <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-5 mb-[26px]">

            {/* Equipo */}
            <SpotlightCard accent="gold" className="p-5 bg-surface border-border rounded-2xl">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2">
                <span>👥</span> Mi equipo
              </h3>
              <div className="text-center py-4">
                <p className="text-3xl mb-1">🏠</p>
                <p className="text-sm text-text-muted mb-3">No pertenecés a ningún equipo aún</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/torneos')} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs font-bold px-4">
                    Buscar equipo
                  </Button>
                  <Button onClick={() => navigate('/crear-equipo')} variant="outline" className="rounded-full border-gold/30 text-gold hover:bg-gold/10 text-xs px-4">
                    Crear equipo
                  </Button>
                </div>
              </div>
            </SpotlightCard>

            {/* Estadísticas rápidas */}
            <SpotlightCard accent="purple" className="p-5 bg-surface border-border rounded-2xl">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2">
                <span>📊</span> Mis estadísticas
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Partidos jugados', value: '8', color: 'text-purple-mid' },
                  { label: 'Goles marcados', value: '12', color: 'text-gold' },
                  { label: 'Asistencias', value: '4', color: 'text-purple-mid' },
                  { label: 'Tarjetas amarillas', value: '2', color: 'text-yellow-400' },
                  { label: 'Minutos jugados', value: '620\'', color: 'text-text-muted' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-border/40 pb-1.5 last:border-b-0">
                    <span className="text-text-muted">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Solicitudes / Invitaciones */}
            <SpotlightCard accent="gold" className="p-5 bg-surface border-border rounded-2xl">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2">
                <span>📨</span> Invitaciones
              </h3>
              <div className="text-center py-4">
                <p className="text-3xl mb-1">🔔</p>
                <p className="text-sm text-text-muted">No tenés invitaciones pendientes</p>
                <p className="text-xs text-text-faint mt-1">Las invitaciones de capitanes aparecerán acá</p>
              </div>
            </SpotlightCard>
          </section>

          {/* Torneos disponibles + Próximos partidos */}
          <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
            
            {/* Torneos disponibles */}
            <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">🏆 Torneos disponibles</h3>
                <Link to="/torneos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-3">
                {torneosDisponibles.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                    <div>
                      <p className="text-sm font-semibold">{t.nombre}</p>
                      <p className="text-xs text-text-muted">{t.fecha} · {t.categoria}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      t.estado === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'
                    }`}>
                      {t.estado === 'live' ? 'En vivo' : 'Próximo'}
                    </span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Próximos partidos */}
            <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">📅 Próximos partidos</h3>
                <Link to="/mis-partidos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                  Ver todos →
                </Link>
              </div>
              {misPartidos.length > 0 ? (
                misPartidos.map((m, i) => (
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
    </div>
  )
}
