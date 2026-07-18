import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { Checkbox } from '@/components/common/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Users, ShieldCheck, UserCog, ChevronRight, UserRoundCheck } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'
import OtpVerify from '@/components/OtpVerify'
import { login as apiLogin, validateOtp, resendOtp } from '@/services/auth'
import { setJwt } from '@/api/client'
import { DEMO_USERS, type DemoUser } from '@/utils/demoUsers'

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
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'role' | 'login' | 'otp'>('role')
  const [selectedRole, setSelectedRole] = useState<string>('jugador')
  const [userId, setUserId] = useState<string>('')
  const [otpCode, setOtpCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoIndex, setVideoIndex] = useState(0)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const quickDemoLogin = (demoUser: DemoUser) => {
    setSelectedRole(demoUser.role === 'arbitro' ? 'arbitro' : demoUser.role === 'organizador' ? 'administrador' : 'jugador')
    setEmail(demoUser.email)
    setJwt('mock-jwt-' + Date.now())
    login(demoUser.email, demoUser.role, '', demoUser.name)
    if (demoUser.isCaptain) {
      localStorage.setItem('techcup_user_captain', '1')
    }
    navigate(demoUser.role === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${demoUser.role}`)
  }

  const doLocalLogin = (userEmail: string, displayName?: string) => {
    const frontRole = selectedRole === 'administrador' ? 'organizador' : selectedRole
    setJwt('mock-jwt-' + Date.now())
    login(userEmail, frontRole as import('@/hooks/auth/useAuth').UserRole, '', displayName ?? userEmail)
    navigate(selectedRole === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${frontRole}`)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setAuthError(null)
    try {
      const res = await apiLogin(email, password)
      setUserId(res.userId)
      setOtpCode(res.otpCode || String(Math.floor(100000 + Math.random() * 900000)))
      setStep('otp')
    } catch {
      // Backend no disponible — login local directo
      doLocalLogin(email)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (otpCode: string) => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const res = await validateOtp(userId, otpCode)
      setJwt(res.token, true)
      const frontRole = selectedRole === 'administrador' ? 'organizador' : selectedRole
      const userEmail = res.user?.email || email || `${selectedRole}@techcup.com`
      const userName = res.user?.fullName || userEmail
      login(userEmail, frontRole as import('@/hooks/auth/useAuth').UserRole, '', userName)
      navigate(selectedRole === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${frontRole}`)
    } catch (err) {
      // Si la API no responde, intentar login local
      if (!userId) return setAuthError('Error de conexión')
      const frontRole = selectedRole === 'administrador' ? 'organizador' : selectedRole
      setJwt('mock-jwt-' + Date.now())
      login(email || `${selectedRole}@techcup.com`, frontRole as import('@/hooks/auth/useAuth').UserRole)
      navigate(selectedRole === 'arbitro' ? '/arbitro/dashboard' : `/dashboard/${frontRole}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpResend = async () => {
    if (!userId) return
    try {
      await resendOtp(userId)
    } catch {
      // Silencioso
    }
  }

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return
    setIsLoading(true)
    setAuthError(null)
    try {
      // Decodificar el JWT de Google para obtener el email
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      const googleEmail = payload.email || `${selectedRole}@techcup.com`
      if (!email) setEmail(googleEmail)

      const { loginGoogle } = await import('@/services/auth')
      const res = await loginGoogle(response.credential)
      setUserId(res.userId)
      setOtpCode(res.otpCode || String(Math.floor(100000 + Math.random() * 900000)))
      setStep('otp')
    } catch {
      doLocalLogin(email || `${selectedRole}@techcup.com`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleContinue = (role: string) => {
    setSelectedRole(role)
    setStep('login')
    setVideoIndex(role === 'arbitro' ? 1 : 0)
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

  const renderRoleCard = (role: typeof roleCards[number], i: number) => {
    const Icon = role.icon
    return (
      <motion.button
        key={role.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        onClick={() => handleRoleContinue(role.id)}
        className="group relative flex items-stretch gap-0 rounded-[10px] overflow-hidden border border-gold/20 bg-[#F3EEFF]/70 dark:bg-black/60 hover:border-gold/50 transition-all duration-300 text-left w-full cursor-pointer"
      >
        {/* Imagen lateral */}
        <div className="relative w-[120px] min-h-[140px] flex-shrink-0 overflow-hidden bg-[#F3EEFF] dark:bg-black/80 flex items-center justify-center max-sm:hidden">
          <img src={role.img} alt="" className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 hidden dark:block dark:bg-[linear-gradient(90deg,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
        </div>
        {/* Contenido */}
        <div className="flex-1 p-4 flex flex-col justify-center relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), transparent)' }} />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={16} className="text-gold" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg normal-case tracking-[.3px] text-gold mb-1">{role.name}</h3>
              <p className="text-xs normal-case text-text-muted leading-relaxed">{role.desc}</p>
            </div>
              <div className="flex-shrink-0 mt-1">
                <div className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-300 group-hover:bg-gold/20 border border-gold/30">
                  <ChevronRight size={16} className="text-gold" />
              </div>
            </div>
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F5FA] dark:bg-black flex relative overflow-x-auto">

      {/* Izquierda — imagen de roles, solo en el paso de selección de rol */}
      {step === 'role' && (
        <div className="block relative w-[58%] min-w-[380px] overflow-hidden bg-[#F6F5FA] dark:bg-black">
          <img src="/images/bg-roles.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '63% center' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.5)]" />
        </div>
      )}

      {/* Panel negro-dorado */}
      <div className={`relative z-10 flex items-center justify-center p-8 lg:p-16 overflow-hidden min-w-[320px] ${step === 'role' ? 'w-[42%]' : 'w-1/2'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F3EEFF] to-white dark:from-black dark:via-[#1a1a1a] dark:to-black" />
        {/* Aurora dorado + violeta — solo en modo oscuro */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block dark:opacity-60 dark:bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none hidden dark:block dark:opacity-40 dark:bg-[radial-gradient(ellipse_at_70%_60%,rgba(245,166,35,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 hidden dark:block dark:bg-black/70" />
        {/* Brillo dorado sutil */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/5 blur-[60px] hidden dark:block" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gold/10 blur-[50px] hidden dark:block" />
        <div className={`relative w-full transition-all duration-300 ${step === 'role' ? 'max-w-[560px]' : 'max-w-[460px]'}`}>
          {/* Logo + back to home button */}
          <div className="flex items-center gap-3 mb-10">
            <img src="/assets/logo.png" alt="TechCup" className="w-9 h-9 rounded-lg object-cover shadow-lg shadow-gold/20" />
            <Link to="/" aria-label="Volver al inicio" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-black/60 border border-gold/30 text-gold-ink hover:bg-gold/20 hover:text-white transition-all duration-300 backdrop-blur-sm">
              <ArrowLeft size={16} />
            </Link>
          </div>

          {step === 'role' ? (
            /* Step 1: Role Selector — recuadro negro-dorado */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[12px] border border-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.08)] relative overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-sm">
              <div className="mb-6">
                <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] text-gray-light mb-2">
                  <span className="text-gold">Selecciona tu</span> <span className="text-gold">rol</span>
                </h1>
                <p className="text-sm text-text-muted">Selecciona cómo quieres ingresar al sistema.</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Demo quick-login */}
                <button onClick={() => setShowDemoUsers(!showDemoUsers)} className="w-full flex items-center justify-between p-3 rounded-xl bg-gold/10 border border-gold/20 hover:bg-gold/15 transition-all">
                  <span className="text-sm text-gold font-semibold flex items-center gap-2"><UserRoundCheck size={16} /> Demo rápido (11 usuarios)</span>
                  <ChevronRight size={16} className={`text-gold transition-transform ${showDemoUsers ? 'rotate-90' : ''}`} />
                </button>
                {showDemoUsers && (
                  <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto p-1">
                    {DEMO_USERS.map(u => (
                      <button key={u.email} onClick={() => quickDemoLogin(u)}
                        className="text-left px-3 py-2 rounded-lg hover:bg-gold/10 transition-all flex items-center justify-between group">
                        <div>
                          <p className="text-sm text-gray-light font-medium">{u.name}</p>
                          <p className="text-[11px] text-text-muted">{u.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'organizador' ? 'bg-purple-mid/20 text-purple-mid border border-purple-mid/30' :
                          u.role === 'arbitro' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {u.role}{u.isCaptain ? ' 👑' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {renderRoleCard(roleCards[0], 0)}
                {renderRoleCard(roleCards[1], 1)}
                {renderRoleCard(roleCards[2], 2)}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Login form */
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 p-6 rounded-2xl border border-gold/10 bg-white/60 dark:bg-purple-deep/20 backdrop-blur-sm">
              <button onClick={() => setStep('role')} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold-ink transition-colors mb-3">
                <ArrowLeft size={16} /> Elegir otro rol
              </button>
              <div className="flex items-center gap-3 mb-2 p-3 rounded-xl bg-purple-mid/10 border border-gold/20">
                <img src={roleCards.find(r => r.shortName.toLowerCase() === selectedRole)?.img} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs text-gold-ink uppercase tracking-wider">Rol seleccionado</p>
                  <p className="text-sm font-bold text-gray-light">{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</p>
                </div>
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] text-gray-light mb-1">
                Bienvenido de <span className="text-gold-ink">vuelta</span>
              </h1>
              <p className="text-sm text-text-muted mb-4">Inicia sesión para acceder a tu cuenta.</p>

            {step === 'login' && (
              <>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="email" type="email" placeholder="correo@escuelaing.edu.co" value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-white/80 dark:bg-purple-deep/40 border-gold/20 text-gray-light placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contraseña</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                      className="bg-white/80 dark:bg-purple-deep/40 border-gold/20 text-gray-light placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-gold-ink transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-xs text-red-400 text-center">{authError}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Checkbox id="remember" className="border-border data-[state=checked]:bg-purple-mid data-[state=checked]:border-purple-mid" /><Label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Recordarme</Label></div>
                  <Link to="/recuperar" className="text-sm text-gold-ink hover:text-gold-dark font-semibold transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all">{isLoading ? 'Enviando...' : 'Iniciar sesión'}</Button>
              </form>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" /><span className="text-xs text-gold-ink font-semibold uppercase">o</span><div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" /></div>

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
                <Button onClick={() => quickDemoLogin(DEMO_USERS[0])} variant="outline" className="w-full rounded-full border-gold/30 bg-white/60 dark:bg-purple-deep/30 text-gold-ink hover:bg-gold/10 hover:text-gray-light h-12 text-sm font-semibold gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continuar con Google
                </Button>
              )}
              <p className="text-center text-sm text-text-muted">¿No tienes cuenta? <Link to="/registro" className="text-gold-ink font-semibold hover:text-gold-dark transition-colors">Regístrate</Link></p>
              </>
            )}

            {step === 'otp' && (
              <OtpVerify
                email={email}
                onVerify={handleOtpVerify}
                onResend={handleOtpResend}
                onBack={() => { setStep('login'); setOtpCode(null) }}
                isLoading={isLoading}
                error={authError}
                otpCode={otpCode}
              />
            )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Right — video, solo en el paso de iniciar sesión */}
      {step === 'login' && (
        <div className="chrome-dark flex relative z-10 w-1/2 min-w-[320px] overflow-hidden bg-black">
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
