/**
 * TODO: Reemplazar cuando el Matches Service (am-matches-service) esté deployado.
 *
 * Endpoints esperados bajo el APIM:
 *   GET /matches                    → listado de partidos
 *   GET /matches/{id}               → detalle de un partido
 *   GET /tournaments/{id}/matches   → partidos de un torneo
 *
 * Por ahora re-exportamos los datos mock desde services.
 */
export { partidos, posiciones } from '@/services/partidos'
export type { Partido, Posicion } from '@/services/partidos'
