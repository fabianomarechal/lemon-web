// Interfaces para o sistema de carrinho e pagamento

export interface ItemCarrinho {
  id: string
  produtoId: string
  nome: string
  preco: number
  quantidade: number
  imagem?: string
  categoria?: string
  cor?: string
  tamanho?: string
}

export interface Carrinho {
  itens: ItemCarrinho[]
  total: number
  subtotal: number
  frete?: number
  desconto?: number
}

export interface EnderecoEntrega {
  nome: string
  telefone: string
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  referencia?: string
}

export interface DadosCliente {
  nome: string
  email: string
  telefone: string
  documento: string // CPF/CNPJ
  endereco: EnderecoEntrega
}

export interface Pedido {
  id?: string
  numero?: string
  cliente: DadosCliente
  itens: ItemCarrinho[]
  subtotal: number
  frete: number
  desconto: number
  total: number
  status: 'pendente' | 'confirmado' | 'processando' | 'enviado' | 'entregue' | 'cancelado'
  formaPagamento: 'mercado_pago' | 'pix' | 'cartao' | 'boleto'
  statusPagamento: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado' | 'estornado'
  mercadoPagoId?: string
  pagamentoUrl?: string
  criadoEm: Date
  atualizadoEm: Date
  observacoes?: string
}

export interface PreferenciaMercadoPago {
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
    currency_id: string
  }>
  payer?: {
    name?: string
    email?: string
    phone?: {
      area_code?: string
      number?: string
    }
    identification?: {
      type?: string
      number?: string
    }
  }
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  notification_url?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

export interface PagamentoMercadoPago {
  id: string
  status: string
  status_detail: string
  external_reference?: string
  payment_method_id?: string
  payment_type_id?: string
  transaction_amount?: number
  currency_id?: string
  date_created?: string
  date_approved?: string
  payer?: {
    email?: string
    identification?: {
      type?: string
      number?: string
    }
  }
}

export interface ConfiguracaoFrete {
  gratuito_acima_de: number
  valor_padrao: number
  regioes: Array<{
    estados: string[]
    valor: number
    prazo_dias: number
  }>
}

// Contexto do carrinho
export interface CarrinhoContextType {
  carrinho: Carrinho
  adicionarItem: (item: Omit<ItemCarrinho, 'id'>) => void
  removerItem: (itemId: string) => void
  atualizarQuantidade: (itemId: string, quantidade: number) => void
  limparCarrinho: () => void
  calcularTotal: () => void
  quantidadeItens: number
}