import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const timestamp = Date.now()
    const fileName = `banner_${timestamp}_${file.name}`
    
    const result = await uploadImage(arrayBuffer, file.type, fileName, 'banners')
    
    return NextResponse.json({ 
      url: result.url,
      publicId: result.path
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 })
  }
}