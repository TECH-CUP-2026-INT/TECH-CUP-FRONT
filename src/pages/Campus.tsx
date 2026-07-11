import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { cn } from '@/lib/utils'
import { canchas, type Cancha } from '@/data/campus'
import { partidos } from '@/data/partidos'
import { MapPin, Sun, Moon, CloudRain, ShieldCheck, Wrench, Users, Clock, Fence, Lightbulb, Warehouse, Star } from 'lucide-react'

type Filtro = 'todas' | 'disponible' | 'ocupado' | 'mantenimiento'

const filtros: { id: Filtro; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'disponible', label: 'Disponibles' },
  { id: 'ocupado', label: 'Ocupadas' },
  { id: 'mantenimiento', label: 'Mantenimiento' },
]

const estadoIcon = {
  disponible: ShieldCheck,
  ocupado: Users,
  mantenimiento: Wrench,
}

const estadoColor = {
  disponible: 'text-green-400 bg-green-500/10 border-green-500/20',
  ocupado: 'text-red-400 bg-red-500/10 border-red-500/20',
  mantenimiento: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

const estadoBg = {
  disponible: 'from-green-500/5 via-transparent to-transparent',
  ocupado: 'from-red-500/5 via-transparent to-transparent',
  mantenimiento: 'from-amber-500/5 via-transparent to-transparent',
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-green-400 fill-green-400' : 'text-gray-600'}
        />
      ))}
    </div>
  )
}

