'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Home, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const externalReference = searchParams.get('external_reference')
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    // Recuperar dados do pedido para tentar novamente
    const ultimoPedido = localStorage.getItem('ultimo-pedido')
    if (ultimoPedido) {
      try {
        const pedido = JSON.parse(ultimoPedido)
        console.log('Pedido que falhou:', pedido)
      } catch (error) {
        console.error('Erro ao recuperar dados do pedido:', error)
      }
    }

    // Verificar se há detalhes do erro nos parâmetros
    const status = searchParams.get('status')
    const statusDetail = searchParams.get('status_detail')
    
    if (status && statusDetail) {
      setErrorDetails(`Status: ${status} - ${statusDetail}`)
    }
  }, [searchParams])

  const handleTryAgain = () => {
    // Verificar se há um pedido salvo para tentar novamente
    const ultimoPedido = localStorage.getItem('ultimo-pedido')
    if (ultimoPedido) {
      router.push('/checkout')
    } else {
      router.push('/carrinho')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Erro no Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="text-lg mb-2">
                  Ops! Algo deu errado com seu pagamento.
                </p>
                <p className="text-sm">
                  Nenhum valor foi cobrado do seu cartão ou conta.
                </p>
                {externalReference && (
                  <p className="text-sm mt-2">
                    Referência do pedido: <span className="font-mono font-medium">{externalReference}</span>
                  </p>
                )}
                {errorDetails && (
                  <p className="text-sm mt-2 text-red-600">
                    {errorDetails}
                  </p>
                )}
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-red-800">Possíveis causas:</h3>
                <ul className="text-sm text-red-700 space-y-1 text-left">
                  <li>• Dados do cartão incorretos ou inválidos</li>
                  <li>• Cartão sem limite disponível</li>
                  <li>• Cartão bloqueado ou vencido</li>
                  <li>• Problemas temporários com a operadora</li>
                  <li>• Sessão de pagamento expirada</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-800">O que fazer agora:</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Verifique os dados do seu cartão</li>
                  <li>• Confirme se há limite disponível</li>
                  <li>• Entre em contato com seu banco se necessário</li>
                  <li>• Tente novamente com outro método de pagamento</li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Se o problema persistir, entre em contato conosco através do WhatsApp ou email.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleTryAgain}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/carrinho')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Carrinho
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Ir ao Início
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  Precisa de ajuda? Entre em contato:
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <a 
                    href="https://wa.me/5511999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    WhatsApp
                  </a>
                  <a 
                    href="mailto:contato@girafadepapel.com" 
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Email
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function ErrorPage() {
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
      <ErrorContent />
    </Suspense>
  )
}