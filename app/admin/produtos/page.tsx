'use client';

import { Produto } from '@/types/produto';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEdit, FaFilter, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';

export default function AdminProdutos() {
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDestaque, setFiltroDestaque] = useState('');
  const [filtroEstoque, setFiltroEstoque] = useState('');
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  // Categorias únicas para o filtro
  const categorias = useMemo(() => {
    const todasCategorias = todosProdutos.flatMap(produto => produto.categorias || []);
    return [...new Set(todasCategorias)].sort();
  }, [todosProdutos]);

  // Produtos filtrados
  const produtosFiltrados = useMemo(() => {
    return todosProdutos.filter(produto => {
      const nomeMatch = filtroNome === '' || produto.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const categoriaMatch = filtroCategoria === '' || produto.categorias?.includes(filtroCategoria);
      const destaqueMatch = filtroDestaque === '' || 
        (filtroDestaque === 'sim' && produto.destaque) || 
        (filtroDestaque === 'nao' && !produto.destaque);
      const estoqueMatch = filtroEstoque === '' ||
        (filtroEstoque === 'semEstoque' && produto.estoque === 0) ||
        (filtroEstoque === 'comEstoque' && produto.estoque > 0) ||
        (filtroEstoque === 'baixoEstoque' && produto.estoque > 0 && produto.estoque <= 5);
      
      return nomeMatch && categoriaMatch && destaqueMatch && estoqueMatch;
    });
  }, [todosProdutos, filtroNome, filtroCategoria, filtroDestaque, filtroEstoque]);

  // Produtos paginados
  const produtosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return produtosFiltrados.slice(inicio, fim);
  }, [produtosFiltrados, paginaAtual, itensPorPagina]);

  // Cálculos de paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  const temPaginaAnterior = paginaAtual > 1;
  const temProximaPagina = paginaAtual < totalPaginas;

  // Reset da página quando os filtros mudam
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroCategoria, filtroDestaque, filtroEstoque]);

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroCategoria('');
    setFiltroDestaque('');
    setFiltroEstoque('');
    setPaginaAtual(1);
  };

  async function carregarProdutos() {
    try {
      setLoading(true);
      const res = await fetch('/api/produtos');
      if (!res.ok) {
        throw new Error('Falha ao carregar produtos');
      }
      
      const data = await res.json();
      setTodosProdutos(data);
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
      setTodosProdutos(todosProdutos.filter(produto => produto.id !== id));
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

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaFilter className="mr-2" />
            Filtros
          </h3>
          <button
            onClick={limparFiltros}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do produto
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Filtro por categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por destaque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto em destaque
            </label>
            <select
              value={filtroDestaque}
              onChange={(e) => setFiltroDestaque(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todos</option>
              <option value="sim">Em destaque</option>
              <option value="nao">Não destacados</option>
            </select>
          </div>

          {/* Filtro por estoque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Situação do estoque
            </label>
            <select
              value={filtroEstoque}
              onChange={(e) => setFiltroEstoque(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todos</option>
              <option value="comEstoque">Com estoque</option>
              <option value="baixoEstoque">Baixo estoque (≤ 5)</option>
              <option value="semEstoque">Sem estoque</option>
            </select>
          </div>
        </div>

        {/* Informações dos resultados */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {produtosFiltrados.length} produto(s) de {todosProdutos.length} total
        </div>
      </div>

      {/* Controles de paginação superior */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Itens por página:</span>
          <select
            value={itensPorPagina}
            onChange={(e) => setItensPorPagina(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              disabled={!temPaginaAnterior}
              className={`px-3 py-1 rounded text-sm ${
                temPaginaAnterior
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>

            <span className="text-sm text-gray-700">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              disabled={!temProximaPagina}
              className={`px-3 py-1 rounded text-sm ${
                temProximaPagina
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
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
              {produtosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                    {produtosFiltrados.length === 0 && todosProdutos.length > 0 
                      ? 'Nenhum produto encontrado com os filtros aplicados.'
                      : 'Nenhum produto cadastrado.'
                    }
                  </td>
                </tr>
              ) : (
                produtosPaginados.map(produto => (
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
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        produto.estoque === 0 
                          ? 'bg-red-100 text-red-800'
                          : produto.estoque <= 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {produto.estoque}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        produto.destaque 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {produto.destaque ? 'Sim' : 'Não'}
                      </span>
                    </td>
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

        {/* Paginação inferior */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPaginaAtual(1)}
                disabled={paginaAtual === 1}
                className={`px-3 py-2 rounded text-sm ${
                  paginaAtual === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Primeira
              </button>

              <button
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={!temPaginaAnterior}
                className={`px-3 py-2 rounded text-sm ${
                  temPaginaAnterior
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>

              {/* Páginas numeradas */}
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pageNum;
                if (totalPaginas <= 5) {
                  pageNum = i + 1;
                } else if (paginaAtual <= 3) {
                  pageNum = i + 1;
                } else if (paginaAtual >= totalPaginas - 2) {
                  pageNum = totalPaginas - 4 + i;
                } else {
                  pageNum = paginaAtual - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPaginaAtual(pageNum)}
                    className={`px-3 py-2 rounded text-sm ${
                      paginaAtual === pageNum
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={!temProximaPagina}
                className={`px-3 py-2 rounded text-sm ${
                  temProximaPagina
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setPaginaAtual(totalPaginas)}
                disabled={paginaAtual === totalPaginas}
                className={`px-3 py-2 rounded text-sm ${
                  paginaAtual === totalPaginas
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Última
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
