import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Trophy, Goal, ShieldCheck, Swords, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react'

type RankingTab = 'posiciones' | 'goleadores' | 'valla' | 'fairplay'

interface TablaEquipo {
  pos: number
  nombre: string
  pj: number
  g: number
  e: number
  p: number
  gf: number
  gc: number
  dg: number
  pts: number
  cambio: 'sube' | 'baja' | 'igual'
}

interface Goleador {
  pos: number
  nombre: string
  equipo: string
  goles: number
  asistencias: number
  partidos: number
}

interface PorteroRanking {
  pos: number
  nombre: string
  equipo: string
  golesRecibidos: number
  partidos: number
  vallasInvictas: number
}

interface FairPlay {
  pos: number
  equipo: string
  amarillas: number
  rojas: number
  puntos: number
}

const tablaMock: TablaEquipo[] = [
  { pos: 1, nombre: 'Tigres FC', pj: 12, g: 9, e: 2, p: 1, gf: 28, gc: 10, dg: 18, pts: 29, cambio: 'sube' },
  { pos: 2, nombre: 'Sistemas FC', pj: 12, g: 8, e: 2, p: 2, gf: 22, gc: 10, dg: 12, pts: 26, cambio: 'igual' },
  { pos: 3, nombre: 'IA Warriors', pj: 12, g: 7, e: 3, p: 2, gf: 20, gc: 12, dg: 8, pts: 24, cambio: 'sube' },
  { pos: 4, nombre: 'Code United', pj: 12, g: 6, e: 2, p: 4, gf: 18, gc: 14, dg: 4, pts: 20, cambio: 'baja' },
  { pos: 5, nombre: 'Dragones FC', pj: 12, g: 4, e: 3, p: 5, gf: 15, gc: 18, dg: -3, pts: 15, cambio: 'igual' },
  { pos: 6, nombre: 'Los Bits', pj: 12, g: 3, e: 2, p: 7, gf: 12, gc: 22, dg: -10, pts: 11, cambio: 'sube' },
  { pos: 7, nombre: 'Titanes', pj: 12, g: 2, e: 1, p: 9, gf: 8, gc: 25, dg: -17, pts: 7, cambio: 'baja' },
  { pos: 8, nombre: 'Fénix', pj: 12, g: 1, e: 1, p: 10, gf: 6, gc: 28, dg: -22, pts: 4, cambio: 'igual' },
]

const goleadoresMock: Goleador[] = [
  { pos: 1, nombre: 'Juan Pérez', equipo: 'Tigres FC', goles: 8, asistencias: 3, partidos: 10 },
  { pos: 2, nombre: 'Esteban Quintero', equipo: 'IA Warriors', goles: 6, asistencias: 4, partidos: 11 },
  { pos: 3, nombre: 'Daniel Castro', equipo: 'Tigres FC', goles: 5, asistencias: 2, partidos: 9 },
  { pos: 4, nombre: 'Laura Gómez', equipo: 'Tigres FC', goles: 5, asistencias: 5, partidos: 12 },
  { pos: 5, nombre: 'Pedro Gómez', equipo: 'Sistemas FC', goles: 4, asistencias: 6, partidos: 12 },
  { pos: 6, nombre: 'Miguel Ángel', equipo: 'Code United', goles: 4, asistencias: 2, partidos: 10 },
  { pos: 7, nombre: 'Carlos Marín', equipo: 'Sistemas FC', goles: 3, asistencias: 4, partidos: 11 },
  { pos: 8, nombre: 'Sofía López', equipo: 'Code United', goles: 3, asistencias: 3, partidos: 10 },
]

