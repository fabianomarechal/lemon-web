import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

// GET - Buscar um produto específico
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura - com await para garantir que o params seja resolvido
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    // Usamos o ID para a consulta
    const docRef = adminDb.collection('produtos').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 });
  }
}

// PUT - Atualizar um produto
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura - com await para garantir que o params seja resolvido
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    const updates = await request.json();
    
    // Verifica se o produto existe
    const docRef = adminDb.collection('produtos').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    const updatedProduct = {
      ...updates,
      dataAtualizacao: new Date().toISOString()
    };
    
    await docRef.update(updatedProduct);
    
    return NextResponse.json({
      id: id,
      ...updatedProduct
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

// DELETE - Remover um produto
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura - com await para garantir que o params seja resolvido
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    // Verifica se o produto existe
    const docRef = adminDb.collection('produtos').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    await docRef.delete();
    
    return NextResponse.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 });
  }
}
