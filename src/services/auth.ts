/**
 * Auth — Service layer
 *
 * Estrategia:
 * - Llama al API real del Identity Service
 * - Los errores del API se propagan a la UI
 * - El JWT se guarda/limpia automáticamente via client.ts
 */

import { clearJwt, hasJwt } from '@/api/client'
import {
  loginApi,
  loginGoogleApi,
  registerApi,
  validateOtpApi,
  resendOtpApi,
  logoutApi,
  requestRecoveryApi,
  resetPasswordApi,
  validateTokenApi,
  type LoginRequest,
  type RegisterRequest,
  type LoginResponse,
  type OtpResponse,
  type UserRoleAPI,
} from '@/api/auth'

// ─── Mapeo de roles API → front ─────────────────────────────
const API_ROLE_TO_FRONT: Record<UserRoleAPI, string> = {
  PLAYER: 'jugador',
  CAPTAIN: 'jugador',
  REFEREE: 'arbitro',
  ORGANIZER: 'organizador',
  ADMIN: 'organizador',
}

const FRONT_ROLE_TO_API: Record<string, UserRoleAPI> = {
  jugador: 'PLAYER',
  arbitro: 'REFEREE',
  organizador: 'ORGANIZER',
  administrador: 'ORGANIZER',
}

// ─── Service Functions ─────────────────────────────────────

/**
 * Paso 1: Login con email + contraseña.
 * @returns userId (necesario para el paso 2 de OTP)
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  return loginApi({ email, password })
}

/**
 * Registro de nuevo usuario.
 */
export async function registerUser(data: RegisterRequest): Promise<OtpResponse> {
  return registerApi(data)
}

/**
 * Paso 1b: Login con Google OAuth.
 */
export async function loginGoogle(googleToken: string): Promise<LoginResponse> {
  return loginGoogleApi({ googleToken })
}

/**
 * Paso 2: Validar OTP → obtiene JWT + datos del usuario.
 */
export async function validateOtp(userId: string, otpCode: string): Promise<OtpResponse> {
  return validateOtpApi({ userId, otpCode })
}

/**
 * Reenviar OTP.
 */
export async function resendOtp(userId: string): Promise<string> {
  const res = await resendOtpApi({ userId })
  return res.message
}

/**
 * Logout: limpia el JWT del localStorage.
 */
export function logout(): void {
  clearJwt()
  localStorage.removeItem('techcup_user')
}

/**
 * Saber si hay sesión activa (JWT guardado).
 */
export function isLoggedIn(): boolean {
  return hasJwt()
}

/**
 * Recuperación de contraseña.
 */
export async function requestPasswordRecovery(email: string): Promise<string> {
  const res = await requestRecoveryApi({ email })
  return res.message
}

/**
 * Restablecer contraseña con código de recuperación.
 */
export async function resetPassword(
  email: string,
  recoveryCode: string,
  newPassword: string,
): Promise<string> {
  const res = await resetPasswordApi({ email, recoveryCode, newPassword })
  return res.message
}

/**
 * Valida el JWT actual y devuelve los datos del usuario.
 */
export async function validateToken() {
  try {
    return await validateTokenApi()
  } catch {
    return null
  }
}

/**
 * Convierte un rol de API (PLAYER/CAPTAIN/REFEREE/ORGANIZER/ADMIN)
 * al string que usa el frontend (jugador/arbitro/organizador).
 */
export function mapApiRoleToFront(role: UserRoleAPI): string {
  return API_ROLE_TO_FRONT[role] ?? 'jugador'
}

/**
 * Convierte un rol del frontend al formato que espera la API.
 */
export function mapFrontRoleToApi(role: string): UserRoleAPI {
  return FRONT_ROLE_TO_API[role.toLowerCase()] ?? 'PLAYER'
}
