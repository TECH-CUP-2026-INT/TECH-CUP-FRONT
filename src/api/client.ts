import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const DEV = import.meta.env.DEV
const BASE_URL = DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://techapi.azure-api.net')
const APIM_KEY = import.meta.env.VITE_APIM_KEY

if (!DEV && !APIM_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    '[techcup] VITE_APIM_KEY missing in production. APIM will reject every request with 401. ' +
      'Set it in Cloudflare Pages → Settings → Environment variables.',
  )
}

// ── Prefijos por servicio en el gateway ──────────────────────
export const CHAT_SERVICE_PREFIX = '/communication'
export const USERS_SERVICE_PREFIX = '/users'
export const TEAMS_SERVICE_PREFIX = '/teams'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: APIM_KEY ? { 'subscription-key': APIM_KEY } : {},
  headers: {
    'Content-Type': 'application/json',
    ...(APIM_KEY ? { 'Ocp-Apim-Subscription-Key': APIM_KEY } : {}),
  },
})

/** Key donde guardamos el JWT en localStorage */
export const JWT_STORAGE_KEY = 'techcup_jwt'

/** Flag que indica si el JWT es real (del backend) o mock (offline) */
const JWT_REAL_KEY = 'techcup_jwt_real'

/** Error de API que conserva el status HTTP para que el caller pueda ramificar sobre él. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ── Interceptor: mete el JWT automáticamente en cada request ──
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(JWT_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Interceptor de respuesta → errores no-2xx caen acá
 * en vez de tener que checkear !res.ok manualmente.
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message ?? error.response.statusText
      // Si el token expiró o es inválido, limpiar
      if (status === 401) {
        localStorage.removeItem(JWT_STORAGE_KEY)
      }
      throw new ApiError(status, `API Error ${status}: ${message}`)
    }
    if (error.request) {
      throw new Error('Sin respuesta del servidor — revisá la conexión')
    }
    throw error
  },
)

/** Helper para guardar el JWT después de login exitoso */
export function setJwt(token: string, real = false): void {
  localStorage.setItem(JWT_STORAGE_KEY, token)
  if (real) localStorage.setItem(JWT_REAL_KEY, '1')
  else localStorage.removeItem(JWT_REAL_KEY)
}

/** Helper para limpiar el JWT al hacer logout */
export function clearJwt(): void {
  localStorage.removeItem(JWT_STORAGE_KEY)
  localStorage.removeItem(JWT_REAL_KEY)
}

/** Saber si hay un JWT guardado */
export function hasJwt(): boolean {
  return !!localStorage.getItem(JWT_STORAGE_KEY)
}

/** Saber si el JWT actual es real (del backend) — necesario para Teams/Logistics */
export function isRealJwt(): boolean {
  return localStorage.getItem(JWT_REAL_KEY) === '1'
}

/**
 * GET request al API de TechCup.
 * @param path  Ruta completa (ej: /identity/api/v1/audit)
 * @param opts  Opciones con params query string
 */
export async function apiGet<T>(
  path: string,
  opts?: { params?: Record<string, string | number> },
): Promise<T> {
  const res = await api.get<T>(path, { params: opts?.params })
  return res.data
}

/**
 * POST request al API de TechCup.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await api.post<T>(path, body)
  return res.data
}

/**
 * POST multipart/form-data (para uploads).
 */
export async function apiPostForm<T>(path: string, form: FormData): Promise<T> {
  const res = await api.post<T>(path, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

/**
 * PUT request.
 */
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await api.put<T>(path, body)
  return res.data
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await api.patch<T>(path, body)
  return res.data
}

/**
 * DELETE request.
 */
export async function apiDelete<T>(path: string): Promise<T> {
  const res = await api.delete<T>(path)
  return res.data
}

export default api
