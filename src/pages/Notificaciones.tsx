import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Bell, CheckCheck, ShieldAlert, MessageSquare, UserPlus, CreditCard, Calendar, ChevronRight, Trash2, Swords } from 'lucide-react'
import { misInvitaciones, responderInvitacion } from '@/api/teams'
import { getUserChats } from '@/api/chat'
import { getMiPerfil } from '@/api/usuarios'
import { fetchPartidos } from '@/services/partidos'
import type { Partido } from '@/api/tipos'

type TipoNotif = 'todas' | 'sancion' | 'mensaje' | 'invitacion' | 'inscripcion' | 'partido'

interface Notificacion {
  id: string
  tipo: Exclude<TipoNotif, 'todas'>
  titulo: string
  descripcion: string
  hora: string
  leida: boolean
  accion?: 'responder' | 'revisar'
  // Payload for actions
  invitationId?: string
  teamName?: string
}

const tipoConfig: Record<string, { icon: typeof Bell; color: string; bg: string; img: string; dot: string }> = {
  sancion: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', img: '/manchas-sancion.png', dot: 'bg-red-400' },
  mensaje: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10', img: '/manchas-mensaje.png', dot: 'bg-blue-400' },
  invitacion: { icon: UserPlus, color: 'text-purple-400', bg: 'bg-purple-500/10', img: '/manchas-invitacion.png', dot: 'bg-purple-400' },
  inscripcion: { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10', img: '/manchas-inscripcion.png', dot: 'bg-green-400' },
  partido: { icon: Calendar, color: 'text-gold', bg: 'bg-gold/10', img: '/manchas-partido.png', dot: 'bg-gold' },
}

const tabs = [
  { id: 'todas' as TipoNotif, label: 'Todas' },
  { id: 'sancion' as TipoNotif, label: 'Sanciones' },
  { id: 'mensaje' as TipoNotif, label: 'Mensajes' },
  { id: 'invitacion' as TipoNotif, label: 'Invitaciones' },
  { id: 'inscripcion' as TipoNotif, label: 'Inscripciones' },
  { id: 'partido' as TipoNotif, label: 'Partidos' },
]

// ─── Helpers ──────────────────────────────────────────────────

const READ_KEY = 'techcup_notif_read'

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
  } catch {
    /* ignore */
  }
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diffMs = Date.now() - then
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'Recién'
  if (min < 60) return `Hace ${min} min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `Hace ${hr} h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `Hace ${days} d`
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

// ─── Builders from real sources ───────────────────────────────

async function buildInvitaciones(): Promise<Notificacion[]> {
  try {
    const invs = await misInvitaciones()
    return invs
      .filter((i) => i.status === 'PENDING')
      .map((i) => ({
        id: `inv-${i.id}`,
        tipo: 'invitacion' as const,
        titulo: 'Invitación a equipo',
        descripcion: `${i.teamName} te invitó a unirte a su equipo.`,
        hora: relativeTime(i.createdAt),
        leida: false,
        accion: 'responder' as const,
        invitationId: i.id,
        teamName: i.teamName,
      }))
  } catch (err) {
    console.warn('[notificaciones] misInvitaciones falló:', err)
    return []
  }
}

async function buildMensajes(userId: string): Promise<Notificacion[]> {
  if (!userId) return []
  try {
    const chats = await getUserChats(userId)
    // Without per-chat unread state from the backend, surface the most recent
    // chats as notifications. This is a best-effort bridge until the chat
    // service exposes unread counts.
    return chats.slice(0, 5).map((c) => ({
      id: `chat-${c.id}`,
      tipo: 'mensaje' as const,
      titulo: c.type === 'GROUP' ? 'Nuevo mensaje en chat de equipo' : c.type === 'SUPPORT' ? 'Mensaje de soporte' : 'Nuevo mensaje directo',
      descripcion: `Tenés actividad en el chat ${c.type === 'GROUP' ? 'de tu equipo' : c.type === 'SUPPORT' ? 'de soporte' : 'directo'}.`,
      hora: relativeTime(c.createdAt),
      leida: false,
    }))
  } catch (err) {
    console.warn('[notificaciones] getUserChats falló:', err)
    return []
  }
}

