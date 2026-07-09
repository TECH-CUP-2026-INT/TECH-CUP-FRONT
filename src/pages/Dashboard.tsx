import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { partidos, posiciones } from '@/data/partidos'
import { Input } from '@/components/ui/input'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0">
        <AppTopbar title="Inicio" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-8 pb-[60px] max-md:p-5 relative">
          {/* Background glow - más intenso */}
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
          <div className="fixed top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-deep/10 blur-[100px] pointer-events-none" />
          
          {/* Hero */}
          <section className="rounded-2xl p-10 max-md:p-6 mb-[26px] relative bg-[radial-gradient(ellipse_500px_300px_at_85%_20%,rgba(245,166,35,.18),transparent_65%),linear-gradient(120deg,var(--color-purple-deep2)_0%,var(--color-purple-black)_70%)] border border-white/10 shadow-[0_0_0_1px_rgba(109,40,217,.15),0_20px_60px_-20px_rgba(76,29,149,.55)]">
            <h2 className="font-[family-name:var(--font-display)] uppercase text-3xl leading-tight max-w-[480px] mb-5">
              LA PASIÓN NOS UNE,<br />LA <span className="text-gold">INGENIERÍA</span> NOS IMPULSA.
            </h2>
            <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold">
              Explorar torneos →
            </Button>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-4 max-lg:grid-cols-2 gap-[18px] mb-[26px]">
            {[
              { icon:'🏆', num:'4', label:'Torneos activos', accent:'purple' },
              { icon:'👥', num:'32', label:'Equipos inscritos', accent:'gold' },
              { icon:'📅', num:'6', label:'Próximos partidos', accent:'purple' },
              { icon:'📊', num:'128', label:'Goles marcados', accent:'gold' },
            ].map((s, i) => (
              <SpotlightCard key={i} accent={s.accent as 'gold' | 'purple'} className="p-5 flex gap-3.5 items-center bg-surface border-border rounded-2xl">
                <span className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center flex-shrink-0 ${s.accent === 'purple' ? 'bg-purple-mid/20 text-[#b39ef2]' : 'bg-gold/15 text-gold'}`}>
                  {s.icon}
                </span>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-[26px] leading-none">{s.num}</div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              </SpotlightCard>
            ))}
          </section>

          {/* Matches + Standings */}
          <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">
            <SpotlightCard accent="purple" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">Próximos partidos</h3>
                <a href="#" className="text-xs text-gold font-bold">Ver calendario completo →</a>
              </div>
              {partidos.map((m, i) => (
                <div key={i} className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0">
                  <div className="w-[52px] text-center flex-shrink-0">
                    <b className="block font-[family-name:var(--font-display)] text-lg">{m.dia}</b>
                    <span className="text-[10px] text-text-muted uppercase">{m.mes}</span>
                  </div>
                  <div className="flex-1 text-[13.5px] font-semibold">
                    {m.eq1} <span className="text-text-faint">vs</span> {m.eq2}
                    <small className="block font-normal text-text-muted text-[11.5px] mt-0.5">{m.lugar}</small>
                  </div>
                  <div className="text-xs text-gold font-bold">{m.hora}</div>
                </div>
              ))}
            </SpotlightCard>

            <SpotlightCard accent="gold" className="p-[22px_24px] bg-surface border-border rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14.5px] font-semibold tracking-[.3px]">Tabla de posiciones</h3>
                <a href="#" className="text-xs text-gold font-bold">Ver completa →</a>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[10.5px] text-text-faint uppercase tracking-[.5px] font-semibold text-left">
                    <th className="pb-2.5">Pos</th><th className="pb-2.5">Equipo</th><th className="pb-2.5">PJ</th><th className="pb-2.5">DG</th><th className="pb-2.5 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {posiciones.map((r, i) => (
                    <tr key={i} className={`text-[13px] ${i === 0 ? 'text-gold font-bold' : ''}`}>
                      <td className="py-2 text-text-muted w-[26px]">{r.pos}</td>
                      <td className="py-2 border-t border-border">{i === 0 ? '🏆 ' : ''}{r.equipo}</td>
                      <td className="py-2 border-t border-border">{r.pj}</td>
                      <td className="py-2 border-t border-border">{r.dg > 0 ? '+' : ''}{r.dg}</td>
                      <td className="py-2 border-t border-border text-right font-bold">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SpotlightCard>
          </section>

          {/* CTA */}
          <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-gradient-to-r from-purple-deep2 to-purple-black border border-white/10 max-md:flex-col max-md:items-start">
            <div>
              <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1">Forma tu equipo y vive la experiencia</h3>
              <p className="text-[13px] text-text-muted">Invita a tus amigos y compite por la copa.</p>
            </div>
            <InteractiveHoverButton onClick={() => alert('Crear equipo')}>
              Crear equipo
            </InteractiveHoverButton>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
