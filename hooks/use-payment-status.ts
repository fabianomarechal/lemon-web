import { useCallback, useEffect, useState } from 'react'

interface PaymentStatus {
  id: string
  status: string
  status_detail: string
  external_reference: string
  transaction_amount: number
  currency_id: string
  payment_method_id: string
  payment_type_id: string
  installments: number
  date_created: string
  date_approved?: string
  date_last_updated: string
  payer: {
    email?: string
    identification?: {
      type: string
      number: string
    }
  }
  card?: {
    last_four_digits: string
    first_six_digits: string
  }
  firebase_data?: Record<string, unknown>
}

interface UsePaymentStatusReturn {
  paymentStatus: PaymentStatus | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePaymentStatus(paymentId: string | null): UsePaymentStatusReturn {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentStatus = useCallback(async () => {
    if (!paymentId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/mercadopago/payment/${paymentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao consultar status do pagamento')
      }

      const result: PaymentStatus = await response.json()
      setPaymentStatus(result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao consultar status do pagamento:', err)
    } finally {
      setLoading(false)
    }
  }, [paymentId])

  useEffect(() => {
    fetchPaymentStatus()
  }, [fetchPaymentStatus])

  return {
    paymentStatus,
    loading,
    error,
    refetch: fetchPaymentStatus
  }
}

// Hook para polling automático do status
export function usePaymentStatusPolling(
  paymentId: string | null,
  intervalMs: number = 5000,
  maxAttempts: number = 20
): UsePaymentStatusReturn {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [shouldStop, setShouldStop] = useState(false)

  const fetchPaymentStatus = useCallback(async () => {
    if (!paymentId || attempts >= maxAttempts || shouldStop) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/mercadopago/payment/${paymentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao consultar status do pagamento')
      }

      const result: PaymentStatus = await response.json()
      setPaymentStatus(result)
      setAttempts(prev => prev + 1)

      // Parar polling se pagamento foi finalizado
      if (['aprovado', 'rejeitado', 'cancelado', 'reembolsado'].includes(result.status)) {
        setShouldStop(true)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao consultar status do pagamento:', err)
      setAttempts(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }, [paymentId, attempts, maxAttempts, shouldStop])

  useEffect(() => {
    if (!paymentId || shouldStop) return

    fetchPaymentStatus()

    const interval = setInterval(fetchPaymentStatus, intervalMs)
    return () => clearInterval(interval)
  }, [fetchPaymentStatus, paymentId, shouldStop, intervalMs])

  return {
    paymentStatus,
    loading,
    error,
    refetch: fetchPaymentStatus
  }
}