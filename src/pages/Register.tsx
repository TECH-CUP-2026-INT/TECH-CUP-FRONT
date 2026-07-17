import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Upload, Camera } from 'lucide-react'

type UserType = 'estudiante' | 'graduado' | 'profesor' | 'administrativo' | 'familiar'
type Position = 'portero' | 'defensa' | 'volante' | 'delantero'

const steps = [
  { id: 1, label: 'Tipo de usuario' },
  { id: 2, label: 'Datos personales' },
  { id: 3, label: 'Credenciales' },
  { id: 4, label: 'Verificación' },
  { id: 5, label: 'Perfil deportivo' },
]

const userTypes: { id: UserType; label: string; icon: string; desc: string }[] = [
  { id: 'estudiante', label: 'Estudiante', icon: '🎓', desc: 'Actualmente cursando' },
  { id: 'graduado', label: 'Graduado', icon: '👨‍🎓', desc: 'Egresado de la Escuela' },
  { id: 'profesor', label: 'Profesor', icon: '👨‍🏫', desc: 'Docente o catedrático' },
  { id: 'administrativo', label: 'Admin.', icon: '💼', desc: 'Personal administrativo' },
  { id: 'familiar', label: 'Familiar', icon: '👪', desc: 'Familiar de estudiante' },
]

const positions: { id: Position; label: string }[] = [
  { id: 'portero', label: 'Portero' },
  { id: 'defensa', label: 'Defensa' },
  { id: 'volante', label: 'Volante' },
  { id: 'delantero', label: 'Delantero' },
]

type Genero = 'masculino' | 'femenino' | 'otro' | 'no_especifica'

interface FormData {
  userType: UserType | null
  nombre: string
  email: string
  tipoDoc: string
  nroDoc: string
  fechaNac: string
  genero: Genero | ''
  telefono: string
  direccion: string
  programa: string
  semestre: string
  password: string
  confirmPassword: string
  posicion: string
  dorsal: string
  foto: File | null
  fotoPreview: string
}

