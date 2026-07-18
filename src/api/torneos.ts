import { apiGet } from './client'
import type { Torneo } from './tipos'

/**
 * Obtiene todos los torneos activos desde el Tournament Service via APIM.
 * APIM path: /api/v1/Tournament/tournaments/active
 */
export async function getTorneosActivos(): Promise<Torneo[]> {
  return apiGet<Torneo[]>('/api/v1/Tournament/tournaments/active')
}

/**
 * Obtiene un torneo específico por ID.
 * APIM path: /api/v1/Tournament/tournaments/{id}
 */
export async function getTorneoPorId(id: string): Promise<Torneo> {
  return apiGet<Torneo>(`/api/v1/Tournament/tournaments/${id}`)
}
