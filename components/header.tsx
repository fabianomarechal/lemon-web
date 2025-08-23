"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-4xl">🍋</span>
          <Link href="/" className="font-fredoka text-3xl text-pink-500 ml-2">
            Lemon
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <Link href="/produtos" className="text-gray-600 hover:text-pink-500 transition-colors">
            Produtos
          </Link>
          <Link href="/sobre" className="text-gray-600 hover:text-pink-500 transition-colors">
            Sobre Nós
          </Link>
          <Link href="/contato" className="text-gray-600 hover:text-pink-500 transition-colors">
            Contato
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-pink-500 transition-colors">🔍</button>
          <button className="text-gray-600 hover:text-pink-500 transition-colors">🛒</button>
          <button
            className="md:hidden text-gray-600 hover:text-pink-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col space-y-4 p-6">
              <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
                Home
              </Link>
              <Link href="/produtos" className="text-gray-600 hover:text-pink-500 transition-colors">
                Produtos
              </Link>
              <Link href="/sobre" className="text-gray-600 hover:text-pink-500 transition-colors">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-gray-600 hover:text-pink-500 transition-colors">
                Contato
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