const INITIAL_FORM: FormData = {
  userType: null,
  nombre: '',
  email: '',
  tipoDoc: 'Cédula',
  nroDoc: '',
  fechaNac: '',
  genero: '',
  telefono: '',
  direccion: '',
  programa: 'Ing. Sistemas',
  semestre: '1',
  password: '',
  confirmPassword: '',
  posicion: '',
  dorsal: '',
  foto: null,
  fotoPreview: '',
}

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showSuccess, setShowSuccess] = useState(false)

  const update = (field: keyof FormData, value: string | File | null) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      update('foto', file)
      const reader = new FileReader()
      reader.onload = () => update('fotoPreview', reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFinish = () => {
    console.log('Registro completado:', { ...form, foto: form.foto?.name })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-black/90 via-black/80 to-purple-black/90" />
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',backgroundSize:'30px 30px'}} />
      
      {/* Background orbs decorativos */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[560px] relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
            <img src="/assets/logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
            TECH<span className="text-gold-ink">CUP</span>
          </span>
        </Link>

        {/* Success overlay */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark mx-auto mb-6 flex items-center justify-center"
              >
                <Check size={36} className="text-[#1A1206]" />
              </motion.div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[.5px] mb-2">
                ¡Registro <span className="text-gold-ink">exitoso!</span>
              </h2>
              <p className="text-text-muted">Bienvenido a TechCup. Revisá tu correo para verificar tu cuenta.</p>
            </div>
          </motion.div>
        )}

        {/* Card */}
        <div className="bg-surface border border-border/60 rounded-2xl p-8 md:p-10">
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-semibold">Paso {step} de 5</span>
              <span className="text-xs text-gold-ink font-semibold">{steps[step - 1].label}</span>
            </div>
            <div className="flex gap-1.5">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                    s.id < step ? 'bg-gold' : s.id === step ? 'bg-purple-mid' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Tipo de usuario */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">¿Quién sos?</h2>
                <p className="text-sm text-text-muted mb-6">Seleccioná tu tipo de usuario para continuar.</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {userTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update('userType', t.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.userType === t.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border bg-black/50 hover:border-purple-mid/50'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{t.icon}</span>
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!form.userType}
                  className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 disabled:opacity-40"
                >
                  Siguiente <ArrowRight size={16} />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Datos personales */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">Datos personales</h2>
                <p className="text-sm text-text-muted mb-6">Completá tu información básica.</p>
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Nombre completo</Label>
                    <Input value={form.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Ej. Juan Camilo Rivera" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Correo electrónico</Label>
                    <Input value={form.email} onChange={e => update('email', e.target.value)} type="email" placeholder="correo@escuelaing.edu.co" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Tipo documento</Label>
                      <select value={form.tipoDoc} onChange={e => update('tipoDoc', e.target.value)} className="w-full bg-black border border-border text-white rounded-xl h-11 mt-1.5 px-3 text-sm outline-none focus:border-purple-mid">
                        <option>Cédula</option><option>Tarjeta identidad</option><option>Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Número</Label>
                      <Input value={form.nroDoc} onChange={e => update('nroDoc', e.target.value)} placeholder="1234567890" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Fecha de nacimiento</Label>
                      <Input value={form.fechaNac} onChange={e => update('fechaNac', e.target.value)} type="date" className="bg-black border-border text-white rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid [color-scheme:dark]" />
                    </div>
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Género</Label>
                      <select value={form.genero} onChange={e => update('genero', e.target.value)} className="w-full bg-black border border-border text-white rounded-xl h-11 mt-1.5 px-3 text-sm outline-none focus:border-purple-mid">
                        <option value="">Seleccionar...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                        <option value="no_especifica">Prefiero no decirlo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Teléfono</Label>
                    <Input value={form.telefono} onChange={e => update('telefono', e.target.value)} type="tel" placeholder="300 123 4567" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Dirección</Label>
                    <Input value={form.direccion} onChange={e => update('direccion', e.target.value)} placeholder="Cra 7 # 12-34, Bogotá" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Programa</Label>
                      <select value={form.programa} onChange={e => update('programa', e.target.value)} className="w-full bg-black border border-border text-white rounded-xl h-11 mt-1.5 px-3 text-sm outline-none focus:border-purple-mid">
                        <option>Ing. Sistemas</option><option>Ing. Industrial</option><option>Ing. Civil</option><option>Ing. Mecánica</option><option>Ing. Electrónica</option><option>Matemáticas</option><option>Administración</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Semestre</Label>
                      <select value={form.semestre} onChange={e => update('semestre', e.target.value)} className="w-full bg-black border border-border text-white rounded-xl h-11 mt-1.5 px-3 text-sm outline-none focus:border-purple-mid">
                        {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}° semestre</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                    <ChevronLeft size={16} /> Anterior
                  </Button>
                  <Button onClick={() => setStep(3)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 flex-1">
                    Siguiente <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Credenciales */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">Credenciales</h2>
                <p className="text-sm text-text-muted mb-6">Creá tu contraseña segura.</p>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Contraseña</Label>
                    <Input value={form.password} onChange={e => update('password', e.target.value)} type="password" placeholder="Mínimo 8 caracteres" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Confirmar contraseña</Label>
                    <Input value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} type="password" placeholder="Repetí tu contraseña" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className={`w-2 h-2 rounded-full ${form.password.length >= 8 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    Mínimo 8 caracteres · 1 mayúscula · 1 número
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-400">Las contraseñas no coinciden</p>
                  )}
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                    <ChevronLeft size={16} /> Anterior
                  </Button>
                  <Button onClick={() => setStep(4)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 flex-1">
                    Siguiente <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: OTP */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <span className="text-4xl mb-4 block">🔒</span>
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">Verificá tu correo</h2>
                <p className="text-sm text-text-muted mb-6">Ingresá el código de 6 dígitos enviado a juan***@escuelaing.edu.co</p>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 bg-black border border-border text-white text-center text-xl font-bold rounded-xl outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted mb-6">
                  ¿No recibiste el código?{' '}
                  <button className="text-gold-ink font-semibold hover:underline">Reenviar</button>
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                    <ChevronLeft size={16} /> Anterior
                  </Button>
                  <Button onClick={() => setStep(5)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 flex-1">
                    Verificar <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Perfil deportivo */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">Perfil deportivo</h2>
                <p className="text-sm text-text-muted mb-6">Contanos sobre tu experiencia en la cancha.</p>
                <div className="space-y-5">
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Posición de juego</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      {positions.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => update('posicion', p.id)}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                            form.posicion === p.id
                              ? 'border-gold bg-gold/10 text-gold-ink'
                              : 'border-border bg-black/50 hover:border-purple-mid/50 hover:bg-purple-mid/10'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Número dorsal</Label>
                    <Input value={form.dorsal} onChange={e => update('dorsal', e.target.value)} type="number" min={1} max={99} placeholder="Ej. 10" className="bg-black border-border text-white placeholder:text-text-faint rounded-xl h-11 mt-1.5 focus-visible:border-purple-mid" />
                  </div>
                  <div>
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Foto de perfil</Label>
                    <label className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple-mid/50 transition-all cursor-pointer block">
                      {form.fotoPreview ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={form.fotoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover ring-2 ring-gold/40" />
                          <p className="text-xs text-gold-ink font-semibold">{form.foto?.name}</p>
                        </div>
                      ) : (
                        <>
                          <Camera size={32} className="mx-auto text-text-faint mb-2" />
                          <p className="text-sm text-text-muted">Click para subir tu foto</p>
                          <p className="text-xs text-text-faint mt-1">PNG, JPG · Max 5MB</p>
                        </>
                      )}
                      <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFoto} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep(4)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
                    <ChevronLeft size={16} /> Anterior
                  </Button>
                  <Button onClick={handleFinish} disabled={!form.posicion} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 flex-1 disabled:opacity-40">
                    Finalizar <Check size={16} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Link volver */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-text-muted hover:text-gold-ink transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
