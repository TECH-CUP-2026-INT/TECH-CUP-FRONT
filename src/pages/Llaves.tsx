import { useState } from 'react'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { Button } from '@/components/common/button'
import { Swords, Shuffle, Edit3 } from 'lucide-react'

type Equipo = { nom: string; emoji: string; color: string }
type Partido = { eq1: Equipo; eq2: Equipo; res: string; ganador?: string }

const equipos: Equipo[] = [
  { nom: 'Tigres FC', emoji: '🐯', color: '#EF4444' },
  { nom: 'Sistemas FC', emoji: '⚙️', color: '#22C55E' },
  { nom: 'Code United', emoji: '🔵', color: '#3B82F6' },
  { nom: 'IA Warriors', emoji: '🦁', color: '#8B5CF6' },
  { nom: 'Dragones FC', emoji: '🐉', color: '#F97316' },
  { nom: 'Los Bits', emoji: '⚡', color: '#F5A623' },
  { nom: 'Titanes', emoji: '🛡️', color: '#14B8A6' },
  { nom: 'Fénix', emoji: '🔥', color: '#EC4899' },
]

const Llave = ({ partido, round }: { partido: Partido; round: number }) => (
  <div className={`flex flex-col ${round < 2 ? 'justify-around' : 'justify-center'} h-full`}>
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${partido.ganador === partido.eq1.nom ? 'border-gold/50 bg-gold/10' : 'border-white/10 bg-white/5'}`}>
      <span>{partido.eq1.emoji}</span>
      <span className="text-sm font-semibold flex-1">{partido.eq1.nom}</span>
      <span className="text-xs font-bold font-mono text-gold">{partido.res.split(' - ')[0]}</span>
    </div>
    <div className="h-3 flex items-center justify-center">
      <span className="text-[8px] text-text-faint font-bold uppercase tracking-wider">VS</span>
    </div>
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${partido.ganador === partido.eq2.nom ? 'border-gold/50 bg-gold/10' : 'border-white/10 bg-white/5'}`}>
      <span>{partido.eq2.emoji}</span>
      <span className="text-sm font-semibold flex-1">{partido.eq2.nom}</span>
      <span className="text-xs font-bold font-mono text-gold">{partido.res.split(' - ')[1]}</span>
    </div>
  </div>
)

export default function Llaves() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [generado, setGenerado] = useState(false)

  const cuartos: Partido[] = [
    { eq1: equipos[0], eq2: equipos[1], res: '2 - 1', ganador: 'Tigres FC' },
    { eq1: equipos[2], eq2: equipos[3], res: '3 - 0', ganador: 'Code United' },
    { eq1: equipos[4], eq2: equipos[5], res: '2 - 2', ganador: 'Dragones FC' },
    { eq1: equipos[6], eq2: equipos[7], res: '1 - 0', ganador: 'Titanes' },
  ]

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <AppTopbar title="Llaves eliminatorias" onMenuClick={() => setSidebarOpen(true)} />
        <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />

        <main className="p-8 pb-[60px] relative z-10 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 max-md:flex-col gap-3">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px]">
                Llaves <span className="text-gold">eliminatorias</span>
              </h1>
              <p className="text-sm text-text-muted">TechCup 2024-I · Fase final</p>
            </div>
            <div className="flex gap-2">
              {!generado ? (
                <Button onClick={() => setGenerado(true)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-sm h-auto py-2.5 px-5 flex items-center gap-2">
                  <Shuffle size={16} /> Generar llaves
                </Button>
              ) : (
                <Button variant="outline" className="rounded-full border-gold/50 text-gold hover:bg-gold/10 text-sm h-auto py-2.5 px-5 flex items-center gap-2">
                  <Edit3 size={16} /> Editar emparejamientos
                </Button>
              )}
            </div>
          </div>

          {!generado ? (
            <div className="text-center py-20">
              <Swords size={48} className="mx-auto text-text-faint mb-4" />
              <p className="text-text-muted text-lg">Las llaves aún no han sido generadas.</p>
              <p className="text-sm text-text-muted mt-1">El organizador debe generar las llaves cuando la fase de grupos finalice.</p>
            </div>
          ) : (
            <div className="min-w-[800px]">
              {/* Rounds header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-6 mb-6">
                {['CUARTOS DE FINAL', 'SEMIFINAL', 'FINAL', 'CAMPEÓN'].map((r, i) => (
                  <div key={i} className="text-[10px] uppercase tracking-[2px] text-text-faint font-semibold text-center">
                    {r}
                  </div>
                ))}
              </div>

              {/* Bracket */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-6">
                {/* Cuartos */}
                <div className="flex flex-col justify-around gap-6">
                  <Llave partido={cuartos[0]} round={0} />
                  <div className="relative">
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-gold/30" />
                  </div>
                  <Llave partido={cuartos[1]} round={0} />
                  <div className="relative">
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-gold/30" />
                  </div>
                  <Llave partido={cuartos[2]} round={0} />
                  <div className="relative">
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-gold/30" />
                  </div>
                  <Llave partido={cuartos[3]} round={0} />
                  <div className="relative">
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-gold/30" />
                  </div>
                </div>

                {/* Semifinal */}
                <div className="flex flex-col justify-around py-[52px]">
                  <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/30 bg-gold/10">
                        <span>🐯</span><span className="text-sm font-semibold flex-1">Tigres FC</span>
                        <span className="text-xs font-bold font-mono text-gold">1</span>
                      </div>
                      <span className="text-[8px] text-text-faint text-center">VS</span>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                        <span>🔵</span><span className="text-sm font-semibold flex-1">Code United</span>
                        <span className="text-xs font-bold font-mono text-gold">0</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/30 bg-gold/10">
                        <span>🐉</span><span className="text-sm font-semibold flex-1">Dragones FC</span>
                        <span className="text-xs font-bold font-mono text-gold">2</span>
                      </div>
                      <span className="text-[8px] text-text-faint text-center">VS</span>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/30 bg-gold/10">
                        <span>🛡️</span><span className="text-sm font-semibold flex-1">Titanes</span>
                        <span className="text-xs font-bold font-mono text-gold">1</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final */}
                <div className="flex flex-col justify-center py-[130px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/40 bg-gold/15">
                      <span>🐯</span><span className="text-sm font-semibold flex-1">Tigres FC</span>
                      <span className="text-xs font-bold font-mono text-gold">3</span>
                    </div>
                    <span className="text-[8px] text-text-faint text-center">VS</span>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                      <span>🐉</span><span className="text-sm font-semibold flex-1">Dragones FC</span>
                      <span className="text-xs font-bold font-mono text-gold">1</span>
                    </div>
                  </div>
                </div>

                {/* Champion */}
                <div className="flex flex-col justify-center">
                  <div className="w-full min-w-[120px] flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-gold/20 to-gold/5 border border-gold/40">
                    <span className="text-3xl">🏆</span>
                    <span className="text-2xl">🐯</span>
                    <p className="font-[family-name:var(--font-display)] text-lg uppercase text-gold">Tigres FC</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-[1px]">Campeón 2024-I</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
