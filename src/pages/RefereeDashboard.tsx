import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import ManchasFloating from '@/components/common/ManchasFloating'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Swords, CalendarDays, MapPin, Clock, Shield } from 'lucide-react'

const partidos = [
  { id: 1, eq1: 'Tigres FC', eq2: 'Sistemas FC', fecha: '24 MAY', hora: '8:00 PM', cancha: 'Cancha 1', estado: 'live', torneo: 'TechCup 2024-I' },
  { id: 2, eq1: 'Code United', eq2: 'IA Warriors', fecha: '24 MAY', hora: '9:30 PM', cancha: 'Cancha 2', estado: 'upcoming', torneo: 'TechCup 2024-I' },
  { id: 3, eq1: 'Dragones FC', eq2: 'Los Bits', fecha: '25 MAY', hora: '5:00 PM', cancha: 'Cancha 1', estado: 'upcoming', torneo: 'TechCup 2024-I' },
  { id: 4, eq1: 'Sistemas FC', eq2: 'Tigres FC', fecha: '18 MAY', hora: '8:00 PM', cancha: 'Cancha 1', estado: 'final', resultado: '2 - 1', torneo: 'TechCup 2024-I' },
]

const SIDEBAR_KEY = 'techcup_sidebar_collapsed'

export default function RefereeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored ? JSON.parse(stored) : false
  })
  const navigate = useNavigate()

  const handleCollapse = (val: boolean) => {
    setSidebarCollapsed(val)
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(val))
  }

  const sidebarWidth = sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px'

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onCollapse={handleCollapse} />
      <div className="min-w-0 flex-1 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <AppTopbar title="Panel de árbitro" sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
        <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />

        <main className="max-w-[900px] mx-auto px-8 py-8 pb-[60px] relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-purple-mid/20 border border-gold/30 flex items-center justify-center">
              <Shield size={24} className="text-gold" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase">Panel de <span className="text-gold">árbitro</span></h1>
              <p className="text-sm text-text-muted">Tus partidos asignados — Gestioná cuando inicie el encuentro.</p>
            </div>
          </div>

          {/* Partido destacado - en vivo */}
          {partidos.filter(p => p.estado === 'live').map(p => (
            <SpotlightCard key={p.id} accent="gold" className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between max-md:flex-col gap-4">
                <div>
                  <Badge className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> EN VIVO
                  </Badge>
                  <p className="text-xs text-text-faint uppercase tracking-[.4px]">{p.torneo}</p>
                  <h2 className="font-[family-name:var(--font-display)] text-xl uppercase mt-1">{p.eq1} <span className="text-gold">VS</span> {p.eq2}</h2>
                  <div className="flex items-center gap-4 text-xs text-text-muted mt-2">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {p.fecha}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {p.hora}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {p.cancha}</span>
                  </div>
                </div>
                <Button onClick={() => navigate('/arbitraje')} className="rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3 h-auto shadow-lg shadow-green-900/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Gestionar partido
                </Button>
              </div>
            </SpotlightCard>
          ))}

          {/* Lista de partidos */}
          <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] mb-4">
            Mis partidos <span className="text-gold">asignados</span>
          </h3>
          <div className="space-y-3">
            {partidos.map(p => (
              <SpotlightCard key={p.id} accent={p.estado === 'live' ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <p className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold">{p.torneo}</p>
                    <Badge className={`rounded-full text-[10px] px-2.5 py-0.5 h-auto uppercase font-bold ${
                      p.estado === 'live' ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse' :
                      p.estado === 'upcoming' ? 'bg-gold/15 text-gold border border-gold/40' : 'bg-white/10 text-text-muted border border-white/15'
                    }`}>
                      {p.estado === 'live' ? '🔴 En vivo' : p.estado === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Swords size={14} className="text-gold flex-shrink-0" />
                    <span className="font-semibold text-sm">{p.eq1} <span className="text-text-faint">vs</span> {p.eq2}</span>
                    {p.resultado && <span className="text-sm font-bold text-text-muted">{p.resultado}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {p.fecha}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {p.hora}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {p.cancha}</span>
                    {p.estado === 'live' && (
                      <button onClick={() => navigate('/arbitraje')} className="text-green-400 font-bold text-xs ml-auto hover:underline">
                        Gestionar →
                      </button>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </main>
        <Footer />
      </div>
      <ManchasFloating />
    </div>
  )
}
