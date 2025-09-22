import BannerCarousel from "@/components/banner-carousel";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ProdutosCarousel from "@/components/produtos-carousel";
import { adminDb } from "@/lib/firebase/admin";
import { Banner } from "@/lib/types/banner";
import Image from "next/image";
import Link from "next/link";

// Use ISR (Incremental Static Regeneration) for better performance
// Page will be statically generated but revalidated every 5 minutes
// AND revalidated immediately when products are updated via revalidatePath()
export const revalidate = 300 // 5 minutes

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

    console.log('Buscando produtos para carousel diretamente do Firebase');

    // Buscar todos os produtos ativos (não apenas os em destaque)
    const snapshot = await adminDb
      .collection('produtos')
      .limit(12) // Buscar mais produtos para ter variedade no carousel
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
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

async function getBannersAtivos(): Promise<Banner[]> {
  try {
    if (!adminDb) {
      console.error('Firebase Admin não inicializado');
      return [];
    }

    const snapshot = await adminDb
      .collection('banners')
      .where('ativo', '==', true)
      .limit(3)
      .get();
    
    const banners: Banner[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      banners.push({
        id: doc.id,
        titulo: data.titulo || '',
        subtitulo: data.subtitulo || '',
        imagemUrl: data.imagemUrl || '',
        linkDestino: data.linkDestino || '',
        textoLink: data.textoLink || 'Ver Produtos',
        ativo: data.ativo || false,
        ordem: data.ordem || 1,
        criadoEm: data.criadoEm?.toDate(),
        atualizadoEm: data.atualizadoEm?.toDate()
      });
    });
    
    // Ordenar por ordem no lado do cliente
    banners.sort((a, b) => a.ordem - b.ordem);
    
    return banners;
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return [];
  }
}

export default async function HomePage() {
  const [produtosDestaque, bannersAtivos] = await Promise.all([
    getProdutosDestaque(),
    getBannersAtivos()
  ]);
  
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        {bannersAtivos.length > 0 ? (
          <BannerCarousel banners={bannersAtivos} />
        ) : (
          // Banner padrão caso não tenha banners cadastrados
          <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-24">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-8">
                <Image src="/images/girafa-logo-large.svg" alt="Girafa de Papel" width={200} height={200} priority />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">Girafa de Papel</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-700">
                Papelaria criativa e artigos únicos para dar vida às suas ideias.
              </p>
              <Link href="/produtos" className="bg-teal-500 text-white py-3 px-8 rounded-lg hover:bg-teal-600 transition-colors text-lg font-medium shadow-lg">
                Ver Produtos
              </Link>
            </div>
          </section>
        )}

        {/* Featured Products Carousel */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Produtos em Destaque</h2>
              <Link href="/produtos" className="text-teal-600 hover:text-teal-700 font-medium">
                Ver todos →
              </Link>
            </div>

            <ProdutosCarousel produtos={produtosDestaque} />
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
