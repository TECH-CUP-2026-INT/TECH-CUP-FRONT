import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { Swords, Shield, Calendar, Trophy, Camera, X, Lock, CheckCircle } from 'lucide-react'

type Tab = 'informacion' | 'estadisticas' | 'historial'

const stats = [
  { label: 'Goles', value: '8', icon: '⚽', color: 'from-gold to-gold-dark' },
  { label: 'Asistencias', value: '5', icon: '👟', color: 'from-purple-mid to-purple-deep' },
  { label: 'Tarjetas 🟨', value: '2', icon: '🟨', color: 'from-gold to-gold-dark' },
  { label: 'Faltas', value: '3', icon: '⚠️', color: 'from-purple-mid to-purple-deep' },
  { label: 'Partidos', value: '12', icon: '📋', color: 'from-gold to-gold-dark' },
  { label: 'Minutos', value: '480\'', icon: '⏱️', color: 'from-purple-mid to-purple-deep' },
]

const historial = [
  { torneo: 'TechCup 2024-I', partidos: 8, goles: 6, asistencias: 3, tarjetas: 1 },
  { torneo: 'TechCup 2023-II', partidos: 4, goles: 2, asistencias: 2, tarjetas: 1 },
]

export default function Perfil() {
  const [tab, setTab] = useState<Tab>('informacion')
  const { user } = useAuth()
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editProgram, setEditProgram] = useState('Ing. Sistemas')
  const [editSemester, setEditSemester] = useState('6')
  const [editSaved, setEditSaved] = useState(false)

  const handleSaveProfile = () => {
    if (user) {
      const updated = { ...user, name: editName }
      localStorage.setItem('techcup_user', JSON.stringify(updated))
    }
    localStorage.setItem('techcup_profile', JSON.stringify({ name: editName, program: editProgram, semester: editSemester }))
    setEditSaved(true)
    setTimeout(() => { setEditSaved(false); setEditingProfile(false) }, 1500)
  }

  return (
    <DashboardLayout title="Perfil deportivo">
      <main className="max-w-[900px] mx-auto px-8 py-8 pb-[60px]">
          {/* Header perfil */}
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-6 max-md:flex-col max-md:text-center">
              {/* Foto grande */}
              <div className="relative group">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-gold/40 ring-offset-4 ring-offset-black">
                  <img src="https://i.pravatar.cc/150?img=13" alt="" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-purple-mid border-2 border-black flex items-center justify-center hover:bg-purple-deep2 transition-colors">
                  <Camera size={14} className="text-white" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px]">
                  Juan Camilo <span className="text-gold">Rivera</span>
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap max-md:justify-center">
                  <Badge className="rounded-full bg-purple-mid/20 text-purple-mid border border-purple-mid/30 text-[11px] uppercase font-bold">
                    Jugador
                  </Badge>
                  <span className="text-sm text-text-muted">Sistemas FC</span>
                  <span className="w-1 h-1 rounded-full bg-text-faint" />
                  <span className="text-sm text-text-muted">Ing. Sistemas · Semestre 6</span>
                </div>
              </div>

              <div className="flex gap-2 max-md:flex-wrap max-md:justify-center">
                <Button size="sm" onClick={() => { setEditingProfile(true); setEditName(user?.name || '') }} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4">
                  Editar perfil
                </Button>
                <Button size="sm" variant="outline" className="rounded-full border-gold text-gold hover:bg-gold/10 text-xs h-auto py-2 px-4">
                  Subir foto
                </Button>
              </div>
            </div>
          </SpotlightCard>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6">
            {(['informacion', 'estadisticas', 'historial'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}
              >
                {t === 'informacion' ? 'Información' : t === 'estadisticas' ? 'Estadísticas' : 'Historial'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'informacion' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              {[
                { label: 'Posición', value: 'Delantero', icon: <Swords size={18} /> },
                { label: 'Dorsal', value: '#10', icon: <Shield size={18} /> },
                { label: 'Fecha nac.', value: '15 Mar 2003', icon: <Calendar size={18} /> },
                { label: 'Programa', value: 'Ing. Sistemas', icon: <Trophy size={18} /> },
              ].map((info, i) => (
                <SpotlightCard key={i} accent={i % 2 === 0 ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-mid/20 text-gold">{info.icon}</span>
                  <div>
                    <p className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold">{info.label}</p>
                    <p className="text-sm font-bold mt-0.5">{info.value}</p>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          )}

          {tab === 'estadisticas' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-3 max-md:grid-cols-2 gap-4 mb-6">
                {stats.map((s, i) => (
                  <SpotlightCard key={i} accent={i % 2 === 0 ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl p-5 text-center">
                    <span className="text-2xl mb-2 block">{s.icon}</span>
                    <p className="font-[family-name:var(--font-display)] text-3xl font-bold">{s.value}</p>
                    <p className="text-xs text-text-muted mt-1">{s.label}</p>
                  </SpotlightCard>
                ))}
              </div>

              {/* Promedios */}
              <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] mb-4">
                  Promedios por <span className="text-gold">partido</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Goles', value: '0.67' },
                    { label: 'Asistencias', value: '0.42' },
                    { label: 'Faltas', value: '0.25' },
                  ].map((p, i) => (
                    <div key={i} className="text-center">
                      <p className="font-[family-name:var(--font-display)] text-2xl text-gold">{p.value}</p>
                      <p className="text-xs text-text-muted">{p.label}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {tab === 'historial' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {historial.map((h, i) => (
                <SpotlightCard key={i} accent="gold" className="bg-surface border border-border rounded-2xl p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-lg uppercase mb-3">{h.torneo}</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Partidos', value: h.partidos },
                      { label: 'Goles', value: h.goles },
                      { label: 'Asistencias', value: h.asistencias },
                      { label: 'Tarjetas', value: h.tarjetas },
                    ].map((d, j) => (
                      <div key={j} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="font-[family-name:var(--font-display)] text-xl text-gold">{d.value}</p>
                        <p className="text-xs text-text-muted">{d.label}</p>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          )}
        </main>

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
                <button onClick={() => setEditingProfile(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
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
    </DashboardLayout>
  )
}
