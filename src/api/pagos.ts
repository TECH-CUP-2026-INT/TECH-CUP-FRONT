import type {
  CreatePaymentOrderRequest,
  PaymentOrderResponse,
  PseTransactionRequest,
  PseTransactionResponse,
  PaymentStatusResponse,
} from '@/types/pagos'

const PAYMENTS_API = import.meta.env.PROD ? 'http://20.12.84.133' : ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYMENTS_API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || error.error || `Error ${res.status}`)
  }

  return res.json()
}

export function createPaymentOrder(data: CreatePaymentOrderRequest) {
  return request<PaymentOrderResponse>('/payment-orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function submitPseTransaction(enrollmentId: string, data: PseTransactionRequest) {
  return request<PseTransactionResponse>(`/payment-orders/${enrollmentId}/pse`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getPaymentOrderStatus(enrollmentId: string) {
  return request<PaymentStatusResponse>(`/payment-orders/${enrollmentId}`)
}
