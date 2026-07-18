import { apiGet, apiPostForm, apiPut, TEAMS_SERVICE_PREFIX } from './client'
import type { Team } from './tipos'

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface TeamInvitation {
  id: string
  teamId: string
  teamName: string
  invitedUserId: string
  invitedBy: string
  status: InvitationStatus
  createdAt: string
  respondedAt: string | null
}

/**
 * Crea un equipo nuevo. `colors` es un string libre (ej "#FF0000,#FFFFFF"), no un objeto.
 * @throws {ApiError} si la API responde con error (4xx/5xx).
 * @throws {Error} si no hay conexión con el servidor.
 */
export async function crearEquipo(
  captainName: string,
  name: string,
  colors: string,
  logo: Blob,
): Promise<Team> {
  const form = new FormData()
  form.append(
    'team',
    new Blob([JSON.stringify({ name, colors, captainName })], { type: 'application/json' }),
  )
  form.append('logo', logo, 'logo.png')
  return await apiPostForm<Team>(`${TEAMS_SERVICE_PREFIX}/teams`, form)
}

/** El jugador invitado acepta (accept=true) o rechaza (accept=false) una invitación. */
export function responderInvitacion(
  invitationId: string,
  accept: boolean,
  userName?: string,
): Promise<TeamInvitation> {
  return apiPut<TeamInvitation>(`${TEAMS_SERVICE_PREFIX}/invitations/${invitationId}/respond`, {
    accept,
    userName,
  })
}

/** Invitaciones pendientes recibidas por el usuario autenticado. */
export function misInvitaciones(): Promise<TeamInvitation[]> {
  return apiGet<TeamInvitation[]>(`${TEAMS_SERVICE_PREFIX}/invitations/my`)
}
