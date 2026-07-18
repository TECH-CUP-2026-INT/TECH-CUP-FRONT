const STORAGE_KEY = 'techcup_team_names'

function readCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/** Recuerda el nombre de un equipo para poder mostrarlo donde solo tenemos su teamId (ej. chat). */
export function rememberTeamName(teamId: string, teamName: string): void {
  const cache = readCache()
  cache[teamId] = teamName
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

/** Nombre de equipo cacheado, si esta sesión/dispositivo ya lo vio antes. */
export function getTeamName(teamId: string): string | undefined {
  return readCache()[teamId]
}
