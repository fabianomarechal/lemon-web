import { NextRequest, NextResponse } from 'next/server'
import { deleteImage } from '@/lib/cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID não fornecido' }, { status: 400 })
    }

    await deleteImage(publicId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    return NextResponse.json({ error: 'Erro ao deletar imagem' }, { status: 500 })
  }
}