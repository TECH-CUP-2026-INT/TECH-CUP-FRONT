import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Swords, Shield, Calendar, Trophy, Camera } from 'lucide-react'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('informacion')

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <AppTopbar title="Perfil deportivo" onMenuClick={() => setSidebarOpen(true)} />

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
                <Button size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4">
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

        <Footer />
      </div>
    </div>
  )
}
