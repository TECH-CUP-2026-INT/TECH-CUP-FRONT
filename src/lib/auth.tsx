import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  login: (email: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('techcup_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ')
    const newUser: User = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      avatar: `https://i.pravatar.cc/72?img=${Math.floor(Math.random() * 70) + 1}`,
    }
    setUser(newUser)
    localStorage.setItem('techcup_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('techcup_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
