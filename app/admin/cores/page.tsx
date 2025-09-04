'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { useState, useEffect } from 'react';

interface Cor {
  id?: string;
  nome: string;
  codigo: string; // Código hexadecimal da cor
}

export default function CoresPage() {
  const [cores, setCores] = useState<Cor[]>([]);
  const [novaCor, setNovaCor] = useState<Cor>({ nome: '', codigo: '#000000' });
  const [editandoCor, setEditandoCor] = useState<Cor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar cores ao montar o componente
  useEffect(() => {
    carregarCores();
  }, []);

  const carregarCores = async () => {
    try {
      const response = await fetch('/api/admin/cores');
      if (response.ok) {
        const data = await response.json();
        setCores(data);
      }
    } catch (error) {
      console.error('Erro ao carregar cores:', error);
    }
  };

  const handleSalvarCor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const corParaSalvar = editandoCor || novaCor;
      const method = editandoCor ? 'PUT' : 'POST';
      const url = editandoCor 
        ? `/api/admin/cores/${editandoCor.id}` 
        : '/api/admin/cores';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(corParaSalvar),
      });

      if (response.ok) {
        setSuccess(editandoCor ? 'Cor atualizada com sucesso!' : 'Cor criada com sucesso!');
        setNovaCor({ nome: '', codigo: '#000000' });
        setEditandoCor(null);
        carregarCores();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao salvar cor');
      }
    } catch (error) {
      setError('Erro ao salvar cor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirCor = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta cor?')) return;

    try {
      const response = await fetch(`/api/admin/cores/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Cor excluída com sucesso!');
        carregarCores();
      } else {
        setError('Erro ao excluir cor');
      }
    } catch (error) {
      setError('Erro ao excluir cor. Tente novamente.');
    }
  };

  const iniciarEdicao = (cor: Cor) => {
    setEditandoCor(cor);
    setNovaCor({ nome: '', codigo: '#000000' });
  };

  const cancelarEdicao = () => {
    setEditandoCor(null);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gerenciar Cores</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Formulário para adicionar/editar cor */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editandoCor ? 'Editar Cor' : 'Adicionar Nova Cor'}
            </h2>
            
            <form onSubmit={handleSalvarCor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="nome" className="block text-gray-700 mb-2">
                  Nome da Cor
                </label>
                <input
                  type="text"
                  id="nome"
                  value={editandoCor?.nome || novaCor.nome}
                  onChange={(e) => {
                    if (editandoCor) {
                      setEditandoCor({ ...editandoCor, nome: e.target.value });
                    } else {
                      setNovaCor({ ...novaCor, nome: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Ex: Azul Royal"
                  required
                />
              </div>

              <div>
                <label htmlFor="codigo" className="block text-gray-700 mb-2">
                  Código da Cor
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="codigo"
                    value={editandoCor?.codigo || novaCor.codigo}
                    onChange={(e) => {
                      if (editandoCor) {
                        setEditandoCor({ ...editandoCor, codigo: e.target.value });
                      } else {
                        setNovaCor({ ...novaCor, codigo: e.target.value });
                      }
                    }}
                    className="w-16 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editandoCor?.codigo || novaCor.codigo}
                    onChange={(e) => {
                      if (editandoCor) {
                        setEditandoCor({ ...editandoCor, codigo: e.target.value });
                      } else {
                        setNovaCor({ ...novaCor, codigo: e.target.value });
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    required
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : (editandoCor ? 'Atualizar' : 'Adicionar')}
                </button>
                
                {editandoCor && (
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de cores */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cores Cadastradas</h2>
            
            {cores.length === 0 ? (
              <p className="text-gray-500">Nenhuma cor cadastrada ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cores.map((cor) => (
                  <div key={cor.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: cor.codigo }}
                      ></div>
                      <div>
                        <h3 className="font-medium">{cor.nome}</h3>
                        <p className="text-sm text-gray-500">{cor.codigo}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicao(cor)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluirCor(cor.id!)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
