'use client'

import { Carrinho, CarrinhoContextType, ItemCarrinho } from '@/lib/types/carrinho'
import React, { createContext, useContext, useEffect, useReducer } from 'react'

// Estado inicial do carrinho
const carrinhoInicial: Carrinho = {
  itens: [],
  total: 0,
  subtotal: 0,
  frete: 0,
  desconto: 0
}

// Ações do reducer
type CarrinhoAction =
  | { type: 'ADICIONAR_ITEM'; payload: Omit<ItemCarrinho, 'id'> }
  | { type: 'REMOVER_ITEM'; payload: string }
  | { type: 'ATUALIZAR_QUANTIDADE'; payload: { id: string; quantidade: number } }
  | { type: 'LIMPAR_CARRINHO' }
  | { type: 'CALCULAR_TOTAL' }
  | { type: 'DEFINIR_FRETE'; payload: number }
  | { type: 'DEFINIR_DESCONTO'; payload: number }
  | { type: 'CARREGAR_CARRINHO'; payload: Carrinho }

// Função para gerar ID único
const gerarId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// Reducer do carrinho
function carrinhoReducer(state: Carrinho, action: CarrinhoAction): Carrinho {
  switch (action.type) {
    case 'ADICIONAR_ITEM': {
      const novoItem: ItemCarrinho = {
        ...action.payload,
        id: gerarId()
      }
      
      // Verificar se o produto já existe no carrinho
      const itemExistente = state.itens.find(
        item => item.produtoId === novoItem.produtoId && 
                item.cor === novoItem.cor && 
                item.tamanho === novoItem.tamanho
      )
      
      let novosItens
      if (itemExistente) {
        // Se existe, atualizar quantidade
        novosItens = state.itens.map(item =>
          item.id === itemExistente.id
            ? { ...item, quantidade: item.quantidade + novoItem.quantidade }
            : item
        )
      } else {
        // Se não existe, adicionar novo item
        novosItens = [...state.itens, novoItem]
      }
      
      const novoState = { ...state, itens: novosItens }
      return calcularTotais(novoState)
    }
    
    case 'REMOVER_ITEM': {
      const novosItens = state.itens.filter(item => item.id !== action.payload)
      const novoState = { ...state, itens: novosItens }
      return calcularTotais(novoState)
    }
    
    case 'ATUALIZAR_QUANTIDADE': {
      const { id, quantidade } = action.payload
      
      if (quantidade <= 0) {
        // Se quantidade é 0 ou negativa, remover item
        const novosItens = state.itens.filter(item => item.id !== id)
        const novoState = { ...state, itens: novosItens }
        return calcularTotais(novoState)
      }
      
      const novosItens = state.itens.map(item =>
        item.id === id ? { ...item, quantidade } : item
      )
      const novoState = { ...state, itens: novosItens }
      return calcularTotais(novoState)
    }
    
    case 'LIMPAR_CARRINHO':
      return carrinhoInicial
    
    case 'DEFINIR_FRETE': {
      const novoState = { ...state, frete: action.payload }
      return calcularTotais(novoState)
    }
    
    case 'DEFINIR_DESCONTO': {
      const novoState = { ...state, desconto: action.payload }
      return calcularTotais(novoState)
    }
    
    case 'CARREGAR_CARRINHO':
      return action.payload
    
    case 'CALCULAR_TOTAL':
      return calcularTotais(state)
    
    default:
      return state
  }
}

// Função para calcular totais
function calcularTotais(carrinho: Carrinho): Carrinho {
  const subtotal = carrinho.itens.reduce(
    (acc, item) => acc + (item.preco * item.quantidade), 
    0
  )
  
  const total = subtotal + (carrinho.frete || 0) - (carrinho.desconto || 0)
  
  return {
    ...carrinho,
    subtotal: Number(subtotal.toFixed(2)),
    total: Number(Math.max(0, total).toFixed(2))
  }
}

// Criar contexto
const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined)

// Provider do carrinho
export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, dispatch] = useReducer(carrinhoReducer, carrinhoInicial)

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const carrinhoSalvo = localStorage.getItem('carrinho-girafa-papel')
      if (carrinhoSalvo) {
        try {
          const carrinhoData = JSON.parse(carrinhoSalvo)
          dispatch({ type: 'CARREGAR_CARRINHO', payload: carrinhoData })
        } catch (error) {
          console.error('Erro ao carregar carrinho do localStorage:', error)
        }
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carrinho-girafa-papel', JSON.stringify(carrinho))
    }
  }, [carrinho])

  // Funções do contexto
  const adicionarItem = (item: Omit<ItemCarrinho, 'id'>) => {
    dispatch({ type: 'ADICIONAR_ITEM', payload: item })
  }

  const removerItem = (itemId: string) => {
    dispatch({ type: 'REMOVER_ITEM', payload: itemId })
  }

  const atualizarQuantidade = (itemId: string, quantidade: number) => {
    dispatch({ type: 'ATUALIZAR_QUANTIDADE', payload: { id: itemId, quantidade } })
  }

  const limparCarrinho = () => {
    dispatch({ type: 'LIMPAR_CARRINHO' })
  }

  const calcularTotal = () => {
    dispatch({ type: 'CALCULAR_TOTAL' })
  }

  const definirFrete = (valor: number) => {
    dispatch({ type: 'DEFINIR_FRETE', payload: valor })
  }

  const definirDesconto = (valor: number) => {
    dispatch({ type: 'DEFINIR_DESCONTO', payload: valor })
  }

  // Calcular quantidade total de itens
  const quantidadeItens = carrinho.itens.reduce((acc, item) => acc + item.quantidade, 0)

  const value: CarrinhoContextType = {
    carrinho,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
    quantidadeItens
  }

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  )
}

// Hook para usar o contexto
export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider')
  }
  return context
}