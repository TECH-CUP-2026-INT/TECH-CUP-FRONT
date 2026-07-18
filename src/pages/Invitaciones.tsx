import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/common/DashboardLayout'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Button } from '@/components/common/button'
import { UserPlus } from 'lucide-react'
import { misInvitaciones, responderInvitacion, type TeamInvitation } from '@/api/teams'
import { getMiPerfil } from '@/api/usuarios'
import { addTeamChatParticipant } from '@/api/chat'
import { rememberTeamName } from '@/utils/teamNameCache'
import { ApiError } from '@/api/client'

export default function Invitaciones() {
  const navigate = useNavigate()
  const [invitaciones, setInvitaciones] = useState<TeamInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<Record<string, string>>({})
  const [joinedTeamId, setJoinedTeamId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvitaciones()
  }, [])

  function fetchInvitaciones() {
    setLoading(true)
    setLoadError(null)
    misInvitaciones()
      .then(list => {
        setInvitaciones(list.filter(inv => inv.status === 'PENDING'))
        list.forEach(inv => rememberTeamName(inv.teamId, inv.teamName))
      })
      .catch(() => setLoadError('No pudimos cargar tus invitaciones.'))
      .finally(() => setLoading(false))
  }

  async function aceptar(inv: TeamInvitation) {
    setBusyId(inv.id)
    setActionError(prev => ({ ...prev, [inv.id]: '' }))
    try {
      await responderInvitacion(inv.id, true)
      rememberTeamName(inv.teamId, inv.teamName)
      const miPerfil = await getMiPerfil()
      try {
        await addTeamChatParticipant(inv.teamId, miPerfil.id, 'MEMBER')
      } catch (e) {
        // 409 = ya soy participante del chat — se trata como éxito, no como error.
        if (!(e instanceof ApiError) || e.status !== 409) throw e
      }
      setInvitaciones(prev => prev.filter(i => i.id !== inv.id))
      setJoinedTeamId(inv.teamId)
    } catch {
      setActionError(prev => ({ ...prev, [inv.id]: 'No pudimos procesar la invitación. Reintentá.' }))
    } finally {
      setBusyId(null)
    }
  }

  async function rechazar(inv: TeamInvitation) {
    setBusyId(inv.id)
    setActionError(prev => ({ ...prev, [inv.id]: '' }))
    try {
      await responderInvitacion(inv.id, false)
      setInvitaciones(prev => prev.filter(i => i.id !== inv.id))
    } catch {
      setActionError(prev => ({ ...prev, [inv.id]: 'No pudimos procesar la invitación. Reintentá.' }))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout title="Invitaciones">
      <div className="max-w-[600px] mx-auto px-8 py-8">
        {joinedTeamId && (
          <SpotlightCard accent="gold" className="bg-surface border border-gold/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-light">Te uniste al equipo — ya podés chatear con ellos.</p>
            <Button size="sm" onClick={() => navigate('/chat')} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4">
              Ir al chat
            </Button>
          </SpotlightCard>
        )}

        {loading && <p className="text-sm text-text-faint">Cargando invitaciones…</p>}
        {loadError && (
          <div className="text-sm text-red-400 space-y-2 mb-4">
            <p>{loadError}</p>
            <button className="text-gold underline" onClick={fetchInvitaciones}>Reintentar</button>
          </div>
        )}
        {!loading && !loadError && invitaciones.length === 0 && (
          <p className="text-sm text-text-faint">No tenés invitaciones pendientes.</p>
        )}

        <div className="space-y-3">
          {invitaciones.map(inv => (
            <SpotlightCard key={inv.id} accent="purple" className="bg-surface border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-mid/15 flex items-center justify-center shrink-0">
                  <UserPlus size={20} className="text-purple-mid" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{inv.teamName}</p>
                  <p className="text-xs text-text-muted">Te invitó a unirte al equipo</p>
                </div>
              </div>
              {actionError[inv.id] && <p className="text-xs text-red-400 mt-2">{actionError[inv.id]}</p>}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  disabled={busyId === inv.id}
                  onClick={() => aceptar(inv)}
                  className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-auto py-2 px-4 flex-1 disabled:opacity-50"
                >
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === inv.id}
                  onClick={() => rechazar(inv)}
                  className="rounded-full border-border text-gray-light hover:bg-white/5 text-xs h-auto py-2 px-4 flex-1 disabled:opacity-50"
                >
                  Rechazar
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
