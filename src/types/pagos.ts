export interface CreatePaymentOrderRequest {
  enrollmentId: string
  teamId: string
  tournamentId: string
  amount: number
}

export interface PaymentOrderResponse {
  paymentOrderId: string
  status: string
  preferenceId: string
  expiresAt: string
}

export interface PseTransactionRequest {
  payerName: string
  payerEmail: string
  payerDocType: string
  payerDocNumber: string
  payerPhone: string
  financialInstitution: string
}

export interface PseTransactionResponse {
  status: string
  externalResourceUrl: string
}

export interface PaymentStatusResponse {
  status: string
  enrollmentId: string
}
