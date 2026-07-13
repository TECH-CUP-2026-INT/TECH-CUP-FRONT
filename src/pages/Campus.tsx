import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { cn } from '@/lib/utils'
import { canchas, type Cancha } from '@/data/campus'
import { partidos } from '@/data/partidos'
import { MapPin, ShieldCheck, Wrench, Users, Clock, Fence, Lightbulb, Warehouse, Star, Eye } from 'lucide-react'

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
    <DashboardLayout title="Campus Deportivo">
      <main className="p-8 pb-[60px] max-md:p-5 relative">

          {/* Header con foto real */}
          <section className="rounded-2xl p-8 max-md:p-6 mb-[26px] relative overflow-hidden border border-green-500/20 min-h-[240px]">
            <img src="/canchas.jpeg" alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
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

          {/* Grid de canchas - solo horario y división */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-[26px]">
            {filtradas.map((cancha) => {
              const Icon = estadoIcon[cancha.estado]
              const isOccupied = cancha.estado === 'ocupado'
              return (
                <div
                  key={cancha.id}
                  className={cn(
                    'rounded-2xl border p-4 relative overflow-hidden transition-all hover:border-white/30 group cursor-pointer',
                    isOccupied
                      ? 'bg-gradient-to-br from-red-950/20 via-black to-black border-red-900/30'
                      : cancha.estado === 'mantenimiento'
                      ? 'bg-gradient-to-br from-amber-950/20 via-black to-black border-amber-900/30'
                      : 'bg-gradient-to-br from-green-950/15 via-black to-black border-white/10'
                  )}
                  onClick={() => isOccupied && navigate(`/partido/1`)}
                >
                  <div className={cn(
                    'absolute top-[-30%] right-[-20%] w-[150px] h-[150px] rounded-full blur-[70px] pointer-events-none opacity-25',
                    isOccupied ? 'bg-red-500' : cancha.estado === 'mantenimiento' ? 'bg-amber-500' : 'bg-green-500'
                  )} />

                  <div className="relative z-10">
                    {/* Header: nombre + división + estado */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{cancha.nombre}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                          <MapPin size={11} /> {cancha.ubicacion} · {cancha.tipo}
                        </div>
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[.3px] border',
                        estadoColor[cancha.estado]
                      )}>
                        <Icon size={10} />
                        {cancha.estado}
                      </span>
                    </div>

                    {/* Partido actual - solo horario */}
                    {cancha.partidoActual && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className={isOccupied ? 'text-red-400' : 'text-gold'}>{cancha.partidoActual.eq1}</span>
                            <span className="text-text-faint">vs</span>
                            <span className="text-blue-400">{cancha.partidoActual.eq2}</span>
                          </div>
                          <span className="text-xs text-gold font-semibold">{cancha.partidoActual.hora}</span>
                        </div>
                        <span className="text-[10px] text-text-muted">{cancha.partidoActual.jornada}</span>
                      </div>
                    )}

                    {/* Próximos horarios */}
                    {cancha.proximos && cancha.proximos.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        {cancha.proximos.map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-text-muted py-0.5">
                            <span className="text-[11px]">{p.eq1} vs {p.eq2}</span>
                            <span className="text-gold text-[11px] font-medium">{p.hora}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Click hint */}
                    {isOccupied && (
                      <div className="mt-2 text-[10px] text-text-faint opacity-0 group-hover:opacity-100 transition-opacity">
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
    </DashboardLayout>
  )
}