export default function Campus() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const navigate = useNavigate()

  const filtradas = filtro === 'todas' ? canchas : canchas.filter((c) => c.estado === filtro)
  const disponibles = canchas.filter((c) => c.estado === 'disponible').length
  const ocupadas = canchas.filter((c) => c.estado === 'ocupado').length
  const enMantenimiento = canchas.filter((c) => c.estado === 'mantenimiento').length
  const ocupadasList = filtro === 'todas' || filtro === 'ocupado'
    ? canchas.filter((c) => c.estado === 'ocupado')
    : []

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0">
        <AppTopbar title="Campus Deportivo" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 pb-[60px] max-md:p-5 relative">
          {/* Background glow */}
          <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-5%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />

          {/* Header */}
          <section className="rounded-2xl p-8 max-md:p-6 mb-[26px] relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-black to-purple-black/40" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(34,197,94,.8) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(212,175,55,.4) 0%, transparent 50%)',
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                  <Fence className="text-green-400" size={20} />
                </div>
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px]">
                    Campus <span className="text-green-400">Deportivo</span>
                  </h1>
                  <p className="text-sm text-text-muted">Estado en vivo de las canchas — {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Stats mini */}
              <div className="flex flex-wrap gap-4 mt-5">
                {[
                  { icon: ShieldCheck, label: 'Disponibles', count: disponibles, color: 'text-green-400' },
                  { icon: Users, label: 'Ocupadas', count: ocupadas, color: 'text-red-400' },
                  { icon: Wrench, label: 'Mantenimiento', count: enMantenimiento, color: 'text-amber-400' },
                  { icon: Fence, label: 'Total canchas', count: canchas.length, color: 'text-gray-light' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
                    <s.icon size={16} className={s.color} />
                    <span className="text-sm text-text-muted">{s.label}</span>
                    <span className={cn('text-lg font-bold font-[family-name:var(--font-display)]', s.color)}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filtros */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap',
                  filtro === f.id
                    ? 'bg-green-500/15 text-green-400 border-green-500/30'
                    : 'bg-white/5 text-text-muted border-white/10 hover:bg-white/10 hover:text-white'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid de canchas */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-[26px]">
            {filtradas.map((cancha) => {
              const Icon = estadoIcon[cancha.estado]
              const isOccupied = cancha.estado === 'ocupado'
              return (
                <div
                  key={cancha.id}
                  className={cn(
                    'rounded-2xl border p-5 relative overflow-hidden transition-all hover:border-white/20 group cursor-pointer',
                    isOccupied
                      ? 'bg-gradient-to-br from-red-950/20 via-black to-black border-red-900/30'
                      : cancha.estado === 'mantenimiento'
                      ? 'bg-gradient-to-br from-amber-950/20 via-black to-black border-amber-900/30'
                      : 'bg-gradient-to-br from-green-950/15 via-black to-black border-white/10'
                  )}
                  onClick={() => isOccupied && navigate(`/partido/1`)}
                >
                  {/* Status glow */}
                  <div className={cn(
                    'absolute top-[-30%] right-[-20%] w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none opacity-30',
                    isOccupied ? 'bg-red-500' : cancha.estado === 'mantenimiento' ? 'bg-amber-500' : 'bg-green-500'
                  )} />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-base">{cancha.nombre}</h3>
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                          <MapPin size={12} />
                          {cancha.ubicacion}
                        </div>
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[.4px] border',
                        estadoColor[cancha.estado]
                      )}>
                        <Icon size={12} />
                        {cancha.estado}
                      </span>
                    </div>

                    {/* Tipo + rating */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-md">{cancha.tipo}</span>
                      <Rating rating={cancha.rating} />
                    </div>

                    {/* Características */}
                    <div className="flex items-center gap-3 mb-3">
                      {cancha.iluminacion && (
                        <span className="flex items-center gap-1 text-[11px] text-text-faint">
                          <Lightbulb size={12} className="text-yellow-500" /> Iluminada
                        </span>
                      )}
                      {cancha.techada && (
                        <span className="flex items-center gap-1 text-[11px] text-text-faint">
                          <Warehouse size={12} className="text-blue-400" /> Techada
                        </span>
                      )}
                    </div>

                    {/* Partido actual (ocupada) */}
                    {cancha.partidoActual && (
                      <div className="mt-2 pt-3 border-t border-white/10">
                        <p className="text-[11px] text-text-faint uppercase tracking-[.4px] mb-2 font-semibold">EN CURSO</p>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className="text-red-400">{cancha.partidoActual.eq1}</span>
                          <span className="text-text-faint text-xs">vs</span>
                          <span className="text-blue-400">{cancha.partidoActual.eq2}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-text-muted">
                            <Clock size={11} /> {cancha.partidoActual.hora}
                          </span>
                          <span className="text-[11px] text-gold">{cancha.partidoActual.jornada}</span>
                        </div>
                      </div>
                    )}

                    {/* Próximos */}
                    {cancha.proximos && cancha.proximos.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-white/10">
                        <p className="text-[11px] text-text-faint uppercase tracking-[.4px] mb-1.5 font-semibold">PRÓXIMOS</p>
                        {cancha.proximos.map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-text-muted">
                            <span>{p.eq1} vs {p.eq2}</span>
                            <span className="text-gold">{p.hora}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Click hint si está ocupada */}
                    {isOccupied && (
                      <div className="mt-3 text-[11px] text-text-faint font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click para ver el partido →
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </section>

          {/* Listado de ocupadas */}
          {ocupadasList.length > 0 && (
            <section className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-red-950/10 via-black to-black">
              <div className="p-5 border-b border-white/10">
                <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.4px]">
                  <span className="text-red-400">Ocupadas</span> ahora
                </h2>
                <p className="text-xs text-text-muted mt-0.5">Canchas con partidos en vivo</p>
              </div>
              <div className="divide-y divide-white/10">
                {ocupadasList.map((cancha) => (
                  <div
                    key={cancha.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/partido/1`)}
                  >
                    {/* Indicador rojo animado */}
                    <span className="relative flex h-3 w-3 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{cancha.nombre}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{cancha.ubicacion} · {cancha.tipo}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        <span className="text-red-400">{cancha.partidoActual?.eq1}</span>
                        <span className="text-text-faint mx-1">vs</span>
                        <span className="text-blue-400">{cancha.partidoActual?.eq2}</span>
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {cancha.partidoActual?.hora} · {cancha.partidoActual?.jornada}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-text-faint hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline de próximos partidos del día */}
              <div className="p-5 border-t border-white/10 bg-white/[0.02]">
                <h3 className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold mb-3">Partidos del día</h3>
                <div className="space-y-2">
                  {partidos.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-[52px] text-center flex-shrink-0">
                        <span className="text-[11px] text-gold font-bold">{p.hora}</span>
                      </div>
                      <div className="w-0.5 h-6 rounded-full bg-white/10" />
                      <div className="flex-1">
                        <span className="font-semibold">{p.eq1}</span>
                        <span className="text-text-faint mx-1">vs</span>
                        <span className="font-semibold">{p.eq2}</span>
                        <span className="text-text-muted text-xs ml-2">· {p.lugar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Leyenda */}
          <div className="mt-6 flex items-center gap-5 text-xs text-text-faint">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Ocupado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mantenimiento
            </span>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
