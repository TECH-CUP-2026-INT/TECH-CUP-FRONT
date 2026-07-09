import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
        scrolled && 'bg-black/82 backdrop-blur-md border-[rgba(255,255,255,0.08)] py-3'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
            <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
              TECH<span className="text-gold">CUP</span>
            </span>
            <span className="text-[8.5px] tracking-[1.6px] text-text-muted font-semibold">
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
                  'text-[13.5px] font-semibold tracking-[.4px] text-gray-light pb-1.5 border-b-2 border-transparent transition-colors hover:text-purple-mid',
                  pathname === link.href && 'text-purple-mid border-gold'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3.5">
          <Link to="/login">
            <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-purple-mid hover:text-white font-bold text-sm px-6 py-2.5 h-auto transition-all duration-300">
              Iniciar sesión
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden bg-none border-none text-white p-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-border mt-4 py-6 px-8">
          <ul className="flex flex-col items-center gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-sm font-semibold tracking-[.4px] text-gray-light transition-colors hover:text-white',
                    pathname === link.href && 'text-white'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold text-sm px-6">
              Iniciar sesión
            </Button>
          </ul>
        </div>
      )}
    </nav>
  )
}
