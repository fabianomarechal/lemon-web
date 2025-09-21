'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentStatusPolling } from '@/hooks/use-payment-status'
import { Clock, Home, Package, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PendentePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')
  
  // Usar polling para verificar mudanças de status
  const { paymentStatus, loading, refetch } = usePaymentStatusPolling(paymentId, 10000, 30) // 10s, 30 tentativas

  useEffect(() => {
    // Se o pagamento foi aprovado, redirecionar para sucesso
    if (paymentStatus?.status === 'aprovado') {
      router.push(`/pagamento/sucesso?payment_id=${paymentId}&external_reference=${externalReference}`)
    }
    
    // Se o pagamento foi rejeitado, redirecionar para erro
    if (['rejeitado', 'cancelado'].includes(paymentStatus?.status || '')) {
      router.push(`/pagamento/erro?payment_id=${paymentId}&external_reference=${externalReference}`)
    }
  }, [paymentStatus, router, paymentId, externalReference])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusMessage = () => {
    if (!paymentStatus) return 'Verificando status do pagamento...'
    
    switch (paymentStatus.status) {
      case 'pendente':
        return 'Aguardando confirmação do pagamento'
      case 'processando':
        return 'Pagamento sendo processado'
      case 'autorizado':
        return 'Pagamento autorizado, aguardando captura'
      default:
        return 'Aguardando processamento do pagamento'
    }
  }

  const getInstructions = () => {
    if (!paymentStatus) return []

    // Baseado no método de pagamento, dar instruções específicas
    switch (paymentStatus.payment_method_id) {
      case 'pix':
        return [
          'O PIX pode levar alguns minutos para ser processado',
          'Verifique se o pagamento foi realizado em seu banco',
          'A confirmação acontece automaticamente'
        ]
      case 'bolbradesco':
      case 'boleto':
        return [
          'O boleto pode levar até 3 dias úteis para ser processado',
          'Certifique-se de que o boleto foi pago',
          'Você receberá uma confirmação por email quando aprovado'
        ]
      default:
        return [
          'Seu pagamento está sendo verificado',
          'Isso pode levar alguns minutos',
          'Você será notificado sobre mudanças no status'
        ]
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Clock className="w-16 h-16 text-yellow-600" />
                  {loading && (
                    <div className="absolute -top-1 -right-1">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Pagamento Pendente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-2">{getStatusMessage()}</p>
                {externalReference && (
                  <p className="text-sm">
                    Número do pedido: <span className="font-mono font-medium">{externalReference}</span>
                  </p>
                )}
                {paymentId && (
                  <p className="text-sm">
                    ID do pagamento: <span className="font-mono font-medium">{paymentId}</span>
                  </p>
                )}
              </div>

              {paymentStatus && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-yellow-800">Detalhes do Pagamento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {paymentStatus.transaction_amount && (
                      <div>
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium ml-2">
                          {formatCurrency(paymentStatus.transaction_amount)}
                        </span>
                      </div>
                    )}
                    {paymentStatus.payment_method_id && (
                      <div>
                        <span className="text-gray-600">Método:</span>
                        <span className="font-medium ml-2">{paymentStatus.payment_method_id}</span>
                      </div>
                    )}
                    {paymentStatus.date_created && (
                      <div>
                        <span className="text-gray-600">Criado em:</span>
                        <span className="font-medium ml-2">
                          {new Date(paymentStatus.date_created).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium ml-2 capitalize">{paymentStatus.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-800">O que acontece agora:</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  {getInstructions().map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Esta página verifica automaticamente mudanças no status do pagamento.
                  Você também pode atualizar manualmente.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={refetch}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Verificar Status
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/produtos')}
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Ver Produtos
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Voltar ao Início
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  Você receberá notificações por email sobre mudanças no status do seu pagamento.
                </p>
                <p className="text-xs text-gray-500">
                  Dúvidas? Entre em contato pelo WhatsApp ou email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}