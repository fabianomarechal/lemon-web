import { Fredoka as Fredoka_One, Poppins } from "next/font/google"
import type React from "react"
import "./globals.css"

const fredokaOne = Fredoka_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
})

const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Girafa de Papel - Papelaria Criativa",
  description: "Sua papelaria criativa online. Produtos únicos e de qualidade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${fredokaOne.variable} ${poppins.variable}`}>
      <body className="font-sans bg-blue-100">{children}</body>
    </html>
  )
}