const porterosMock: PorteroRanking[] = [
  { pos: 1, nombre: 'Luis Torres', equipo: 'Sistemas FC', golesRecibidos: 10, partidos: 12, vallasInvictas: 5 },
  { pos: 2, nombre: 'Carlos Martínez', equipo: 'Tigres FC', golesRecibidos: 10, partidos: 12, vallasInvictas: 4 },
  { pos: 3, nombre: 'Andrés Ramírez', equipo: 'IA Warriors', golesRecibidos: 12, partidos: 12, vallasInvictas: 3 },
  { pos: 4, nombre: 'Felipe Rojas', equipo: 'Code United', golesRecibidos: 14, partidos: 12, vallasInvictas: 3 },
  { pos: 5, nombre: 'David Ocampo', equipo: 'IA Warriors', golesRecibidos: 18, partidos: 11, vallasInvictas: 2 },
]

const fairplayMock: FairPlay[] = [
  { pos: 1, equipo: 'Sistemas FC', amarillas: 8, rojas: 0, puntos: 8 },
  { pos: 2, equipo: 'Code United', amarillas: 10, rojas: 0, puntos: 10 },
  { pos: 3, equipo: 'Tigres FC', amarillas: 10, rojas: 1, puntos: 13 },
  { pos: 4, equipo: 'IA Warriors', amarillas: 12, rojas: 1, puntos: 15 },
  { pos: 5, equipo: 'Dragones FC', amarillas: 14, rojas: 1, puntos: 17 },
  { pos: 6, equipo: 'Los Bits', amarillas: 15, rojas: 2, puntos: 21 },
  { pos: 7, equipo: 'Titanes', amarillas: 18, rojas: 2, puntos: 24 },
  { pos: 8, equipo: 'Fénix', amarillas: 20, rojas: 3, puntos: 29 },
]

const tabs = [
  { id: 'posiciones' as RankingTab, label: 'Tabla de posiciones', icon: Trophy },
  { id: 'goleadores' as RankingTab, label: 'Goleadores', icon: Goal },
  { id: 'valla' as RankingTab, label: 'Valla menos vencida', icon: ShieldCheck },
  { id: 'fairplay' as RankingTab, label: 'Fair Play', icon: Swords },
]

function CambioIcon({ cambio }: { cambio: 'sube' | 'baja' | 'igual' }) {
  if (cambio === 'sube') return <ArrowUp size={14} className="text-green-400" />
  if (cambio === 'baja') return <ArrowDown size={14} className="text-red-400" />
  return <Minus size={14} className="text-text-faint" />
}

