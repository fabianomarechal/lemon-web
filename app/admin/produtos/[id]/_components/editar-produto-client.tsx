'use client';

import AdminAuthStatus from '@/components/admin-auth-status';
import AdminProtect from '@/components/admin-protect';
import MultiImageUpload from '@/components/multi-image-upload';
import { ProdutoFormData } from '@/types/produto';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(isEdicao);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      imagens: images
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEdicao) {
        const response = await fetch(`/api/admin/produtos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar produto');
        }

        toast.success('Produto atualizado com sucesso!');
      } else {
        const response = await fetch('/api/admin/produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar produto');
        }

        toast.success('Produto criado com sucesso!');
        // Redirecionar para a página de listagem ou para o produto criado
        router.push('/admin/produtos');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao salvar o produto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminProtect>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
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
                    <MultiImageUpload 
                      existingImages={formData.imagens} 
                      onImagesChange={handleImagesChange}
                      maxImages={5}
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${
                      saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center`}
                  >
                    {saving && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {saving ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Criar')} {!saving && 'Produto'}
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