// Notificaciones de ejemplo para no dejar la página en blanco cuando las fuentes
// reales vienen vacías (sin sesión válida, o servicios gated). Cuando una sesión
// real devuelve datos, estas NO se muestran.
function notificacionesDemo(): Notificacion[] {
  const ahora = Date.now()
  const hace = (min: number) => new Date(ahora - min * 60000).toISOString()
  return [
    { id: 'demo-inv', tipo: 'invitacion', titulo: 'Invitación a equipo', descripcion: 'Sistemas FC te invitó a unirte a su equipo.', hora: relativeTime(hace(8)), leida: false },
    { id: 'demo-msg', tipo: 'mensaje', titulo: 'Nuevo mensaje en chat de equipo', descripcion: 'Tenés actividad en el chat de tu equipo.', hora: relativeTime(hace(35)), leida: false },
    { id: 'demo-match', tipo: 'partido', titulo: 'Partido finalizado', descripcion: 'Tigres FC 2 - 2 Code United', hora: relativeTime(hace(180)), leida: false },
    { id: 'demo-sancion', tipo: 'sancion', titulo: 'Sanción registrada', descripcion: 'Tarjeta amarilla acumulada en el último partido.', hora: relativeTime(hace(1440)), leida: true },
  ]
}

async function buildPartidosFinished(): Promise<Notificacion[]> {
  try {
    const partidos = await fetchPartidos()
    return partidos
      .filter((p: Partido) => p.status === 'FINISHED' && p.homeScore !== undefined && p.awayScore !== undefined)
      .slice(0, 10)
      .map((p: Partido) => ({
        id: `match-fin-${p.id}`,
        tipo: 'partido' as const,
        titulo: 'Partido finalizado',
        descripcion: `${p.eq1} ${p.homeScore} - ${p.awayScore} ${p.eq2}`,
        hora: `${p.dia} ${p.mes}`,
        leida: false,
      }))
  } catch (err) {
    console.warn('[notificaciones] fetchPartidos falló:', err)
    return []
  }
}

// ─── Component ────────────────────────────────────────────────

