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
  { id:'1', nombre:'TechCup 2026-I',  estado:'closed',   semestre:'2026-I', categoria:'Fútbol 11', equipos:32, jugadores:384, canchas:4, fecha:'Mar 3 – Jun 14, 2026',         tag:'Torneo oficial',   imagen:'/images/fondo-1.png' },
  { id:'2', nombre:'TechCup 2026-II', estado:'upcoming', semestre:'2026-II',categoria:'Fútbol 11', equipos:32, jugadores:384, canchas:4, fecha:'Ago 20 – Nov 30, 2026',        tag:'Torneo oficial',   imagen:'/images/fondo-2.png' },
  { id:'3', nombre:'TechCup Relámpago 2026', estado:'upcoming', semestre:'2026-II', categoria:'Fútbol 11', equipos:16, jugadores:192, canchas:2, fecha:'Sep 2026', tag:'Torneo relámpago', imagen:'/images/fondo-3.png' },
  { id:'4', nombre:'TechCup 2025-II', estado:'closed',   semestre:'2025-II',categoria:'Fútbol 11', equipos:28, jugadores:320, canchas:4, fecha:'Ago 14 – Nov 25, 2025',        tag:'Torneo oficial',   imagen:'/images/fondo-4.png' },
  { id:'5', nombre:'TechCup 2025-I',  estado:'closed',   semestre:'2025-I', categoria:'Fútbol 11', equipos:24, jugadores:276, canchas:4, fecha:'Mar 6 – Jun 10, 2025',         tag:'Torneo oficial',   imagen:'/images/fondo-5.png' },
  { id:'6', nombre:'TechCup 2024-II', estado:'closed',   semestre:'2024-II',categoria:'Fútbol 11', equipos:20, jugadores:240, canchas:3, fecha:'Ago 15 – Nov 26, 2024',        tag:'Torneo oficial',   imagen:'/images/fondo-6.png' },
  { id:'7', nombre:'TechCup Futsal 2026', estado:'upcoming', semestre:'2026-II', categoria:'Futsal', equipos:16, jugadores:128, canchas:2, fecha:'Sep 1 – Dic 15, 2026', tag:'Torneo oficial',   imagen:'/images/fondo-1.png' },
  { id:'8', nombre:'TechCup Apertura 2026', estado:'live', semestre:'2026-I', categoria:'Fútbol 11', equipos:8, jugadores:96, canchas:2, fecha:'Mar 5 – Jun 15, 2026', tag:'Torneo apertura',  imagen:'/images/fondo-2.png' },
  { id:'9', nombre:'TechCup Femenino 2026', estado:'upcoming', semestre:'2026-II', categoria:'Fútbol 11', equipos:12, jugadores:144, canchas:2, fecha:'Oct 1 – Dic 15, 2026', tag:'Torneo femenino', imagen:'/images/fondo-5.png' },
  { id:'10', nombre:'TechCup Indoor 2026', estado:'upcoming', semestre:'2026-I', categoria:'Futsal', equipos:10, jugadores:80, canchas:1, fecha:'Jun 1 – Jul 31, 2026', tag:'Torneo indoor',    imagen:'/images/fondo-3.png' },
  { id:'11', nombre:'TechCup 2023-II', estado:'closed', semestre:'2023-II',categoria:'Fútbol 11', equipos:18, jugadores:216, canchas:3, fecha:'Ago 10 – Nov 28, 2023', tag:'Torneo oficial',   imagen:'/images/fondo-6.png' },
  { id:'12', nombre:'TechCup Mini 2026', estado:'live', semestre:'2026-II', categoria:'Futsal', equipos:6, jugadores:48, canchas:1, fecha:'Jun 15 – Ago 1, 2026', tag:'Categorías menores', imagen:'/images/fondo-4.png' },
]

// ── localStorage persistence ──────────────────────────────────
const STORAGE_KEY = 'techcup_torneos_creados'

function loadCreados(): Torneo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCreados(creados: Torneo[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(creados)) } catch {}
}

// ── Module-level array ───────────────────────────────────────
// El array compartido: las páginas que importan `torneos` obtienen
// esta misma referencia. Al mutar _torneos, `torneos` refleja los cambios
// automáticamente porque apuntan al mismo objeto Array.
const _torneos: Torneo[] = [...MOCK_TORNEOS, ...loadCreados()]

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
  if (!data || data.length === 0) return
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
    if (Array.isArray(data) && data.length > 0) {
      updateTorneos(data)
      return data
    }
    // Si el API devolvió un solo objeto con id, lo integramos al mock
    if (data && typeof data === 'object' && 'id' in data) {
      const realId = (data as unknown as { id: string }).id
      // Actualizar el torneo live con el ID real
      const liveIdx = _torneos.findIndex(t => t.estado === 'live')
      if (liveIdx >= 0) {
        _torneos[liveIdx] = { ..._torneos[liveIdx], id: realId }
      }
    }
    return [..._torneos]
  } catch (error) {
    console.warn('[torneos] Error fetching from API, usando mock:', error)
    return [..._torneos]
  }
}

/**
 * Crea un torneo nuevo (local) y lo agrega al listado.
 */
export function createTorneo(data: {
  nombre: string
  tipo?: string
  fechaInicio?: string
  fechaFin?: string
  canchas?: number
}): Torneo {
  const id = Date.now()
  const torneo: Torneo = {
    id: id.toString(),
    nombre: data.nombre,
    estado: 'upcoming',
    semestre: '2026-II',
    categoria: 'Fútbol 11',
    equipos: 0,
    jugadores: 0,
    canchas: data.canchas ?? 0,
    fecha: data.fechaInicio || '',
    tag: data.tipo === 'relampago' ? 'Relámpago' : 'Próximo',
  }
  _torneos.unshift(torneo)
  return torneo
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
