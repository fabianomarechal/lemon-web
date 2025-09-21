'use client'

import { useCarrinho } from '@/contexts/carrinho-context'
import Link from 'next/link'

interface ResumoCarrinhoProps {
  mostrarBotaoCheckout?: boolean
  className?: string
}

export default function ResumoCarrinho({ mostrarBotaoCheckout = true, className = '' }: ResumoCarrinhoProps) {
  const { carrinho, quantidadeItens } = useCarrinho()

  if (quantidadeItens === 0) {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-slate-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <p className="text-lg font-medium">Carrinho vazio</p>
          <p className="text-sm">Adicione produtos para continuar</p>
        </div>
        <Link 
          href="/produtos" 
          className="inline-block bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Ver Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Resumo do Pedido
      </h3>

      {/* Resumo dos valores */}
      <div className="space-y-3">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({quantidadeItens} {quantidadeItens === 1 ? 'item' : 'itens'})</span>
          <span>{new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(carrinho.subtotal)}</span>
        </div>

        {carrinho.frete && carrinho.frete > 0 ? (
          <div className="flex justify-between text-slate-600">
            <span>Frete</span>
            <span>{new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(carrinho.frete)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-green-600">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
        )}

        {carrinho.desconto && carrinho.desconto > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Desconto</span>
            <span>-{new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(carrinho.desconto)}</span>
          </div>
        )}

        <hr className="border-slate-200" />

        <div className="flex justify-between font-bold text-lg text-slate-800">
          <span>Total</span>
          <span>{new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(carrinho.total)}</span>
        </div>
      </div>

      {/* Botões de ação */}
      {mostrarBotaoCheckout && (
        <div className="mt-6 space-y-3">
          <Link
            href="/checkout"
            className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-teal-600 transition-colors block"
          >
            Finalizar Compra
          </Link>
          
          <Link
            href="/produtos"
            className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium text-center hover:bg-slate-200 transition-colors block"
          >
            Continuar Comprando
          </Link>
        </div>
      )}

      {/* Informações adicionais */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 space-y-1">
          <p>✓ Entrega rápida e segura</p>
          <p>✓ Pagamento seguro via Mercado Pago</p>
          <p>✓ Troca e devolução em até 7 dias</p>
        </div>
      </div>
    </div>
  )
}