import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProdutosPage() {
  const categories = [
    { name: "Cadernos & Agendas", icon: "📓", count: 25 },
    { name: "Canetas & Lápis", icon: "✏️", count: 40 },
    { name: "Adesivos & Washi Tapes", icon: "🎨", count: 35 },
    { name: "Organizadores", icon: "📁", count: 20 },
    { name: "Papéis Especiais", icon: "📄", count: 15 },
    { name: "Kits Criativos", icon: "🎁", count: 12 },
  ]

  const products = [
    { name: "Caderno Limão Siciliano", price: "R$ 25,00", category: "Cadernos", bg: "bg-blue-50" },
    { name: "Kit Lápis Pastel", price: "R$ 18,00", category: "Canetas", bg: "bg-pink-50" },
    { name: "Pasta Organizadora", price: "R$ 32,00", category: "Organizadores", bg: "bg-blue-50" },
    { name: "Washi Tapes Citrus", price: "R$ 15,00", category: "Adesivos", bg: "bg-pink-50" },
    { name: "Agenda 2024 Limão", price: "R$ 45,00", category: "Agendas", bg: "bg-yellow-50" },
    { name: "Marcadores Fluorescentes", price: "R$ 22,00", category: "Canetas", bg: "bg-green-50" },
    { name: "Papel Scrapbook Citrus", price: "R$ 12,00", category: "Papéis", bg: "bg-orange-50" },
    { name: "Kit Bullet Journal", price: "R$ 65,00", category: "Kits", bg: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-fredoka text-5xl md:text-6xl mb-4 text-shadow">Nossos Produtos</h1>
            <p className="text-xl md:text-2xl">Descubra nossa coleção completa de papelaria criativa</p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-gray-50 hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} produtos</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Todos os Produtos</h2>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option>Ordenar por</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais populares</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={index}
                  className={`${product.bg} rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300`}
                >
                  <div className="w-full h-56 bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center">
                    <span className="text-6xl">🍋</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                    <h3 className="font-semibold text-lg text-gray-800 mt-1">{product.name}</h3>
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
      </main>

      <Footer />
    </div>
  )
}
