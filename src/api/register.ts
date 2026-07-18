import { apiPost } from './client'

// ─── Tipos ─────────────────────────────────────────────────

export type TipoIdentificacion = 'CC' | 'CE' | 'TI' | 'PASAPORTE'

export interface RegistroEstudianteRequest {
  nombreCompleto: string
  correoInstitucional: string
  contrasena: string
  programaAcademico: string
  semestre: number
  tipoIdentificacion: TipoIdentificacion
  numeroIdentificacion: string
}

export interface RegistroInvitadoRequest {
  nombreCompleto: string
  correo: string
  contrasena: string
  tipoIdentificacion: TipoIdentificacion
  numeroIdentificacion: string
}

export interface RegistroResponse {
  usuarioId: string
  estadoCuenta: string
  rolAsignado: string
  mensaje: string
}

// ─── Helpers ────────────────────────────────────────────────

function mapTipoDoc(tipoDoc: string): TipoIdentificacion {
  switch (tipoDoc) {
    case 'Cédula':
    case 'Tarjeta de ciudadanía':
      return 'CC'
    case 'Tarjeta identidad':
      return 'TI'
    case 'Pasaporte':
      return 'PASAPORTE'
    default:
      return 'CC'
  }
}

// ─── API Functions ──────────────────────────────────────────

const USERS_PATH = '/users'

export async function registerStudentApi(data: RegistroEstudianteRequest): Promise<RegistroResponse> {
  return apiPost<RegistroResponse>(`${USERS_PATH}/usuarios/registro/estudiante`, data)
}

export async function registerGuestApi(data: RegistroInvitadoRequest): Promise<RegistroResponse> {
  return apiPost<RegistroResponse>(`${USERS_PATH}/usuarios/registro/invitado`, data)
}

export { mapTipoDoc }
