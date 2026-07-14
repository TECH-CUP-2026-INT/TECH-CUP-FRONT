import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { FutPlayerCard } from '@/components/employees/FutPlayerCard'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Swords, Calendar, BarChart3, Plus, X, Edit3, Users, Clock, Goal, ShieldAlert } from 'lucide-react'

type Tab = 'plantilla' | 'calendario' | 'estadisticas'

interface Jugador {
  id: number
  nombre: string
  dorsal: number
  posicion: string
  img: string
  goles: number
  asistencias: number
  amarillas: number
  rojas: number
  faltas: number
  partidos: number
}

const defaultStats = { goles: 0, asistencias: 0, amarillas: 0, rojas: 0, faltas: 0, partidos: 0 }

const jugadores = [
  { nombre: 'Juan Pérez', dorsal: 10, posicion: 'Delantero', img: 'https://i.pravatar.cc/72?img=1' },
  { nombre: 'Pedro Gómez', dorsal: 7, posicion: 'Volante', img: 'https://i.pravatar.cc/72?img=2' },
  { nombre: 'Luis Torres', dorsal: 1, posicion: 'Portero', img: 'https://i.pravatar.cc/72?img=3' },
  { nombre: 'Ana Martínez', dorsal: 5, posicion: 'Defensa', img: 'https://i.pravatar.cc/72?img=9' },
  { nombre: 'Carlos López', dorsal: 8, posicion: 'Volante', img: 'https://i.pravatar.cc/72?img=12' },
]

