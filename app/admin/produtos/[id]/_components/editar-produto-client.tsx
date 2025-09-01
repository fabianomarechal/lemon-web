'use client';

import AdminAuthStatus from '@/components/admin-auth-status';
import AdminProtect from '@/components/admin-protect';
import { ProdutoFormData } from '@/types/produto';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface EditarProdutoClientProps {
  id: string;
}

export default function EditarProdutoClient({ id }: EditarProdutoClientProps) {
  const router = useRouter();
  const isEdicao = id !== 'novo';
  
  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    descricao: '',
    preco: 0,
    categorias: [],
    imagens: [],
    estoque: 0,
    destaque: false
  });
  
  const [categoriaInput, setCategoriaInput] = useState('');
  const [imagemInput, setImagemInput] = useState('');
  const [loading, setLoading] = useState(isEdicao);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdicao) {
      async function carregarProduto() {
        try {
          const res = await fetch(`/api/produtos/${id}`);
          
          if (!res.ok) {
            throw new Error('Produto não encontrado');
          }
          
          const produto = await res.json();
          setFormData({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            categorias: produto.categorias || [],
            imagens: produto.imagens || [],
            estoque: produto.estoque,
            destaque: produto.destaque
          });
        } catch (err) {
          console.error('Erro ao carregar produto:', err);
          setError('Não foi possível carregar o produto. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      }
      
      carregarProduto();
    }
  }, [id, isEdicao]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'destaque') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (name === 'preco') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'estoque') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddCategoria = () => {
    if (categoriaInput.trim()) {
      setFormData(prev => ({
        ...prev,
        categorias: [...prev.categorias, categoriaInput.trim()]
      }));
      setCategoriaInput('');
    }
  };
  
  const handleRemoveCategoria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddImagem = () => {
    if (imagemInput.trim()) {
      setFormData(prev => ({
        ...prev,
        imagens: [...prev.imagens, imagemInput.trim()]
      }));
      setImagemInput('');
    }
  };
  
  const handleRemoveImagem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const url = isEdicao ? `/api/produtos/${id}` : '/api/produtos';
      const method = isEdicao ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error('Falha ao salvar produto');
      }
      
      router.push('/admin/produtos');
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setError('Não foi possível salvar o produto. Tente novamente mais tarde.');
    }
  };

  return (
    <AdminProtect>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-6">{isEdicao ? 'Editar' : 'Novo'} Produto</h1>
            <AdminAuthStatus />
          </div>
          
          <button 
            onClick={() => router.push('/admin/produtos')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Voltar para lista
          </button>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl">Carregando produto...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Preço */}
                  <div>
                    <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="preco"
                      name="preco"
                      value={formData.preco}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Estoque */}
                  <div>
                    <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">Estoque</label>
                    <input
                      type="number"
                      id="estoque"
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Descrição */}
                  <div className="col-span-2">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Destaque */}
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="destaque"
                        name="destaque"
                        checked={formData.destaque}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="destaque" className="ml-2 block text-sm text-gray-700">Produto em Destaque</label>
                    </div>
                  </div>
                  
                  {/* Categorias */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.categorias.map((categoria, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                          <span>{categoria}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveCategoria(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={categoriaInput}
                        onChange={(e) => setCategoriaInput(e.target.value)}
                        placeholder="Adicionar categoria"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategoria}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                  
                  {/* Imagens */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagens (URLs)</label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.imagens.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt="Preview" className="h-20 w-auto object-contain" />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImagem(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={imagemInput}
                        onChange={(e) => setImagemInput(e.target.value)}
                        placeholder="URL da imagem"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddImagem}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isEdicao ? 'Atualizar' : 'Criar'} Produto
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminProtect>
  );
}
