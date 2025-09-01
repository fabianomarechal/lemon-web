import Footer from "@/components/footer"
import Header from "@/components/header"

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
        <section className="py-16 bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-fredoka text-5xl md:text-6xl mb-4 text-shadow">Sobre Nós</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Conheça a história por trás da Lemon e nossa paixão por papelaria criativa
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa História</h2>
                  <p className="text-gray-600 mb-4">
                    A Lemon nasceu do sonho de duas amigas apaixonadas por papelaria e criatividade. Em 2020, durante a
                    pandemia, descobrimos que pequenos momentos criativos podem transformar nosso dia e trazer mais cor
                    para nossa rotina.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Começamos vendendo produtos artesanais para amigos e família, e logo percebemos que havia uma
                    comunidade inteira de pessoas que, assim como nós, encontravam alegria nos detalhes fofos e
                    coloridos da papelaria.
                  </p>
                  <p className="text-gray-600">
                    Hoje, a Lemon é mais que uma loja - é um espaço onde a criatividade floresce e onde cada produto é
                    escolhido com carinho para inspirar momentos especiais no seu dia a dia.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-200 to-pink-200 rounded-lg p-8 text-center">
                  <div className="text-8xl mb-4">🍋</div>
                  <h3 className="font-fredoka text-2xl text-gray-800 mb-2">Lemon</h3>
                  <p className="text-gray-600">Papelaria que inspira</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16" style={{ backgroundColor: "#F7DC6F" }}>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa Missão</h2>
              <p className="text-xl text-gray-600 mb-8">
                &quot;Tornar a criatividade acessível e inspirar pessoas a expressarem sua personalidade única através de
                produtos de papelaria cuidadosamente selecionados, criando momentos especiais no dia a dia de cada
                cliente.&quot;
              </p>
              <div className="bg-pink-50 rounded-lg p-8">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Por que escolher a Lemon?</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
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
