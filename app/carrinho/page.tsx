'use client'

import ItemCarrinhoComponent from '@/components/carrinho/item-carrinho'
import ResumoCarrinho from '@/components/carrinho/resumo-carrinho'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { useCarrinho } from '@/contexts/carrinho-context'
import Link from 'next/link'

export default function CarrinhoPage() {
  const { carrinho, quantidadeItens, limparCarrinho } = useCarrinho()

  const handleLimparCarrinho = () => {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      limparCarrinho()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-teal-600">Início</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-800 font-medium">Carrinho</li>
          </ol>
        </nav>

        {/* Título */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Meu Carrinho
            {quantidadeItens > 0 && (
              <span className="text-lg font-normal text-slate-600 ml-2">
                ({quantidadeItens} {quantidadeItens === 1 ? 'item' : 'itens'})
              </span>
            )}
          </h1>

          {quantidadeItens > 0 && (
            <button
              onClick={handleLimparCarrinho}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Limpar Carrinho
            </button>
          )}
        </div>

        {quantidadeItens === 0 ? (
          // Carrinho vazio
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Seu carrinho está vazio
              </h2>
              
              <p className="text-slate-600 mb-8">
                Explore nossa coleção de produtos criativos e únicos para dar vida às suas ideias.
              </p>
              
              <Link
                href="/produtos"
                className="inline-block bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Explorar Produtos
              </Link>
            </div>
          </div>
        ) : (
          // Carrinho com itens
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {carrinho.itens.map((item) => (
                  <ItemCarrinhoComponent
                    key={item.id}
                    item={item}
                    editavel={true}
                  />
                ))}
              </div>

              {/* Informações adicionais */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Informações Importantes
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Frete grátis para compras acima de R$ 100,00</li>
                  <li>• Prazo de entrega: 5 a 10 dias úteis</li>
                  <li>• Troca e devolução em até 7 dias</li>
                  <li>• Pagamento seguro via Mercado Pago</li>
                </ul>
              </div>
            </div>

            {/* Resumo do carrinho */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ResumoCarrinho mostrarBotaoCheckout={true} />
              </div>
            </div>
          </div>
        )}

        {/* Seção de produtos relacionados ou em destaque */}
        {quantidadeItens > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              Você também pode gostar
            </h2>
            <div className="text-center">
              <Link
                href="/produtos"
                className="inline-block bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Ver Mais Produtos
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}