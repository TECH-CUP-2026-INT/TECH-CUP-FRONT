import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, User, X, LogOut } from 'lucide-react'
import { Button } from '@/components/common/button'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/auth/useAuth'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/common/avatar'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/torneos', label: 'Torneos y Equipos' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide navbar on private app pages
  if (pathname.startsWith('/app') || pathname === '/dashboard' || pathname === '/chat') return null

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-[18px] transition-all duration-300 border-b border-transparent',
        scrolled && 'bg-[#F0EDF7]/80 dark:bg-black/82 backdrop-blur-md border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] py-3'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-0 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
            <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-display)] font-black italic text-2xl tracking-[.5px]">
              T<span className="text-gold-ink">C</span>
            </span>
            <span className="text-[9px] tracking-[1.5px] text-text-muted/80 font-semibold mt-[3px] whitespace-nowrap">
              INGENIERÍA DE SISTEMAS
            </span>
          </div>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-[34px]">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  'text-[13.5px] font-semibold tracking-[.4px] text-gray-light pb-1.5 border-b-2 border-transparent transition-colors hover:text-gold-ink',
                  pathname === link.href && 'text-gold-ink border-gold'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — theme toggle + auth */}
        <div className="hidden md:flex items-center gap-3.5">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 bg-surface border border-border rounded-full pr-4 pl-1.5 py-1 hover:border-gold/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/30">
                    <Avatar className="w-full h-full rounded-full">
                      <AvatarImage src={user.avatar} alt="" className="w-full h-full object-cover" />
                      <AvatarFallback className="text-[10px] font-bold">{user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                <span className="text-sm font-semibold text-gray-light">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="w-8 h-8 rounded-full bg-white/5 border border-border flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="rounded-full bg-transparent text-gold-ink border border-gold/50 hover:bg-gold/10 font-bold text-sm px-6 py-2.5 h-auto transition-all duration-300">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden bg-none border-none text-gray-light p-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F0EDF7]/95 dark:bg-black/95 backdrop-blur-md border-t border-border mt-4 py-6 px-8">
          <div className="flex justify-center mb-4">
            <ThemeToggle />
          </div>
          <ul className="flex flex-col items-center gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-sm font-semibold tracking-[.4px] text-gray-light transition-colors hover:text-gold-ink',
                    pathname === link.href && 'text-gold-ink'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="rounded-full bg-purple-mid text-white font-bold text-sm px-6">
                    Ir al Dashboard
                  </Button>
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false) }} className="text-sm text-text-muted hover:text-red-400 transition-colors">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold text-sm px-6">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}
