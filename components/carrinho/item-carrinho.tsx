'use client'

import { useCarrinho } from '@/contexts/carrinho-context'
import { ItemCarrinho } from '@/lib/types/carrinho'
import Image from 'next/image'

interface ItemCarrinhoComponentProps {
  item: ItemCarrinho
  editavel?: boolean
}

export default function ItemCarrinhoComponent({ item, editavel = true }: ItemCarrinhoComponentProps) {
  const { atualizarQuantidade, removerItem } = useCarrinho()

  const handleAtualizarQuantidade = (novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerItem(item.id)
    } else {
      atualizarQuantidade(item.id, novaQuantidade)
    }
  }

  const handleRemoverItem = () => {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
      removerItem(item.id)
    }
  }

  const precoTotal = item.preco * item.quantidade

  return (
    <div className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-lg">
      {/* Imagem do produto */}
      <div className="flex-shrink-0 w-20 h-20 bg-slate-100 rounded-lg overflow-hidden">
        {item.imagem ? (
          <Image
            src={item.imagem}
            alt={item.nome}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="flex-grow">
        <h3 className="font-medium text-slate-800 mb-1">{item.nome}</h3>
        
        {/* Variantes */}
        <div className="text-sm text-slate-600 space-y-1">
          {item.cor && (
            <div>Cor: <span className="font-medium">{item.cor}</span></div>
          )}
          {item.tamanho && (
            <div>Tamanho: <span className="font-medium">{item.tamanho}</span></div>
          )}
          {item.categoria && (
            <div>Categoria: <span className="font-medium">{item.categoria}</span></div>
          )}
        </div>

        {/* Preço unitário */}
        <div className="text-sm text-slate-600 mt-2">
          Preço unitário: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(item.preco)}
        </div>
      </div>

      {/* Controles de quantidade e preço */}
      <div className="flex-shrink-0 text-right">
        {editavel ? (
          <div className="space-y-2">
            {/* Controle de quantidade */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAtualizarQuantidade(item.quantidade - 1)}
                className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                disabled={item.quantidade <= 1}
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantidade}</span>
              <button
                onClick={() => handleAtualizarQuantidade(item.quantidade + 1)}
                className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                +
              </button>
            </div>

            {/* Botão remover */}
            <button
              onClick={handleRemoverItem}
              className="text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-sm text-slate-600">Qtd: {item.quantidade}</div>
          </div>
        )}

        {/* Preço total do item */}
        <div className="font-bold text-slate-800 mt-2">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(precoTotal)}
        </div>
      </div>
    </div>
  )
}