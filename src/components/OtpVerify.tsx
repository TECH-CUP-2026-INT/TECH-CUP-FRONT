import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const OTP_LENGTH = 6

interface OtpVerifyProps {
  email: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  isLoading?: boolean
  error?: string | null
}

export default function OtpVerify({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  error = null,
}: OtpVerifyProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [resending, setResending] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const maskedEmail = email.replace(/(.{3}).+(?=@)/, '$1***')

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus al siguiente input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const newOtp = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[nextIndex]?.focus()
  }

  const handleSubmit = () => {
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) return
    onVerify(code)
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await onResend()
    } finally {
      setResending(false)
    }
  }

  const isComplete = otp.every((d) => d !== '')

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 md:p-10 rounded-2xl border border-border/60"
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
      }}
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted font-semibold">Paso 4 de 5</span>
          <span className="text-xs text-gold font-semibold">Verificación</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                i < 3 ? 'bg-gold' : i === 3 ? 'bg-purple-mid' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <span className="text-4xl mb-4 block">🔒</span>
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">
          Verificá tu correo
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Ingresá el código de 6 dígitos enviado a <strong className="text-gold">{maskedEmail}</strong>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el }}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 bg-black border border-border text-white text-center text-xl font-bold rounded-xl outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-4">{error}</p>
        )}

        <p className="text-xs text-text-muted mb-6">
          ¿No recibiste el código?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-gold font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? 'Reenviando...' : 'Reenviar'}
          </button>
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1"
          >
            <ArrowLeft size={16} /> Anterior
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isLoading}
            className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 flex-1"
          >
            {isLoading ? 'Verificando...' : 'Verificar'}{' '}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
