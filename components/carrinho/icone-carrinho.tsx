'use client'

import { useCarrinho } from '@/contexts/carrinho-context'
import Link from 'next/link'

export default function IconeCarrinho() {
  const { quantidadeItens, carrinho } = useCarrinho()

  return (
    <Link 
      href="/carrinho" 
      className="relative inline-flex items-center p-2 text-slate-700 hover:text-teal-600 transition-colors"
      aria-label={`Carrinho com ${quantidadeItens} itens`}
    >
      {/* Ícone do carrinho */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
        />
      </svg>
      
      {/* Badge com quantidade */}
      {quantidadeItens > 0 && (
        <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {quantidadeItens > 99 ? '99+' : quantidadeItens}
        </span>
      )}
      
      {/* Tooltip com valor total */}
      {quantidadeItens > 0 && (
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-slate-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
            Total: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(carrinho.total)}
          </div>
        </div>
      )}
    </Link>
  )
}