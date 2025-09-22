'use client';

import CoresProduto from "@/components/cores-produto";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Cor, Produto } from '@/types/produto';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [cores, setCores] = useState<Cor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorias dinâmicas baseadas nos produtos reais
  const categoriesDisplay = categorias.map(cat => ({
    name: cat,
    icon: getCategoryIcon(cat),
    count: todosProdutos.filter(p => p.categorias.includes(cat)).length
  }));

  // Função para definir ícones para categorias
  function getCategoryIcon(categoria: string): string {
    const lowerCat = categoria.toLowerCase();
    if (lowerCat.includes('caderno') || lowerCat.includes('agenda')) return "📓";
    if (lowerCat.includes('caneta') || lowerCat.includes('lápis') || lowerCat.includes('escrita')) return "✏️";
    if (lowerCat.includes('adesivo') || lowerCat.includes('washi') || lowerCat.includes('tape')) return "🎨";
    if (lowerCat.includes('organizador') || lowerCat.includes('pasta')) return "📁";
    if (lowerCat.includes('papel') || lowerCat.includes('folha')) return "📄";
    if (lowerCat.includes('kit') || lowerCat.includes('conjunto')) return "🎁";
    return "📋"; // ícone padrão
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const baseUrl = window.location.origin;

        // Carregar produtos e cores em paralelo
        const [produtosRes, coresRes] = await Promise.all([
          fetch(`${baseUrl}/api/produtos`),
          fetch(`${baseUrl}/api/admin/cores`)
        ]);

        if (!produtosRes.ok) {
          throw new Error(`Falha ao carregar produtos: ${produtosRes.status} ${produtosRes.statusText}`);
        }

        if (!coresRes.ok) {
          throw new Error(`Falha ao carregar cores: ${coresRes.status} ${coresRes.statusText}`);
        }

        const [produtosData, coresData] = await Promise.all([
          produtosRes.json(),
          coresRes.json()
        ]);

        console.log('Produtos carregados:', produtosData);
        console.log('Cores carregadas:', coresData);

        setTodosProdutos(produtosData);
        setCores(coresData);

        // Extrair categorias únicas
        const todasCategorias = produtosData.flatMap((p: Produto) => p.categorias);
        const categoriasUnicas = [...new Set(todasCategorias)] as string[];
        setCategorias(categoriasUnicas);

        // Filtrar produtos baseado na categoria selecionada
        if (categoriaSelecionada) {
          const produtosFiltrados = produtosData.filter((p: Produto) =>
            p.categorias.includes(categoriaSelecionada)
          );
          setProdutos(produtosFiltrados);
        } else {
          setProdutos(produtosData);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Efeito separado para filtrar quando a categoria muda
  useEffect(() => {
    if (todosProdutos.length > 0) {
      if (categoriaSelecionada) {
        const produtosFiltrados = todosProdutos.filter(p => 
          p.categorias.includes(categoriaSelecionada)
        );
        setProdutos(produtosFiltrados);
      } else {
        setProdutos(todosProdutos);
      }
    }
  }, [categoriaSelecionada, todosProdutos]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
                <section className="py-16 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">Nossos Produtos</h1>
            <p className="text-xl">Descubra nossa coleção de papelaria criativa</p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Categorias</h2>
            
            {categorias.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* Botão "Todos os Produtos" */}
                <div
                  className={`text-center p-6 rounded-lg transition-colors cursor-pointer border ${
                    !categoriaSelecionada 
                      ? 'bg-teal-100 border-teal-300 text-teal-800' 
                      : 'bg-gray-50 hover:bg-cyan-50 border-cyan-100'
                  }`}
                  onClick={() => setCategoriaSelecionada(null)}
                >
                  <div className="text-4xl mb-3">🛍️</div>
                  <h3 className="font-semibold text-gray-800 mb-1">Todos</h3>
                  <p className="text-sm text-gray-600">
                    {todosProdutos.length} produtos
                  </p>
                </div>

                {categoriesDisplay.map((category, index) => (
                  <div
                    key={index}
                    className={`text-center p-6 rounded-lg transition-colors cursor-pointer border ${
                      categoriaSelecionada === category.name 
                        ? 'bg-teal-100 border-teal-300 text-teal-800' 
                        : 'bg-gray-50 hover:bg-cyan-50 border-cyan-100'
                    }`}
                    onClick={() => setCategoriaSelecionada(category.name)}
                  >
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.count} produtos
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando categorias...</p>
              </div>
            )}
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
                  className="text-teal-600 hover:text-teal-800"
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
                    <div className="w-full h-56 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
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
                            className="text-xs text-teal-600 uppercase tracking-wide font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mt-1">{produto.nome}</h3>
                      
                      {/* Cores disponíveis */}
                      {produto.cores && produto.cores.length > 0 && (
                        <div className="mt-2">
                          <CoresProduto
                            coresIds={produto.cores}
                            showLabels={true}
                            size="small"
                            todasCores={cores}
                          />
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-xl text-teal-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(produto.preco)}
                        </span>
                        <div className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors">
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
