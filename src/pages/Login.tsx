import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { Checkbox } from '@/components/common/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Users, ShieldCheck, UserCog, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'

const roleCards = [
  {
    id: 'jugador',
    name: 'Jugador / Familiar',
    shortName: 'Jugador',
    desc: 'Sigue los partidos, consulta estadísticas y mantente al día con el rendimiento de tu equipo.',
    color: '#7f77dd',
    colorLight: 'rgba(127,119,221,0.15)',
    icon: Users,
    img: '/images/jugador.png',
  },
  {
    id: 'administrador',
    name: 'Administrador / Organizador',
    shortName: 'Organizador',
    desc: 'Gestiona equipos, arma el calendario, configura torneos y administra los usuarios del sistema.',
    color: '#3fc8ff',
    colorLight: 'rgba(63,200,255,0.15)',
    icon: UserCog,
    img: '/images/admin.png',
  },
  {
    id: 'arbitro',
    name: 'Árbitro',
    shortName: 'Árbitro',
    desc: 'Controla el marcador en vivo, gestiona el tiempo y registra sanciones durante los partidos.',
    color: '#e24b4a',
    colorLight: 'rgba(226,75,74,0.15)',
    icon: ShieldCheck,
    img: '/images/arbitro.png',
  },
]

const videos = ['/hero-video.mp4', '/videos/video-arbitro.mp4']

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'role' | 'login'>('role')
  const [selectedRole, setSelectedRole] = useState<string>('jugador')
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoIndex, setVideoIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const decodeJwtPayload = (token: string) => {
    try {
      const base64 = token.split('.')[1]
      return JSON.parse(atob(base64))
    } catch {
      return null
    }
  }

  const handleGoogleSuccess = (response: CredentialResponse) => {
    const payload = decodeJwtPayload(response.credential || '')
    const email = payload?.email || `${selectedRole}@google.com`
    login(email, selectedRole as import('@/hooks/auth/useAuth').UserRole, payload?.picture, payload?.name)
    navigate(selectedRole === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${selectedRole}`)
  }

  const handleRoleContinue = (role: string) => {
    setSelectedRole(role)
    setStep('login')
    if (role === 'arbitro') {
      setVideoIndex(1)
    } else {
      setVideoIndex(0)
    }
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) videoRef.current.pause()
    else videoRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const nextVideo = () => {
    const next = (videoIndex + 1) % videos.length
    setVideoIndex(next)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">

      {/* Left — panel negro-dorado */}
      <div className="relative z-10 w-full lg:w-[38%] flex items-center justify-center p-8 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black border-r border-gold/20" />
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(rgba(212,175,55,.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        {/* Brillo dorado sutil */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/5 blur-[60px]" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gold/10 blur-[50px]" />
        <div className="relative w-full max-w-[460px]">
          {/* Back to home button */}
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-black/60 border border-gold/30 text-gold-ink hover:bg-gold/20 hover:text-white transition-all duration-300 text-sm font-semibold backdrop-blur-sm mb-10">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>

          {step === 'role' ? (
            /* Step 1: Role Selector — recuadro negro-dorado */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[12px] border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.08)] relative overflow-hidden"
              style={{
                backgroundImage: 'url("/images/bg-roles.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {/* Overlay oscuro para legibilidad */}
              <div className="absolute inset-0 bg-black/70" />
              <div className="mb-6">
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] text-white mb-2">
                  Selecciona tu <span className="text-gold-ink">rol</span>
                </h1>
                <p className="text-sm text-gray-400">Selecciona cómo quieres ingresar al sistema.</p>
              </div>

              <div className="flex flex-col gap-4">
                {roleCards.map((role, i) => {
                  const Icon = role.icon
                  return (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleRoleContinue(role.shortName.toLowerCase())}
                      className="group relative flex items-stretch gap-0 rounded-[10px] overflow-hidden border border-gold/20 bg-black/60 hover:border-gold/50 transition-all duration-300 text-left w-full cursor-pointer"
                    >
                      {/* Imagen lateral */}
                      <div className="relative w-[120px] min-h-[140px] flex-shrink-0 overflow-hidden bg-black/80 flex items-center justify-center max-sm:hidden">
                        <img src={role.img} alt="" className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.8) 100%)` }} />
                      </div>
                      {/* Contenido */}
                      <div className="flex-1 p-4 flex flex-col justify-center relative">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), transparent)' }} />
                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Icon size={16} className="text-gold-ink" />
                              <span className="text-[10px] font-bold tracking-[1.6px] uppercase text-gold-ink">Rol</span>
                            </div>
                            <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-[.3px] text-white mb-1">{role.name}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{role.desc}</p>
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-300 group-hover:bg-gold/20 border border-gold/30">
                              <ChevronRight size={16} className="text-gold-ink" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Login form */
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 p-6 rounded-2xl border border-gold/10 bg-purple-deep/20 backdrop-blur-sm">
              <button onClick={() => setStep('role')} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold-ink transition-colors mb-3">
                <ArrowLeft size={16} /> Elegir otro rol
              </button>
              <div className="flex items-center gap-3 mb-2 p-3 rounded-xl bg-purple-mid/10 border border-gold/20">
                <img src={`/images/${selectedRole}.png`} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs text-gold/60 uppercase tracking-wider">Rol seleccionado</p>
                  <p className="text-sm font-bold text-white">{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</p>
                </div>
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] text-white mb-1">
                Bienvenido de <span className="text-gold-ink">vuelta</span>
              </h1>
              <p className="text-sm text-text-muted mb-4">Inicia sesión para acceder a tu cuenta.</p>

              <form onSubmit={e => { e.preventDefault(); login(email, selectedRole as import('@/hooks/auth/useAuth').UserRole); navigate(selectedRole === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${selectedRole}`) }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="email" type="email" placeholder="correo@escuelaing.edu.co" value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-purple-deep/40 border-gold/20 text-white placeholder:text-gold/40 rounded-xl pl-10 h-12 focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contraseña</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      className="bg-purple-deep/40 border-gold/20 text-white placeholder:text-gold/40 rounded-xl pl-10 h-12 focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Checkbox id="remember" className="border-border data-[state=checked]:bg-purple-mid data-[state=checked]:border-purple-mid" /><Label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Recordarme</Label></div>
                  <Link to="/recuperar" className="text-sm text-gold-ink hover:text-gold-dark font-semibold transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
                <Button type="submit" className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all">Iniciar sesión</Button>
              </form>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" /><span className="text-xs text-gold/60 font-semibold uppercase">o</span><div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" /></div>

              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error('Google login failed')}
                  text="continue_with"
                  shape="pill"
                  size="large"
                  width="100%"
                  theme="outline"
                />
              ) : (
                <Button variant="outline" className="w-full rounded-full border-gold/30 bg-purple-deep/30 text-gold-ink hover:bg-gold/10 hover:text-white h-12 text-sm font-semibold gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continuar con Google
                </Button>
              )}
              <p className="text-center text-sm text-gold/60">¿No tienes cuenta? <Link to="/registro" className="text-gold-ink font-semibold hover:text-gold-dark transition-colors">Regístrate</Link></p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right — video + texto */}
      <div className="hidden lg:flex relative z-10 w-[62%] overflow-hidden bg-black">
        {/* Video de fondo — contenido completo sin recortes */}
        <video key={videoIndex} ref={videoRef} autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover">
          <source src={videos[videoIndex]} type="video/mp4" />
        </video>
        {/* Overlay gradiente para que el texto sea legible y transición con el panel izquierdo */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 20%, transparent 40%)',
          }}
        />
        
        {/* Controles de video */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
          <button onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all text-white">
            {isPlaying ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>}
          </button>
          <button onClick={nextVideo}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,4 15,12 5,20"/><rect x="17" y="4" width="2" height="16"/></svg>
          </button>
        </div>
        
        {/* Texto superpuesto — esquina inferior derecha */}
        <div className="absolute bottom-0 right-0 z-20 p-10 lg:p-14 text-right">
          <div className="max-w-[420px] ml-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-black shadow-lg shadow-gold/20">
                <img src="/assets/logo.png" alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-[1px]">
                TECH<span className="text-gold-ink">CUP</span>
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,52px)] uppercase leading-[.92] tracking-[.5px]">
              La pasión nos <span className="text-gold-ink">conecta</span>
            </h2>
            <p className="text-sm text-text-muted mt-4 leading-relaxed">
              Inicia sesión y vive la emoción del torneo universitario más importante de Ingeniería de Sistemas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
