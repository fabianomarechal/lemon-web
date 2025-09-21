// Configuração do Mercado Pago para o frontend
export const mercadopagoPublicConfig = {
  publicKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '',
  environment: process.env.MERCADO_PAGO_ENVIRONMENT || 'sandbox'
}

// Função para validar se as credenciais estão configuradas
export function validatePublicConfig() {
  if (!mercadopagoPublicConfig.publicKey) {
    throw new Error('Mercado Pago Public Key não configurada')
  }
  
  if (!mercadopagoPublicConfig.publicKey.startsWith('TEST-') && 
      mercadopagoPublicConfig.environment === 'sandbox') {
    console.warn('Usando ambiente sandbox mas a public key não é de teste')
  }
  
  return true
}