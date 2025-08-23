import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 p-6">
            <h1 className="font-fredoka text-6xl md:text-8xl text-shadow text-yellow-300">Lemon</h1>
            <p className="text-xl md:text-2xl mt-2 font-semibold">papelaria fofa e criativa</p>
            <Link
              href="/produtos"
              className="inline-block mt-8 px-8 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
            >
              Ver Produtos
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Novidades</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Caderno Limão Siciliano",
                  description: "Perfeito para suas anotações mais criativas!",
                  price: "R$ 25,00",
                  bg: "bg-blue-50",
                },
                {
                  name: "Kit Lápis Pastel",
                  description: "Cores suaves para dar vida aos seus desenhos.",
                  price: "R$ 18,00",
                  bg: "bg-pink-50",
                },
                {
                  name: "Pasta Organizadora",
                  description: "Mantenha tudo organizado com muito estilo.",
                  price: "R$ 32,00",
                  bg: "bg-blue-50",
                },
                {
                  name: "Washi Tapes Citrus",
                  description: "Decore seu planner, bullet journal e muito mais.",
                  price: "R$ 15,00",
                  bg: "bg-pink-50",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className={`${product.bg} rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300`}
                >
                  <div className="w-full h-56 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center">
                    <span className="text-6xl">🍋</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-bold text-xl text-pink-500">{product.price}</span>
                      <button className="bg-yellow-400 text-white px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
  )
}
