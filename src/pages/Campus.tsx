import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Badge } from '@/components/common/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, Clock, Trophy, Fence, Goal, ShieldCheck, X, Activity, Wifi, Coffee, Car, Accessibility, Search, Filter, Loader2 } from 'lucide-react'
import { CardSkeleton } from '@/components/common/skeleton'

const divisiones = [
  { nombre: 'Cancha 1', eq1: 'Tigres FC', eq2: 'IA Warriors', hora: '8:00 PM', resultado: '3 - 1' },
  { nombre: 'Cancha 2', eq1: 'Code United', eq2: 'Sistemas FC', hora: '8:00 PM', resultado: '2 - 2' },
  { nombre: 'Cancha 3', eq1: 'Dragones FC', eq2: 'Los Bits', hora: '8:00 PM' },
  { nombre: 'Cancha 4', eq1: 'Titanes', eq2: 'Fénix', hora: '8:00 PM' },
]

interface MatchEvent {
  tipo: 'gol' | 'amarilla' | 'roja' | 'sustitucion'
  jugador: string
  equipo: string
  minuto: number
}

const matchEvents: MatchEvent[] = [
  { tipo: 'gol', jugador: 'Laura Gómez', equipo: 'Tigres FC', minuto: 12 },
  { tipo: 'gol', jugador: 'Esteban Quintero', equipo: 'IA Warriors', minuto: 28 },
  { tipo: 'amarilla', jugador: 'Carlos Ruiz', equipo: 'IA Warriors', minuto: 35 },
  { tipo: 'gol', jugador: 'Juan Pablo Mora', equipo: 'Tigres FC', minuto: 52 },
  { tipo: 'roja', jugador: 'David Ocampo', equipo: 'IA Warriors', minuto: 72 },
  { tipo: 'gol', jugador: 'Daniel Castro', equipo: 'Tigres FC', minuto: 85 },
]

const TIPO_ICON: Record<string, { icon: string; color: string }> = {
  'gol': { icon: '⚽', color: 'text-green-400' },
  'amarilla': { icon: '🟨', color: 'text-yellow-400' },
  'roja': { icon: '🟥', color: 'text-red-400' },
  'sustitucion': { icon: '🔄', color: 'text-blue-400' },
}

interface Sede {
  id: number
  nombre: string
  tipo: 'cancha' | 'auditorio' | 'gimnasio' | 'salon'
  ubicacion: string
  capacidad: number
  imagen: string
  descripcion: string
  horarios: string
  amenities: string[]
  estado: 'disponible' | 'mantenimiento' | 'ocupado'
  deportes?: string[]
}

const sedes: Sede[] = [
  {
    id: 1, nombre: 'Cancha Principal Sede Norte', tipo: 'cancha',
    ubicacion: 'Sede Norte, Campus Principal', capacidad: 2000,
    imagen: '/canchas.jpeg',
    descripcion: 'Campo de fútbol 11 dividido en 4 canchas para partidos simultáneos. Gramilla sintética de última generación.',
    horarios: 'Lun–Dom 6:00 AM – 10:00 PM',
    amenities: ['Iluminación LED', 'Camerinos', 'Baños', 'Estacionamiento', 'Graderías'],
    estado: 'disponible',
    deportes: ['Fútbol 11', 'Fútbol 7'],
  },
  {
    id: 2, nombre: 'Cancha Múltiple Sede Sur', tipo: 'cancha',
    ubicacion: 'Sede Sur, Bloque B', capacidad: 800,
    imagen: '/cancha-juego.png',
    descripcion: 'Cancha techada multiusos con piso sintético. Ideal para entrenamientos y partidos pequeños.',
    horarios: 'Lun–Sáb 7:00 AM – 9:00 PM',
    amenities: ['Techo', 'Iluminación', 'Camerinos', 'Baños'],
    estado: 'disponible',
    deportes: ['Fútbol 5', 'Baloncesto', 'Voleibol'],
  },
  {
    id: 3, nombre: 'Auditorio Principal Sede Norte', tipo: 'auditorio',
    ubicacion: 'Sede Norte, Edificio Central', capacidad: 500,
    imagen: '/cancha-juego.png',
    descripcion: 'Auditorio con capacidad para 500 personas. Pantalla LED, sonido profesional y climatización.',
    horarios: 'Lun–Vie 8:00 AM – 8:00 PM',
    amenities: ['Aire acondicionado', 'Pantalla LED', 'Sonido', 'Micrófonos inalámbricos', 'Wifi'],
    estado: 'ocupado',
  },
  {
    id: 4, nombre: 'Gimnasio TechCup', tipo: 'gimnasio',
    ubicacion: 'Sede Norte, Bloque Deportivo', capacidad: 100,
    imagen: '/cancha-juego.png',
    descripcion: 'Gimnasio equipado con máquinas de pesas, cardio y área de estiramiento.',
    horarios: 'Lun–Dom 5:00 AM – 10:00 PM',
    amenities: ['Máquinas de pesas', 'Cardio', 'Lockers', 'Baños con ducha', 'Toallas'],
    estado: 'disponible',
  },
  {
    id: 5, nombre: 'Salón de Reuniones Sede Norte', tipo: 'salon',
    ubicacion: 'Sede Norte, 2do piso', capacidad: 30,
    imagen: '/cancha-juego.png',
    descripcion: 'Salón ejecutivo para reuniones de capitanes y juntas directivas. Equipado con videobeam.',
    horarios: 'Lun–Vie 8:00 AM – 6:00 PM',
    amenities: ['Videobeam', 'Pizarra', 'Wifi', 'Cafetería'],
    estado: 'disponible',
  },
  {
    id: 6, nombre: 'Cancha de Entrenamiento Sede Sur', tipo: 'cancha',
    ubicacion: 'Sede Sur, Bloque D', capacidad: 200,
    imagen: '/cancha-juego.png',
    descripcion: 'Cancha de fútbol 7 para entrenamientos y calentamiento previo a los partidos.',
    horarios: 'Lun–Sáb 6:00 AM – 8:00 PM',
    amenities: ['Iluminación', 'Baños', 'Bancas'],
    estado: 'mantenimiento',
    deportes: ['Fútbol 7'],
  },
]

