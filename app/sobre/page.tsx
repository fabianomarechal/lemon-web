'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Image from 'next/image';

export default function SobrePage() {
  const values = [
    {
      icon: "🎨",
      title: "Criatividade",
      description: "Acreditamos que cada pessoa tem um artista dentro de si esperando para ser descoberto.",
    },
    {
      icon: "💝",
      title: "Qualidade",
      description: "Selecionamos cuidadosamente cada produto para garantir a melhor experiência.",
    },
    {
      icon: "🌟",
      title: "Inspiração",
      description: "Nosso objetivo é inspirar você a criar, sonhar e expressar sua personalidade única.",
    },
    {
      icon: "🤝",
      title: "Comunidade",
      description: "Construímos uma comunidade de pessoas apaixonadas por papelaria e criatividade.",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-fredoka text-5xl md:text-6xl mb-4 text-shadow">Sobre Nós</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Conheça a história por trás da Girafa de Papel e nossa paixão por papelaria criativa
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-6">Nossa História</h2>
                  <p className="text-slate-600 mb-4">
                    A Girafa de Papel nasceu do sonho de criar um espaço onde a criatividade e a imaginação pudessem voar alto. Como uma girafa que alcança as alturas mais elevadas, nossa marca representa a busca constante por inspiração e originalidade.
                  </p>
                  <p className="text-slate-600 mb-4">
                    Começamos com a missão de oferecer produtos de papelaria únicos e especiais, que despertem a criança interior em cada pessoa. Acreditamos que cada folha em branco é uma oportunidade de criar algo extraordinário.
                  </p>
                  <p className="text-slate-600">
                    Hoje, a Girafa de Papel é mais que uma loja - é um universo onde sonhos tomam forma no papel e onde cada produto é escolhido com carinho para inspirar momentos mágicos de criação.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Image src="/images/girafa-logo.svg" alt="Girafa de Papel" width={80} height={80} />
                  </div>
                  <h3 className="font-fredoka text-2xl text-slate-800 mb-2">Girafa de Papel</h3>
                  <p className="text-slate-600">Criatividade que alcança as alturas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg border border-cyan-100">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-xl text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Nossa Missão</h2>
              <p className="text-xl text-slate-600 mb-8">
                &quot;Tornar a criatividade acessível e inspirar pessoas a expressarem sua personalidade única através de
                produtos de papelaria cuidadosamente selecionados, criando momentos especiais no dia a dia de cada
                cliente.&quot;
              </p>
              <div className="bg-yellow-50 rounded-lg p-8 border border-yellow-200">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">Por que escolher a Girafa de Papel?</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
                  <div>
                    <strong>Curadoria Especial:</strong> Cada produto é escolhido pensando na qualidade e no design
                    único.
                  </div>
                  <div>
                    <strong>Atendimento Personalizado:</strong> Nossa equipe está sempre pronta para ajudar você a
                    encontrar o produto perfeito.
                  </div>
                  <div>
                    <strong>Comunidade Criativa:</strong> Faça parte de uma comunidade que valoriza a criatividade e a
                    expressão pessoal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
