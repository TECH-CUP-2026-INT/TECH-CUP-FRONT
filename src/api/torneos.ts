import { apiGet, apiPut, apiDelete } from './client'
import type { Torneo } from './tipos'

const BASE = '/api/v1/Tournament'

/**
 * Obtiene todos los torneos activos desde el Tournament Service via APIM.
 * APIM path: /api/v1/Tournament/tournaments/active
 */
export async function getTorneosActivos(): Promise<Torneo[]> {
  return apiGet<Torneo[]>(`${BASE}/tournaments/active`)
}

/**
 * Obtiene un torneo específico por ID.
 * APIM path: /api/v1/Tournament/tournaments/{id}
 */
export async function getTorneoPorId(id: string): Promise<Torneo> {
  return apiGet<Torneo>(`${BASE}/tournaments/${id}`)
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
 * PUT /api/v1/Tournament/tournaments/{id}
 */
export async function updateTorneoApi(
  id: string,
  data: UpdateTorneoRequest
): Promise<Torneo> {
  return apiPut<Torneo>(`${BASE}/tournaments/${id}`, data)
}

/**
 * Elimina un torneo.
 * DELETE /api/v1/Tournament/tournaments/{id}
 */
export async function deleteTorneoApi(id: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`${BASE}/tournaments/${id}`)
}
