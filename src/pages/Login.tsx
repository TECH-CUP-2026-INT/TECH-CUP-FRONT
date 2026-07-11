import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-black flex">
      
      {/* Left — Video + overlay */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        }}>
        {/* Background video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "0% center" }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-black/95 via-purple-black/70 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-purple-black flex-shrink-0">
                <img src="/assets/logo.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] font-bold text-xl tracking-[.5px]">
                  TECH<span className="text-gold">CUP</span>
                </span>
                <span className="text-[9px] tracking-[1.6px] text-text-muted font-semibold">
                  INGENIERÍA DE SISTEMAS
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Slogan central */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-[360px]"
          >
            <p className="font-[family-name:var(--font-display)] text-4xl uppercase leading-[1.1] mb-4">
              La pasión nos <span className="text-gold">conecta</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              Iniciá sesión y viví la emoción del torneo universitario más importante de Ingeniería de Sistemas.
            </p>
            
            {/* Línea decorativa */}
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-[2px] rounded-full bg-gold/60" />
              <div className="w-8 h-[2px] rounded-full bg-purple-mid/40" />
              <div className="w-8 h-[2px] rounded-full bg-gold/20" />
            </div>
          </motion.div>

          {/* Footer izquierda */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-text-faint"
          >
            © 2026 TechCup — Todos los derechos reservados
          </motion.p>
        </div>
      </div>

      {/* Right — Formulario */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 lg:p-16 overflow-hidden">
        {/* Background — ambient light spots so glass effect is visible */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 55% at 20% 15%, rgba(212, 175, 55, 0.22) 0%, transparent 65%),
              radial-gradient(ellipse 65% 55% at 80% 85%, rgba(147, 51, 234, 0.13) 0%, transparent 55%),
              radial-gradient(ellipse 40% 35% at 55% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 45%)
            `,
            backgroundColor: '#0a0a0f',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative w-full max-w-[420px] space-y-5">
          {/* Logo mobile */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="flex items-center gap-2.5 lg:hidden">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
                <img src="/assets/logo.png" alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
                TECH<span className="text-gold">CUP</span>
              </span>
            </Link>
          </motion.div>

          <GlassCard>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              {/* Back + Title */}
              <div>
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors mb-5">
                  <ArrowLeft size={16} />
                  Volver al inicio
                </Link>
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] mb-1">
                  Bienvenido de <span className="text-gold">vuelta</span>
                </h1>
                <p className="text-sm text-text-muted">Iniciá sesión para acceder a tu cuenta.</p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={e => { e.preventDefault(); login(email); navigate('/dashboard') }}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@escuelaing.edu.co"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className="border-border data-[state=checked]:bg-purple-mid data-[state=checked]:border-purple-mid" />
                    <Label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Recordarme</Label>
                  </div>
                  <Link to="/recuperar" className="text-sm text-gold hover:text-gold-dark font-semibold transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button type="submit" className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all">
                  Iniciar sesión
                </Button>
              </form>

              {/* Separador */}
              <div className="flex items-center gap-3">
                <Separator className="flex-1 bg-border/40" />
                <span className="text-xs text-text-faint font-semibold uppercase">o</span>
                <Separator className="flex-1 bg-border/40" />
              </div>

              {/* Google */}
              <Button variant="outline" className="w-full rounded-full border-border/60 bg-white/5 text-gray-light hover:bg-white/10 hover:text-white h-12 text-sm font-semibold gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </Button>

              {/* Registro */}
              <p className="text-center text-sm text-text-muted">
                ¿No tenés cuenta?{' '}
                <Link to="/registro" className="text-gold font-semibold hover:text-gold-dark transition-colors">
                  Registrate
                </Link>
              </p>

              {/* Árbitro */}
              <div className="rounded-2xl bg-white/5 border border-white/10 text-center p-4">
                <p className="text-sm text-text-muted">
                  ¿Eres árbitro?{' '}
                  <Link to="/login/arbitro" className="text-gold font-semibold hover:text-gold-dark transition-colors">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// ── Glass Card con mouse tracking ──

function GlassCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMouse({ x, y })
    if (shineRef.current) {
      const dx = (e.clientX - rect.left) - rect.width * 0.3
      const pct = Math.max(-100, Math.min(100, (dx / rect.width) * 100))
      shineRef.current.style.transform = `translateX(${pct}%)`
    }
  }, [])

  const handleLeave = useCallback(() => {
    setMouse({ x: 50, y: 50 })
    if (shineRef.current) shineRef.current.style.transform = 'translateX(-78%)'
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative overflow-hidden text-white bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl p-6"
      style={{
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        '--mouse-x': mouse.x + '%',
        '--mouse-y': mouse.y + '%',
      } as React.CSSProperties}
    >
      {/* Mouse radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.10) 0%, transparent 60%)`,
          opacity: 0.06,
        }}
      />
      {/* Conic gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
        <div
          className="absolute -inset-[100%] opacity-[0.04]"
          style={{
            background: 'conic-gradient(transparent, rgba(255,255,255,0.3), transparent, rgba(255,255,255,0.15), transparent)',
            transform: 'rotate(258deg)',
          }}
        />
      </div>
      {/* Sliding linear shine */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
          transform: 'translateX(-78%)',
          transition: 'transform 0.075s ease-out',
        }}
      />
      {children}
    </div>
  )
}
