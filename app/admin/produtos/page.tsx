'use client';

import { Produto } from '@/types/produto';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

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
      console.error('Erro ao carregar:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  async function excluirProduto(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
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
      <div>
        <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 mb-6 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => carregarProdutos()} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Link href="/admin/produtos/novo" className="bg-teal-600 text-white flex items-center px-4 py-2 rounded hover:bg-teal-700">
          <FaPlus className="mr-2" /> Novo Produto
        </Link>
      </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Categoria</th>
                <th className="py-3 px-4 text-left">Preço</th>
                <th className="py-3 px-4 text-left">Peso</th>
                <th className="py-3 px-4 text-left">Estoque</th>
                <th className="py-3 px-4 text-left">Destaque</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                produtos.map(produto => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4">{produto.categorias?.join(', ') || '-'}</td>
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(produto.preco)}
                    </td>
                    <td className="py-3 px-4">
                      {produto.peso && produto.peso > 0 
                        ? produto.peso >= 1000 
                          ? `${(produto.peso / 1000).toFixed(produto.peso % 1000 === 0 ? 0 : 1)} kg`
                          : `${produto.peso} g`
                        : '-'
                      }
                    </td>
                    <td className="py-3 px-4">{produto.estoque}</td>
                    <td className="py-3 px-4">{produto.destaque ? 'Sim' : 'Não'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link 
                          href={`/admin/produtos/${produto.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => excluirProduto(produto.id!)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}
