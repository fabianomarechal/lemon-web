import Footer from "@/components/footer";
import Header from "@/components/header";
import { adminDb } from "@/lib/firebase/admin";
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

async function getProdutosDestaque(): Promise<ProdutoSimples[]> {
  try {
    if (!adminDb) {
      console.error('Firebase Admin não inicializado');
      return [];
    }

    console.log('Buscando produtos em destaque diretamente do Firebase');
    
    const snapshot = await adminDb
      .collection('produtos')
      .where('destaque', '==', true)
      .limit(4)
      .get();
    
    console.log('Documentos encontrados:', snapshot.size);
    
    const produtos: ProdutoSimples[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      produtos.push({
        id: doc.id,
        nome: data.nome || '',
        descricao: data.descricao || '',
        preco: data.preco || 0,
        imagens: data.imagens || [],
        destaque: data.destaque || false,
      });
    });
    
    console.log('Produtos retornados:', produtos.length);
    return produtos;
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return [];
  }
}

export default async function HomePage() {
  const produtosDestaque = await getProdutosDestaque();
  
  // Cores alternadas para os produtos - paleta análoga fria (azuis e verdes)
  const bgColors = [
    'bg-blue-50',
    'bg-cyan-50',
    'bg-teal-50',
    'bg-sky-50',
    'bg-blue-50',
  ];
  
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">Lemon Papelaria</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-700">
              Artigos de papelaria e escritório de qualidade para todas as suas necessidades.
            </p>
            <Link href="/produtos" className="bg-teal-500 text-white py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors text-lg font-medium shadow-lg">
              Ver Produtos
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Produtos em Destaque</h2>
              <Link href="/produtos" className="text-teal-600 hover:text-teal-700 font-medium">
                Ver todos →
              </Link>
            </div>
            
            {produtosDestaque.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Nenhum produto em destaque encontrado</p>
                <Link href="/produtos" className="inline-block mt-4 text-teal-600 hover:text-teal-700">
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {produtosDestaque.slice(0, 4).map((produto, index) => (
                  <Link
                    href={`/produtos/${produto.id}`}
                    key={produto.id}
                    className={`${bgColors[index % bgColors.length]} rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-cyan-100`}
                  >
                    <div className="w-full h-56 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
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
                      <h3 className="font-semibold text-lg text-slate-800">{produto.nome}</h3>
                      <p className="text-slate-600 mt-2 line-clamp-2">{produto.descricao}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-xl text-teal-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(produto.preco)}
                        </span>
                        <div className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors">
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
        <section className="py-16 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Inscreva-se na nossa Newsletter!</h2>
            <p className="text-slate-600 mb-8">Receba novidades e promoções exclusivas no seu e-mail.</p>
            <div className="flex justify-center max-w-md mx-auto">
              <input
                className="px-4 py-3 flex-1 rounded-l-full focus:outline-none focus:ring-2 focus:ring-teal-400 border border-cyan-200"
                placeholder="Seu melhor e-mail"
                type="email"
              />
              <button className="bg-teal-500 text-white font-semibold px-6 py-3 rounded-r-full hover:bg-teal-600 transition-colors">
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
