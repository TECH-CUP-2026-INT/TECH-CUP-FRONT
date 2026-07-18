import { apiGet, apiPost, apiPut, apiDelete } from './client'
import type { Torneo } from './tipos'

/**
 * Obtiene todos los torneos activos desde el Tournament Service via APIM.
 * APIM: GET /tournaments/active
 */
export async function getTorneosActivos(): Promise<Torneo[]> {
  return apiGet<Torneo[]>('/tournaments/active')
}

/**
 * Cuerpo que espera el backend para crear un torneo (verificado en fuente).
 * type: NORMAL|LIGHTNING · format: BRACKETS|GROUPS|LEAGUE.
 */
export interface CreateTournamentRequest {
  name: string
  type: string
  format: string
  numberOfTeams: number
  cost: number
  startDate: string
  endDate?: string
  registrationDeadline: string
}

/**
 * Crea un torneo en el backend.
 * APIM: POST /tournaments (mk-tournament-service)
 */
export async function crearTorneoApi(data: CreateTournamentRequest): Promise<{ id: string }> {
  return apiPost<{ id: string }>('/tournaments', data)
}

/**
 * Obtiene un torneo específico por ID.
 * APIM: GET /tournaments/{id}
 */
export async function getTorneoPorId(id: string): Promise<Torneo> {
  return apiGet<Torneo>(`/tournaments/${id}`)
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Update + Delete
// ═══════════════════════════════════════════════════════════════

export interface UpdateTorneoRequest {
  nombre?: string
  estado?: string
  categoria?: string
  canchas?: number
  fecha?: string
  tag?: string
}

/**
 * Actualiza un torneo existente.
 * APIM: PUT /tournaments/{id}
 */
export async function updateTorneoApi(
  id: string,
  data: UpdateTorneoRequest
): Promise<Torneo> {
  return apiPut<Torneo>(`/tournaments/${id}`, data)
}

/**
 * Elimina un torneo.
 * APIM: DELETE /tournaments/{id}
 */
export async function deleteTorneoApi(id: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/tournaments/${id}`)
}
