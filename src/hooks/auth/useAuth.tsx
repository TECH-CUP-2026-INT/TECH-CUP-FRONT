import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { clearJwt, hasJwt, isRealJwt } from '@/api/client'
import { getInitialsAvatar } from '@/utils/avatar'

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
  isRealAuth: boolean
  becomeCaptain: () => void
  removeCaptain: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isRealAuth: false,
  becomeCaptain: () => {},
  removeCaptain: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Si no hay sesión guardada, crear usuario demo automaticamente
    const stored = localStorage.getItem('techcup_user')
    if (stored) return JSON.parse(stored)
    if (hasJwt()) return null
    const demo: User = {
      name: 'Usuario Demo',
      email: 'demo@techcup.com',
      avatar: getInitialsAvatar('Usuario Demo'),
      role: 'jugador',
      isCaptain: false,
    }
    localStorage.setItem('techcup_user', JSON.stringify(demo))
    return demo
  })

  useEffect(() => {
    if (!localStorage.getItem('techcup_user') && hasJwt()) {
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isRealAuth: isRealJwt(), becomeCaptain, removeCaptain }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
