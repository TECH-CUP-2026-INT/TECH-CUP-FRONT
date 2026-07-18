/**
 * Usuarios — Service Layer
 *
 * Estrategia (patrón "tournament"):
 * 1. Intenta llamar al API real del Users Service vía APIM
 * 2. Si falla (red, 401, 403), usa datos mock
 * 3. Update de perfil también sincroniza con localStorage
 */

import {
  getMiPerfil as apiGetMiPerfil,
  updatePerfilApi,
  deleteCuentaApi,
  type PerfilResponse,
  type UpdatePerfilRequest,
} from '@/api/usuarios'

// ─── Display types ───────────────────────────────────────────

export interface PerfilDisplay {
  id: string
  nombreCompleto: string
  correo: string
  tipoUsuario: string
  rol: string
  programaAcademico?: string
  semestre?: string
  verificadoOTP: boolean
}

// ─── Module-level state ──────────────────────────────────────

let _perfil: PerfilDisplay | null = null

export function getPerfil(): PerfilDisplay | null {
  return _perfil
}

// ─── Mappers ─────────────────────────────────────────────────

function mapPerfil(api: PerfilResponse): PerfilDisplay {
  return {
    id: api.id,
    nombreCompleto: api.nombreCompleto,
    correo: api.correo,
    tipoUsuario: api.tipoUsuario,
    rol: api.rol,
    programaAcademico: api.programaAcademico,
    semestre: api.semestre,
    verificadoOTP: api.verificadoOTP,
  }
}

// ─── Service Functions ───────────────────────────────────────

/**
 * Obtiene el perfil del usuario autenticado.
 */
export async function fetchMiPerfil(): Promise<PerfilDisplay | null> {
  try {
    const data = await apiGetMiPerfil()
    _perfil = mapPerfil(data)
    return _perfil
  } catch (error) {
    console.warn('[usuarios] API perfil falló, usando mock:', error)
    const mock: PerfilDisplay = {
      id: 'mock-user-001',
      nombreCompleto: 'Usuario Demo',
      correo: 'demo@techcup.com',
      tipoUsuario: 'STUDENT',
      rol: 'PLAYER',
      programaAcademico: 'Ingeniería de Sistemas',
      semestre: '8',
      verificadoOTP: true,
    }
    _perfil = mock
    return mock
  }
}

/**
 * Actualiza el perfil del usuario autenticado.
 */
export async function actualizarPerfil(
  data: UpdatePerfilRequest
): Promise<PerfilDisplay | null> {
  try {
    const result = await updatePerfilApi(data)
    _perfil = mapPerfil(result)
    return _perfil
  } catch (error) {
    console.warn('[usuarios] API update perfil falló, actualizando solo local:', error)
    // Fallback local
    if (_perfil) {
      if (data.nombreCompleto) _perfil.nombreCompleto = data.nombreCompleto
      if (data.programaAcademico) _perfil.programaAcademico = data.programaAcademico
      if (data.semestre) _perfil.semestre = data.semestre
    }
    return _perfil
  }
}

/**
 * Elimina la cuenta del usuario autenticado.
 */
export async function eliminarCuenta(): Promise<boolean> {
  try {
    await deleteCuentaApi()
    _perfil = null
    return true
  } catch (error) {
    console.warn('[usuarios] API delete cuenta falló:', error)
    return false
  }
}