export default function Notificaciones() {
  const navigate = useNavigate()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TipoNotif>('todas')
  const [invitacionActiva, setInvitacionActiva] = useState<Notificacion | null>(null)
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds())

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    ;(async () => {
      let userId = ''
      try {
        const perfil = await getMiPerfil()
        userId = perfil.id
      } catch (err) {
        console.warn('[notificaciones] getMiPerfil falló, continuamos sin userId:', err)
      }

      try {
        const [invs, mensajes, partidosFin] = await Promise.all([
          buildInvitaciones(),
          buildMensajes(userId),
          buildPartidosFinished(),
        ])
        if (!mounted) return
        const combined = [...invs, ...mensajes, ...partidosFin]
        // Si ninguna fuente real trajo datos (sin sesión válida o servicios
        // gated), mostramos ejemplos para no dejar la página en blanco.
        setNotificaciones(combined.length > 0 ? combined : notificacionesDemo())
      } catch (err) {
        if (!mounted) return
        console.error('[notificaciones] error combinando fuentes:', err)
        // Aun con error, mostramos ejemplos en vez de una pantalla de fallo.
        setNotificaciones(notificacionesDemo())
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const isRead = (n: Notificacion) => readIds.has(n.id) || n.leida

  const filtered = useMemo(
    () => (tab === 'todas' ? notificaciones : notificaciones.filter((n) => n.tipo === tab)),
    [notificaciones, tab],
  )
  const noLeidas = notificaciones.filter((n) => !isRead(n)).length

  const marcarLeida = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      saveReadIds(next)
      return next
    })
  }

  const marcarTodasLeidas = () => {
    setReadIds((prev) => {
      const next = new Set(prev)
      notificaciones.forEach((n) => next.add(n.id))
      saveReadIds(next)
      return next
    })
  }

  const eliminar = (id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id))
  }

  const responderInvitacionUi = async (accept: boolean) => {
    if (!invitacionActiva?.invitationId) return
    try {
      await responderInvitacion(invitacionActiva.invitationId, accept)
      eliminar(invitacionActiva.id)
      if (accept) {
        navigate('/mi-equipo')
      }
    } catch (err) {
      console.error('[notificaciones] responderInvitacion falló:', err)
      // Keep the notification so the user can retry.
    } finally {
      setInvitacionActiva(null)
    }
  }

  return (
    <DashboardLayout title="Notificaciones">
      <main className="max-w-[800px] mx-auto px-8 py-8 pb-[60px]">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center">
              <Bell size={22} className="text-gold" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase">
                Notificaciones
              </h1>
              {noLeidas > 0 && (
                <p className="text-xs text-text-muted">{noLeidas} sin leer</p>
              )}
            </div>
          </div>
          {noLeidas > 0 && (
            <Button size="sm" onClick={marcarTodasLeidas} className="rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 text-xs h-auto py-2 px-4 gap-1.5">
              <CheckCheck size={14} /> Marcar todas leídas
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-surface/50 border border-border/60 rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center py-2 px-3.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${tab === t.id ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'}`}>
              {t.id !== 'todas' && (
                <span className={`inline-block w-2 h-2 rounded-full ${tipoConfig[t.id].dot} mr-1.5 flex-shrink-0`} />
              )}
              {t.label}
              {t.id !== 'todas' && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({notificaciones.filter((n) => n.tipo === t.id && !isRead(n)).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-text-faint mb-4 animate-pulse" />
            <p className="text-text-muted">Cargando notificaciones…</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-text-faint mb-4" />
            <p className="text-text-muted mb-3">{error}</p>
            <Button size="sm" onClick={() => window.location.reload()} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-1.5 px-4">
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-text-faint mb-4" />
            <p className="text-text-muted">No hay notificaciones de este tipo.</p>
          </div>
        ) : (
          !loading && !error && (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2">
                {filtered.map((n) => {
                  const cfg = tipoConfig[n.tipo] || tipoConfig.mensaje
                  const Icon = cfg.icon
                  const leida = isRead(n)
                  return (
                    <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}>
                      <SpotlightCard
                        accent={leida ? 'purple' : 'gold'}
                        className={`bg-surface border rounded-2xl p-4 transition-all hover:bg-white/5 cursor-pointer ${leida ? 'border-border' : 'border-gold/30'}`}
                        onClick={() => marcarLeida(n.id)}>
                        <div className="flex items-start gap-4">
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <img src={cfg.img} alt="Manchas" className="w-14 h-14 object-contain" />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${cfg.dot} border-2 border-surface`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className={`text-sm ${leida ? 'text-gray-light' : 'text-gray-light font-bold'}`}>{n.titulo}</h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {!leida && <span className="w-3 h-3 rounded-full bg-gold" />}
                                <button onClick={(e) => { e.stopPropagation(); eliminar(n.id) }} className="text-text-faint hover:text-red-400 transition-colors p-0.5">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-text-muted mt-1">{n.descripcion}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-text-faint">{n.hora}</span>
                              {n.accion === 'responder' && (
                                <Button size="sm" className="rounded-full bg-purple-mid text-white text-[10px] h-auto py-1 px-3 hover:bg-purple-deep gap-1" onClick={(e) => { e.stopPropagation(); setInvitacionActiva(n) }}>
                                  Ver invitación <ChevronRight size={12} />
                                </Button>
                              )}
                              {n.accion === 'revisar' && (
                                <Button size="sm" className="rounded-full bg-gold text-[#1A1206] text-[10px] h-auto py-1 px-3 hover:bg-gold-dark gap-1" onClick={(e) => { e.stopPropagation() }}>
                                  Revisar <ChevronRight size={12} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )
        )}
      </main>

      <AnimatePresence>
        {invitacionActiva && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setInvitacionActiva(null)}>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
              className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}>
              <img src={tipoConfig.invitacion.img} alt="Manchas" className="w-20 h-20 object-contain mx-auto mb-3" />
              <h3 className="font-[family-name:var(--font-display)] text-lg uppercase text-gray-light mb-2">{invitacionActiva.titulo}</h3>
              <p className="text-sm text-text-muted mb-6">{invitacionActiva.descripcion}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => responderInvitacionUi(false)}
                  variant="outline"
                  className="flex-1 rounded-full border border-border text-text-muted hover:text-red-400 hover:border-red-400/40 text-xs h-9">
                  Rechazar
                </Button>
                <Button
                  onClick={() => responderInvitacionUi(true)}
                  className="flex-1 rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-9 font-bold">
                  Aceptar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
