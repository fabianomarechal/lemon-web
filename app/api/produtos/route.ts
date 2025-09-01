import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Produto } from '@/types/produto';

// GET - Listar todos os produtos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const destaque = searchParams.get('destaque');
    
    let query = db.collection('produtos');
    
    if (categoria) {
      query = query.where('categorias', 'array-contains', categoria);
    }
    
    if (destaque === 'true') {
      query = query.where('destaque', '==', true);
    }
    
    const snapshot = await query.get();
    const produtos: Produto[] = [];
    
    snapshot.forEach(doc => {
      produtos.push({
        id: doc.id,
        ...doc.data() as Omit<Produto, 'id'>
      });
    });
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

// POST - Criar novo produto
export async function POST(req: NextRequest) {
  try {
    const produto = await req.json();
    const novoProduto = {
      ...produto,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };
    
    const docRef = await db.collection('produtos').add(novoProduto);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...novoProduto 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
