import { apiGet, apiPost } from './client'
import type {
  CreatePaymentOrderRequest,
  PaymentOrderResponse,
  PseTransactionRequest,
  PseTransactionResponse,
  PaymentStatusResponse,
} from '@/types/pagos'

const PAYMENTS_PATH = '/api/v1/Payment'

export function createPaymentOrder(data: CreatePaymentOrderRequest) {
  return apiPost<PaymentOrderResponse>(`${PAYMENTS_PATH}/payment-orders`, data)
}

export function submitPseTransaction(enrollmentId: string, data: PseTransactionRequest) {
  return apiPost<PseTransactionResponse>(`${PAYMENTS_PATH}/payment-orders/${enrollmentId}/pse`, data)
}

export function getPaymentOrderStatus(enrollmentId: string) {
  return apiGet<PaymentStatusResponse>(`${PAYMENTS_PATH}/payment-orders/${enrollmentId}`)
}
