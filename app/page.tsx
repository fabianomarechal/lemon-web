import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

// Definição inline do tipo para evitar problemas de importação
interface ProdutoSimples {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagens?: string[];
  destaque?: boolean;
}

export default async function HomePage() {
  // Buscar produtos em destaque pelo lado do cliente
  const produtosDestaque: ProdutoSimples[] = [];
  
  try {
    // Usando a URL absoluta que funciona em qualquer ambiente
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';
    
    const res = await fetch(new URL('/api/produtos?destaque=true', baseUrl || 'http://localhost:3000'), {
      next: { revalidate: 300 } // Revalidate a cada 5 minutos
    });
    
    if (res.ok) {
      const data = await res.json();
      produtosDestaque.push(...data);
    }
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
  }
  
  // Cores alternadas para os produtos
  const bgColors = [
    'bg-yellow-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-blue-100',
    'bg-pink-100',
  ];
  
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-yellow-50 py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Lemon Papelaria</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Artigos de papelaria e escritório de qualidade para todas as suas necessidades.
            </p>
            <Link href="/produtos" className="bg-yellow-500 text-white py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors text-lg font-medium">
              Ver Produtos
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Produtos em Destaque</h2>
              <Link href="/produtos" className="text-pink-500 hover:text-pink-700 font-medium">
                Ver todos →
              </Link>
            </div>
            
            {produtosDestaque.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum produto em destaque encontrado</p>
                <Link href="/produtos" className="inline-block mt-4 text-pink-500 hover:text-pink-700">
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {produtosDestaque.slice(0, 4).map((produto, index) => (
                  <Link
                    href={`/produtos/${produto.id}`}
                    key={produto.id}
                    className={`${bgColors[index % bgColors.length]} rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300`}
                  >
                    <div className="w-full h-56 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center">
                      {produto.imagens && produto.imagens.length > 0 ? (
                        <img 
                          src={produto.imagens[0]} 
                          alt={produto.nome} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🍋</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-800">{produto.nome}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{produto.descricao}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-xl text-pink-500">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(produto.preco)}
                        </span>
                        <div className="bg-yellow-400 text-white px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors">
                          Comprar
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16" style={{ backgroundColor: "#F7DC6F" }}>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Inscreva-se na nossa Newsletter!</h2>
            <p className="text-gray-600 mb-8">Receba novidades e promoções exclusivas no seu e-mail.</p>
            <div className="flex justify-center max-w-md mx-auto">
              <input
                className="px-4 py-3 flex-1 rounded-l-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Seu melhor e-mail"
                type="email"
              />
              <button className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-r-full hover:bg-pink-600 transition-colors">
                Inscrever
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
