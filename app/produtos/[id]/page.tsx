'use client';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Produto } from '@/types/produto';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetalheProdutoPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);

  useEffect(() => {
    async function carregarProduto() {
      try {
        setLoading(true);
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/produtos/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Produto não encontrado');
          }
          throw new Error('Erro ao carregar produto');
        }
        
        const data = await res.json();
        setProduto(data);
      } catch (err) {
        console.error('Erro:', err);
        setError('Não foi possível carregar os detalhes do produto.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      carregarProduto();
    }
  }, [id]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Voltar
        </button>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl">Carregando detalhes do produto...</p>
          </div>
        ) : error || !produto ? (
          <div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error || 'Produto não encontrado'}
            </div>
            <button 
              onClick={() => router.push('/produtos')}
              className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors"
            >
              Voltar para produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div>
              <div className="aspect-square overflow-hidden bg-cyan-50 rounded-lg mb-4 border border-cyan-100">
                {produto.imagens && produto.imagens.length > 0 ? (
                  <img 
                    src={produto.imagens[imagemAtiva]} 
                    alt={produto.nome} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan-100">
                    <span className="text-6xl">🍋</span>
                  </div>
                )}
              </div>
              
              {produto.imagens && produto.imagens.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {produto.imagens.map((imagem, index) => (
                    <button 
                      key={index}
                      onClick={() => setImagemAtiva(index)}
                      className={`w-20 h-20 rounded border-2 transition-colors ${imagemAtiva === index ? 'ring-2 ring-teal-500 border-teal-500' : 'border-cyan-200 hover:border-cyan-300'}`}
                    >
                      <img 
                        src={imagem} 
                        alt={`${produto.nome} - imagem ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Informações do Produto */}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-800">{produto.nome}</h1>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {produto.categorias.map(cat => (
                  <span 
                    key={cat} 
                    className="text-sm px-2 py-1 bg-cyan-100 text-teal-700 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              
              <p className="text-3xl font-bold text-teal-600 mb-4">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(produto.preco)}
              </p>
              
              <div className="mb-6">
                <p className="font-semibold mb-2 text-slate-800">Disponibilidade:</p>
                {produto.estoque > 0 ? (
                  <span className="inline-block bg-cyan-100 text-teal-800 px-3 py-1 rounded-full">
                    Em estoque ({produto.estoque} {produto.estoque === 1 ? 'unidade' : 'unidades'})
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    Esgotado
                  </span>
                )}
              </div>
              
              {produto.peso && produto.peso > 0 && (
                <div className="mb-6">
                  <p className="font-semibold mb-2 text-slate-800">Peso:</p>
                  <span className="text-slate-600">
                    {produto.peso >= 1000 
                      ? `${(produto.peso / 1000).toFixed(produto.peso % 1000 === 0 ? 0 : 1)} kg`
                      : `${produto.peso} g`
                    }
                  </span>
                </div>
              )}
              
              <div className="prose max-w-none mb-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Descrição</h3>
                <p className="text-slate-600">{produto.descricao}</p>
              </div>
              
              <button 
                className={`w-full py-3 px-4 rounded-lg text-white font-bold shadow-lg transition-colors ${
                  produto.estoque > 0 
                    ? 'bg-teal-500 hover:bg-teal-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={produto.estoque <= 0}
              >
                {produto.estoque > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
