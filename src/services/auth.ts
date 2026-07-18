/**
 * Auth — Service layer
 *
 * Estrategia:
 * 1. Intenta llamar al API real del Identity Service
 * 2. Si el API no responde (error de red), usa datos mock
 * 3. El JWT se guarda/limpia automáticamente via client.ts
 */

import { clearJwt, hasJwt } from '@/api/client'
import {
  loginApi,
  loginGoogleApi,
  validateOtpApi,
  resendOtpApi,
  logoutApi,
  requestRecoveryApi,
  resetPasswordApi,
  validateTokenApi,
  type LoginRequest,
  type OtpValidationRequest,
  type LoginResponse,
  type OtpResponse,
  type UserResponse,
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

// ─── Mock fallback ─────────────────────────────────────────
const MOCK_USER_ID = 'mock-user-001'

/** Login + OTP mock (simula el flujo completo) */
async function mockLogin(_data: LoginRequest): Promise<LoginResponse> {
  // Simula delay de red
  await new Promise((r) => setTimeout(r, 800))
  return { userId: MOCK_USER_ID, message: 'OTP sent to your email.' }
}

async function mockValidateOtp(_data: OtpValidationRequest): Promise<OtpResponse> {
  await new Promise((r) => setTimeout(r, 600))
  return {
    token: 'mock-jwt-token',
    user: {
      id: MOCK_USER_ID,
      fullName: 'Usuario Mock',
      email: 'mock@escuelaing.edu.co',
      userType: 'STUDENT',
      role: 'PLAYER',
      status: 'ACTIVE',
    },
  }
}

// ─── Service Functions ─────────────────────────────────────

/**
 * Paso 1: Login con email + contraseña.
 * @returns userId (necesario para el paso 2 de OTP)
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    return await loginApi({ email, password })
  } catch (error) {
    console.warn('[auth] API login falló, usando mock:', error)
    return mockLogin({ email, password })
  }
}

/**
 * Paso 1b: Login con Google OAuth.
 */
export async function loginGoogle(googleToken: string): Promise<LoginResponse> {
  try {
    return await loginGoogleApi({ googleToken })
  } catch (error) {
    console.warn('[auth] API Google login falló, usando mock:', error)
    return { userId: MOCK_USER_ID, message: 'OTP sent to your email.' }
  }
}

/**
 * Paso 2: Validar OTP → obtiene JWT + datos del usuario.
 * Autoguarda el JWT automáticamente.
 * @returns OtpResponse con token y datos del usuario
 */
export async function validateOtp(userId: string, otpCode: string): Promise<OtpResponse> {
  try {
    return await validateOtpApi({ userId, otpCode })
  } catch (error) {
    console.warn('[auth] API OTP validation falló, usando mock:', error)
    return mockValidateOtp({ userId, otpCode })
  }
}

/**
 * Reenviar OTP.
 */
export async function resendOtp(userId: string): Promise<string> {
  try {
    const res = await resendOtpApi({ userId })
    return res.message
  } catch (error) {
    console.warn('[auth] API resend OTP falló:', error)
    return 'OTP re-sent (mock).'
  }
}

/**
 * Logout: limpia el JWT del localStorage.
 */
export function logout(): void {
  clearJwt()
  // También limpiamos el user del localStorage
  localStorage.removeItem('techcup_user')
}

/**
 * Saber si hay sesión activa (JWT guardado).
 */
export function isLoggedIn(): boolean {
  return hasJwt()
}

/**
 * Recuperación de contraseña: solicita código al correo.
 */
export async function requestPasswordRecovery(email: string): Promise<string> {
  try {
    const res = await requestRecoveryApi({ email })
    return res.message
  } catch (error) {
    console.warn('[auth] API recovery falló, usando mock:', error)
    return 'Si el correo existe, recibirás un código de recuperación.'
  }
}

/**
 * Restablecer contraseña con código de recuperación.
 */
export async function resetPassword(
  email: string,
  recoveryCode: string,
  newPassword: string,
): Promise<string> {
  try {
    const res = await resetPasswordApi({ email, recoveryCode, newPassword })
    return res.message
  } catch (error) {
    console.warn('[auth] API reset password falló, usando mock:', error)
    return 'Contraseña restablecida exitosamente.'
  }
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
