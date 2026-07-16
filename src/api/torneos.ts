import { apiGet } from './client'
import type { Torneo } from './tipos'

/**
 * Obtiene todos los torneos activos desde el Tournament Service via APIM.
 * GET /tournaments/active
 */
export async function getTorneosActivos(): Promise<Torneo[]> {
  return apiGet<Torneo[]>('/tournaments/active')
}

/**
 * Obtiene un torneo específico por ID.
 * GET /tournaments/{id}
 */
export async function getTorneoPorId(id: string): Promise<Torneo> {
  return apiGet<Torneo>(`/tournaments/${id}`)
}
