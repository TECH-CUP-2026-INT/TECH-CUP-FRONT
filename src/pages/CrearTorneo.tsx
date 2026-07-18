import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select'
import { ArrowLeft, ArrowRight, Check, Trophy, CalendarDays, DollarSign, Users, MapPin, Plus, X } from 'lucide-react'

type Formato = 'llaves' | 'grupos' | 'liga'
type TipoTorneo = 'normal' | 'relampago'

interface CanchaInput {
  nombre: string
  ubicacion: string
  descripcion: string
}

export default function CrearTorneo() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paso, setPaso] = useState(0)

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoTorneo>('normal')
  const [formato, setFormato] = useState<Formato>('llaves')
  const [minEquipos, setMinEquipos] = useState('8')
  const [maxEquipos, setMaxEquipos] = useState('16')
  const [costo, setCosto] = useState('0')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [fechaCierre, setFechaCierre] = useState('')
  const [canchas, setCanchas] = useState<CanchaInput[]>([{ nombre: '', ubicacion: '', descripcion: '' }])
  const [creado, setCreado] = useState(false)

  const canAddMore = canchas.every(c => c.nombre.trim() && c.ubicacion.trim())

  const handleCrear = () => {
    const torneo = {
      id: Date.now().toString(),
      nombre,
      tipo,
      formato,
      minEquipos: parseInt(minEquipos),
      maxEquipos: parseInt(maxEquipos),
      costo: parseInt(costo),
      fechaInicio,
      fechaFin,
      fechaCierre,
      canchas: canchas.filter(c => c.nombre.trim()),
      estado: 'upcoming',
    }
    console.log('[CrearTorneo] Torneo creado:', torneo)
    setCreado(true)
  }

  if (creado) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <AppTopbar title="Crear torneo" onMenuClick={() => setSidebarOpen(true)} />
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
          <main className="flex items-center justify-center min-h-[80vh] relative z-10">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-400" />
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase mb-2">
                Torneo <span className="text-gold">creado</span>
              </h1>
              <p className="text-text-muted text-sm mb-8">"{nombre}" ya está disponible. Ahora podés configurar los emparejamientos.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/dashboard/admin')} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 px-8">
                  Ir al panel
                </Button>
                <Button variant="outline" onClick={() => navigate('/torneos')} className="rounded-full border-gold text-gold hover:bg-gold/10 h-12 px-8">
                  Ver torneos
                </Button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    )
  }

  const formatos: { value: Formato; label: string; desc: string }[] = [
    { value: 'llaves', label: 'Llaves', desc: 'Eliminación directa' },
    { value: 'grupos', label: 'Grupos', desc: 'Fase de grupos + eliminatorias' },
    { value: 'liga', label: 'Liga', desc: 'Todos contra todos' },
  ]

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <AppTopbar title="Crear torneo" onMenuClick={() => setSidebarOpen(true)} />
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />

        <main className="max-w-[600px] mx-auto px-8 py-8 pb-[60px] relative z-10">
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3].map(p => (
                <div key={p} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${paso >= p ? 'bg-gold text-[#1A1206]' : 'bg-surface text-text-muted border border-border'}`}>{p}</div>
                  <span className={`text-xs font-semibold hidden md:block ${paso >= p ? 'text-gold' : 'text-text-muted'}`}>
                    {p === 1 ? 'Info' : p === 2 ? 'Configuración' : 'Canchas'}
                  </span>
                  {p < 3 && <div className={`w-8 h-px mx-1 ${paso > p ? 'bg-gold' : 'bg-border'}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paso === 0 && (
                <motion.div key="p0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Info del <span className="text-gold">torneo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Datos básicos para crear el torneo.</p>

                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Nombre del torneo</Label>
                  <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. TechCup 2026-III" className="bg-black border-border text-white rounded-xl h-12 mt-1.5 mb-4" />

                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2 block">Tipo de torneo</Label>
                  <div className="flex gap-3 mb-4">
                    {(['normal', 'relampago'] as const).map(t => (
                      <button key={t} onClick={() => setTipo(t)}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${tipo === t ? 'border-gold bg-gold/10' : 'border-border bg-black/30 hover:border-purple-mid/50'}`}>
                        <span className="text-lg mb-1 block">{t === 'normal' ? '📅' : '⚡'}</span>
                        <span className="text-sm font-bold">{t === 'normal' ? 'Normal' : 'Relámpago'}</span>
                        <p className="text-[10px] text-text-muted mt-0.5">{t === 'normal' ? 'Fechas programadas' : 'Mismo día'}</p>
                      </button>
                    ))}
                  </div>

                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2 block">Formato de competencia</Label>
                  <div className="flex gap-3 mb-6">
                    {formatos.map(f => (
                      <button key={f.value} onClick={() => setFormato(f.value)}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${formato === f.value ? 'border-gold bg-gold/10' : 'border-border bg-black/30 hover:border-purple-mid/50'}`}>
                        <span className="text-lg mb-1 block">
                          {f.value === 'llaves' ? '🏆' : f.value === 'grupos' ? '🔀' : '🔄'}
                        </span>
                        <span className="text-sm font-bold">{f.label}</span>
                        <p className="text-[10px] text-text-muted mt-0.5">{f.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                      <ArrowLeft size={16} /> Cancelar
                    </Button>
                    <Button onClick={() => setPaso(1)} disabled={!nombre.trim()} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1 disabled:opacity-40">
                      Siguiente <ArrowRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {paso === 1 && (
                <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Configuración <span className="text-gold">del torneo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Equipos, costo y fechas.</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Mín. equipos</Label>
                      <Input type="number" value={minEquipos} onChange={e => setMinEquipos(e.target.value)} className="bg-black border-border text-white rounded-xl h-12 mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Máx. equipos</Label>
                      <Input type="number" value={maxEquipos} onChange={e => setMaxEquipos(e.target.value)} className="bg-black border-border text-white rounded-xl h-12 mt-1.5" />
                    </div>
                  </div>

                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Costo de inscripción ($)</Label>
                  <Input type="number" value={costo} onChange={e => setCosto(e.target.value)} placeholder="0 = gratuito" className="bg-black border-border text-white rounded-xl h-12 mt-1.5 mb-4" />

                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Fecha cierre inscripciones</Label>
                  <Input type="date" value={fechaCierre} onChange={e => setFechaCierre(e.target.value)} className="bg-black border-border text-white rounded-xl h-12 mt-1.5 mb-4" />

                  {tipo === 'normal' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Fecha inicio</Label>
                        <Input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="bg-black border-border text-white rounded-xl h-12 mt-1.5" />
                      </div>
                      <div>
                        <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Fecha fin</Label>
                        <Input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="bg-black border-border text-white rounded-xl h-12 mt-1.5" />
                      </div>
                    </div>
                  )}

                  {tipo === 'relampago' && (
                    <div className="mb-4">
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Fecha del evento</Label>
                      <Input type="date" value={fechaInicio} onChange={e => { setFechaInicio(e.target.value); setFechaFin(e.target.value) }} className="bg-black border-border text-white rounded-xl h-12 mt-1.5" />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setPaso(0)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                      <ArrowLeft size={16} /> Anterior
                    </Button>
                    <Button onClick={() => setPaso(2)} disabled={!fechaCierre} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1 disabled:opacity-40">
                      Siguiente <ArrowRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {paso === 2 && (
                <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Canchas del <span className="text-gold">torneo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Registrá las canchas donde se jugarán los partidos.</p>

                  <div className="space-y-4 mb-6">
                    {canchas.map((c, i) => (
                      <div key={i} className="p-4 rounded-xl bg-black/50 border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase text-text-faint">Cancha #{i + 1}</span>
                          {canchas.length > 1 && (
                            <button onClick={() => setCanchas(canchas.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        <Input placeholder="Nombre de la cancha" value={c.nombre} onChange={e => { const n = [...canchas]; n[i] = { ...n[i], nombre: e.target.value }; setCanchas(n) }} className="bg-black border-border text-white rounded-xl h-11 mt-1.5 mb-2" />
                        <Input placeholder="Ubicación (ej. Sede Norte)" value={c.ubicacion} onChange={e => { const n = [...canchas]; n[i] = { ...n[i], ubicacion: e.target.value }; setCanchas(n) }} className="bg-black border-border text-white rounded-xl h-11 mt-1.5 mb-2" />
                        <Input placeholder="Descripción (opcional)" value={c.descripcion} onChange={e => { const n = [...canchas]; n[i] = { ...n[i], descripcion: e.target.value }; setCanchas(n) }} className="bg-black border-border text-white rounded-xl h-11 mt-1.5" />
                      </div>
                    ))}
                  </div>

                  {canAddMore && (
                    <Button variant="outline" onClick={() => setCanchas([...canchas, { nombre: '', ubicacion: '', descripcion: '' }])} className="w-full rounded-full border-border text-gray-light hover:bg-white/5 h-12 mb-6 gap-2">
                      <Plus size={16} /> Agregar otra cancha
                    </Button>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setPaso(1)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                      <ArrowLeft size={16} /> Anterior
                    </Button>
                    <Button onClick={handleCrear} disabled={!canchas[0]?.nombre.trim()} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1 disabled:opacity-40">
                      <Trophy size={16} /> Crear torneo
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>
        </main>
        <Footer />
      </div>
    </div>
  )
}
