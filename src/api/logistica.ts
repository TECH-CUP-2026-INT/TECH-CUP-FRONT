/**
 * Logística — API Layer
 *
 * Servicio de Logística (service-logistics / am-logistic-service).
 * APIM path: /api/v1/Logistic
 *
 * Dominios:
 *   - Refrigerios: definiciones y entregas por partido
 *   - Dotación: items físicos (petos, balones, kits) asignados a árbitros
 *   - Auditoría: feed de eventos de logística
 */

import { apiGet, apiPost, apiPatch } from './client'

// ─── Enums ──────────────────────────────────────────────────

export type TipoItemDotacion = 'PETO' | 'BALON' | 'KIT'
export type EstadoDotacion = 'PENDIENTE' | 'ENTREGADO' | 'DEVUELTO'
export type TipoEventoAuditoria =
  | 'DEFINICION_REFRIGERIO_CREADA'
  | 'ENTREGA_REFRIGERIO_REGISTRADA'
  | 'DOTACION_REGISTRADA'
  | 'DOTACION_ENTREGADA'
  | 'DOTACION_DEVUELTA'

// ─── Response types ─────────────────────────────────────────

export interface ItemRefrigerio {
  descripcion: string
  cantidad: number
}

export interface DefinicionRefrigerio {
  id: string
  partidoId: string
  equipoId: string
  items: ItemRefrigerio[]
  observaciones: string
  creadoPorId: string
  fechaCreacion: string
}

export interface EntregaRefrigerio {
  id: string
  definicionRefrigerioId: string
  partidoId: string
  equipoId: string
  capitanId: string
  responsableId: string
  fechaEntrega: string
  observaciones: string
}

export interface ItemDotacion {
  id: string
  arbitroId: string
  tipoItem: TipoItemDotacion
  estado: EstadoDotacion
  responsableAsignadoId: string
  entregadoPorId: string | null
  fechaRegistro: string
  fechaEntrega: string | null
  recibidoPorId: string | null
  fechaDevolucion: string | null
  observaciones: string
}

export interface AuditEvent {
  tipo: TipoEventoAuditoria
  entidadId: string
  actorId: string
  timestamp: string
  detalle: string
}

// ─── Request types ──────────────────────────────────────────

export interface CrearDefinicionRefrigerioRequest {
  partidoId: string
  equipoId: string
  items: { descripcion: string; cantidad: number }[]
  observaciones?: string
}

export interface RegistrarEntregaRefrigerioRequest {
  definicionRefrigerioId: string
  capitanId: string
  observaciones?: string
}

export interface RegistrarItemDotacionRequest {
  arbitroId: string
  tipoItem: TipoItemDotacion
  cantidad: number
  responsableAsignadoId: string
  observaciones?: string
}

// ─── Helpers ─────────────────────────────────────────────────

const LOGISTIC_PATH = '/api/v1/Logistic'

// ─── Refrigerios: Definiciones ──────────────────────────────

/**
 * POST /api/refrigerios/definiciones
 * Crear definición de refrigerio(s) para un equipo en un partido.
 * Requiere rol ORGANIZADOR.
 */
export async function crearDefinicionRefrigerioApi(
  body: CrearDefinicionRefrigerioRequest,
): Promise<DefinicionRefrigerio> {
  return apiPost<DefinicionRefrigerio>(
    `${LOGISTIC_PATH}/api/refrigerios/definiciones`,
    body,
  )
}

/**
 * GET /api/refrigerios/definiciones?partidoId=UUID
 * Listar definiciones de refrigerio de un partido.
 * Requiere rol ADMIN u ORGANIZADOR.
 */
export async function listarDefinicionesRefrigerioApi(
  partidoId: string,
): Promise<DefinicionRefrigerio[]> {
  return apiGet<DefinicionRefrigerio[]>(
    `${LOGISTIC_PATH}/api/refrigerios/definiciones`,
    { params: { partidoId } },
  )
}

// ─── Refrigerios: Entregas ──────────────────────────────────

/**
 * POST /api/refrigerios/entregas
 * Registrar entrega real de un refrigerio al capitán.
 * Requiere rol ORGANIZADOR.
 */
export async function registrarEntregaRefrigerioApi(
  body: RegistrarEntregaRefrigerioRequest,
): Promise<EntregaRefrigerio> {
  return apiPost<EntregaRefrigerio>(
    `${LOGISTIC_PATH}/api/refrigerios/entregas`,
    body,
  )
}

/**
 * GET /api/refrigerios/entregas?partidoId=UUID
 * Listar entregas de refrigerio de un partido.
 * Requiere rol ADMIN u ORGANIZADOR.
 */
export async function listarEntregasRefrigerioApi(
  partidoId: string,
): Promise<EntregaRefrigerio[]> {
  return apiGet<EntregaRefrigerio[]>(
    `${LOGISTIC_PATH}/api/refrigerios/entregas`,
    { params: { partidoId } },
  )
}

// ─── Dotación ───────────────────────────────────────────────

/**
 * POST /api/dotacion
 * Registrar items de dotación como PENDIENTE, uno por unidad física.
 * Requiere rol ORGANIZADOR.
 */
export async function registrarDotacionApi(
  body: RegistrarItemDotacionRequest,
): Promise<ItemDotacion[]> {
  return apiPost<ItemDotacion[]>(
    `${LOGISTIC_PATH}/api/dotacion`,
    body,
  )
}

/**
 * PATCH /api/dotacion/{itemId}/entrega
 * Marcar un item de dotación como ENTREGADO.
 * Requiere rol ORGANIZADOR.
 */
export async function marcarDotacionEntregadaApi(
  itemId: string,
  observaciones?: string,
): Promise<ItemDotacion> {
  return apiPatch<ItemDotacion>(
    `${LOGISTIC_PATH}/api/dotacion/${itemId}/entrega`,
    observaciones ? { observaciones } : undefined,
  )
}

/**
 * PATCH /api/dotacion/{itemId}/devolucion
 * Registrar devolución de un item de dotación (estado DEVUELTO).
 * Requiere rol ORGANIZADOR.
 */
export async function devolverDotacionApi(
  itemId: string,
  observaciones?: string,
): Promise<ItemDotacion> {
  return apiPatch<ItemDotacion>(
    `${LOGISTIC_PATH}/api/dotacion/${itemId}/devolucion`,
    observaciones ? { observaciones } : undefined,
  )
}

/**
 * GET /api/dotacion?arbitroId=UUID&estado=STRING
 * Listar items de dotación de un árbitro, opcionalmente filtrados por estado.
 * Requiere rol ADMIN u ORGANIZADOR.
 */
export async function listarDotacionPorArbitroApi(
  arbitroId: string,
  estado?: EstadoDotacion,
): Promise<ItemDotacion[]> {
  return apiGet<ItemDotacion[]>(
    `${LOGISTIC_PATH}/api/dotacion`,
    {
      params: {
        arbitroId,
        ...(estado ? { estado } : {}),
      },
    },
  )
}

// ─── Auditoría ──────────────────────────────────────────────

/**
 * GET /api/auditoria/eventos
 * Listar eventos de auditoría del dominio de Logística.
 * Requiere rol ADMIN u ORGANIZADOR.
 */
export async function listarEventosAuditoriaApi(): Promise<AuditEvent[]> {
  return apiGet<AuditEvent[]>(`${LOGISTIC_PATH}/api/auditoria/eventos`)
}
