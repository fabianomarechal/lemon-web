'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCarrinho } from '@/contexts/carrinho-context'
import { useCreatePreference } from '@/hooks/use-create-preference'
import { DadosCliente } from '@/lib/types/carrinho'
import { CreditCard, Loader2, Mail, MapPin, Phone, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CheckoutFormProps {
  onSuccess?: (preferenceId: string) => void
  onError?: (error: string) => void
}

export function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
  const router = useRouter()
  const { carrinho, limparCarrinho } = useCarrinho()
  const { createPreference, loading, error } = useCreatePreference()

  const [dadosCliente, setDadosCliente] = useState<DadosCliente>({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    endereco: {
      nome: '',
      telefone: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('endereco.')) {
      const enderecoField = field.split('.')[1]
      setDadosCliente(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }))
    } else {
      setDadosCliente(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Limpar erro do campo quando começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validações obrigatórias
    if (!dadosCliente.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!dadosCliente.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(dadosCliente.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!dadosCliente.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    }

    // Validações de endereço
    if (!dadosCliente.endereco.cep.trim()) {
      newErrors['endereco.cep'] = 'CEP é obrigatório'
    }

    if (!dadosCliente.endereco.rua.trim()) {
      newErrors['endereco.rua'] = 'Rua é obrigatória'
    }

    if (!dadosCliente.endereco.numero.trim()) {
      newErrors['endereco.numero'] = 'Número é obrigatório'
    }

    if (!dadosCliente.endereco.bairro.trim()) {
      newErrors['endereco.bairro'] = 'Bairro é obrigatório'
    }

    if (!dadosCliente.endereco.cidade.trim()) {
      newErrors['endereco.cidade'] = 'Cidade é obrigatória'
    }

    if (!dadosCliente.endereco.estado.trim()) {
      newErrors['endereco.estado'] = 'Estado é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (carrinho.itens.length === 0) {
      onError?.('Carrinho está vazio')
      return
    }

    try {
      // Preparar dados para o Mercado Pago
      const items = carrinho.itens.map((item) => ({
        id: item.id,
        title: item.nome,
        quantity: item.quantidade,
        unit_price: item.preco,
        currency_id: 'BRL'
      }))

      const payer = {
        name: dadosCliente.nome,
        email: dadosCliente.email,
        phone: {
          number: dadosCliente.telefone
        },
        address: {
          zip_code: dadosCliente.endereco.cep,
          street_name: dadosCliente.endereco.rua,
          street_number: dadosCliente.endereco.numero
        }
      }

      const externalReference = `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Criar preferência no Mercado Pago
      const preference = await createPreference({
        items,
        payer,
        external_reference: externalReference
      })

      if (preference) {
        // Salvar dados do pedido localmente (opcional)
        localStorage.setItem('ultimo-pedido', JSON.stringify({
          id: externalReference,
          dadosCliente,
          items: carrinho.itens,
          total: carrinho.total,
          createdAt: new Date().toISOString()
        }))

        // Limpar carrinho
        limparCarrinho()

        // Redirecionar para o Mercado Pago
        const initPoint = process.env.NODE_ENV === 'production' 
          ? preference.init_point 
          : preference.sandbox_init_point

        window.location.href = initPoint

        onSuccess?.(preference.id)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pedido'
      onError?.(errorMessage)
    }
  }

  if (carrinho.itens.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
          <Button 
            onClick={() => router.push('/produtos')} 
            className="mt-4"
          >
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
      {/* Formulário de dados do cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados pessoais */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={dadosCliente.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={dadosCliente.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    type="tel"
                    value={dadosCliente.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={`pl-10 ${errors.telefone ? 'border-red-500' : ''}`}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                {errors.telefone && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <Label className="text-base font-semibold">Endereço de Entrega</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    type="text"
                    value={dadosCliente.endereco.cep}
                    onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
                    className={errors['endereco.cep'] ? 'border-red-500' : ''}
                    placeholder="00000-000"
                  />
                  {errors['endereco.cep'] && (
                    <p className="text-sm text-red-500 mt-1">{errors['endereco.cep']}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    type="text"
                    value={dadosCliente.endereco.estado}
                    onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
                    className={errors['endereco.estado'] ? 'border-red-500' : ''}
                    placeholder="SP"
                  />
                  {errors['endereco.estado'] && (
                    <p className="text-sm text-red-500 mt-1">{errors['endereco.estado']}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="rua">Rua *</Label>
                <Input
                  id="rua"
                  type="text"
                  value={dadosCliente.endereco.rua}
                  onChange={(e) => handleInputChange('endereco.rua', e.target.value)}
                  className={errors['endereco.rua'] ? 'border-red-500' : ''}
                />
                {errors['endereco.rua'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['endereco.rua']}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    type="text"
                    value={dadosCliente.endereco.numero}
                    onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                    className={errors['endereco.numero'] ? 'border-red-500' : ''}
                  />
                  {errors['endereco.numero'] && (
                    <p className="text-sm text-red-500 mt-1">{errors['endereco.numero']}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    type="text"
                    value={dadosCliente.endereco.complemento}
                    onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
                    placeholder="Apto, bloco, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  type="text"
                  value={dadosCliente.endereco.bairro}
                  onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                  className={errors['endereco.bairro'] ? 'border-red-500' : ''}
                />
                {errors['endereco.bairro'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['endereco.bairro']}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  type="text"
                  value={dadosCliente.endereco.cidade}
                  onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                  className={errors['endereco.cidade'] ? 'border-red-500' : ''}
                />
                {errors['endereco.cidade'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['endereco.cidade']}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Finalizar Compra
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resumo do pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {carrinho.itens.map((item) => (
            <div key={`${item.id}-${item.cor || ''}-${item.tamanho || ''}`} className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">{item.nome}</p>
                {(item.cor || item.tamanho) && (
                  <p className="text-sm text-muted-foreground">
                    {item.cor && `Cor: ${item.cor}`}
                    {item.cor && item.tamanho && ' • '}
                    {item.tamanho && `Tamanho: ${item.tamanho}`}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Quantidade: {item.quantidade}
                </p>
              </div>
              <p className="font-medium">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </p>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {carrinho.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>R$ {(carrinho.frete || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {carrinho.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}