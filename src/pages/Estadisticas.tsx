import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Trophy } from 'lucide-react'

const stats = [
  { label: 'Goles', value: '8', change: '+2', icon: '⚽' },
  { label: 'Asistencias', value: '5', change: '+1', icon: '👟' },
  { label: 'Partidos', value: '12', change: '+3', icon: '📋' },
  { label: 'Minutos', value: "480'", change: '+90\'', icon: '⏱️' },
  { label: 'Tarjetas 🟨', value: '2', change: '+1', icon: '🟨' },
  { label: 'Faltas', value: '3', change: '0', icon: '⚠️' },
]

const partidosStats = [
  { rival: 'Tigres FC', resultado: '3-1', goles: 2, asistencias: 1, tarjetas: 0, min: 90, fecha: '20 MAY' },
  { rival: 'Code United', resultado: '1-2', goles: 0, asistencias: 1, tarjetas: 1, min: 75, fecha: '18 MAY' },
  { rival: 'IA Warriors', resultado: '2-2', goles: 1, asistencias: 0, tarjetas: 0, min: 90, fecha: '11 MAY' },
]

export default function Estadisticas() {
  return (
    <DashboardLayout title="Estadísticas">
      <main className="max-w-[900px] mx-auto px-8 py-8 pb-[60px]">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 max-md:flex-col max-md:text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black">
              <img src="https://i.pravatar.cc/150?img=13" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase">Estadísticas de <span className="text-gold">Juan Camilo</span></h1>
              <p className="text-sm text-text-muted">Delantero · #10 · Sistemas FC</p>
            </div>
          </div>

          {/* Grid stats */}
          <div className="grid grid-cols-3 max-md:grid-cols-2 gap-4 mb-8">
            {stats.map((s, i) => (
              <SpotlightCard key={i} accent={i % 2 === 0 ? 'gold' : 'purple'} className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full">{s.change}</span>
                </div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </SpotlightCard>
            ))}
          </div>

          {/* Gráfico de evolución */}
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-[family-name:var(--font-display)] text-lg uppercase mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" /> Evolución de <span className="text-gold">goles</span>
            </h3>
            <div className="flex items-end gap-3 h-32">
              {[
                { torneo: '2023-II', goles: 2 },
                { torneo: '2024-I', goles: 6 },
                { torneo: '2024-II', goles: 8 },
              ].map((g, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gold">{g.goles}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-gold/30 to-gold/60" style={{ height: `${(g.goles / 8) * 100}%` }} />
                  <span className="text-[10px] text-text-faint text-center">{g.torneo}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Tabla de partidos */}
          <SpotlightCard accent="purple" className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 pb-3">
              <h3 className="font-[family-name:var(--font-display)] text-lg uppercase flex items-center gap-2">
                <Trophy size={18} className="text-gold" /> Historial de <span className="text-gold">partidos</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-text-faint uppercase tracking-[.5px] border-t border-border">
                    <th className="text-left py-3 px-5">Fecha</th>
                    <th className="text-left py-3 px-5">Rival</th>
                    <th className="text-center py-3 px-5">Resultado</th>
                    <th className="text-center py-3 px-3">G</th>
                    <th className="text-center py-3 px-3">A</th>
                    <th className="text-center py-3 px-3">🟨</th>
                    <th className="text-center py-3 px-3">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {partidosStats.map((p, i) => (
                    <tr key={i} className="border-t border-border hover:bg-white/5">
                      <td className="py-3 px-5 text-xs text-text-muted">{p.fecha}</td>
                      <td className="py-3 px-5 font-semibold">{p.rival}</td>
                      <td className="py-3 px-5 text-center font-bold">{p.resultado}</td>
                      <td className="py-3 px-3 text-center text-gold font-bold">{p.goles}</td>
                      <td className="py-3 px-3 text-center text-purple-mid">{p.asistencias}</td>
                      <td className="py-3 px-3 text-center">{p.tarjetas > 0 ? '🟨' : '-'}</td>
                      <td className="py-3 px-3 text-center text-text-muted">{p.min}'</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        </main>
    </DashboardLayout>
  )
}
