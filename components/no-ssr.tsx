'use client'

import dynamic from 'next/dynamic'
import React from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const NoSSR: React.FC<NoSSRProps> = ({ children }) => {
  return <>{children}</>
}

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      <p className="ml-4 text-lg text-gray-700">Carregando...</p>
    </div>
  ),
})