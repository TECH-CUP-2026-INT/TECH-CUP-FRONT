import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import {
  Trophy, Goal, ShieldCheck, Swords, Medal,
  ArrowUp, ArrowDown, Minus, Shuffle, Shield,
} from 'lucide-react'

type RankingTab = 'posiciones' | 'goleadores' | 'valla' | 'fairplay' | 'llaves'

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
  { id: 'llaves' as RankingTab, label: 'Llaves', icon: Shield },
]

function CambioIcon({ cambio }: { cambio: 'sube' | 'baja' | 'igual' }) {
  if (cambio === 'sube') return <ArrowUp size={14} className="text-green-400" />
  if (cambio === 'baja') return <ArrowDown size={14} className="text-red-400" />
  return <Minus size={14} className="text-text-faint" />
}

export default function Rankings() {
  const [tab, setTab] = useState<RankingTab>('posiciones')

  const rankColors = (pos: number) => {
    if (pos <= 3) return 'text-gold'
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
            <Trophy size={22} className="text-gold" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase">
              Rankings <span className="text-gold">públicos</span>
            </h1>
            <p className="text-xs text-text-muted">TechCup 2026-I</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${tab === t.id ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'}`}>
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
                <Medal size={18} className="text-gold" /> Tabla de <span className="text-gold">posiciones</span>
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
                          {i < 3 ? <Medal size={14} className="text-gold" /> : <span className="text-text-muted">{r.pos}</span>}
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
                      <td className="py-3 px-4 text-right font-bold text-gold">{r.pts}</td>
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
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-gold">{g.goles}</p>
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
                <Swords size={18} className="text-gold" /> Tabla de <span className="text-gold">Fair Play</span>
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
                      <td className="py-3 px-4 text-right font-bold text-gold">{f.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        )}

        {/* ===== LLAVES ELIMINATORIAS ===== */}
        {tab === 'llaves' && <LlavesBracket />}
      </main>
    </DashboardLayout>
  )
}

/* ─────────────────────── WORLD CUP BRACKET ─────────────────────── */

type EquipoB = { nom: string; emoji: string; color: string; bandera: string }

type PartidoB = {
  eq1: EquipoB
  eq2: EquipoB
  res1: number | null
  res2: number | null
  ganador: string | null
  penales?: boolean
  penRes1?: number
  penRes2?: number
}

type RondaB = {
  nombre: string
  abbr: string
  partidos: PartidoB[]
}

const equiposB: EquipoB[] = [
  { nom: 'Tigres FC', emoji: '🐯', color: '#EF4444', bandera: '🇲🇽' },
  { nom: 'Sistemas FC', emoji: '⚙️', color: '#22C55E', bandera: '🇨🇴' },
  { nom: 'Code United', emoji: '🔵', color: '#3B82F6', bandera: '🇺🇸' },
  { nom: 'IA Warriors', emoji: '🦁', color: '#8B5CF6', bandera: '🇬🇧' },
]

function simularPartido(e1: EquipoB, e2: EquipoB): PartidoB {
  const a = Math.random() * 4 | 0
  const b = Math.random() * 4 | 0
  let penales = false
  let p1: number | undefined
  let p2: number | undefined
  let gan: string
  if (a !== b) {
    gan = a > b ? e1.nom : e2.nom
  } else {
    penales = true
    p1 = (Math.random() * 5 | 0) + 1
    p2 = (Math.random() * 5 | 0) + 1
    while (p1 === p2) { p1 = (Math.random() * 5 | 0) + 1 }
    gan = p1 > p2 ? e1.nom : e2.nom
  }
  return { eq1: e1, eq2: e2, res1: a, res2: b, ganador: gan, penales, penRes1: p1, penRes2: p2 }
}

function generarBracket(): RondaB[] {
  const mezcla = [...equiposB].sort(() => Math.random() - 0.5)

  const semi1 = simularPartido(mezcla[0], mezcla[1])
  const semi2 = simularPartido(mezcla[2], mezcla[3])

  const g1 = equiposB.find(e => e.nom === semi1.ganador)!
  const g2 = equiposB.find(e => e.nom === semi2.ganador)!
  const final = simularPartido(g1, g2)

  return [
    { nombre: 'Semifinal', abbr: 'SEMIS', partidos: [semi1, semi2] },
    { nombre: 'Final', abbr: 'FINAL', partidos: [final] },
  ]
}

