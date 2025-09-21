import { adminDb } from '@/lib/firebase/admin'
import { mercadopagoClient, mercadopagoConfig, validateMercadoPagoConfig } from '@/lib/mercadopago/config'
import { PreferenciaMercadoPago } from '@/lib/types/carrinho'
import { Preference } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

interface RequestBody extends PreferenciaMercadoPago {
  metadata?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    // Validar configuração do Mercado Pago
    validateMercadoPagoConfig()
    
    // Obter dados do body
    const body = await request.json()
    const { 
      items, 
      payer, 
      external_reference,
      metadata 
    }: RequestBody = body

    // Validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar itens
    for (const item of items) {
      if (!item.title || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Todos os itens devem ter title, quantity e unit_price' },
          { status: 400 }
        )
      }
    }

    // Calcular total
    const total = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0)

    // URLs de callback
    const callbackUrls = mercadopagoConfig.getCallbackUrls()
    
    // Log das URLs para debug
    console.log('URLs de callback configuradas:', callbackUrls)
    console.log('Base URL:', mercadopagoConfig.baseUrl)

    // Verificar se todas as URLs estão definidas
    if (!callbackUrls.success || !callbackUrls.failure || !callbackUrls.pending) {
      console.error('URLs de callback faltando:', {
        success: !!callbackUrls.success,
        failure: !!callbackUrls.failure,
        pending: !!callbackUrls.pending
      })
      throw new Error('URLs de callback não estão completamente configuradas')
    }

    // Criar instância do Preference
    const preference = new Preference(mercadopagoClient)

    // Dados da preferência
    const preferenceData = {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || 'BRL'
      })),
      
      // Informações do pagador
      payer: payer ? {
        name: payer.name,
        email: payer.email,
        phone: payer.phone,
        identification: payer.identification
      } : undefined,

      // URLs de retorno - estrutura correta para Mercado Pago
      back_urls: {
        success: callbackUrls.success,
        failure: callbackUrls.failure,
        pending: callbackUrls.pending
      },
      
      // auto_return removido - causava erro na API
      
      // Referência externa (ID do pedido)
      external_reference: external_reference || `pedido_${Date.now()}`,
      
      // URL de notificação (webhook)
      notification_url: mercadopagoConfig.getWebhookUrl(),
      
      // Configurações de notificação
      notification_urls: {
        webhook: mercadopagoConfig.getWebhookUrl()
      },
      
      // Expiração
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      
      // Configurações adicionais
      statement_descriptor: 'GIRAFA DE PAPEL',
      
      // Dados adicionais para rastreamento
      metadata: {
        ...metadata,
        store_name: 'Girafa de Papel',
        created_at: new Date().toISOString(),
        total_amount: total
      }
    }

    // Log detalhado da configuração antes de enviar
    console.log('Dados da preferência:', {
      items: preferenceData.items.length,
      back_urls: preferenceData.back_urls,
      external_reference: preferenceData.external_reference,
      notification_url: preferenceData.notification_url
    })

    // Criar preferência no Mercado Pago
    const result = await preference.create({ body: preferenceData })

    // Salvar preferência no Firebase para controle
    if (adminDb && external_reference) {
      try {
        await (adminDb as any).collection('pagamentos').doc(external_reference).set({
          mercadoPagoId: result.id,
          preferenceId: result.id,
          status: 'pending',
          total,
          items,
          payer,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        })
      } catch (firebaseError) {
        console.error('Erro ao salvar preferência no Firebase:', firebaseError)
        // Não falhar a requisição por causa do Firebase
      }
    }

    // Retornar dados da preferência
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      external_reference: result.external_reference,
      expires_at: result.date_of_expiration,
      total,
      items_count: items.length
    })

  } catch (error: unknown) {
    console.error('Erro ao criar preferência do Mercado Pago:', error)
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('Mensagem do erro:', error.message)
      if ('cause' in error) {
        console.error('Causa do erro:', error.cause)
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' && error instanceof Error 
          ? error.message 
          : 'Erro ao processar pagamento'
      },
      { status: 500 }
    )
  }
}