type CampusTab = 'instalaciones' | 'partidos'
type TipoFiltro = 'todas' | 'cancha' | 'auditorio' | 'gimnasio' | 'salon'

const TIPO_LABEL: Record<TipoFiltro, string> = {
  todas: 'Todas', cancha: 'Canchas', auditorio: 'Auditorios', gimnasio: 'Gimnasios', salon: 'Salones',
}

const TIPO_ICON_MAP: Record<string, string> = {
  cancha: '🏟️', auditorio: '🎤', gimnasio: '💪', salon: '💼',
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Iluminación LED': <span className="text-yellow-400">💡</span>,
  'Iluminación': <span className="text-yellow-400">💡</span>,
  'Camerinos': <span className="text-blue-400">🚪</span>,
  'Baños': <span className="text-cyan-400">🚻</span>,
  'Estacionamiento': <Car size={13} className="text-blue-400" />,
  'Graderías': <span className="text-amber-400">📊</span>,
  'Techo': <span className="text-gray-400">🏗️</span>,
  'Aire acondicionado': <span className="text-blue-300">❄️</span>,
  'Pantalla LED': <span className="text-purple-400">🖥️</span>,
  'Sonido': <span className="text-green-400">🔊</span>,
  'Micrófonos inalámbricos': <span className="text-pink-400">🎤</span>,
  'Wifi': <Wifi size={13} className="text-green-400" />,
  'Máquinas de pesas': <span className="text-gray-400">🏋️</span>,
  'Cardio': <span className="text-red-400">🏃</span>,
  'Lockers': <span className="text-amber-400">🔐</span>,
  'Baños con ducha': <span className="text-cyan-400">🚿</span>,
  'Toallas': <span className="text-white/60">🧴</span>,
  'Videobeam': <span className="text-purple-400">📽️</span>,
  'Pizarra': <span className="text-white/60">📝</span>,
  'Cafetería': <Coffee size={13} className="text-amber-500" />,
  'Bancas': <span className="text-amber-400">🪑</span>,
}

