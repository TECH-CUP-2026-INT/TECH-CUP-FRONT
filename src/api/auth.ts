import { apiPost, setJwt } from './client'

// ─── Tipos ─────────────────────────────────────────────────

export type UserRoleAPI = 'PLAYER' | 'CAPTAIN' | 'REFEREE' | 'ORGANIZER' | 'ADMIN'
export type UserTypeAPI = 'STUDENT' | 'GUEST' | 'GRADUATE' | 'REFEREE' | 'ADMIN' | 'ORGANIZER'
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: string
  message: string
  otpCode?: string
}

export interface OtpValidationRequest {
  userId: string
  otpCode: string
}

export interface UserResponse {
  id: string
  fullName: string
  email: string
  userType: UserTypeAPI
  role: UserRoleAPI
  status: AccountStatus
}

export interface OtpResponse {
  token: string
  user: UserResponse
}

export interface OtpResendRequest {
  userId: string
}

export interface GoogleLoginRequest {
  googleToken: string
}

export interface MessageResponse {
  message: string
}

export interface PasswordRecoveryRequest {
  email: string
}

export interface PasswordResetRequest {
  email: string
  recoveryCode: string
  newPassword: string
}

export interface TokenValidationResponse {
  valid: boolean
  userId?: string
  email?: string
  role?: UserRoleAPI
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  userType: UserTypeAPI
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  phone: string
  address: string
  program?: string
  semester?: string
  position?: string
  jerseyNumber?: string
  googleToken?: string
}

export interface AuditEvent {
  id: string
  userId: string
  actionType: string
  description: string
  success: boolean
  timestamp: string
}

// ─── Auth Path ──────────────────────────────────────────────
const AUTH = '/identity/api/v1/auth'
const OTP = '/identity/api/v1/otp'
const PASSWORD = '/identity/api/v1/password'
const TOKEN = '/identity/api/v1/token'

// ─── API Functions ──────────────────────────────────────────

/**
 * Paso 1 del login: email + password → devuelve userId + envía OTP al correo.
 */
export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>(`${AUTH}/login`, data)
  console.log('[loginApi] respuesta cruda:', JSON.stringify(res))
  return res
}

/**
 * Login con Google OAuth: token de Google → devuelve userId + envía OTP.
 */
export async function loginGoogleApi(data: GoogleLoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>(`${AUTH}/login/google`, data)
}

/**
 * Registro de nuevo usuario. Crea la cuenta y devuelve JWT + datos del usuario.
 */
export async function registerApi(data: RegisterRequest): Promise<OtpResponse> {
  const res = await apiPost<OtpResponse>(`${AUTH}/register`, data)
  setJwt(res.token)
  return res
}

/**
 * Paso 2 del login: valida el OTP → devuelve JWT + datos del usuario.
 * Automáticamente guarda el JWT en localStorage.
 */
export async function validateOtpApi(data: OtpValidationRequest): Promise<OtpResponse> {
  const res = await apiPost<OtpResponse>(`${OTP}/validate`, data)
  console.log('[validateOtpApi] respuesta cruda:', JSON.stringify(res))
  if (!res.token || !res.user) {
    throw new Error('Respuesta inválida del servidor: falta token o datos del usuario')
  }
  setJwt(res.token)
  return res
}

/**
 * Reenvía un nuevo OTP al correo (cooldown de 60s).
 */
export async function resendOtpApi(data: OtpResendRequest): Promise<MessageResponse> {
  return apiPost<MessageResponse>(`${OTP}/resend`, data)
}

/**
 * Cierra sesión: revoca el JWT actual.
 */
export async function logoutApi(): Promise<MessageResponse> {
  return apiPost<MessageResponse>(`${AUTH}/logout`, {})
}

/**
 * Solicita código de recuperación de contraseña.
 */
export async function requestRecoveryApi(data: PasswordRecoveryRequest): Promise<MessageResponse> {
  return apiPost<MessageResponse>(`${PASSWORD}/recovery`, data)
}

/**
 * Restablece la contraseña con el código de recuperación.
 */
export async function resetPasswordApi(data: PasswordResetRequest): Promise<MessageResponse> {
  return apiPost<MessageResponse>(`${PASSWORD}/reset`, data)
}

/**
 * Valida un JWT y devuelve los datos del usuario.
 */
export async function validateTokenApi(): Promise<TokenValidationResponse> {
  return apiPost<TokenValidationResponse>(`${TOKEN}/validate`, {})
}
