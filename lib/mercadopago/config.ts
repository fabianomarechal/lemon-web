import { MercadoPagoConfig } from 'mercadopago'

// Verificar se as variáveis de ambiente estão definidas (apenas no servidor)
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
if (!accessToken) {
  console.warn('MERCADO_PAGO_ACCESS_TOKEN não encontrado nas variáveis de ambiente')
}

// Configurar o cliente do Mercado Pago
export const mercadopagoClient = new MercadoPagoConfig({
  accessToken: accessToken || '',
  options: {
    timeout: 5000,
    idempotencyKey: undefined
  }
})

// Configurações adicionais
export const mercadopagoConfig = {
  // URLs de retorno (usando variável de ambiente)
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // URLs de callback
  getCallbackUrls() {
    const baseUrl = this.baseUrl
    return {
      success: `${baseUrl}/pagamento/sucesso`,
      failure: `${baseUrl}/pagamento/erro`,
      pending: `${baseUrl}/pagamento/pendente`
    }
  },
  
  // URL do webhook
  getWebhookUrl() {
    return `${this.baseUrl}/api/mercadopago/webhook`
  },
  
  // Configurações de notificação
  notificationSettings: {
    webhook_url: undefined, // será definido dinamicamente
    events: [
      'payment',        // Mudanças no status do pagamento (essencial)
      'merchant_order'  // Mudanças no pedido (recomendado)
    ]
  }
}

// Função para validar a configuração
export function validateMercadoPagoConfig() {
  if (!accessToken) {
    throw new Error('Mercado Pago não configurado: ACCESS_TOKEN não encontrado')
  }
  
  if (accessToken.startsWith('TEST-') && process.env.NODE_ENV === 'production') {
    console.warn('ATENÇÃO: Usando token de teste em produção!')
  }

  if (accessToken.startsWith('APP_USR-') && process.env.MERCADO_PAGO_ENVIRONMENT === 'sandbox') {
    console.log('✅ Usando credenciais de teste da conta vendedor (APP_USR) em ambiente sandbox')
  }
  
  return true
}

// Constantes úteis
export const MERCADO_PAGO_CONSTANTS = {
  CURRENCY: 'BRL',
  COUNTRY: 'BR',
  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PIX: 'pix',
    BOLETO: 'ticket'
  },
  PAYMENT_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    AUTHORIZED: 'authorized',
    IN_PROCESS: 'in_process',
    IN_MEDIATION: 'in_mediation',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    CHARGED_BACK: 'charged_back'
  }
} as const