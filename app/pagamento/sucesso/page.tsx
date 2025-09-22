'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentStatus } from '@/hooks/use-payment-status'
import { DadosCliente, ItemCarrinho } from '@/lib/types/carrinho'
import { CheckCircle, Home, Loader2, Package } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

interface PedidoSalvo {
  id: string
  dadosCliente: DadosCliente
  items: ItemCarrinho[]
  total: number
  createdAt: string
}

function SucessoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const paymentId = searchParams.get('payment_id')
  const externalReference = searchParams.get('external_reference')
  const [pedidoSalvo, setPedidoSalvo] = useState<PedidoSalvo | null>(null)

  const { paymentStatus, loading } = usePaymentStatus(paymentId)

  useEffect(() => {
    // Recuperar dados do pedido salvos localmente
    const ultimoPedido = localStorage.getItem('ultimo-pedido')
    if (ultimoPedido) {
      try {
        const pedido = JSON.parse(ultimoPedido)
        setPedidoSalvo(pedido)
      } catch (error) {
        console.error('Erro ao recuperar dados do pedido:', error)
      }
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusMessage = () => {
    if (!paymentStatus) return 'Verificando pagamento...'
    
    switch (paymentStatus.status) {
      case 'aprovado':
        return 'Pagamento aprovado com sucesso!'
      case 'pendente':
        return 'Pagamento pendente de aprovação'
      case 'processando':
        return 'Pagamento sendo processado'
      default:
        return 'Status do pagamento verificado'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {loading ? (
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="w-16 h-16 text-green-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {loading ? 'Verificando Pagamento...' : 'Pedido Confirmado!'}
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Detalhes do Pagamento</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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
                    {paymentStatus.installments && paymentStatus.installments > 1 && (
                      <div>
                        <span className="text-gray-600">Parcelas:</span>
                        <span className="font-medium ml-2">{paymentStatus.installments}x</span>
                      </div>
                    )}
                    {paymentStatus.date_approved && (
                      <div>
                        <span className="text-gray-600">Aprovado em:</span>
                        <span className="font-medium ml-2">
                          {new Date(paymentStatus.date_approved).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {pedidoSalvo && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    {pedidoSalvo.items && pedidoSalvo.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.nome} (x{item.quantidade})</span>
                        <span>{formatCurrency(item.preco * item.quantidade)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-medium flex justify-between">
                      <span>Total:</span>
                      <span>{formatCurrency(pedidoSalvo.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {paymentStatus?.status === 'aprovado' 
                    ? 'Você receberá um email de confirmação em breve com os detalhes do seu pedido.'
                    : 'Você será notificado sobre mudanças no status do seu pagamento.'
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/produtos')}
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Ver Mais Produtos
                  </Button>
                  <Button 
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Carregando...
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    }>
      <SucessoContent />
    </Suspense>
  )
}