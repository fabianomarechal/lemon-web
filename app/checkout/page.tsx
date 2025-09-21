'use client'

import { CheckoutForm } from '@/components/checkout/checkout-form'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false)

  const handleSuccess = (preferenceId: string) => {
    console.log('Preferência criada com sucesso:', preferenceId)
    toast.success('Redirecionando para o pagamento...')
  }

  const handleError = (error: string) => {
    console.error('Erro no checkout:', error)
    toast.error(error || 'Erro ao processar pedido')
    setProcessing(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar Compra
            </h1>
            <p className="text-gray-600">
              Complete seus dados para finalizar o pedido
            </p>
          </div>

          {/* Checkout Form */}
          <CheckoutForm
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    </main>
  )
}