'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banner } from '@/lib/types/banner'
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

interface BannerCarouselProps {
  banners: Banner[]
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Rotação automática a cada 5 segundos
  useEffect(() => {
    if (!isPlaying || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length, isPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (banners.length === 0) return null

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative overflow-hidden">
      {/* Banner principal */}
      <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24 transition-all duration-500">
        {currentBanner.imagemUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={currentBanner.imagemUrl}
              alt={currentBanner.titulo}
              fill
              className="object-cover opacity-20 transition-opacity duration-500"
              priority
            />
          </div>
        )}
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <Image 
              src="/images/girafa-logo-large.svg" 
              alt="Girafa de Papel" 
              width={200} 
              height={200} 
              priority 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 animate-fadeIn">
            {currentBanner.titulo}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-700 animate-fadeIn">
            {currentBanner.subtitulo}
          </p>
          <Link 
            href={currentBanner.linkDestino || "/produtos"} 
            className="bg-teal-500 text-white py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors text-lg font-medium shadow-lg animate-fadeIn"
          >
            {currentBanner.textoLink || "Ver Produtos"}
          </Link>
        </div>
      </div>

      {/* Controles apenas se há mais de 1 banner */}
      {banners.length > 1 && (
        <>
          {/* Botões de navegação */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Banner anterior"
          >
            <ChevronLeftIcon className="w-6 h-6 text-slate-700" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Próximo banner"
          >
            <ChevronRightIcon className="w-6 h-6 text-slate-700" />
          </button>

          {/* Indicadores de posição */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-teal-500 scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>

          {/* Botão de play/pause */}
          <button
            onClick={toggleAutoPlay}
            className="absolute top-6 right-6 z-20 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-200"
            aria-label={isPlaying ? "Pausar rotação" : "Iniciar rotação"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Contador de banner */}
          <div className="absolute top-6 left-6 z-20 bg-white/80 px-3 py-1 rounded-full shadow-lg">
            <span className="text-sm font-medium text-slate-700">
              {currentIndex + 1} / {banners.length}
            </span>
          </div>
        </>
      )}
    </section>
  )
}