import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <span className="text-3xl">🍋</span>
          <span className="font-fredoka text-2xl text-white ml-2">Lemon</span>
        </div>
        <p className="mb-4">© 2024 Lemon - Papelaria Criativa. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-4">
          <Link href="#" className="hover:text-pink-400 transition-colors">
            Instagram
          </Link>
          <Link href="#" className="hover:text-pink-400 transition-colors">
            Facebook
          </Link>
          <Link href="#" className="hover:text-pink-400 transition-colors">
            Pinterest
          </Link>
        </div>
      </div>
    </footer>
  )
}
