'use client'

import AdicionarCarrinho from '@/components/carrinho/adicionar-carrinho'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Ícones inline para evitar dependências externas
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface ProdutoSimples {
  id: string
  nome: string
  descricao: string
  preco: number
  imagens?: string[]
  destaque?: boolean
}

interface ProdutosCarouselProps {
  produtos: ProdutoSimples[]
}

export default function ProdutosCarousel({ produtos }: ProdutosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [shuffledProdutos, setShuffledProdutos] = useState<ProdutoSimples[]>([])

  // Randomizar produtos na montagem do componente
  useEffect(() => {
    const shuffled = [...produtos].sort(() => Math.random() - 0.5)
    setShuffledProdutos(shuffled)
  }, [produtos])

  // Cores alternadas para os produtos
  const bgColors = [
    'bg-blue-50',
    'bg-cyan-50',
    'bg-teal-50',
    'bg-sky-50',
    'bg-blue-50',
  ]

  // Quantos produtos mostrar por vez (responsivo)
  const getProductsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1 // mobile
      if (window.innerWidth < 768) return 2 // tablet
      if (window.innerWidth < 1024) return 3 // tablet large
      return 4 // desktop
    }
    return 4 // fallback
  }

  const [productsPerView, setProductsPerView] = useState(4)

  useEffect(() => {
    const updateProductsPerView = () => {
      setProductsPerView(getProductsPerView())
    }

    updateProductsPerView()
    window.addEventListener('resize', updateProductsPerView)
    return () => window.removeEventListener('resize', updateProductsPerView)
  }, [])

  // Rotação automática a cada 5 segundos
  useEffect(() => {
    if (!isPlaying || shuffledProdutos.length <= productsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, shuffledProdutos.length - productsPerView)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [shuffledProdutos.length, productsPerView, isPlaying])

  const goToPrevious = () => {
    const maxIndex = Math.max(0, shuffledProdutos.length - productsPerView)
    setCurrentIndex(currentIndex === 0 ? maxIndex : currentIndex - 1)
  }

  const goToNext = () => {
    const maxIndex = Math.max(0, shuffledProdutos.length - productsPerView)
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (shuffledProdutos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Nenhum produto em destaque encontrado</p>
        <Link href="/produtos" className="inline-block mt-4 text-teal-600 hover:text-teal-700">
          Ver todos os produtos
        </Link>
      </div>
    )
  }

  const showControls = shuffledProdutos.length > productsPerView

  return (
    <div className="relative">
      {/* Container do carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`
          }}
        >
          {shuffledProdutos.map((produto, index) => (
            <div
              key={produto.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / productsPerView}%` }}
            >
              <div
                className={`${bgColors[index % bgColors.length]} rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-cyan-100 h-full`}
              >
                <Link href={`/produtos/${produto.id}`}>
                  <div className="w-full h-56 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center cursor-pointer">
                    {produto.imagens && produto.imagens.length > 0 ? (
                      <img
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">🍋</span>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/produtos/${produto.id}`}>
                    <h3 className="font-semibold text-lg text-slate-800 hover:text-teal-600 cursor-pointer">{produto.nome}</h3>
                  </Link>
                  <p className="text-slate-600 mt-2 line-clamp-2">{produto.descricao}</p>
                  <div className="mt-4">
                    <span className="font-bold text-xl text-teal-600 block mb-3">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(produto.preco)}
                    </span>
                    <AdicionarCarrinho
                      produto={{
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagens: produto.imagens
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles do carousel - apenas se necessário */}
      {showControls && (
        <>
          {/* Botões de navegação */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Produtos anteriores"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Próximos produtos"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-700" />
          </button>

          {/* Indicadores de posição */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, shuffledProdutos.length - productsPerView + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-teal-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para grupo ${index + 1}`}
              />
            ))}
          </div>

          {/* Botão de play/pause */}
          <button
            onClick={toggleAutoPlay}
            className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-200"
            aria-label={isPlaying ? "Pausar rotação" : "Iniciar rotação"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </>
      )}
    </div>
  )
}