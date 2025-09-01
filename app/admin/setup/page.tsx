'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { clientAuth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

export default function ConfigPage() {
  const [email, setEmail] = useState('admin@lemonpapelaria.com.br');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    if (!clientAuth) {
      setError('Erro na inicialização do Firebase. Tente novamente mais tarde.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Criar o usuário administrador
      await createUserWithEmailAndPassword(clientAuth, email, password);
      setSuccess('Usuário administrador criado com sucesso! Agora você pode fazer login.');
      setPassword('');
      setConfirmPassword('');
    } catch (error: Error | unknown) {
      console.error('Erro ao criar usuário:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('Este email já está em uso. Tente fazer login ou recuperar a senha.');
        } else if (error.code === 'auth/invalid-email') {
          setError('Email inválido.');
        } else {
          setError('Ocorreu um erro ao criar o usuário. Por favor, tente novamente.');
        }
      } else {
        setError('Ocorreu um erro desconhecido. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Configuração Inicial</h1>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-700">
              Esta página é para configuração inicial do sistema. Crie um usuário administrador para acessar as áreas protegidas.
            </p>
          </div>
          
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
          
          <form onSubmit={handleSetup}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email do Administrador
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">A senha deve ter pelo menos 6 caracteres.</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Criando...' : 'Criar Usuário Administrador'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
