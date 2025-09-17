'use client'

import { useEffect, useState } from 'react'

interface BodyWrapperProps {
  children: React.ReactNode
}

export default function BodyWrapper({ children }: BodyWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Durante a hidratação inicial, renderize sem extensões
  const className = mounted 
    ? "font-sans bg-blue-100" 
    : "font-sans bg-blue-100"

  return (
    <div className={className} suppressHydrationWarning>
      {children}
    </div>
  )
}