export default function Rankings() {
  const [tab, setTab] = useState<RankingTab>('posiciones')

  const rankColors = (pos: number) => {
    if (pos <= 3) return 'text-gold-ink'
    if (pos <= 5) return 'text-white'
    return 'text-text-muted'
  }

  const rankBg = (pos: number) => {
    if (pos <= 3) return 'bg-gold/10 border-gold/30'
    return 'bg-surface border-border/60'
  }

  return (
    <DashboardLayout title="Rankings">
      <main className="max-w-[900px] mx-auto px-8 py-8 pb-[60px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center">
            <Trophy size={22} className="text-gold-ink" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase">
              Rankings <span className="text-gold-ink">públicos</span>
            </h1>
            <p className="text-xs text-text-muted">TechCup 2026-I</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'}`}>
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Tabla de posiciones */}
        {tab === 'posiciones' && (
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 pb-3 border-b border-border">
              <h3 className="font-[family-name:var(--font-display)] text-lg uppercase flex items-center gap-2">
                <Medal size={18} className="text-gold-ink" /> Tabla de <span className="text-gold-ink">posiciones</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-text-faint uppercase tracking-[.5px] border-b border-border">
                    <th className="text-left py-3 px-4 w-10">#</th>
                    <th className="text-left py-3 px-4">Equipo</th>
                    <th className="text-center py-3 px-3">PJ</th>
                    <th className="text-center py-3 px-3">G</th>
                    <th className="text-center py-3 px-3">E</th>
                    <th className="text-center py-3 px-3">P</th>
                    <th className="text-center py-3 px-3">GF</th>
                    <th className="text-center py-3 px-3">GC</th>
                    <th className="text-center py-3 px-3">DG</th>
                    <th className="text-right py-3 px-4">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaMock.map((r, i) => (
                    <tr key={i} className={`border-t border-border hover:bg-white/5 transition-colors ${i < 3 ? 'bg-gold/[0.02]' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {i < 3 ? <Medal size={14} className="text-gold-ink" /> : <span className="text-text-muted">{r.pos}</span>}
                          <CambioIcon cambio={r.cambio} />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{r.nombre}</td>
                      <td className="py-3 px-4 text-center text-text-muted">{r.pj}</td>
                      <td className="py-3 px-4 text-center text-green-400">{r.g}</td>
                      <td className="py-3 px-4 text-center text-yellow-400">{r.e}</td>
                      <td className="py-3 px-4 text-center text-red-400">{r.p}</td>
                      <td className="py-3 px-4 text-center">{r.gf}</td>
                      <td className="py-3 px-4 text-center text-text-muted">{r.gc}</td>
                      <td className={`py-3 px-4 text-center font-mono ${r.dg > 0 ? 'text-green-400' : r.dg < 0 ? 'text-red-400' : 'text-text-muted'}`}>{r.dg > 0 ? `+${r.dg}` : r.dg}</td>
                      <td className="py-3 px-4 text-right font-bold text-gold-ink">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        )}

        {/* Goleadores */}
        {tab === 'goleadores' && (
          <div className="space-y-2">
            {goleadoresMock.map((g, i) => (
              <SpotlightCard key={i} accent={i < 3 ? 'gold' : 'purple'} className={`bg-surface border rounded-2xl p-4 ${i < 3 ? 'border-gold/30' : 'border-border'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${rankBg(i + 1)} border`}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${g.pos}`}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{g.nombre}</p>
                    <p className="text-xs text-text-muted">{g.equipo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-gold-ink">{g.goles}</p>
                    <p className="text-[10px] text-text-faint">{g.partidos} PJ · {g.asistencias} asist.</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        {/* Valla menos vencida */}
        {tab === 'valla' && (
          <div className="space-y-2">
            {porterosMock.map((p, i) => (
              <SpotlightCard key={i} accent={i < 3 ? 'gold' : 'purple'} className={`bg-surface border rounded-2xl p-4 ${i < 3 ? 'border-gold/30' : 'border-border'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${rankBg(i + 1)} border`}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${p.pos}`}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{p.nombre}</p>
                    <p className="text-xs text-text-muted">{p.equipo}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-text-faint">GR</p>
                      <p className="font-bold text-lg">{p.golesRecibidos}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-text-faint">VI</p>
                      <p className="font-bold text-lg text-green-400">{p.vallasInvictas}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-text-faint">PJ</p>
                      <p className="font-bold text-lg text-text-muted">{p.partidos}</p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        {/* Fair Play */}
        {tab === 'fairplay' && (
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 pb-3 border-b border-border">
              <h3 className="font-[family-name:var(--font-display)] text-lg uppercase flex items-center gap-2">
                <Swords size={18} className="text-gold-ink" /> Tabla de <span className="text-gold-ink">Fair Play</span>
              </h3>
              <p className="text-xs text-text-muted mt-1">Menos puntos = más limpio (🟨=1, 🟥=3)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-text-faint uppercase tracking-[.5px] border-b border-border">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-4">Equipo</th>
                    <th className="text-center py-3 px-3">🟨</th>
                    <th className="text-center py-3 px-3">🟥</th>
                    <th className="text-right py-3 px-4">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {fairplayMock.map((f, i) => (
                    <tr key={i} className={`border-t border-border hover:bg-white/5 transition-colors ${i < 3 ? 'bg-gold/[0.02]' : ''}`}>
                      <td className="py-3 px-4">
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : <span className="text-text-muted">{f.pos}</span>}
                      </td>
                      <td className="py-3 px-4 font-semibold">{f.equipo}</td>
                      <td className="py-3 px-4 text-center text-yellow-400">{f.amarillas}</td>
                      <td className="py-3 px-4 text-center text-red-400">{f.rojas}</td>
                      <td className="py-3 px-4 text-right font-bold text-gold-ink">{f.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        )}
      </main>
    </DashboardLayout>
  )
}
