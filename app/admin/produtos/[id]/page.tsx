'use client';

import AdminAuthStatus from '@/components/admin-auth-status';
import AdminProtect from '@/components/admin-protect';
import { ProdutoFormData } from '@/types/produto';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function EditarProduto({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
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
      carregarProduto();
    }
  }, [id, isEdicao]);

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

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'preco') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else if (name === 'estoque') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  }

  function adicionarCategoria() {
    if (categoriaInput.trim() && !formData.categorias.includes(categoriaInput.trim())) {
      setFormData({
        ...formData,
        categorias: [...formData.categorias, categoriaInput.trim()]
      });
      setCategoriaInput('');
    }
  }

  function removerCategoria(categoria: string) {
    setFormData({
      ...formData,
      categorias: formData.categorias.filter(cat => cat !== categoria)
    });
  }

  function adicionarImagem() {
    if (imagemInput.trim() && !formData.imagens.includes(imagemInput.trim())) {
      setFormData({
        ...formData,
        imagens: [...formData.imagens, imagemInput.trim()]
      });
      setImagemInput('');
    }
  }

  function removerImagem(imagem: string) {
    setFormData({
      ...formData,
      imagens: formData.imagens.filter(img => img !== imagem)
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
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
        throw new Error('Erro ao salvar produto');
      }
      
      router.push('/admin/produtos');
    } catch (err) {
      console.error('Erro:', err);
      setError('Não foi possível salvar o produto. Verifique os dados e tente novamente.');
    }
  }

  if (loading) {
    return (
      <AdminProtect>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Carregando produto...</h1>
        </div>
      </AdminProtect>
    );
  }

  return (
    <AdminProtect>
      <div className="container mx-auto py-8 px-4">
        <AdminAuthStatus />
        
        <h1 className="text-2xl font-bold mb-6">{isEdicao ? 'Editar' : 'Novo'} Produto</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
          <input
            type="number"
            id="estoque"
            name="estoque"
            value={formData.estoque}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="destaque"
              name="destaque"
              checked={formData.destaque}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="destaque" className="ml-2 block text-sm text-gray-900">
              Produto em destaque
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categorias</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={categoriaInput}
              onChange={(e) => setCategoriaInput(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mr-2"
              placeholder="Adicione uma categoria"
            />
            <button
              type="button"
              onClick={adicionarCategoria}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Adicionar
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.categorias.map((cat) => (
              <div key={cat} className="bg-blue-100 rounded-full py-1 px-3 flex items-center">
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => removerCategoria(cat)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagens (URLs)</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={imagemInput}
              onChange={(e) => setImagemInput(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mr-2"
              placeholder="URL da imagem"
            />
            <button
              type="button"
              onClick={adicionarImagem}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Adicionar
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.imagens.map((img) => (
              <div key={img} className="border p-2 rounded">
                <img src={img} alt="Preview" className="h-20 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => removerImagem(img)}
                  className="mt-1 text-red-500 block w-full text-center"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Salvar Produto
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/produtos')}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
    </AdminProtect>
  );
}
