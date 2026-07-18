import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { clearJwt, hasJwt } from '@/api/client'

export type UserRole = 'jugador' | 'arbitro' | 'organizador'

interface User {
  name: string
  email: string
  avatar: string
  role: UserRole
  isCaptain?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, role: UserRole, avatar?: string, name?: string) => void
  logout: () => void
  isAuthenticated: boolean
  becomeCaptain: () => void
  removeCaptain: () => void
}

function getInitialsAvatar(name: string): string {
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  becomeCaptain: () => {},
  removeCaptain: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('techcup_user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else if (hasJwt()) {
      // Hay JWT pero no user data → intentar validarlo
      import('@/services/auth').then(({ validateToken }) => {
        validateToken().then((res) => {
          if (res?.valid && res.email) {
            const role = res.role === 'REFEREE' ? 'arbitro' as const
              : (res.role === 'ORGANIZER' || res.role === 'ADMIN') ? 'organizador' as const
              : 'jugador' as const
            login(res.email, role)
          } else {
            clearJwt()
          }
        })
      })
    }
  }, [])

  const login = (email: string, role: UserRole = 'jugador', avatar?: string, name?: string) => {
    const displayName = name || (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    const newUser: User = {
      name: displayName,
      email,
      avatar: avatar || getInitialsAvatar(displayName),
      role,
      isCaptain: false,
    }
    setUser(newUser)
    localStorage.setItem('techcup_user', JSON.stringify(newUser))
  }

  const becomeCaptain = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, isCaptain: true }
      localStorage.setItem('techcup_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeCaptain = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, isCaptain: false }
      localStorage.setItem('techcup_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('techcup_user')
    clearJwt()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, becomeCaptain, removeCaptain }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
