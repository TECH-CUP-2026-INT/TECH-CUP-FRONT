export function getInitialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
  const colors = ['#7f77dd', '#e24b4a', '#3fc8ff', '#e8bd5f', '#4CAF50', '#FF9800']
  const color = colors[name.length % colors.length]
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${color}"/><text x="50" y="50" dominant-baseline="central" text-anchor="middle" fill="white" font-size="40" font-weight="700" font-family="Arial,sans-serif">${initials}</text></svg>`)}`
}
