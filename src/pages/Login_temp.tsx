import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { Checkbox } from '@/components/common/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'

const roles = [
  { id: 'capitan', name: 'Capit+ín', desc: 'Alineaci+¦n y representaci+¦n del equipo.', color: '#e8bd5f', img: '/images/capitan.png' },
  { id: 'jugador', name: 'Jugador', desc: 'Equipo, partidos y estad+¡sticas.', color: '#7f77dd', img: '/images/jugador.png' },
  { id: 'arbitro', name: '+ürbitro', desc: 'Marcador, tiempo y sanciones en vivo.', color: '#e24b4a', img: '/images/arbitro.png' },
  { id: 'admin', name: 'Admin', desc: 'Equipos, calendario y configuraci+¦n.', color: '#3fc8ff', img: '/images/admin.png' },
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
                <p className="text-sm text-text-muted mt-2">Eleg+¡ tu rol para continuar</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {roles.map(role => (
                  <button key={role.id} onClick={() => { setSelectedRole(role.id); setStep('login') }}
                    onMouseEnter={() => setHoveredRole(role.id)} onMouseLeave={() => setHoveredRole(null)}
                    className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300
                      border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20
                      hover:scale-[1.02] cursor-pointer">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 100%, ${role.color}22, transparent 70%)` }} />
                    <div className="relative z-10">
                      <img src={role.img} alt="" className="w-full h-28 object-contain mb-2" draggable={false} />
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">Rol</span>
                        <span className="w-2 h-2 rounded-full border border-white/40" style={{ background: role.color, boxShadow: `0 0 6px ${role.color}` }} />
                      </div>
                      <p className="font-bold text-white text-sm mt-1">{role.name}</p>
                      <p className="text-[11px] text-white/50 mt-0.5">{role.desc}</p>
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
              <p className="text-sm text-text-muted mb-4">Inici+í sesi+¦n para acceder a tu cuenta.</p>

              <form onSubmit={e => { e.preventDefault(); login(email, 'jugador'); navigate('/dashboard') }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electr+¦nico</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="email" type="email" placeholder="correo@escuelaing.edu.co" value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contrase+¦a</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="GÇóGÇóGÇóGÇóGÇóGÇóGÇóGÇó"
                      className="bg-black/30 border-border/60 text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-purple-mid" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Checkbox id="remember" className="border-border data-[state=checked]:bg-purple-mid data-[state=checked]:border-purple-mid" /><Label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Recordarme</Label></div>
                  <Link to="/recuperar" className="text-sm text-gold hover:text-gold-dark font-semibold transition-colors">-+Olvidaste tu contrase+¦a?</Link>
                </div>
                <Button type="submit" className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all">Iniciar sesi+¦n</Button>
              </form>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border/40" /><span className="text-xs text-text-faint font-semibold uppercase">o</span><div className="flex-1 h-px bg-border/40" /></div>

              <Button variant="outline" className="w-full rounded-full border-border/60 bg-white/5 text-gray-light hover:bg-white/10 hover:text-white h-12 text-sm font-semibold gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuar con Google
              </Button>
              <p className="text-center text-sm text-text-muted">-+No ten+¬s cuenta? <Link to="/registro" className="text-gold font-semibold hover:text-gold-dark transition-colors">Registrate</Link></p>
              <div className="rounded-2xl bg-white/5 border border-white/10 text-center p-4"><p className="text-sm text-text-muted">-+Eres +írbitro? <Link to="/login/arbitro" className="text-gold font-semibold hover:text-gold-dark transition-colors">Inicia sesi+¦n aqu+¡</Link></p></div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right GÇö Preview */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(200,133,26,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(109,40,217,0.08) 0%, transparent 50%), #0A0614' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative text-center max-w-[400px]">
          <div className="relative w-full aspect-[3/4] max-w-[320px] mx-auto">
            <div className="absolute inset-0 bg-purple-mid/20 blur-[80px] rounded-full animate-pulse" />
            <img src={activeRole?.img || '/images/capitan.png'} alt="" className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mt-4 text-white">{activeRole?.name || 'Capit+ín'}</h2>
          <p className="text-sm text-text-muted mt-1 max-w-[300px] mx-auto">{activeRole?.desc || ''}</p>
        </motion.div>
      </div>
    </div>
  )
}
