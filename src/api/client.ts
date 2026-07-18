import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = 'https://techapi.azure-api.net'
const SUBSCRIPTION_KEY = '4eff9bdd419b49308dc37fd491741c47'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'Content-Type': 'application/json',
  },
})

/** Key donde guardamos el JWT en localStorage */
const JWT_STORAGE_KEY = 'techcup_jwt'

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
      throw new Error(`API Error ${status}: ${message}`)
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

export default api
