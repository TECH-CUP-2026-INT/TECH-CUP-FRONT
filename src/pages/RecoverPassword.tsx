import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, Lock, CheckCircle, KeyRound } from 'lucide-react'

type Step = 'email' | 'otp' | 'newpass' | 'done'

export default function RecoverPassword() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] relative z-10">
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-purple-black"><img src="/assets/logo.png" alt="" className="w-full h-full object-cover" /></div>
          <span className="font-[family-name:var(--font-display)] font-bold text-lg">TECH<span className="text-gold">CUP</span></span>
        </Link>

        <div className="bg-surface border border-border/60 rounded-2xl p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-full bg-purple-mid/20 border border-purple-mid/30 flex items-center justify-center mx-auto mb-6">
                  <Lock size={24} className="text-gold" />
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] text-center mb-2">¿Olvidaste tu <span className="text-gold">contraseña?</span></h1>
                <p className="text-sm text-text-muted text-center mb-8">Ingresá tu correo y te enviaremos un código de verificación.</p>
                <div className="space-y-2 mb-6">
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@escuelaing.edu.co" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl pl-10 h-12 focus-visible:border-gold" />
                  </div>
                </div>
                <Button onClick={() => setStep('otp')} disabled={!email} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 disabled:opacity-40">Enviar código</Button>
                <div className="text-center mt-6">
                  <Link to="/login" className="text-sm text-text-muted hover:text-gold inline-flex items-center gap-1.5"><ArrowLeft size={14} /> Volver al inicio de sesión</Link>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-purple-mid/20 border border-purple-mid/30 flex items-center justify-center mx-auto mb-6">
                  <KeyRound size={24} className="text-gold" />
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-2">Verificá tu <span className="text-gold">correo</span></h1>
                <p className="text-sm text-text-muted mb-6">Ingresá el código de 6 dígitos enviado a {email.replace(/(.{3})(.*)(?=@)/, '$1***')}</p>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((d, i) => (
                    <input key={i} type="text" maxLength={1} value={d} onChange={e => { const n = [...otp]; n[i] = e.target.value; setOtp(n); if (e.target.value && i < 5) document.getElementById(`ro-${i+1}`)?.focus() }} id={`ro-${i}`}
                      className="w-12 h-14 bg-black border border-border text-white text-center text-xl font-bold rounded-xl outline-none focus:border-gold focus:ring-1 focus:ring-gold" autoFocus={i===0} />
                  ))}
                </div>
                <p className="text-xs text-text-muted mb-6">¿No recibiste el código? <button className="text-gold font-semibold hover:underline">Reenviar</button></p>
                <Button onClick={() => setStep('newpass')} disabled={otp.some(d => !d)} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 disabled:opacity-40">Verificar código</Button>
              </motion.div>
            )}

            {step === 'newpass' && (
              <motion.div key="newpass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-full bg-purple-mid/20 border border-purple-mid/30 flex items-center justify-center mx-auto mb-6">
                  <Lock size={24} className="text-gold" />
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] text-center mb-2">Nueva <span className="text-gold">contraseña</span></h1>
                <p className="text-sm text-text-muted text-center mb-8">Elegí una contraseña segura que no hayas usado antes.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Nueva contraseña</Label>
                    <Input type="password" placeholder="Mínimo 8 caracteres" className="bg-black border-border text-white rounded-xl h-12 mt-1.5 focus-visible:border-gold" />
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Confirmar contraseña</Label>
                    <Input type="password" placeholder="Repetí tu contraseña" className="bg-black border-border text-white rounded-xl h-12 mt-1.5 focus-visible:border-gold" />
                  </div>
                </div>
                <Button onClick={() => setStep('done')} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12">Restablecer contraseña</Button>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-2">Contraseña <span className="text-green-400">restablecida</span></h1>
                <p className="text-sm text-text-muted mb-8">Tu contraseña se actualizó correctamente. Ya podés iniciar sesión.</p>
                <Link to="/login"><Button className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12">Iniciar sesión</Button></Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
