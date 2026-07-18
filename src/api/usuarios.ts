import { apiGet, apiPut, apiDelete, USERS_SERVICE_PREFIX } from './client'

export interface PerfilResponse {
  id: string
  nombreCompleto: string
  correo: string
  tipoUsuario: string
  rol: string
  estado: string
  tipoIdentificacion: string
  numeroIdentificacion: string
  programaAcademico?: string
  semestre?: string
  verificadoOTP: boolean
  fechaRegistro: string
}

export interface PerfilPublicoResponse {
  id: string
  nombreCompleto: string
  tipoUsuario: string
  rol: string
  programaAcademico?: string
}

/** Perfil propio, resuelto por el backend a partir del JWT — no requiere pasar el id. */
export async function getMiPerfil(): Promise<PerfilResponse> {
  try {
    return await apiGet<PerfilResponse>(`${USERS_SERVICE_PREFIX}/usuarios/perfil`)
  } catch {
    console.warn('[usuarios] API no disponible, usando mock')
    return {
      id: 'mock-user-001',
      nombreCompleto: 'Usuario Demo',
      correo: 'demo@techcup.com',
      tipoUsuario: 'STUDENT',
      rol: 'PLAYER',
      estado: 'ACTIVE',
      tipoIdentificacion: 'CC',
      numeroIdentificacion: '1234567890',
      verificadoOTP: true,
      fechaRegistro: new Date().toISOString(),
    }
  }
}

/** Perfil público de cualquier usuario, usado para mostrar nombre real en el chat. */
export function getPerfilPublico(userId: string): Promise<PerfilPublicoResponse> {
  return apiGet<PerfilPublicoResponse>(`${USERS_SERVICE_PREFIX}/usuarios/${userId}/perfil`)
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Update perfil + Delete cuenta
// ═══════════════════════════════════════════════════════════════

export interface UpdatePerfilRequest {
  nombreCompleto?: string
  programaAcademico?: string
  semestre?: string
  telefono?: string
  direccion?: string
  posicion?: string
  numeroCamiseta?: string
}

/**
 * Actualiza el perfil del usuario autenticado.
 * PUT /api/v1/Users/usuarios/perfil
 */
export async function updatePerfilApi(
  data: UpdatePerfilRequest
): Promise<PerfilResponse> {
  return apiPut<PerfilResponse>(`${USERS_SERVICE_PREFIX}/usuarios/perfil`, data)
}

/**
 * Elimina/desactiva la cuenta del usuario autenticado.
 * DELETE /api/v1/Users/usuarios/cuenta
 */
export async function deleteCuentaApi(): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`${USERS_SERVICE_PREFIX}/usuarios/cuenta`)
}
