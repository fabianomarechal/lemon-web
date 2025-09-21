import { NextRequest, NextResponse } from 'next/server'
import { mercadopagoClient, mercadopagoConfig } from '@/lib/mercadopago/config'
import { Preference } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testando com dados específicos de conta vendedor de teste...')
    
    // Dados fixos para teste
    const testData = {
      items: [
        {
          id: 'produto-teste-001',
          title: 'Produto de Teste - Conta Vendedor',
          quantity: 1,
          unit_price: 10.00,
          currency_id: 'BRL'
        }
      ],
      // Tentar sem dados de pagador para ver se funciona
      payer: undefined
    }

    // URLs de callback
    const callbackUrls = mercadopagoConfig.getCallbackUrls()
    
    const preferenceData = {
      items: testData.items
      // Removendo TUDO que não é essencial para isolamento
    }

    console.log('📤 Enviando preferência de teste:', JSON.stringify(preferenceData, null, 2))

    // Criar preferência
    const preference = new Preference(mercadopagoClient)
    const result = await preference.create({ body: preferenceData })

    console.log('✅ Preferência criada com sucesso!')
    console.log('ID:', result.id)
    console.log('URL:', result.sandbox_init_point)

    return NextResponse.json({
      id: result.id,
      init_point: result.sandbox_init_point,
      sandbox_init_point: result.sandbox_init_point,
      message: 'Preferência de teste criada com sucesso'
    })

  } catch (error: any) {
    console.error('❌ Erro ao criar preferência de teste:', error)
    
    return NextResponse.json({
      error: 'Erro ao criar preferência de teste',
      message: error.message,
      details: error.cause || error
    }, { status: 500 })
  }
}