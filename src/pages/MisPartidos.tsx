import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin, Clock, Swords } from 'lucide-react'

type Tab = 'proximos' | 'envivo' | 'finalizados'

const partidos = [
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Tigres FC', fecha: '24 MAY', hora: '8:00 PM', cancha: 'Cancha 1', estado: 'upcoming', detalle: 'En 2 días' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Code United', fecha: '18 MAY', hora: '8:00 PM', cancha: 'Cancha 2', estado: 'final', resultado: '3 - 1' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'IA Warriors', fecha: '11 MAY', hora: '5:00 PM', cancha: 'Cancha 1', estado: 'final', resultado: '2 - 2' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Los Bits', fecha: '28 MAY', hora: '7:00 PM', cancha: 'Cancha 3', estado: 'upcoming', detalle: 'En 5 días' },
  { torneo: 'TechCup 2024-I', eq1: 'Sistemas FC', eq2: 'Dragones FC', fecha: '20 MAY', hora: '6:00 PM', cancha: 'Cancha 1', estado: 'live', resultado: '1 - 0' },
]

export default function MisPartidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('proximos')

  const filtrados = partidos.filter(p => p.estado === (tab === 'proximos' ? 'upcoming' : tab === 'envivo' ? 'live' : 'final'))

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
      <div className="min-w-0 relative z-10">
        <AppTopbar title="Mis partidos" onMenuClick={() => setSidebarOpen(true)} />

        <main className="max-w-[800px] mx-auto px-8 py-8 pb-[60px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6">
            {(['proximos', 'envivo', 'finalizados'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}>
                {t === 'proximos' ? 'Próximos' : t === 'envivo' ? 'En vivo' : 'Finalizados'}
                {t === 'envivo' && <span className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />}
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-16">
              <Swords size={40} className="mx-auto text-text-faint mb-4" />
              <p className="text-text-muted">No hay partidos en esta categoría.</p>
            </div>
          )}

          <div className="space-y-3">
            {filtrados.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SpotlightCard accent={p.estado === 'live' ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <span className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold">{p.torneo}</span>
                      <Badge className={`rounded-full text-[10px] px-2.5 py-0.5 h-auto uppercase font-bold ${
                        p.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse' :
                        p.estado === 'upcoming' ? 'bg-gold/15 text-gold border border-gold/40' : 'bg-white/10 text-text-muted border border-white/15'
                      }`}>
                        {p.estado === 'live' ? '🔴 En vivo' : p.estado === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base">{p.eq1}</span>
                          <span className="text-xs text-text-faint font-bold">VS</span>
                          <span className="font-bold text-base">{p.eq2}</span>
                        </div>
                      </div>
                      {p.resultado && (
                        <span className={`font-[family-name:var(--font-display)] text-xl ${p.estado === 'live' ? 'text-green-400' : 'text-text-muted'}`}>
                          {p.resultado}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {p.fecha}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.hora}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {p.cancha}</span>
                      {p.detalle && <span className="text-gold font-semibold">{p.detalle}</span>}
                    </div>

                    <div className="mt-3">
                      <Link to="/partido/1">
                        <Button size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 px-4">Ver detalle</Button>
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
