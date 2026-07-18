import { apiGet, apiPost, apiPostForm, apiPut, TEAMS_SERVICE_PREFIX } from './client'
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

let _teamIdCounter = 100

/** Crea un equipo nuevo. `colors` es un string libre (ej "#FF0000,#FFFFFF"), no un objeto. */
export async function crearEquipo(
  captainName: string,
  name: string,
  colors: string,
  logo: Blob,
): Promise<Team> {
  try {
    const form = new FormData()
    form.append(
      'team',
      new Blob([JSON.stringify({ name, colors, captainName })], { type: 'application/json' }),
    )
    form.append('logo', logo, 'logo.png')
    return await apiPostForm<Team>(`${TEAMS_SERVICE_PREFIX}/teams`, form)
  } catch {
    console.warn('[teams] API no disponible, creando equipo mock')
    return {
      id: `mock-team-${++_teamIdCounter}`,
      name,
      colors,
      captainId: 'mock-user-001',
      memberCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
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
