import { apiGet, USERS_SERVICE_PREFIX } from './client'

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
export function getMiPerfil(): Promise<PerfilResponse> {
  return apiGet<PerfilResponse>(`${USERS_SERVICE_PREFIX}/usuarios/perfil`)
}

/** Perfil público de cualquier usuario, usado para mostrar nombre real en el chat. */
export function getPerfilPublico(userId: string): Promise<PerfilPublicoResponse> {
  return apiGet<PerfilPublicoResponse>(`${USERS_SERVICE_PREFIX}/usuarios/${userId}/perfil`)
}
