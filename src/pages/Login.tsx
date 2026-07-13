import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const roles = [
  { id: 'capitan', name: 'Capitán', desc: 'Alineación y representación del equipo.', color: '#e8bd5f', img: '/images/capitan.png' },
  { id: 'jugador', name: 'Jugador', desc: 'Equipo, partidos y estadísticas.', color: '#7f77dd', img: '/images/jugador.png' },
  { id: 'arbitro', name: 'Árbitro', desc: 'Marcador, tiempo y sanciones en vivo.', color: '#e24b4a', img: '/images/arbitro.png' },
  { id: 'admin', name: 'Admin', desc: 'Equipos, calendario y configuración.', color: '#3fc8ff', img: '/images/admin.png' },
]

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'role' | 'login'>('role')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuth()
  const activeRole = roles.find(r => r.id === (hoveredRole || selectedRole))

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left */}
      <div className="w-full lg:w-[38%] relative flex items-center justify-center p-8 lg:p-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 55% at 20% 15%, rgba(212,175,55,0.22) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 80% 85%, rgba(147,51,234,0.13) 0%, transparent 55%)' }} />
        <div className="relative w-full max-w-[460px]">
          {step === 'role' ? (
            /* Step 1: Role Selector */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[.5px] text-white">
                  TECH<span className="text-gold">CUP</span>
                </h1>
                <p className="text-sm text-text-muted mt-2">Elegí tu rol para continuar</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {roles.map((role, idx) => (
                  <button key={role.id} onClick={() => { setSelectedRole(role.id); setStep('login') }}
                    onMouseEnter={() => setHoveredRole(role.id)} onMouseLeave={() => setHoveredRole(null)}
                    className="group relative flex-1 overflow-hidden rounded-2xl cursor-pointer border-none p-0"
                    style={{ aspectRatio: '1200/669', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {/* Light glow */}
                    <span className="absolute left-1/2 bottom-0 w-[130%] h-[55%] rounded-full pointer-events-none"
                      style={{ transform: 'translateX(-50%)', filter: 'blur(30px)', opacity: 0, background: `radial-gradient(ellipse, ${role.color}, transparent 70%)`, transition: 'opacity .45s ease' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.55'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'} />
                    {/* Spot overlay */}
                    <span className="absolute inset-0 pointer-events-none"
                      style={{ opacity: 0, transition: 'opacity .45s ease', background: `linear-gradient(135deg, ${role.color}11, transparent 60%)` }} />
                    {/* Content */}
                    <div className="relative inset-0 flex flex-col justify-between p-3 pointer-events-none" style={{ position: 'absolute', inset: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">{role.tag}</span>
                        <span className="w-1.5 h-1.5 rounded-full border border-white/40 flex-shrink-0" style={{ background: role.color, boxShadow: `0 0 6px ${role.color}` }} />
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(14px)', borderRadius: '10px', padding: '8px 10px', transform: 'translateY(8px)', opacity: 0, transition: 'transform .4s ease, opacity .4s ease' }}
                        className="group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="font-bold text-white text-xs uppercase tracking-[.02em] m-0">{role.name}</p>
                        <p className="text-[9px] text-white/60 leading-relaxed m-0">{role.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Login form */
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <button onClick={() => setStep('role')} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors mb-3">
                <ArrowLeft size={16} /> Cambiar rol
              </button>
              <div className="flex items-center gap-3 mb-2 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <img src={roles.find(r => r.id === selectedRole)?.img || ''} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Rol seleccionado</p>
                  <p className="text-sm font-bold text-white">{roles.find(r => r.id === selectedRole)?.name}</p>
                </div>
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] text-white mb-1">
                Bienvenido de <span className="text-gold">vuelta</span>
              </h1>
              <p className="text-sm text-text-muted mb-4">Iniciá sesión para acceder a tu cuenta.</p>

              <form onSubmit={e => { e.preventDefault(); login(email, ''); navigate('/dashboard') }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="email" type="email" placeholder="correo@escuelaing.edu.co" value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contraseña</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Checkbox id="remember" className="border-border data-[state=checked]:bg-purple-mid data-[state=checked]:border-purple-mid" /><Label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Recordarme</Label></div>
                  <Link to="/recuperar" className="text-sm text-gold hover:text-gold-dark font-semibold transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
                <Button type="submit" className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all">Iniciar sesión</Button>
              </form>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border/40" /><span className="text-xs text-text-faint font-semibold uppercase">o</span><div className="flex-1 h-px bg-border/40" /></div>

              <Button variant="outline" className="w-full rounded-full border-border/60 bg-white/5 text-gray-light hover:bg-white/10 hover:text-white h-12 text-sm font-semibold gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuar con Google
              </Button>
              <p className="text-center text-sm text-text-muted">¿No tenés cuenta? <Link to="/registro" className="text-gold font-semibold hover:text-gold-dark transition-colors">Registrate</Link></p>
              <div className="rounded-2xl bg-white/5 border border-white/10 text-center p-4"><p className="text-sm text-text-muted">¿Eres árbitro? <Link to="/login/arbitro" className="text-gold font-semibold hover:text-gold-dark transition-colors">Inicia sesión aquí</Link></p></div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right — Preview */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(200,133,26,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(109,40,217,0.08) 0%, transparent 50%), #0A0614' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative text-center max-w-[400px]">
          <div className="relative w-full aspect-[3/4] max-w-[320px] mx-auto">
            <div className="absolute inset-0 bg-purple-mid/20 blur-[80px] rounded-full animate-pulse" />
            <img src={activeRole?.img || '/images/capitan.png'} alt="" className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mt-4 text-white">{activeRole?.name || 'Capitán'}</h2>
          <p className="text-sm text-text-muted mt-1 max-w-[300px] mx-auto">{activeRole?.desc || ''}</p>
        </motion.div>
      </div>
    </div>
  )
}
