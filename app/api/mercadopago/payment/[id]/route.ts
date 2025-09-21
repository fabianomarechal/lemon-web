import { adminDb } from '@/lib/firebase/admin'
import { mercadopagoClient } from '@/lib/mercadopago/config'
import { Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar informações do pagamento no Mercado Pago
    const payment = new Payment(mercadopagoClient)
    
    try {
      const paymentDetails = await payment.get({ id: paymentId })

      // Mapear status para português
      const statusMapping: Record<string, string> = {
        'pending': 'pendente',
        'approved': 'aprovado',
        'authorized': 'autorizado',
        'in_process': 'processando',
        'in_mediation': 'mediacao',
        'rejected': 'rejeitado',
        'cancelled': 'cancelado',
        'refunded': 'reembolsado',
        'charged_back': 'estornado'
      }

      const status = statusMapping[paymentDetails.status || ''] || 'desconhecido'

      // Buscar informações complementares no Firebase
      let firebaseData = null
      if (adminDb && paymentDetails.external_reference) {
        try {
          const docRef = (adminDb as any).collection('pagamentos').doc(paymentDetails.external_reference)
          const docSnapshot = await docRef.get()
          
          if (docSnapshot.exists) {
            firebaseData = docSnapshot.data()
          }
        } catch (firebaseError) {
          console.error('Erro ao buscar dados no Firebase:', firebaseError)
        }
      }

      // Resposta estruturada
      const response = {
        id: paymentDetails.id,
        status,
        status_detail: paymentDetails.status_detail,
        external_reference: paymentDetails.external_reference,
        transaction_amount: paymentDetails.transaction_amount,
        currency_id: paymentDetails.currency_id,
        payment_method_id: paymentDetails.payment_method_id,
        payment_type_id: paymentDetails.payment_type_id,
        installments: paymentDetails.installments,
        date_created: paymentDetails.date_created,
        date_approved: paymentDetails.date_approved,
        date_last_updated: paymentDetails.date_last_updated,
        payer: {
          email: paymentDetails.payer?.email,
          identification: paymentDetails.payer?.identification
        },
        card: paymentDetails.card ? {
          last_four_digits: paymentDetails.card.last_four_digits,
          first_six_digits: paymentDetails.card.first_six_digits
        } : null,
        firebase_data: firebaseData
      }

      return NextResponse.json(response)

    } catch (mpError: unknown) {
      console.error('Erro ao buscar pagamento no Mercado Pago:', mpError)
      
      if (mpError instanceof Error && mpError.message.includes('404')) {
        return NextResponse.json(
          { error: 'Pagamento não encontrado' },
          { status: 404 }
        )
      }

      throw mpError
    }

  } catch (error: unknown) {
    console.error('Erro ao consultar status do pagamento:', error)

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Erro ao consultar pagamento'
      },
      { status: 500 }
    )
  }
}