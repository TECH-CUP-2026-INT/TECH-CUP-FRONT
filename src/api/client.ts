const BASE_URL = 'https://techapi.azure-api.net';
const SUBSCRIPTION_KEY = '4eff9bdd419b49308dc37fd491741c47';

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

/**
 * GET request al API de TechCup.
 * @param path  Ruta absoluta (ej: /api/v1/statistics/rankings)
 * @param opts  Opciones con params query string
 */
export async function apiGet<T>(
  path: string,
  opts?: { params?: Record<string, string | number> },
): Promise<T> {
  let fullPath = path;
  if (opts?.params) {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(opts.params)) {
      qs.set(key, String(val));
    }
    fullPath += `?${qs.toString()}`;
  }
  return request<T>('GET', fullPath);
}

/**
 * POST request al API de TechCup.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, body);
}
