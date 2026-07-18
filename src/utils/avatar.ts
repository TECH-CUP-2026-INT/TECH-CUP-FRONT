/**
 * Genera un avatar SVG con las iniciales de un nombre.
 * Útil para usuarios sin foto de perfil.
 */

export function getInitialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || '?'

  const colors = ['#7f77dd', '#3fc8ff', '#e24b4a', '#f5a623', '#22c55e', '#ec4899']
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
  const bg = colors[colorIndex]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${bg}"/>
    <text x="50" y="50" dominant-baseline="central" text-anchor="middle"
      fill="white" font-size="40" font-weight="700" font-family="Arial,sans-serif">${initials}</text>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
