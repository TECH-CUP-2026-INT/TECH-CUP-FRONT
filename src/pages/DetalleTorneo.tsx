import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { CalendarDays, Users, Download } from 'lucide-react'

type Tab = 'info' | 'equipos' | 'calendario' | 'tabla' | 'llaves'

export default function DetalleTorneo() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('info')

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="min-w-0 relative z-10">
        <AppTopbar title="Detalle del torneo" onMenuClick={() => setSidebarOpen(true)} />

        <main className="max-w-[900px] mx-auto px-8 py-8 pb-[60px]">
          {/* Banner */}
          <SpotlightCard accent="gold" className="bg-gradient-to-br from-purple-deep to-purple-black border border-border rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between max-md:flex-col max-md:text-center gap-4">
              <div>
                <Badge className="rounded-full bg-gold/15 text-gold border border-gold/40 text-[11px] mb-3">En curso</Badge>
                <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase">TechCup <span className="text-gold">2024-I</span></h1>
                <p className="text-text-muted text-sm mt-1">Ingeniería de Sistemas</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap max-md:justify-center">
                  <span className="flex items-center gap-1"><CalendarDays size={12} /> Mar 5 – Jun 15, 2024</span>
                  <span className="flex items-center gap-1"><Users size={12} /> 32 equipos</span>
                </div>
              </div>
              <Button size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs">
                <Download size={14} /> Reglamento PDF
              </Button>
            </div>
          </SpotlightCard>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6 overflow-x-auto">
            {(['info', 'equipos', 'calendario', 'tabla', 'llaves'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                  tab === t ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'
                }`}>{t === 'info' ? 'Información' : t === 'equipos' ? 'Equipos' : t === 'calendario' ? 'Calendario' : t === 'tabla' ? 'Tabla' : 'Llaves'}</button>
            ))}
          </div>

          {tab === 'info' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              {[
                { label: 'Formato', value: 'Todos contra todos + Eliminatorias' },
                { label: 'Categoría', value: 'Masculino · Fútbol 11' },
                { label: 'Duración', value: '3 meses (Mar 5 - Jun 15)' },
                { label: 'Costo de inscripción', value: '$50.000 por equipo' },
                { label: 'Cupo máximo', value: '32 equipos' },
                { label: 'Organizador', value: 'Prof. García - Decanatura' },
              ].map((info, i) => (
                <SpotlightCard key={i} accent={i % 2 === 0 ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl p-5">
                  <p className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold mb-1">{info.label}</p>
                  <p className="text-sm font-semibold">{info.value}</p>
                </SpotlightCard>
              ))}
            </motion.div>
          )}

          {tab === 'equipos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-text-muted mb-4">Mostrando solo nombre y escudo hasta que inicie el torneo.</p>
              <div className="grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-3">
                {['Tigres FC', 'Sistemas FC', 'IA Warriors', 'Code United', 'Dragones FC', 'Los Bits', 'Titanes', 'Fénix'].map((eq, i) => (
                  <Link key={i} to="/mi-equipo" className="block">
                    <SpotlightCard accent="purple" className="bg-surface border border-border rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-deep to-purple-black border border-gold/30 flex items-center justify-center text-lg font-bold text-gold mx-auto mb-2">{eq.split(' ')[0][0]}</div>
                      <p className="text-xs font-semibold">{eq}</p>
                    </SpotlightCard>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'tabla' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="text-[10px] text-text-faint uppercase tracking-[.5px] border-b border-border">
                    <th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">Equipo</th><th className="text-center py-3 px-3">PJ</th><th className="text-center py-3 px-3">G</th><th className="text-center py-3 px-3">E</th><th className="text-center py-3 px-3">P</th><th className="text-center py-3 px-3">DG</th><th className="text-right py-3 px-4">Pts</th>
                  </tr></thead>
                  <tbody>
                    {[{ eq: 'Tigres FC', pj: 12, g: 9, e: 2, p: 1, dg: 18, pts: 29 }, { eq: 'Sistemas FC', pj: 12, g: 8, e: 2, p: 2, dg: 12, pts: 26 }, { eq: 'IA Warriors', pj: 12, g: 7, e: 3, p: 2, dg: 8, pts: 24 }, { eq: 'Code United', pj: 12, g: 6, e: 2, p: 4, dg: 4, pts: 20 }].map((r, i) => (
                      <tr key={i} className="border-t border-border hover:bg-white/5">
                        <td className="py-3 px-4 text-text-muted w-8">{i + 1}</td>
                        <td className="py-3 px-4 font-semibold">{i === 0 ? '🏆 ' : ''}{r.eq}</td>
                        <td className="py-3 px-3 text-center">{r.pj}</td>
                        <td className="py-3 px-3 text-center text-green-400">{r.g}</td>
                        <td className="py-3 px-3 text-center text-yellow-400">{r.e}</td>
                        <td className="py-3 px-3 text-center text-red-400">{r.p}</td>
                        <td className="py-3 px-3 text-center">+{r.dg}</td>
                        <td className="py-3 px-4 text-right font-bold text-gold">{r.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SpotlightCard>
            </motion.div>
          )}

          {tab === 'calendario' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <CalendarDays size={40} className="mx-auto text-text-faint mb-4" />
              <p className="text-text-muted">Calendario disponible próximamente.</p>
            </motion.div>
          )}

          {tab === 'llaves' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-text-muted">Fase eliminatoria del torneo</p>
                <Link to="/llaves">
                  <Button size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 px-4">Ver bracket completo</Button>
                </Link>
              </div>
              <div className="bg-surface/50 border border-border/60 rounded-2xl p-6 overflow-x-auto">
                <div className="flex items-center justify-center gap-8 min-w-[500px]">
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold">🐯 Tigres FC <span className="text-gold">2</span></span></div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold">⚙️ Sistemas FC <span className="text-gold">1</span></span></div>
                    <div className="text-center text-[10px] text-text-faint uppercase tracking-wider mt-1">Cuartos</div>
                  </div>
                  <div className="text-gold text-2xl">⟶</div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl border border-gold/30 bg-gold/10"><span className="text-sm font-semibold">🐯 Tigres FC <span className="text-gold">1</span></span></div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold">🔵 Code United <span className="text-gold">0</span></span></div>
                    <div className="text-center text-[10px] text-text-faint uppercase tracking-wider mt-1">Semifinal</div>
                  </div>
                  <div className="text-gold text-2xl">⟶</div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-b from-gold/20 to-gold/5 border border-gold/40"><span className="text-sm font-semibold">🏆🐯 Tigres FC <span className="text-gold">3</span></span></div>
                    <div className="text-center text-[10px] text-text-faint uppercase tracking-wider mt-1">Final</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}
