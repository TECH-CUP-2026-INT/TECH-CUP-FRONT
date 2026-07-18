/**
 * Logística — Service Layer
 *
 * Estrategia:
 * 1. Datos mock iniciales para que el frontend no rompa
 * 2. fetch*() reemplazan datos con respuestas reales del API
 * 3. Las páginas que necesiten datos frescos llaman a fetch*() en onMount
 * 4. Fallback a mock si el API no responde
 */

import {
  crearDefinicionRefrigerioApi,
  listarDefinicionesRefrigerioApi,
  registrarEntregaRefrigerioApi,
  listarEntregasRefrigerioApi,
  registrarDotacionApi,
  marcarDotacionEntregadaApi,
  devolverDotacionApi,
  listarDotacionPorArbitroApi,
  listarEventosAuditoriaApi,
  type DefinicionRefrigerio,
  type EntregaRefrigerio,
  type ItemDotacion,
  type AuditEvent,
  type EstadoDotacion,
  type CrearDefinicionRefrigerioRequest,
  type RegistrarEntregaRefrigerioRequest,
  type RegistrarItemDotacionRequest,
} from '@/api/logistica'

// ─── Display types (vista resumen para la UI) ───────────────

export interface EquipoLogDisplay {
  id: string
  nombre: string
  emoji: string
  refrigerio: 'entregado' | 'pendiente' | 'no-asignado'
  kit: 'entregado' | 'pendiente' | 'no-asignado'
  cancha: string
}

export interface DotacionDisplay {
  id: string
  nombre: string
  tipo: 'kit' | 'refrigerio'
  cantidad: number
  estado: 'pendiente' | 'entregado' | 'devuelto'
}

// ─── Module-level state ──────────────────────────────────────

let _definiciones: DefinicionRefrigerio[] = []
let _entregas: EntregaRefrigerio[] = []
let _dotacion: ItemDotacion[] = []
let _eventosAuditoria: AuditEvent[] = []

export function getDefiniciones(): DefinicionRefrigerio[] {
  return _definiciones
}

export function getEntregas(): EntregaRefrigerio[] {
  return _entregas
}

export function getDotacion(): ItemDotacion[] {
  return _dotacion
}

export function getEventosAuditoria(): AuditEvent[] {
  return _eventosAuditoria
}

// ─── Mock fallback data ──────────────────────────────────────

const MOCK_EQUIPOS_LOG: EquipoLogDisplay[] = [
  { id: 'team-tigres', nombre: 'Tigres FC', emoji: '🐯', refrigerio: 'entregado', kit: 'entregado', cancha: 'Cancha Principal Sede Norte' },
  { id: 'team-warriors', nombre: 'IA Warriors', emoji: '🦁', refrigerio: 'entregado', kit: 'pendiente', cancha: 'Cancha Principal Sede Norte' },
  { id: 'team-code', nombre: 'Code United', emoji: '💻', refrigerio: 'pendiente', kit: 'pendiente', cancha: 'Cancha Principal Sede Norte 2' },
  { id: 'team-sistemas', nombre: 'Sistemas FC', emoji: '⚙️', refrigerio: 'no-asignado', kit: 'no-asignado', cancha: 'Cancha Principal Sede Norte 2' },
  { id: 'team-dragones', nombre: 'Dragones FC', emoji: '🐉', refrigerio: 'pendiente', kit: 'entregado', cancha: 'Auditorio Principal Sede Norte' },
]

const MOCK_DOTACION_CAPITAN: DotacionDisplay[] = [
  { id: 'd1', nombre: 'Camiseta titular', tipo: 'kit', cantidad: 11, estado: 'pendiente' },
  { id: 'd2', nombre: 'Camiseta suplente', tipo: 'kit', cantidad: 11, estado: 'pendiente' },
  { id: 'd3', nombre: 'Short deportivo', tipo: 'kit', cantidad: 11, estado: 'pendiente' },
  { id: 'd4', nombre: 'Medias', tipo: 'kit', cantidad: 22, estado: 'entregado' },
  { id: 'd5', nombre: 'Petos entrenamiento', tipo: 'kit', cantidad: 11, estado: 'pendiente' },
  { id: 'd6', nombre: 'Hidratación (botellas)', tipo: 'refrigerio', cantidad: 24, estado: 'pendiente' },
  { id: 'd7', nombre: 'Frutas', tipo: 'refrigerio', cantidad: 24, estado: 'pendiente' },
  { id: 'd8', nombre: 'Barras energéticas', tipo: 'refrigerio', cantidad: 24, estado: 'entregado' },
]

const MOCK_EVENTOS_AUDITORIA: AuditEvent[] = [
  { tipo: 'DEFINICION_REFRIGERIO_CREADA', entidadId: 'def-1', actorId: 'org-1', timestamp: new Date().toISOString(), detalle: 'Refrigerio creado para Tigres FC vs IA Warriors' },
  { tipo: 'DOTACION_ENTREGADA', entidadId: 'dot-1', actorId: 'org-1', timestamp: new Date(Date.now() - 3600000).toISOString(), detalle: 'Kit entregado a Roberto Gómez' },
  { tipo: 'ENTREGA_REFRIGERIO_REGISTRADA', entidadId: 'ent-1', actorId: 'org-1', timestamp: new Date(Date.now() - 7200000).toISOString(), detalle: 'Refrigerio entregado a Carlos Martínez (Tigres FC)' },
]

