'use client'

import { useCarrinho } from '@/contexts/carrinho-context'
import { ItemCarrinho } from '@/lib/types/carrinho'
import { useState } from 'react'

interface AdicionarCarrinhoProps {
  produto: {
    id: string
    nome: string
    preco: number
    imagens?: string[]
    categoria?: string
  }
  variantes?: {
    cores?: string[]
    tamanhos?: string[]
  }
  className?: string
}

export default function AdicionarCarrinho({ produto, variantes, className = '' }: AdicionarCarrinhoProps) {
  const { adicionarItem } = useCarrinho()
  const [quantidade, setQuantidade] = useState(1)
  const [corSelecionada, setCorSelecionada] = useState('')
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('')
  const [adicionando, setAdicionando] = useState(false)
  const [mostrarSucesso, setMostrarSucesso] = useState(false)

  const handleAdicionarAoCarrinho = () => {
    // Verificar se variantes obrigatórias estão selecionadas
    if (variantes?.cores && variantes.cores.length > 0 && !corSelecionada) {
      alert('Por favor, selecione uma cor')
      return
    }
    
    if (variantes?.tamanhos && variantes.tamanhos.length > 0 && !tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho')
      return
    }

    setAdicionando(true)

    const item: Omit<ItemCarrinho, 'id'> = {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade,
      imagem: produto.imagens?.[0],
      categoria: produto.categoria,
      cor: corSelecionada || undefined,
      tamanho: tamanhoSelecionado || undefined
    }

    try {
      adicionarItem(item)
      
      // Mostrar feedback de sucesso
      setMostrarSucesso(true)
      setTimeout(() => setMostrarSucesso(false), 3000)
      
      // Reset das opções
      setQuantidade(1)
      if (!variantes?.cores || variantes.cores.length <= 1) setCorSelecionada('')
      if (!variantes?.tamanhos || variantes.tamanhos.length <= 1) setTamanhoSelecionado('')
      
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    } finally {
      setAdicionando(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Seleção de cor */}
      {variantes?.cores && variantes.cores.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cor:
          </label>
          <div className="flex gap-2 flex-wrap">
            {variantes.cores.map((cor) => (
              <button
                key={cor}
                onClick={() => setCorSelecionada(cor)}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  corSelecionada === cor
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {cor}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seleção de tamanho */}
      {variantes?.tamanhos && variantes.tamanhos.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tamanho:
          </label>
          <div className="flex gap-2 flex-wrap">
            {variantes.tamanhos.map((tamanho) => (
              <button
                key={tamanho}
                onClick={() => setTamanhoSelecionado(tamanho)}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  tamanhoSelecionado === tamanho
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {tamanho}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seleção de quantidade */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Quantidade:
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            disabled={quantidade <= 1}
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantidade}</span>
          <button
            onClick={() => setQuantidade(quantidade + 1)}
            className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Preço total */}
      <div className="text-lg font-bold text-slate-800">
        Total: {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(produto.preco * quantidade)}
      </div>

      {/* Botão adicionar ao carrinho */}
      <button
        onClick={handleAdicionarAoCarrinho}
        disabled={adicionando}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          adicionando
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-teal-500 hover:bg-teal-600 text-white hover:shadow-lg'
        }`}
      >
        {adicionando ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent mr-2"></div>
            Adicionando...
          </div>
        ) : (
          'Adicionar ao Carrinho'
        )}
      </button>

      {/* Feedback de sucesso */}
      {mostrarSucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm">
          ✓ Produto adicionado ao carrinho com sucesso!
        </div>
      )}
    </div>
  )
}