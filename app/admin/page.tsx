'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo à área administrativa da Lemon</p>
      </div>
        
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Produtos</h2>
          <p className="text-gray-600 mb-4">Gerencie o catálogo de produtos da loja.</p>
          <Link href="/admin/produtos" className="bg-teal-600 text-white py-2 px-4 rounded block text-center hover:bg-teal-700 transition-colors">
            Gerenciar Produtos
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Cores</h2>
          <p className="text-gray-600 mb-4">Gerencie as opções de cores para os produtos.</p>
          <Link href="/admin/cores" className="bg-cyan-600 text-white py-2 px-4 rounded block text-center hover:bg-cyan-700 transition-colors">
            Gerenciar Cores
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Pedidos</h2>
          <p className="text-gray-600 mb-4">Visualize e gerencie os pedidos dos clientes.</p>
          <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded block text-center cursor-not-allowed">
            Em breve
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Clientes</h2>
          <p className="text-gray-600 mb-4">Acesse a base de clientes da loja.</p>
          <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded block text-center cursor-not-allowed">
            Em breve
          </div>
        </div>
      </div>
    </div>
  );
}
