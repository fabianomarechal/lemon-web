'use client';

import AdminAuthStatus from "@/components/admin-auth-status";
import AdminProtect from "@/components/admin-protect";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { clientAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    if (!clientAuth) {
      console.error('Auth não está inicializado');
      return;
    }
    
    try {
      await signOut(clientAuth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AdminProtect>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto py-8 px-4">
          <AdminAuthStatus />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Área Administrativa</h1>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Produtos</h2>
            <p className="text-gray-600 mb-4">Gerencie o catálogo de produtos da loja.</p>
            <Link href="/admin/produtos" className="bg-yellow-500 text-white py-2 px-4 rounded block text-center">
              Gerenciar Produtos
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
            <p className="text-gray-600 mb-4">Visualize e gerencie os pedidos dos clientes.</p>
            <Link href="#" className="bg-gray-300 text-gray-700 py-2 px-4 rounded block text-center cursor-not-allowed">
              Em breve
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Clientes</h2>
            <p className="text-gray-600 mb-4">Acesse a base de clientes da loja.</p>
            <Link href="#" className="bg-gray-300 text-gray-700 py-2 px-4 rounded block text-center cursor-not-allowed">
              Em breve
            </Link>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Configuração do Firebase</h2>
          <p className="text-gray-600 mb-4">
            Para configurar o Firebase, você precisa adicionar suas credenciais no arquivo <code>.env.local</code>.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Crie uma conta no Firebase (se ainda não tiver): <a href="https://firebase.google.com/" className="text-blue-600" target="_blank" rel="noopener noreferrer">https://firebase.google.com/</a></li>
            <li>Crie um novo projeto no Firebase</li>
            <li>Ative o Firestore Database no seu projeto</li>
            <li>Vá para Configurações do Projeto {'>'} Geral e encontre sua configuração web</li>
            <li>Gere uma nova chave privada em Configurações do Projeto {'>'} Contas de serviço</li>
            <li>Preencha o arquivo <code>.env.local</code> com suas credenciais do Firebase</li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
    </AdminProtect>
  );
}
