import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <Image src="/images/girafa-logo.svg" alt="Girafa de Papel" width={32} height={32} className="mr-2" />
          <span className="font-fredoka text-2xl text-white">Girafa de Papel</span>
        </div>
        <p className="mb-4 text-gray-300">© 2024 Girafa de Papel - Papelaria Criativa. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-4">
          <Link href="https://www.instagram.com/girafadepapel/" className="hover:text-cyan-400 transition-colors text-gray-300">
            Instagram
          </Link>
          <Link href="#" className="hover:text-cyan-400 transition-colors text-gray-300">
            Facebook
          </Link>
          <Link href="#" className="hover:text-cyan-400 transition-colors text-gray-300">
            Pinterest
          </Link>
        </div>
      </div>
    </footer>
  )
}
