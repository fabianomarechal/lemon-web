'use client';

import { useState, useEffect } from 'react';
import { Produto } from '@/types/produto';
import Link from 'next/link';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregarProdutos() {
    try {
      setLoading(true);
      const res = await fetch('/api/produtos');
      if (!res.ok) {
        throw new Error('Falha ao carregar produtos');
      }
      
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error('Erro:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  async function excluirProduto(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Falha ao excluir produto');
      }
      
      // Remove o produto da lista
      setProdutos(produtos.filter(produto => produto.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setError('Não foi possível excluir o produto. Tente novamente mais tarde.');
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={carregarProdutos}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administração de Produtos</h1>
        <Link href="/admin/produtos/novo" className="bg-green-500 text-white py-2 px-4 rounded">
          Adicionar Produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Nome</th>
                <th className="py-2 px-4 border-b text-left">Preço</th>
                <th className="py-2 px-4 border-b text-left">Estoque</th>
                <th className="py-2 px-4 border-b text-left">Categorias</th>
                <th className="py-2 px-4 border-b text-left">Destaque</th>
                <th className="py-2 px-4 border-b text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{produto.nome}</td>
                  <td className="py-2 px-4 border-b">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(produto.preco)}
                  </td>
                  <td className="py-2 px-4 border-b">{produto.estoque}</td>
                  <td className="py-2 px-4 border-b">{produto.categorias.join(', ')}</td>
                  <td className="py-2 px-4 border-b">{produto.destaque ? 'Sim' : 'Não'}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/produtos/${produto.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => excluirProduto(produto.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