export default function MiEquipo() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('plantilla')
  const [jugadores, setJugadores] = useState<Jugador[]>([
    { id: 1, nombre: 'Juan Pérez', dorsal: 10, posicion: 'Delantero', img: 'https://i.pravatar.cc/72?img=1', goles: 6, asistencias: 3, amarillas: 1, rojas: 0, faltas: 4, partidos: 8 },
    { id: 2, nombre: 'Pedro Gómez', dorsal: 7, posicion: 'Volante', img: 'https://i.pravatar.cc/72?img=2', goles: 2, asistencias: 5, amarillas: 2, rojas: 0, faltas: 6, partidos: 8 },
    { id: 3, nombre: 'Luis Torres', dorsal: 1, posicion: 'Portero', img: 'https://i.pravatar.cc/72?img=3', goles: 0, asistencias: 0, amarillas: 0, rojas: 0, faltas: 1, partidos: 8 },
    { id: 4, nombre: 'Ana Martínez', dorsal: 5, posicion: 'Defensa', img: 'https://i.pravatar.cc/72?img=9', goles: 1, asistencias: 1, amarillas: 3, rojas: 1, faltas: 8, partidos: 7 },
    { id: 5, nombre: 'Carlos López', dorsal: 8, posicion: 'Volante', img: 'https://i.pravatar.cc/72?img=12', goles: 3, asistencias: 2, amarillas: 1, rojas: 0, faltas: 3, partidos: 6 },
  ])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Jugador | null>(null)
  const [nuevoJugador, setNuevoJugador] = useState({ nombre: '', dorsal: '', posicion: 'Volante' })

  const agregar = () => {
    if (!nuevoJugador.nombre || !nuevoJugador.dorsal) return
    setJugadores([...jugadores, { id: Date.now(), ...nuevoJugador, dorsal: parseInt(nuevoJugador.dorsal), img: `https://i.pravatar.cc/72?img=${Math.floor(Math.random()*70)+1}`, ...defaultStats }])
    setNuevoJugador({ nombre: '', dorsal: '', posicion: 'Volante' })
    setMostrarForm(false)
  }

  const eliminar = (id: number) => setJugadores(jugadores.filter(j => j.id !== id))

  return (
    <DashboardLayout title="Mi equipo">
      <main className="max-w-[1000px] mx-auto px-8 py-8 pb-[60px]">
          {/* Header equipo */}
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-5 max-md:flex-col max-md:text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-deep to-purple-black border border-gold/30 flex items-center justify-center text-2xl font-black text-gold">SF</div>
              <div className="flex-1">
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Sistemas <span className="text-gold">FC</span></h1>
                <p className="text-sm text-text-muted mt-1">Capitán: Juan Pérez · TechCup 2024-I</p>
                <Badge className="mt-2 rounded-full bg-gold/15 text-gold border border-gold/40 text-[10px]">📋 En revisión</Badge>
              </div>
              <Link to="/inscribir-equipo" className="flex-shrink-0">
                <Button size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4">Inscribir en torneo</Button>
              </Link>
              <div className="flex gap-4 text-sm">
                <span className="text-center"><b className="block text-gold text-lg">12</b>PJ</span>
                <span className="text-center"><b className="block text-green-400 text-lg">28</b>GF</span>
                <span className="text-center"><b className="block text-red-400 text-lg">12</b>GC</span>
                <span className="text-center"><b className="block text-gold text-lg">25</b>PTS</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6 overflow-x-auto">
            {(['plantilla','calendario','estadisticas'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}>
                {t === 'plantilla' ? <Swords size={16} /> : t === 'calendario' ? <Calendar size={16} /> : <BarChart3 size={16} />}
                {t}
              </button>
            ))}
          </div>

          {/* Plantilla */}
          {tab === 'plantilla' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={12} /> Editable hasta 1 hora antes del partido
                </div>
                <Button size="sm" onClick={() => setMostrarForm(true)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 px-3">
                  <Plus size={14} /> Agregar jugador
                </Button>
              </div>

              {/* Form agregar */}
              {mostrarForm && (
                <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-4 mb-4">
                  <p className="text-xs text-gold font-semibold uppercase tracking-[.4px] mb-3">Nuevo jugador</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Input placeholder="Nombre" value={nuevoJugador.nombre} onChange={e => setNuevoJugador({...nuevoJugador, nombre: e.target.value})} className="bg-black border-border text-white rounded-lg h-9 text-sm col-span-2 focus-visible:border-gold" />
                    <Input placeholder="Dorsal" type="number" min={1} max={99} value={nuevoJugador.dorsal} onChange={e => setNuevoJugador({...nuevoJugador, dorsal: e.target.value})} className="bg-black border-border text-white rounded-lg h-9 text-sm focus-visible:border-gold" />
                  </div>
                  <select value={nuevoJugador.posicion} onChange={e => setNuevoJugador({...nuevoJugador, posicion: e.target.value})} className="w-full bg-black border border-border text-white rounded-lg h-9 px-3 text-sm outline-none focus:border-gold mb-3">
                    {['Portero','Defensa','Volante','Delantero'].map(p => <option key={p}>{p}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setMostrarForm(false)} className="rounded-full border-border text-gray-light hover:bg-white/5 text-xs h-auto py-1.5 flex-1">Cancelar</Button>
                    <Button size="sm" onClick={agregar} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 flex-1">Agregar</Button>
                  </div>
                </SpotlightCard>
              )}

              <div className="flex flex-wrap justify-center gap-5">
                {jugadores.map(j => (
                  <div key={j.id} className="group relative">
                    <FutPlayerCard
                      nombre={j.nombre}
                      dorsal={j.dorsal}
                      posicion={j.posicion}
                      img={j.img}
                      stats={{
                        goles: j.goles,
                        asistencias: j.asistencias,
                        partidos: j.partidos,
                        amarillas: j.amarillas,
                        rojas: j.rojas,
                        faltas: j.faltas,
                      }}
                      onClick={() => setSelectedPlayer(j)}
                      actions={
                        <button
                          onClick={(e) => { e.stopPropagation(); eliminar(j.id) }}
                          className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                          aria-label="Eliminar jugador"
                        >
                          <X size={12} className="text-red-400" />
                        </button>
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab !== 'plantilla' && (
            <div className="text-center py-16">
              <p className="text-text-muted">Próximamente</p>
            </div>
          )}
        </main>

      {/* Modal detalle jugador */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPlayer(null)}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}}
              className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
              <div className="text-center mb-5">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-3 ring-gold/60 ring-offset-4 ring-offset-black mb-3">
                  <img src={selectedPlayer.img} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-[family-name:var(--font-display)] text-2xl uppercase">{selectedPlayer.nombre}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge className="rounded-full bg-purple-mid/20 text-purple-mid border border-purple-mid/30 text-[10px]">#{selectedPlayer.dorsal}</Badge>
                  <span className="text-xs text-text-muted">{selectedPlayer.posicion}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Goles', value: selectedPlayer.goles, icon: '⚽' },
                  { label: 'Asistencias', value: selectedPlayer.asistencias, icon: '👟' },
                  { label: 'Partidos', value: selectedPlayer.partidos, icon: '📋' },
                  { label: '🟨 Amarillas', value: selectedPlayer.amarillas, icon: '🟨' },
                  { label: '🟥 Rojas', value: selectedPlayer.rojas, icon: '🟥' },
                  { label: 'Faltas', value: selectedPlayer.faltas, icon: '⚠️' },
                ].map((s,i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-black/50 border border-border/50">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setSelectedPlayer(null)} className="w-full rounded-full border-border text-gray-light hover:bg-white/5 h-11">
                Cerrar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
