"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import IconeCarrinho from "./carrinho/icone-carrinho"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md border-b border-cyan-100">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/images/girafa-logo.svg" alt="Girafa de Papel" width={40} height={40} className="mr-2" />
          <Link href="/" className="font-fredoka text-3xl text-teal-600 hover:text-teal-700 transition-colors">
            Girafa de Papel
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
            Home
          </Link>
          <Link href="/produtos" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
            Produtos
          </Link>
          <Link href="/sobre" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
            Sobre Nós
          </Link>
          <Link href="/contato" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
            Contato
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-slate-600 hover:text-teal-600 transition-colors text-lg">🔍</button>
          <IconeCarrinho />
          <button
            className="md:hidden text-slate-600 hover:text-teal-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden border-t border-cyan-100">
            <div className="flex flex-col space-y-4 p-6">
              <Link href="/" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/produtos" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Produtos
              </Link>
              <Link href="/sobre" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Contato
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
