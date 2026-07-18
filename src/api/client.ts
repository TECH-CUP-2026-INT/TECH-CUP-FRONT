import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const DEV = import.meta.env.DEV
const BASE_URL = DEV ? '' : 'https://techapi.azure-api.net'
const APIM_KEY = import.meta.env.VITE_APIM_KEY

// ── Prefijos por servicio en el gateway ──────────────────────
export const CHAT_SERVICE_PREFIX = '/communications'
export const USERS_SERVICE_PREFIX = '/users/api/v1'
export const TEAMS_SERVICE_PREFIX = '/teams/api/v1'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(APIM_KEY ? { 'Ocp-Apim-Subscription-Key': APIM_KEY } : {}),
  },
})

/** Key donde guardamos el JWT en localStorage */
export const JWT_STORAGE_KEY = 'techcup_jwt'

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
export function setJwt(token: string): void {
  localStorage.setItem(JWT_STORAGE_KEY, token)
}

/** Helper para limpiar el JWT al hacer logout */
export function clearJwt(): void {
  localStorage.removeItem(JWT_STORAGE_KEY)
}

/** Saber si hay un JWT guardado */
export function hasJwt(): boolean {
  return !!localStorage.getItem(JWT_STORAGE_KEY)
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

export default api
