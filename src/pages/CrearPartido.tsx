import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/common/select'
import { torneos, fetchTorneos } from '@/services/torneos'
import { crearPartido } from '@/services/partidos'
import { canchas } from '@/services/campus'
import { ArrowLeft, CalendarDays, Clock, MapPin, Swords, Trophy, Check, Loader2 } from 'lucide-react'

const EQUIPOS = [
  { id: 'eq-1', nombre: 'Tigres FC', emoji: '🐯' },
  { id: 'eq-2', nombre: 'Sistemas FC', emoji: '⚙️' },
  { id: 'eq-3', nombre: 'Code United', emoji: '💻' },
  { id: 'eq-4', nombre: 'IA Warriors', emoji: '🦁' },
  { id: 'eq-5', nombre: 'Dragones FC', emoji: '🐉' },
  { id: 'eq-6', nombre: 'Los Bits', emoji: '⚡' },
  { id: 'eq-7', nombre: 'Titanes', emoji: '🛡️' },
  { id: 'eq-8', nombre: 'Fénix', emoji: '🔥' },
]

export default function CrearPartido() {
  const navigate = useNavigate()
  const [tournamentId, setTournamentId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [canchaId, setCanchaId] = useState('')
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<string | null>(null)

  useEffect(() => { fetchTorneos() }, [])

  const torneosActivos = torneos.filter(t => t.estado === 'live' || t.estado === 'upcoming')
  const canchasDisponibles = canchas.filter(c => c.estado === 'disponible')
  const homeEq = EQUIPOS.find(e => e.id === homeTeamId)
  const awayEq = EQUIPOS.find(e => e.id === awayTeamId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tournamentId || !homeTeamId || !awayTeamId || !fecha || !hora || !canchaId) return
    if (homeTeamId === awayTeamId) {
      setError('Los equipos deben ser diferentes')
      return
    }

    setCreating(true)
    setError(null)
    try {
      const scheduledDate = `${fecha}T${hora}:00`
      const res = await crearPartido({
        tournamentId,
        homeTeamId,
        awayTeamId,
        scheduledDate,
        venue: canchas.find(c => c.id === canchaId)?.nombre || 'Cancha',
      })
      setResultado(`${res.homeTeamName} vs ${res.awayTeamName}`)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el partido')
    } finally {
      setCreating(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark mx-auto mb-6 flex items-center justify-center">
            <Check size={36} className="text-[#1A1206]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] mb-2">
            Partido <span className="text-gold">creado</span>
          </h2>
          <p className="text-text-muted mb-1">{resultado}</p>
          <p className="text-sm text-text-muted mb-6">{fecha} a las {hora}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard/organizador')} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-11 px-6">
              Ir al panel
            </Button>
            <Button onClick={() => { setSuccess(false); setTournamentId(''); setHomeTeamId(''); setAwayTeamId(''); setFecha(''); setHora(''); setCanchaId('') }}
              variant="outline" className="rounded-full border-border text-gray-light hover:bg-white/5 h-11 px-6">
              Crear otro
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-black/90 via-black/80 to-purple-black/90" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-6">
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="bg-surface border border-border/60 rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
              <Swords size={24} className="text-gold" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px]">
                Crear <span className="text-gold">partido</span>
              </h1>
              <p className="text-sm text-text-muted">Programá un nuevo encuentro</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Torneo */}
            <div>
              <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                <Trophy size={14} className="inline mr-1.5 text-gold" /> Torneo
              </Label>
              <Select value={tournamentId} onValueChange={setTournamentId}>
                <SelectTrigger className="bg-black border-border text-white rounded-xl h-11 mt-1.5">
                  <SelectValue placeholder="Seleccioná un torneo" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F1F28] border-border">
                  {torneosActivos.map(t => (
                    <SelectItem key={t.id} value={t.id} className="text-gray-light">{t.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Equipo local</Label>
                <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                  <SelectTrigger className="bg-black border-border text-white rounded-xl h-11 mt-1.5">
                    <SelectValue placeholder="Local" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F28] border-border">
                    {EQUIPOS.map(e => (
                      <SelectItem key={e.id} value={e.id} className="text-gray-light">
                        {e.emoji} {e.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Equipo visitante</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                  <SelectTrigger className="bg-black border-border text-white rounded-xl h-11 mt-1.5">
                    <SelectValue placeholder="Visitante" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F28] border-border">
                    {EQUIPOS.map(e => (
                      <SelectItem key={e.id} value={e.id} className="text-gray-light">
                        {e.emoji} {e.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {homeTeamId && awayTeamId && homeTeamId === awayTeamId && (
              <p className="text-xs text-red-400">Los equipos deben ser diferentes</p>
            )}

            {/* Previsualización */}
            {homeTeamId && awayTeamId && homeTeamId !== awayTeamId && (
              <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-purple-mid/10 border border-gold/20">
                <span className="text-2xl">{homeEq?.emoji}</span>
                <span className="font-bold text-sm">{homeEq?.nombre}</span>
                <span className="text-gold font-bold text-lg">VS</span>
                <span className="font-bold text-sm">{awayEq?.nombre}</span>
                <span className="text-2xl">{awayEq?.emoji}</span>
              </div>
            )}

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                  <CalendarDays size={14} className="inline mr-1.5 text-gold" /> Fecha
                </Label>
                <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
                  className="bg-black border-border text-white rounded-xl h-11 mt-1.5 [color-scheme:dark]" />
              </div>
              <div>
                <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                  <Clock size={14} className="inline mr-1.5 text-gold" /> Hora
                </Label>
                <Input type="time" value={hora} onChange={e => setHora(e.target.value)}
                  className="bg-black border-border text-white rounded-xl h-11 mt-1.5 [color-scheme:dark]" />
              </div>
            </div>

            {/* Cancha */}
            <div>
              <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                <MapPin size={14} className="inline mr-1.5 text-gold" /> Cancha
              </Label>
              <Select value={canchaId} onValueChange={setCanchaId}>
                <SelectTrigger className="bg-black border-border text-white rounded-xl h-11 mt-1.5">
                  <SelectValue placeholder="Seleccioná una cancha" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F1F28] border-border">
                  {canchasDisponibles.length === 0 ? (
                    <SelectItem value="-" disabled className="text-text-muted">No hay canchas disponibles</SelectItem>
                  ) : canchasDisponibles.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-gray-light">
                      {c.nombre} — {c.ubicacion}
                    </SelectItem>
                  ))}
                  <div className="border-t border-border my-1" />
                  {canchas.filter(c => c.estado !== 'disponible').map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-text-muted" disabled>
                      {c.nombre} ({c.estado})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-xl py-2 px-4">{error}</p>
            )}

            <Button type="submit" disabled={!tournamentId || !homeTeamId || !awayTeamId || !fecha || !hora || !canchaId || homeTeamId === awayTeamId || creating}
              className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 disabled:opacity-40 shadow-lg shadow-gold/20">
              {creating ? <><Loader2 size={16} className="animate-spin" /> Creando partido</> : <><Swords size={16} /> Programar partido</>}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