const ESTADO_STYLES: Record<string, { bg: string; dot: string; label: string }> = {
  disponible: { bg: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500', label: 'Disponible' },
  mantenimiento: { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500', label: 'Mantenimiento' },
  ocupado: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500', label: 'Ocupado' },
}

export default function Campus() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<CampusTab>('instalaciones')
  const [filtro, setFiltro] = useState<TipoFiltro>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [sedeModal, setSedeModal] = useState<Sede | null>(null)
  const [matchModal, setMatchModal] = useState<{ eq1: string; eq2: string; hora: string; resultado?: string } | null>(null)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])

  const sedesFiltradas = sedes.filter(s => {
    if (filtro !== 'todas' && s.tipo !== filtro) return false
    if (busqueda && !s.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !s.ubicacion.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout title="Campus Deportivo">
      <main className="p-8 pb-[60px] max-md:p-5 relative">
        {/* Hero */}
        <section className="rounded-2xl p-8 max-md:p-6 mb-[26px] relative overflow-hidden border border-white/10 min-h-[300px] flex items-end">
          <img src="/canchas.jpeg" alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 30%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center">
                <Fence className="text-gold" size={20} />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] text-white">
                  Campus <span className="text-gold">Deportivo</span>
                </h1>
                <p className="text-sm text-white/60">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm text-white/80 leading-relaxed">
                Conocé todas las instalaciones del campus. El torneo se juega en la <strong className="text-gold">Cancha Principal</strong>,
                que se divide en <strong className="text-gold">4 canchas simultáneas</strong> para que hasta 8 equipos compitan al mismo tiempo.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6">
          {(['instalaciones', 'partidos'] as CampusTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
              }`}>
              {t === 'instalaciones' ? '🏟️ Instalaciones' : '⚽ Partidos en vivo'}
            </button>
          ))}
        </div>

        {/* ═══════════════ INSTALACIONES ═══════════════ */}
        {tab === 'instalaciones' && (
          <div className="space-y-5">
            {/* Loading state */}
            {loading ? (
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
                {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : (
            <>
            {/* Filtros */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar instalación..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white outline-none focus:border-gold/50" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(['todas', 'cancha', 'auditorio', 'gimnasio', 'salon'] as TipoFiltro[]).map(t => (
                  <button key={t} onClick={() => setFiltro(t)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                      filtro === t ? 'bg-gold text-[#1A1206] border-gold' : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                    }`}>
                    {t !== 'todas' ? TIPO_ICON_MAP[t] + ' ' : ''}{TIPO_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid sedes */}
            {sedesFiltradas.length === 0 ? (
              <div className="text-center py-16 text-text-muted">
                <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No se encontraron instalaciones</p>
                <p className="text-sm mt-1">Probá con otro filtro o búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
                {sedesFiltradas.map(sede => (
                  <motion.button key={sede.id} layout
                    onClick={() => setSedeModal(sede)}
                    className="bg-surface border border-border/60 rounded-2xl overflow-hidden text-left hover:border-gold/30 transition-all group">
                    <div className="relative h-[100px] overflow-hidden">
                      <img src={sede.imagen} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <Badge className={`rounded-full text-[9px] px-2 py-0.5 h-auto ${ESTADO_STYLES[sede.estado].bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_STYLES[sede.estado].dot} inline-block mr-1`} />
                          {ESTADO_STYLES[sede.estado].label}
                        </Badge>
                        <span className="text-[10px] text-white/60">{TIPO_ICON_MAP[sede.tipo]} {sede.tipo}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{sede.nombre}</h3>
                      <p className="text-[11px] text-text-muted flex items-center gap-1 mb-2">
                        <MapPin size={11} /> {sede.ubicacion}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-text-faint">
                        <span className="flex items-center gap-1"><Users size={11} /> {sede.capacidad} pers.</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {sede.horarios}</span>
                      </div>
                      {sede.deportes && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {sede.deportes.map(d => (
                            <span key={d} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-mid/15 text-purple-mid">{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
            </>
          )}
          </div>
        )}

        {/* ═══════════════ PARTIDOS EN VIVO ═══════════════ */}
        {tab === 'partidos' && (
          <div className="space-y-5">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.5px] text-white">
                  🔴 Partidos <span className="text-gold">en vivo</span>
                </h2>
                <span className="text-[10px] text-gold font-bold uppercase tracking-[.5px] bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">
                  Simultáneo · 8:00 PM
                </span>
              </div>

              {/* Grid 2x2 de canchas */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 mb-4">
                {divisiones.map((d, i) => (
                  <button key={i} onClick={() => setMatchModal({ eq1: d.eq1, eq2: d.eq2, hora: d.hora, resultado: d.resultado })}
                    className="bg-surface border border-border/60 rounded-xl p-4 text-left hover:border-gold/30 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gold font-bold uppercase">{d.nombre}</span>
                      {d.resultado ? (
                        <span className="text-[10px] text-green-400 font-bold">✅ Finalizado</span>
                      ) : (
                        <span className="text-[10px] text-red-400 font-bold animate-pulse">🔴 En vivo</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{d.eq1}</span>
                      <span className="text-lg font-bold font-[family-name:var(--font-display)] text-gold">{d.resultado || 'vs'}</span>
                      <span className="text-sm font-semibold">{d.eq2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted mt-2">
                      <Clock size={10} /> {d.hora}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Leyenda */}
            <div className="flex items-center gap-5 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> En vivo</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold" /> Resultado final</span>
            </div>
          </div>
        )}

        {/* ═══════════════ MODALS ═══════════════ */}

        {/* Modal detalle sede */}
        <AnimatePresence>
          {sedeModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSedeModal(null)}
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A14] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="relative h-[160px] rounded-t-2xl overflow-hidden">
                  <img src={sedeModal.imagen} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <button onClick={() => setSedeModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{TIPO_ICON_MAP[sedeModal.tipo]}</span>
                      <h2 className="font-[family-name:var(--font-display)] text-xl uppercase">{sedeModal.nombre}</h2>
                    </div>
                    <Badge className={`rounded-full text-[9px] px-2 py-0.5 h-auto ${ESTADO_STYLES[sedeModal.estado].bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_STYLES[sedeModal.estado].dot} inline-block mr-1`} />
                      {ESTADO_STYLES[sedeModal.estado].label}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-sm text-white/80 leading-relaxed">{sedeModal.descripcion}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <MapPin size={14} className="text-gold mb-1" />
                      <div className="text-sm font-semibold text-white">Ubicación</div>
                      <div className="text-[11px] text-text-muted">{sedeModal.ubicacion}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <Users size={14} className="text-gold mb-1" />
                      <div className="text-sm font-semibold text-white">Capacidad</div>
                      <div className="text-[11px] text-text-muted">{sedeModal.capacidad} personas</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <Clock size={14} className="text-gold mb-1" />
                      <div className="text-sm font-semibold text-white">Horarios</div>
                      <div className="text-[11px] text-text-muted">{sedeModal.horarios}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-gold text-sm mb-1 block">🏷️</span>
                      <div className="text-sm font-semibold text-white">Tipo</div>
                      <div className="text-[11px] text-text-muted capitalize">{sedeModal.tipo}</div>
                    </div>
                  </div>

                  {sedeModal.deportes && sedeModal.deportes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-[.5px] mb-2">Deportes</h3>
                      <div className="flex gap-2 flex-wrap">
                        {sedeModal.deportes.map(d => (
                          <span key={d} className="text-[11px] px-3 py-1 rounded-full bg-purple-mid/15 text-purple-mid border border-purple-mid/30">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-semibold text-white/60 uppercase tracking-[.5px] mb-2">Instalaciones y servicios</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {sedeModal.amenities.map(a => (
                        <div key={a} className="flex items-center gap-2 text-[12px] text-white/70">
                          {AMENITY_ICONS[a] || <span className="text-gold">✓</span>}
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal detalle partido */}
        <AnimatePresence>
          {matchModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setMatchModal(null)}
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A14] shadow-2xl" onClick={e => e.stopPropagation()}>
                
                <div className="relative h-[180px] rounded-t-2xl overflow-hidden">
                  <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                  <button onClick={() => setMatchModal(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold"><X size={16} /></button>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <span className="text-3xl">🐯</span>
                        <p className="text-sm font-semibold mt-1 text-white">{matchModal.eq1}</p>
                      </div>
                      <div className="text-center px-6">
                        <div className="text-3xl font-bold font-[family-name:var(--font-display)] text-gold">{matchModal.resultado || 'vs'}</div>
                        <Badge className="mt-1 rounded-full bg-red-500/20 text-red-400 border-red-500/30 text-[9px] px-2 py-0.5 h-auto">🔴 En vivo</Badge>
                      </div>
                      <div className="text-center flex-1">
                        <span className="text-3xl">🦁</span>
                        <p className="text-sm font-semibold mt-1 text-white">{matchModal.eq2}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[10px] text-white/50 mt-3">
                      <MapPin size={10} /> Cancha Principal · Sede Norte
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <Clock size={10} /> {matchModal.hora}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-[13px] font-semibold text-white/70 uppercase tracking-[.5px] mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-gold" /> Cronología del partido
                  </h3>
                  <div className="space-y-1 relative before:absolute before:left-[18px] before:top-0 before:bottom-0 before:w-[2px] before:bg-white/10">
                    {matchEvents.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 py-1.5 relative">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 border border-white/10 flex-shrink-0 z-10 text-sm">
                          {TIPO_ICON[ev.tipo]?.icon || '⚽'}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <span className="text-[12.5px] font-semibold text-white">{ev.jugador}</span>
                          <div className="text-[10px] text-white/50">
                            <span className={TIPO_ICON[ev.tipo]?.color || ''}>
                              {ev.tipo === 'gol' ? 'Gol' : ev.tipo === 'amarilla' ? 'Amarilla' : ev.tipo === 'roja' ? 'Roja' : 'Sustitución'}
                            </span>
                            <span> • Min {ev.minuto}'</span>
                            <span className="ml-1.5">· {ev.equipo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 px-5 pb-5">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <Goal size={14} className="text-gold mb-1" />
                    <div className="text-lg font-bold text-white">{matchEvents.filter(e => e.tipo === 'gol').length}</div>
                    <div className="text-[10px] text-white/50">Goles totales</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck size={14} className="text-gold mb-1" />
                    <div className="text-lg font-bold text-white">{matchEvents.filter(e => e.tipo === 'amarilla' || e.tipo === 'roja').length}</div>
                    <div className="text-[10px] text-white/50">Tarjetas</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </DashboardLayout>
  )
}
