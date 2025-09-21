import { PreferenciaMercadoPago } from '@/lib/types/carrinho'
import { useState } from 'react'

interface CreatePreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
  external_reference: string
  expires_at: string
  total: number
  items_count: number
}

interface UseCreatePreferenceReturn {
  createPreference: (data: PreferenciaMercadoPago) => Promise<CreatePreferenceResponse | null>
  loading: boolean
  error: string | null
}

export function useCreatePreference(): UseCreatePreferenceReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPreference = async (
    data: PreferenciaMercadoPago
  ): Promise<CreatePreferenceResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar preferência de pagamento')
      }

      const result: CreatePreferenceResponse = await response.json()
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao criar preferência:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createPreference,
    loading,
    error
  }
}