function MatchCardB({ partido, index }: { partido: PartidoB; index: number }) {
  const esGanador = (nom: string) => partido.ganador === nom

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="mb-1.5"
    >
      <div className="bg-surface/80 border-4 dark:border-white/20 border-gray-500/50 rounded-lg overflow-hidden shadow-sm">
        {/* Team 1 */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 border-b border-border/50 transition-all ${
          esGanador(partido.eq1.nom)
            ? 'bg-gold/10 border-l-2 border-l-gold'
            : partido.ganador && !esGanador(partido.eq1.nom)
            ? 'opacity-50'
            : ''
        }`}>
          <span className="text-xs">{partido.eq1.emoji}</span>
          <span className="font-semibold flex-1 truncate text-xs">{partido.eq1.nom}</span>
          {esGanador(partido.eq1.nom) && <Trophy size={10} className="text-gold mr-1" />}
          <span className={`font-bold font-mono text-xs ${esGanador(partido.eq1.nom) ? 'text-gold' : 'text-text-muted'}`}>
            {partido.res1 ?? '-'}
          </span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 transition-all ${
          esGanador(partido.eq2.nom)
            ? 'bg-gold/10 border-l-2 border-l-gold'
            : partido.ganador && !esGanador(partido.eq2.nom)
            ? 'opacity-50'
            : ''
        }`}>
          <span className="text-xs">{partido.eq2.emoji}</span>
          <span className="font-semibold flex-1 truncate text-xs">{partido.eq2.nom}</span>
          {esGanador(partido.eq2.nom) && <Trophy size={10} className="text-gold mr-1" />}
          <span className={`font-bold font-mono text-xs ${esGanador(partido.eq2.nom) ? 'text-gold' : 'text-text-muted'}`}>
            {partido.res2 ?? '-'}
          </span>
        </div>

        {partido.penales && partido.penRes1 != null && partido.penRes2 != null && (
          <div className="flex items-center justify-center gap-2 px-2 py-0.5 bg-purple-black/50 border-t border-border/30">
            <span className="text-[8px] text-text-faint uppercase tracking-[1px]">Pen</span>
            <span className="text-[10px] font-bold font-mono text-purple-mid">{partido.penRes1} - {partido.penRes2}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function LlavesBracket() {
  const [generado, setGenerado] = useState(false)
  const [rondas, setRondas] = useState<RondaB[]>([])

  const handleGenerar = () => {
    setRondas(generarBracket())
    setGenerado(true)
  }

  const champion = rondas.length > 1 && rondas[1].partidos[0]?.ganador
    ? equiposB.find(e => e.nom === rondas[1].partidos[0].ganador)
    : null

  if (!generado) {
    return (
      <SpotlightCard accent="gold" className="bg-surface border-4 dark:border-white/15 border-gray-500/40 rounded-2xl overflow-hidden mt-2">
        <div className="p-5 pb-3 border-b-4 dark:border-b-white/10 border-b-gray-500/30">
          <h3 className="font-[family-name:var(--font-display)] text-lg uppercase flex items-center gap-2">
            <Shield size={18} className="text-gold" /> Fase <span className="text-gold">eliminatoria</span>
          </h3>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-xs text-text-muted">Semifinales · 4 equipos</p>
          <Button onClick={handleGenerar} size="sm"
            className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4 flex items-center gap-1.5">
            <Shuffle size={14} /> Generar llaves
          </Button>
        </div>
        <div className="text-center py-14">
          <Swords size={40} className="mx-auto text-text-faint mb-3" />
          <p className="text-text-muted text-sm">Presioná <span className="text-gold font-semibold">"Generar llaves"</span> para crear el bracket</p>
        </div>
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard accent="gold" className="bg-surface border-4 dark:border-white/15 border-gray-500/40 rounded-2xl overflow-hidden mt-2">
      <div className="p-5 pb-3 border-b-4 dark:border-b-white/10 border-b-gray-500/30 flex items-center justify-between max-md:flex-col gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg uppercase flex items-center gap-2">
            <Shield size={18} className="text-gold" /> Fase <span className="text-gold">eliminatoria</span>
          </h3>
          <p className="text-xs text-text-muted">Semifinales · 4 equipos</p>
        </div>
        <Button onClick={handleGenerar} size="sm"
          className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4 flex items-center gap-1.5">
          <Shuffle size={14} /> Regenerar
        </Button>
      </div>

      <div className="overflow-x-auto p-5">
        <div className="min-w-[700px]">
          {/* Round badges alineados con las columnas de abajo */}
          <div className="flex items-center gap-0 mb-5">
            <div className="min-w-[185px] text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-[1.5px] bg-purple-black/60 text-text-faint border-4 dark:border-white/15 border-gray-500/40">
                SEMIS
              </span>
            </div>
            <div className="w-12 flex-shrink-0" />
            <div className="min-w-[185px] text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-[1.5px] bg-gold/15 text-gold border-4 border-gold/40">
                <Trophy size={11} className="text-gold" /> FINAL
              </span>
            </div>
            <div className="w-12 flex-shrink-0" />
            {champion && (
              <div className="min-w-[130px] text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-[1.5px] bg-gold/20 text-gold border-4 border-gold/50">
                  <Medal size={11} /> CAMPEÓN
                </span>
              </div>
            )}
          </div>

          {/* Bracket — estilo árbol tipo mundial */}
          <div className="flex items-stretch gap-0">
            {/* ─── Columna Semifinales ─── */}
            <div className="flex flex-col justify-between min-w-[185px]">
              {rondas[0].partidos.map((p, pi) => (
                <MatchCardB key={pi} partido={p} index={pi} />
              ))}
            </div>

            {/* ─── Conector tipo árbol: ramas que convergen ─── */}
            <div className="w-12 flex-shrink-0 relative mx-1">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 48 100"
                preserveAspectRatio="none"
              >
                {/* Rama desde Semi 1 (~20%) hacia el centro (~50%) */}
                <path
                  d="M0,20 L28,20 L28,50"
                  stroke="rgba(245,166,35,0.35)"
                  strokeWidth="2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Rama desde Semi 2 (~80%) hacia el centro (~50%) */}
                <path
                  d="M0,80 L28,80 L28,50"
                  stroke="rgba(245,166,35,0.35)"
                  strokeWidth="2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Tronco vertical que une las ramas */}
                <line
                  x1="28" y1="20" x2="28" y2="80"
                  stroke="rgba(245,166,35,0.15)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Flecha → que apunta a la final */}
                <polygon points="36,46 46,50 36,54" fill="rgba(245,166,35,0.6)" />
              </svg>
            </div>

            {/* ─── Columna Final ─── */}
            <div className="flex flex-col justify-center min-w-[185px]">
              {rondas[1].partidos.map((p, pi) => (
                <MatchCardB key={pi} partido={p} index={pi} />
              ))}
            </div>

            {/* ─── Conector Final → Champion ─── */}
            {champion && (
              <div className="w-12 flex-shrink-0 relative mx-1">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 48 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 L34,50"
                    stroke="rgba(245,166,35,0.35)"
                    strokeWidth="2"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon points="38,46 48,50 38,54" fill="rgba(245,166,35,0.6)" />
                </svg>
              </div>
            )}

            {/* ─── Columna Campeón ─── */}
            {champion && (
              <div className="flex flex-col justify-center min-w-[130px]">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-b from-gold/20 via-gold/10 to-transparent border-4 border-gold/50"
                >
                  <span className="text-3xl">🏆</span>
                  <span className="text-2xl">{champion.emoji}</span>
                  <p className="font-[family-name:var(--font-display)] text-sm uppercase text-gold text-center">
                    {champion.nom}
                  </p>
                  <p className="text-[10px] text-text-muted">Campeón 2026-I</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
