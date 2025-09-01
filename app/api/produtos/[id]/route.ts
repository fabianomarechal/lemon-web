import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

// GET - Buscar um produto específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const doc = await db.collection('produtos').doc(id).get();
    
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const atualizacoes = await req.json();
    
    // Verifica se o produto existe
    const doc = await db.collection('produtos').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    const produtoAtualizado = {
      ...atualizacoes,
      dataAtualizacao: new Date().toISOString()
    };
    
    await db.collection('produtos').doc(id).update(produtoAtualizado);
    
    return NextResponse.json({
      id,
      ...produtoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

// DELETE - Remover um produto
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verifica se o produto existe
    const doc = await db.collection('produtos').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    await db.collection('produtos').doc(id).delete();
    
    return NextResponse.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 });
  }
}
