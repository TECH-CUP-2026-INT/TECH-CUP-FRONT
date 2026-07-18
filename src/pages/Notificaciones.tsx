import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Bell, CheckCheck, ShieldAlert, MessageSquare, UserPlus, CreditCard, Calendar, ChevronRight, Trash2 } from 'lucide-react'

type TipoNotif = 'todas' | 'sancion' | 'mensaje' | 'invitacion' | 'inscripcion' | 'partido'

interface Notificacion {
  id: number
  tipo: TipoNotif
  titulo: string
  descripcion: string
  hora: string
  leida: boolean
  accion?: string
}

const notificacionesMock: Notificacion[] = [
  { id: 1, tipo: 'sancion', titulo: 'Sanción por acumulación de tarjetas', descripcion: 'Acumulaste 2 tarjetas amarillas. Perdés el próximo partido.', hora: 'Hace 30 min', leida: false },
  { id: 2, tipo: 'mensaje', titulo: 'Nuevo mensaje en Sistemas FC', descripcion: 'Carlos López: "¿Listos para mañana?"', hora: 'Hace 1 hora', leida: false },
  { id: 3, tipo: 'invitacion', titulo: 'Invitación a equipo', descripcion: 'Tigres FC te ha invitado a unirte a su equipo.', hora: 'Hace 3 horas', leida: false, accion: 'responder' },
  { id: 4, tipo: 'inscripcion', titulo: 'Inscripción aprobada', descripcion: 'Tu equipo Sistemas FC fue inscrito en TechCup 2026-I.', hora: 'Ayer', leida: true },
  { id: 5, tipo: 'partido', titulo: 'Partido reprogramado', descripcion: 'El partido vs Code United se movió al viernes 8:00 PM.', hora: 'Ayer', leida: true },
  { id: 6, tipo: 'sancion', titulo: 'Jugador sancionado', descripcion: 'Ana Martínez recibió tarjeta roja. 1 partido de suspensión.', hora: 'Ayer', leida: true },
  { id: 7, tipo: 'mensaje', titulo: 'Nuevo mensaje en chat general', descripcion: 'Organizador: "Recordatorio: mañana es el sorteo de grupos"', hora: 'Hace 2 días', leida: true },
  { id: 8, tipo: 'inscripcion', titulo: 'Comprobante recibido', descripcion: 'Subieron un comprobante de pago para TechCup 2026-II.', hora: 'Hace 2 días', leida: true, accion: 'revisar' },
]

const tipoConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  sancion: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' },
  mensaje: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  invitacion: { icon: UserPlus, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  inscripcion: { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10' },
  partido: { icon: Calendar, color: 'text-gold', bg: 'bg-gold/10' },
}

const tabs = [
  { id: 'todas' as TipoNotif, label: 'Todas' },
  { id: 'sancion' as TipoNotif, label: 'Sanciones' },
  { id: 'mensaje' as TipoNotif, label: 'Mensajes' },
  { id: 'invitacion' as TipoNotif, label: 'Invitaciones' },
  { id: 'inscripcion' as TipoNotif, label: 'Inscripciones' },
  { id: 'partido' as TipoNotif, label: 'Partidos' },
]

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState(notificacionesMock)
  const [tab, setTab] = useState<TipoNotif>('todas')

  const filtered = tab === 'todas' ? notificaciones : notificaciones.filter(n => n.tipo === tab)
  const noLeidas = notificaciones.filter(n => !n.leida).length

  const marcarLeida = (id: number) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n))
  }

  const marcarTodasLeidas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
  }

  const eliminar = (id: number) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id))
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
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`py-2 px-3.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${tab === t.id ? 'bg-purple-mid text-white shadow-lg shadow-purple-mid/25' : 'text-text-muted hover:text-white'}`}>
              {t.label}
              {t.id !== 'todas' && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({notificaciones.filter(n => n.tipo === t.id && !n.leida).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-text-faint mb-4" />
            <p className="text-text-muted">No hay notificaciones de este tipo.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {filtered.map(n => {
                const cfg = tipoConfig[n.tipo] || tipoConfig.mensaje
                const Icon = cfg.icon
                return (
                  <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}>
                    <SpotlightCard
                      accent={n.leida ? 'purple' : 'gold'}
                      className={`bg-surface border rounded-2xl p-4 transition-all hover:bg-white/5 cursor-pointer ${n.leida ? 'border-border' : 'border-gold/30'}`}
                      onClick={() => marcarLeida(n.id)}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={18} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`text-sm ${n.leida ? 'text-white' : 'text-white font-bold'}`}>{n.titulo}</h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {!n.leida && <span className="w-2 h-2 rounded-full bg-gold" />}
                              <button onClick={e => { e.stopPropagation(); eliminar(n.id) }} className="text-text-faint hover:text-red-400 transition-colors p-0.5">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-text-muted mt-1">{n.descripcion}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-text-faint">{n.hora}</span>
                            {n.accion === 'responder' && (
                              <Button size="sm" className="rounded-full bg-purple-mid text-white text-[10px] h-auto py-1 px-3 hover:bg-purple-deep gap-1" onClick={e => { e.stopPropagation() }}>
                                Ver invitación <ChevronRight size={12} />
                              </Button>
                            )}
                            {n.accion === 'revisar' && (
                              <Button size="sm" className="rounded-full bg-gold text-[#1A1206] text-[10px] h-auto py-1 px-3 hover:bg-gold-dark gap-1" onClick={e => { e.stopPropagation() }}>
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
        )}
      </main>
    </DashboardLayout>
  )
}
