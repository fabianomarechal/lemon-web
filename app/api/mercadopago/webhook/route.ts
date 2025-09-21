import { adminDb } from '@/lib/firebase/admin'
import { mercadopagoClient } from '@/lib/mercadopago/config'
import { Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

// Interface para dados do webhook
interface WebhookData {
  id: string
  live_mode: boolean
  type: string
  date_created: string
  application_id: string
  user_id: string
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

// Interface para status de pagamento
interface PaymentStatus {
  status: string
  status_detail: string
  mercadopagoStatus: string
  updatedAt: Date
  processedAt?: Date
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma requisição do Mercado Pago (relaxed para ngrok)
    const userAgent = request.headers.get('user-agent') || ''
    const isNgrok = request.headers.get('host')?.includes('ngrok-free.app')

    if (!userAgent.includes('MercadoPago') && !isNgrok) {
      console.log('User-Agent rejeitado:', userAgent)
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Obter dados do webhook - pode vir via body ou query params
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const topic = url.searchParams.get('topic')
    
    let webhookData: WebhookData
    
    if (id && topic) {
      // Dados via query parameters (formato novo do MP)
      webhookData = {
        id: id,
        live_mode: false,
        type: topic,
        date_created: new Date().toISOString(),
        application_id: '',
        user_id: '',
        version: 1,
        api_version: 'v1',
        action: 'created',
        data: {
          id: id
        }
      }
    } else {
      // Dados via body (formato antigo)
      webhookData = await request.json()
    }
    
    console.log('Webhook recebido:', JSON.stringify(webhookData, null, 2))

    // Verificar se é um evento suportado
    if (!['payment', 'merchant_order'].includes(webhookData.type)) {
      console.log('Tipo de webhook ignorado:', webhookData.type)
      return NextResponse.json({ message: 'OK' }, { status: 200 })
    }

    // Processar baseado no tipo de evento
    if (webhookData.type === 'payment') {
      return await processPaymentWebhook(webhookData)
    } else if (webhookData.type === 'merchant_order') {
      return await processMerchantOrderWebhook(webhookData)
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para processar webhook de pagamento
async function processPaymentWebhook(webhookData: WebhookData) {
  try {
    // Obter ID do pagamento
    const paymentId = webhookData.data.id
    if (!paymentId) {
      console.error('ID do pagamento não encontrado no webhook')
      return NextResponse.json(
        { error: 'ID do pagamento não encontrado' },
        { status: 400 }
      )
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const payment = new Payment(mercadopagoClient)
    const paymentDetails = await payment.get({ id: paymentId })

    console.log('Detalhes do pagamento:', JSON.stringify(paymentDetails, null, 2))

    // Extrair informações relevantes
    const externalReference = paymentDetails.external_reference
    const status = paymentDetails.status
    const statusDetail = paymentDetails.status_detail
    const transactionAmount = paymentDetails.transaction_amount
    const payerEmail = paymentDetails.payer?.email
    const paymentMethodId = paymentDetails.payment_method_id
    const installments = paymentDetails.installments

    // Mapear status do Mercado Pago para status interno
    const statusMapping: Record<string, string> = {
      'pending': 'pendente',
      'approved': 'aprovado',
      'authorized': 'autorizado',
      'in_process': 'processando',
      'in_mediation': 'mediacao',
      'rejected': 'rejeitado',
      'cancelled': 'cancelado',
      'refunded': 'reembolsado',
      'charged_back': 'estornado'
    }

    const internalStatus = statusMapping[status || ''] || 'desconhecido'

    // Preparar dados para atualização
    const paymentStatusData: PaymentStatus = {
      status: internalStatus,
      status_detail: statusDetail || '',
      mercadopagoStatus: status || '',
      updatedAt: new Date(),
      processedAt: new Date()
    }

    // Atualizar no Firebase se temos referência externa
    if (adminDb && externalReference) {
      try {
        const paymentDocRef = (adminDb as any).collection('pagamentos').doc(externalReference)
        
        // Verificar se o documento existe
        const docSnapshot = await paymentDocRef.get()
        
        if (docSnapshot.exists) {
          // Atualizar documento existente
          await paymentDocRef.update({
            ...paymentStatusData,
            paymentId,
            transactionAmount,
            payerEmail,
            paymentMethodId,
            installments,
            webhookData: {
              id: webhookData.id,
              action: webhookData.action,
              dateCreated: webhookData.date_created,
              liveMode: webhookData.live_mode
            }
          })

          console.log(`Pagamento ${externalReference} atualizado com status: ${internalStatus}`)

          // Se pagamento foi aprovado, pode executar lógica adicional
          if (internalStatus === 'aprovado') {
            console.log(`Pagamento aprovado para pedido: ${externalReference}`)
            
            // Aqui você pode adicionar:
            // - Envio de email de confirmação
            // - Atualização do estoque
            // - Criação do pedido no sistema
            // - Etc.
            
            // Por enquanto, apenas atualizar status do pedido
            try {
              await (adminDb as any).collection('pedidos').doc(externalReference).update({
                status: 'pago',
                statusPagamento: 'aprovado',
                pagamentoProcessadoEm: new Date(),
                transactionAmount,
                paymentMethodId
              })
            } catch (orderError) {
              console.error('Erro ao atualizar pedido:', orderError)
              // Não falhar o webhook por causa disso
            }
          }

        } else {
          console.warn(`Documento de pagamento não encontrado: ${externalReference}`)
          
          // Criar documento se não existe (caso edge)
          await paymentDocRef.set({
            ...paymentStatusData,
            paymentId,
            transactionAmount,
            payerEmail,
            paymentMethodId,
            installments,
            criadoEm: new Date(),
            source: 'webhook'
          })
        }

      } catch (firebaseError) {
        console.error('Erro ao atualizar Firebase:', firebaseError)
        // Log do erro mas não falhar o webhook
        // O Mercado Pago precisa receber 200 para não reenviar
      }
    }

    // Resposta de sucesso (importante para o Mercado Pago)
    return NextResponse.json(
      { 
        message: 'Webhook processado com sucesso',
        paymentId,
        status: internalStatus,
        externalReference
      },
      { status: 200 }
    )

  } catch (error: unknown) {
    console.error('Erro ao processar webhook:', error)

    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('Mensagem do erro:', error.message)
      console.error('Stack trace:', error.stack)
    }

    // Retornar erro 500 fará o Mercado Pago tentar novamente
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' && error instanceof Error 
          ? error.message 
          : 'Erro ao processar webhook'
      },
      { status: 500 }
    )
  }
}

// Função para processar webhook de merchant_order
async function processMerchantOrderWebhook(webhookData: WebhookData) {
  try {
    console.log('Processando merchant order webhook...')
    
    // Por enquanto, apenas registrar e retornar OK
    // Pode ser expandido futuramente para processar mudanças no pedido
    return NextResponse.json(
      { 
        message: 'Merchant order webhook processado',
        orderId: webhookData.data.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao processar merchant order webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar merchant order' },
      { status: 500 }
    )
  }
}

// Método GET para verificação de saúde do webhook
export async function GET() {
  return NextResponse.json({
    message: 'Webhook do Mercado Pago ativo',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}