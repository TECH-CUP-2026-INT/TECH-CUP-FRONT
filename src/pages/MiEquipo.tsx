import { useState } from 'react'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Badge } from '@/components/ui/badge'
import { Swords, Calendar, BarChart3, MessageSquare } from 'lucide-react'

type Tab = 'plantilla' | 'calendario' | 'estadisticas' | 'chat'

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

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
      <div className="relative z-10">
        <AppTopbar title="Mi equipo" onMenuClick={() => setSidebarOpen(true)} />

        <main className="max-w-[1000px] mx-auto px-8 py-8 pb-[60px]">
          {/* Header equipo */}
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-5 max-md:flex-col max-md:text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-deep to-purple-black border border-gold/30 flex items-center justify-center text-2xl font-black text-gold">SF</div>
              <div className="flex-1">
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Sistemas <span className="text-gold">FC</span></h1>
                <p className="text-sm text-text-muted mt-1">Capitán: Juan Pérez · TechCup 2024-I</p>
              </div>
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
            {(['plantilla','calendario','estadisticas','chat'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}>
                {t === 'plantilla' ? <Swords size={16} /> : t === 'calendario' ? <Calendar size={16} /> : t === 'estadisticas' ? <BarChart3 size={16} /> : <MessageSquare size={16} />}
                {t}
              </button>
            ))}
          </div>

          {/* Plantilla - álbum Panini */}
          {tab === 'plantilla' && (
            <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
              {jugadores.map((j, i) => (
                <SpotlightCard key={i} accent={i % 2 === 0 ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl p-5 text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-gold/30 ring-offset-2 ring-offset-black mb-3 group-hover:ring-gold/60 transition-all">
                    <img src={j.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-lg uppercase">{j.nombre.split(' ')[0]}</p>
                  <Badge className="rounded-full bg-purple-mid/20 text-purple-mid border border-purple-mid/30 text-[10px] mt-1">#{j.dorsal}</Badge>
                  <p className="text-xs text-text-muted mt-1">{j.posicion}</p>
                </SpotlightCard>
              ))}
            </div>
          )}

          {tab !== 'plantilla' && (
            <div className="text-center py-16">
              <p className="text-text-muted">Próximamente</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
