/**
 * Torneos — Service layer
 *
 * Estrategia de migración:
 * 1. Se comienza con datos mock para que el front no rompa
 * 2. fetchTorneos() reemplaza el array con datos reales del API
 * 3. Las páginas que quieran datos frescos llaman a fetchTorneos() on mount
 *
 * TODO: Cuando todas las páginas migren a fetchTorneos(), eliminar el mock por defecto.
 */

import { getTorneosActivos as apiGetTorneosActivos, getTorneoPorId as apiGetTorneoPorId } from '@/api/torneos'

export type { EstadoTorneo, Categoria, Torneo } from '@/api/tipos'
import type { Torneo } from '@/api/tipos'

// ── Mock data (fallback inicial) ──────────────────────────────
const MOCK_TORNEOS: Torneo[] = [
  { id:'1', nombre:'TechCup 2026-I',  estado:'closed',   semestre:'2026-I', categoria:'Fútbol 11', equipos:32, jugadores:384, canchas:4, fecha:'Mar 3 – Jun 14, 2026',         tag:'Torneo oficial' },
  { id:'2', nombre:'TechCup 2026-II', estado:'upcoming', semestre:'2026-II',categoria:'Fútbol 11', equipos:32, jugadores:384, canchas:4, fecha:'Ago 20 – Nov 30, 2026',        tag:'Torneo oficial' },
  { id:'3', nombre:'TechCup Relámpago 2026', estado:'upcoming', semestre:'2026-II', categoria:'Fútbol 11', equipos:16, jugadores:192, canchas:2, fecha:'Sep 2026', tag:'Torneo relámpago' },
  { id:'4', nombre:'TechCup 2025-II', estado:'closed',   semestre:'2025-II',categoria:'Fútbol 11', equipos:28, jugadores:320, canchas:4, fecha:'Ago 14 – Nov 25, 2025',        tag:'Torneo oficial' },
  { id:'5', nombre:'TechCup 2025-I',  estado:'closed',   semestre:'2025-I', categoria:'Fútbol 11', equipos:24, jugadores:276, canchas:4, fecha:'Mar 6 – Jun 10, 2025',         tag:'Torneo oficial' },
  { id:'6', nombre:'TechCup 2024-II', estado:'closed',   semestre:'2024-II',categoria:'Fútbol 11', equipos:20, jugadores:240, canchas:3, fecha:'Ago 15 – Nov 26, 2024',        tag:'Torneo oficial' },
  { id:'7', nombre:'TechCup Futsal 2026', estado:'upcoming', semestre:'2026-II', categoria:'Futsal', equipos:16, jugadores:128, canchas:2, fecha:'Sep 1 – Dic 15, 2026', tag:'Torneo oficial' },
  { id:'8', nombre:'TechCup Apertura 2026', estado:'live', semestre:'2026-I', categoria:'Fútbol 11', equipos:8, jugadores:96, canchas:2, fecha:'Mar 5 – Jun 15, 2026', tag:'Torneo oficial' },
]

// ── Module-level array ───────────────────────────────────────
// El array compartido: las páginas que importan `torneos` obtienen
// esta misma referencia. Al mutar _torneos, `torneos` refleja los cambios
// automáticamente porque apuntan al mismo objeto Array.
const _torneos: Torneo[] = [...MOCK_TORNEOS]

/**
 * Referencia directa al array de torneos.
 * Inicialmente contiene datos mock; se actualiza al llamar fetchTorneos().
 *
 * Uso existente:
 *   import { torneos } from '@/services/torneos'
 *   torneos.filter(t => t.estado === 'live')
 */
// eslint-disable-next-line prefer-const
export let torneos: Torneo[] = _torneos

function updateTorneos(data: Torneo[]): void {
  // Mutamos el mismo array para mantener la referencia viva
  _torneos.splice(0, _torneos.length, ...data)
}

// ── API functions ────────────────────────────────────────────

/**
 * Obtiene torneos desde el API y actualiza el módulo.
 * Llamar en el onMount de las páginas que necesiten datos frescos.
 *
 * @example
 * useEffect(() => { fetchTorneos() }, [])
 */
export async function fetchTorneos(): Promise<Torneo[]> {
  try {
    const data = await apiGetTorneosActivos()
    updateTorneos(data)
    return data
  } catch (error) {
    console.warn('[torneos] Error fetching from API, usando mock:', error)
    return [..._torneos]
  }
}

/**
 * Obtiene un torneo por ID (busca en cache local primero, luego API).
 */
export async function getTorneoPorId(id: string): Promise<Torneo | undefined> {
  const cached = _torneos.find(t => t.id === id)
  if (cached) return cached

  try {
    return await apiGetTorneoPorId(id)
  } catch {
    return undefined
  }
}
