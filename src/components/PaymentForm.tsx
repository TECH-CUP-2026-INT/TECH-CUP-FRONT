import { useState } from 'react'
import { Button } from '@/components/common/button'
import { DollarSign, CreditCard, ArrowRight, XCircle, ExternalLink } from 'lucide-react'
import { submitPseTransaction } from '@/api/pagos'
import type { PaymentOrderResponse, PseTransactionResponse } from '@/types/pagos'

const BANCOS = [
  { id: '1022', name: 'Bancolombia' },
  { id: '1052', name: 'Banco de Bogota' },
  { id: '1007', name: 'Banco de Occidente' },
  { id: '1013', name: 'Davivienda' },
  { id: '1032', name: 'Banco Caja Social' },
  { id: '1066', name: 'Banco Falabella' },
  { id: '1009', name: 'Banco Pichincha' },
  { id: '1058', name: 'Banco Popular' },
]

interface PaymentFormProps {
  amount: number
  order: PaymentOrderResponse
  onSuccess: (result: PseTransactionResponse) => void
  onError: (error: string) => void
  onBack: () => void
}

export function PaymentForm({ amount, order, onSuccess, onError, onBack }: PaymentFormProps) {
  const [processing, setProcessing] = useState(false)
  const [form, setForm] = useState({
    payerName: '',
    payerEmail: '',
    payerDocType: 'CC',
    payerDocNumber: '',
    payerPhone: '',
    financialInstitution: '1022',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    try {
      const result = await submitPseTransaction(order.paymentOrderId, {
        payerName: form.payerName,
        payerEmail: form.payerEmail,
        payerDocType: form.payerDocType,
        payerDocNumber: form.payerDocNumber,
        payerPhone: form.payerPhone,
        financialInstitution: form.financialInstitution,
      })
      onSuccess(result)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-start gap-3 mb-6">
        <DollarSign size={18} className="text-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold">Valor de inscripcion: <span className="text-gold">${amount.toLocaleString()}</span></p>
          <p className="text-xs text-text-muted">Orden #{order.paymentOrderId} — Pago PSE via Mercado Pago</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-text-muted block mb-1">Nombre completo del pagador</label>
          <input name="payerName" value={form.payerName} onChange={handleChange} required
            className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none"
            placeholder="Ej: Juan Perez" />
        </div>

        <div>
          <label className="text-xs text-text-muted block mb-1">Correo electronico</label>
          <input name="payerEmail" type="email" value={form.payerEmail} onChange={handleChange} required
            className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none"
            placeholder="juan@ejemplo.com" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-1">Tipo de documento</label>
            <select name="payerDocType" value={form.payerDocType} onChange={handleChange}
              className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none">
              <option value="CC">Cedula</option>
              <option value="CE">Cedula de extranjeria</option>
              <option value="NIT">NIT</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">Numero de documento</label>
            <input name="payerDocNumber" value={form.payerDocNumber} onChange={handleChange} required
              className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none"
              placeholder="1234567890" />
          </div>
        </div>

        <div>
          <label className="text-xs text-text-muted block mb-1">Telefono</label>
          <input name="payerPhone" value={form.payerPhone} onChange={handleChange} required
            className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none"
            placeholder="3001234567" />
        </div>

        <div>
          <label className="text-xs text-text-muted block mb-1">Banco (PSE)</label>
          <select name="financialInstitution" value={form.financialInstitution} onChange={handleChange}
            className="w-full bg-black/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none">
            {BANCOS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onBack}
            className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={processing}
            className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1 disabled:opacity-40">
            {processing ? 'Procesando...' : 'Pagar con PSE'} <CreditCard size={16} />
          </Button>
        </div>
      </form>
    </div>
  )
}