// ─── Service Functions: Refrigerios ──────────────────────────

/**
 * Obtener resumen de logística por equipo.
 * Combina datos de definiciones y entregas de refrigerio,
 * con fallback a mock si el API no responde.
 */
export async function fetchResumenLogistica(): Promise<EquipoLogDisplay[]> {
  try {
    // Intentar obtener datos reales
    // (en una implementación completa se iteraría sobre partidos del torneo)
    console.log('[logistica] fetchResumenLogistica — API no implementada aún para resumen agregado')
    return [...MOCK_EQUIPOS_LOG]
  } catch (_error) {
    console.warn('[logistica] API resumen falló, usando mock')
    return [...MOCK_EQUIPOS_LOG]
  }
}

/**
 * Obtener definiciones de refrigerio de un partido.
 */
export async function fetchDefinicionesRefrigerio(
  partidoId: string,
): Promise<DefinicionRefrigerio[]> {
  try {
    const data = await listarDefinicionesRefrigerioApi(partidoId)
    _definiciones = data
    return data
  } catch (error) {
    console.warn('[logistica] API definiciones falló, usando mock:', error)
    _definiciones = []
    return []
  }
}

/**
 * Obtener entregas de refrigerio de un partido.
 */
export async function fetchEntregasRefrigerio(
  partidoId: string,
): Promise<EntregaRefrigerio[]> {
  try {
    const data = await listarEntregasRefrigerioApi(partidoId)
    _entregas = data
    return data
  } catch (error) {
    console.warn('[logistica] API entregas falló, usando mock:', error)
    _entregas = []
    return []
  }
}

/**
 * Crear definición de refrigerio.
 * Requiere rol ORGANIZADOR.
 */
export async function crearDefinicionRefrigerio(
  request: CrearDefinicionRefrigerioRequest,
): Promise<DefinicionRefrigerio | null> {
  try {
    const result = await crearDefinicionRefrigerioApi(request)
    console.log('[logistica] Definición creada:', result.id)
    return result
  } catch (error) {
    console.error('[logistica] Error al crear definición:', error)
    return null
  }
}

/**
 * Registrar entrega de refrigerio al capitán.
 * Requiere rol ORGANIZADOR.
 */
export async function registrarEntregaRefrigerio(
  request: RegistrarEntregaRefrigerioRequest,
): Promise<EntregaRefrigerio | null> {
  try {
    const result = await registrarEntregaRefrigerioApi(request)
    console.log('[logistica] Entrega registrada:', result.id)
    return result
  } catch (error) {
    console.error('[logistica] Error al registrar entrega:', error)
    return null
  }
}

// ─── Service Functions: Dotación ─────────────────────────────

/**
 * Obtener items de dotación de un árbitro.
 */
export async function fetchDotacionPorArbitro(
  arbitroId: string,
  estado?: EstadoDotacion,
): Promise<ItemDotacion[]> {
  try {
    const data = await listarDotacionPorArbitroApi(arbitroId, estado)
    _dotacion = data
    return data
  } catch (error) {
    console.warn('[logistica] API dotación falló, usando mock:', error)
    _dotacion = []
    return []
  }
}

/**
 * Registrar items de dotación para un árbitro.
 * Requiere rol ORGANIZADOR.
 */
export async function registrarDotacion(
  request: RegistrarItemDotacionRequest,
): Promise<ItemDotacion[] | null> {
  try {
    const result = await registrarDotacionApi(request)
    console.log('[logistica] Dotación registrada:', result.length, 'items')
    return result
  } catch (error) {
    console.error('[logistica] Error al registrar dotación:', error)
    return null
  }
}

/**
 * Marcar item de dotación como ENTREGADO.
 * Requiere rol ORGANIZADOR.
 */
export async function marcarDotacionEntregada(
  itemId: string,
  observaciones?: string,
): Promise<ItemDotacion | null> {
  try {
    const result = await marcarDotacionEntregadaApi(itemId, observaciones)
    return result
  } catch (error) {
    console.error('[logistica] Error al marcar entrega:', error)
    return null
  }
}

/**
 * Registrar devolución de item de dotación.
 * Requiere rol ORGANIZADOR.
 */
export async function devolverDotacion(
  itemId: string,
  observaciones?: string,
): Promise<ItemDotacion | null> {
  try {
    const result = await devolverDotacionApi(itemId, observaciones)
    return result
  } catch (error) {
    console.error('[logistica] Error al registrar devolución:', error)
    return null
  }
}

// ─── Service Functions: Auditoría ────────────────────────────

/**
 * Obtener eventos de auditoría del dominio de Logística.
 */
export async function fetchEventosAuditoria(): Promise<AuditEvent[]> {
  try {
    const data = await listarEventosAuditoriaApi()
    _eventosAuditoria = data
    return data
  } catch (error) {
    console.warn('[logistica] API auditoría falló, usando mock:', error)
    _eventosAuditoria = MOCK_EVENTOS_AUDITORIA
    return [...MOCK_EVENTOS_AUDITORIA]
  }
}

// ─── Mock helpers para páginas que aún usan datos mock ───────

export function getMockEquiposLog(): EquipoLogDisplay[] {
  return [...MOCK_EQUIPOS_LOG]
}

export function getMockDotacionCapitan(): DotacionDisplay[] {
  return [...MOCK_DOTACION_CAPITAN]
}
