import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { Shield, ArrowLeft, Mail, Lock } from 'lucide-react'

export default function RefereeLogin() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-black/90 via-black/80 to-purple-black/90" />
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',backgroundSize:'30px 30px'}} />
      
      {/* Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
            <img src="/assets/logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
            TECH<span className="text-gold">CUP</span>
          </span>
        </Link>

        <div className="bg-surface border border-border/60 rounded-2xl p-8 md:p-10">
          {/* Ícono */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-purple-mid/20 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-gold" />
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-2 text-center">
            Acceso para <span className="text-gold">árbitros</span>
          </h1>
          
          <div className="bg-purple-mid/10 border border-purple-mid/30 rounded-xl p-4 mb-6 text-sm text-text-muted">
            Los árbitros son creados por el organizador. Si no tenés credenciales, contactalo.
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate('/arbitro/dashboard') }} className="space-y-4">
            <div>
              <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                <Input type="email" placeholder="arbitro@escuelaing.edu.co" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-gold" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contraseña</Label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                <Input type="password" placeholder="••••••••" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-gold" />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 text-sm shadow-lg shadow-gold/20">
              Iniciar sesión como árbitro
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-text-muted hover:text-gold transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
