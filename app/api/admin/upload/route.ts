'use server';

import { uploadImage } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Verificar se o ambiente tem as variáveis necessárias
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Variáveis de ambiente do Cloudinary não definidas');
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Verificar o tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas' },
        { status: 400 }
      );
    }

    // Limite de tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'O arquivo é muito grande (máximo 5MB)' },
        { status: 400 }
      );
    }

    try {
      const buffer = await file.arrayBuffer();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Fazer upload para o Cloudinary
      const result = await uploadImage(buffer, file.type, fileName);
      
      return NextResponse.json(result);
    } catch (uploadError) {
      console.error('Erro ao fazer upload para o Cloudinary:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao processar o upload para o storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload' },
      { status: 500 }
    );
  }
}
