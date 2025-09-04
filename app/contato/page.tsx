"use client"

import type React from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { useState } from "react"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-fredoka text-5xl md:text-6xl mb-4 text-shadow">Contato</h1>
            <p className="text-xl md:text-2xl">Estamos aqui para ajudar! Entre em contato conosco</p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Fale Conosco</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">✉️</div>
                    <div>
                      <h3 className="font-semibold text-slate-800">E-mail</h3>
                      <p className="text-slate-600">contato@lemonpapelaria.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Horário de Atendimento Online</h3>
                      <p className="text-slate-600">
                        Segunda a Sexta: 9h às 18h
                        <br />
                        Sábado: 9h às 14h
                        <br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="font-semibold text-slate-800 mb-4">Siga-nos nas Redes Sociais</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.instagram.com/lemonpapelaria/" className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors">
                      📷 Instagram
                    </a>
                    <a href="#" className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                      📘 Facebook
                    </a>
                    <a href="#" className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-colors">
                      📌 Pinterest
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-cyan-50 rounded-lg p-8 border border-cyan-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Envie sua Mensagem</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-slate-700 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida-produto">Dúvida sobre produto</option>
                      <option value="pedido">Informações sobre pedido</option>
                      <option value="troca-devolucao">Troca ou devolução</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="parceria">Parceria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-slate-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      rows={5}
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors shadow-lg"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Perguntas Frequentes</h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Qual o prazo de entrega?",
                  answer:
                    "O prazo de entrega varia de 3 a 7 dias úteis, dependendo da sua localização. Produtos em estoque são enviados em até 24h após a confirmação do pagamento.",
                },
                {
                  question: "Vocês fazem entregas em todo o Brasil?",
                  answer:
                    "Sim! Fazemos entregas para todo o território nacional através dos Correios e transportadoras parceiras.",
                },
                {
                  question: "Como posso trocar ou devolver um produto?",
                  answer:
                    "Você tem até 7 dias após o recebimento para solicitar troca ou devolução. Entre em contato conosco e te ajudaremos com todo o processo.",
                },
                {
                  question: "Vocês têm loja física?",
                  answer:
                    "Atualmente operamos exclusivamente online, oferecendo uma experiência de compra prática e segura para nossos clientes em todo o Brasil.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-cyan-100">
                  <h3 className="font-semibold text-lg text-slate-800 mb-3">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
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
