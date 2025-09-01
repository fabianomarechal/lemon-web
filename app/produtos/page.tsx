'use client';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Produto } from '@/types/produto';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorias pré-definidas para exibição
  const categoriesDisplay = [
    { name: "Cadernos & Agendas", icon: "📓", count: 0 },
    { name: "Canetas & Lápis", icon: "✏️", count: 0 },
    { name: "Adesivos & Washi Tapes", icon: "🎨", count: 0 },
    { name: "Organizadores", icon: "📁", count: 0 },
    { name: "Papéis Especiais", icon: "📄", count: 0 },
    { name: "Kits Criativos", icon: "🎁", count: 0 },
  ]

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoading(true);
        const url = categoriaSelecionada 
          ? `/api/produtos?categoria=${encodeURIComponent(categoriaSelecionada)}`
          : '/api/produtos';
          
        console.log('Tentando buscar produtos de:', url);
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Falha ao carregar produtos: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Produtos carregados:', data);
        setProdutos(data);
        
        // Extrair categorias únicas
        if (!categoriaSelecionada) {
          const todasCategorias = data.flatMap((p: Produto) => p.categorias);
          const categoriasUnicas = [...new Set(todasCategorias)];
          setCategorias(categoriasUnicas);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    carregarProdutos();
  }, [categoriaSelecionada]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-fredoka text-5xl md:text-6xl mb-4 text-shadow">Nossos Produtos</h1>
            <p className="text-xl md:text-2xl">Descubra nossa coleção completa de papelaria criativa</p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categoriesDisplay.map((category, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-gray-50 hover:bg-yellow-100 transition-colors cursor-pointer"
                  onClick={() => setCategoriaSelecionada(category.name)}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">
                    {produtos.filter(p => p.categorias.includes(category.name)).length} produtos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {categoriaSelecionada ? categoriaSelecionada : 'Todos os Produtos'}
              </h2>
              {categoriaSelecionada && (
                <button 
                  onClick={() => setCategoriaSelecionada(null)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  Voltar para todos
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl">Carregando produtos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : produtos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">
                  {categoriaSelecionada 
                    ? `Nenhum produto encontrado na categoria "${categoriaSelecionada}".` 
                    : 'Nenhum produto disponível no momento.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {produtos.map((produto) => (
                  <Link
                    href={`/produtos/${produto.id}`}
                    key={produto.id}
                    className="rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                  >
                    <div className="w-full h-56 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center">
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
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {produto.categorias.slice(0, 1).map(cat => (
                          <span 
                            key={cat} 
                            className="text-xs text-gray-500 uppercase tracking-wide"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mt-1">{produto.nome}</h3>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-xl text-pink-500">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(produto.preco)}
                        </span>
                        <div className="bg-yellow-400 text-white px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors">
                          Comprar
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
