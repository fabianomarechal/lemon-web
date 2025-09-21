// Script para verificar credenciais de teste do Mercado Pago
import { MercadoPagoConfig, Payment } from 'mercadopago'

async function verificarCredenciais() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  
  if (!accessToken) {
    console.error('❌ Access Token não encontrado')
    return
  }
  
  if (!accessToken.startsWith('TEST-')) {
    console.error('❌ Access Token não é de teste (deve começar com TEST-)')
    return
  }
  
  console.log('✅ Access Token é de teste')
  console.log('Token:', accessToken.substring(0, 20) + '...')
  
  try {
    // Configurar cliente
    const client = new MercadoPagoConfig({
      accessToken
    })
    
    // Tentar buscar um pagamento (vai retornar erro, mas mostra se as credenciais são válidas)
    const payment = new Payment(client)
    await payment.get({ id: '123456789' })
    
  } catch (error: any) {
    if (error.status === 404) {
      console.log('✅ Credenciais válidas (erro 404 é esperado)')
    } else if (error.status === 401) {
      console.error('❌ Credenciais inválidas (erro 401)')
    } else {
      console.log('✅ Credenciais parecem válidas')
      console.log('Erro:', error.message)
    }
  }
}

verificarCredenciais()