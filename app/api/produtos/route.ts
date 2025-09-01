import { adminDb } from '@/lib/firebase/admin';
import { Produto } from '@/types/produto';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar todos os produtos
export async function GET(req: NextRequest) {
  try {
    console.log('API - Iniciando busca de produtos');
    
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
    
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const destaque = searchParams.get('destaque');
    
    console.log('API - Parâmetros:', { categoria, destaque });
    
    try {
      let query = adminDb.collection('produtos');
      
      if (categoria) {
        query = query.where('categorias', 'array-contains', categoria);
      }
      
      if (destaque === 'true') {
        query = query.where('destaque', '==', true);
      }
      
      console.log('API - Executando consulta ao banco de dados');
      const snapshot = await query.get();
      console.log('API - Documentos encontrados:', snapshot.size);
      
      const produtos: Produto[] = [];
      
      snapshot.forEach((doc: any) => {
        produtos.push({
          id: doc.id,
          ...doc.data() as Omit<Produto, 'id'>
        });
      });
      
      console.log('API - Retornando produtos:', produtos.length);
      return NextResponse.json(produtos);
    } catch (dbError) {
      console.error('API - Erro ao acessar o banco de dados:', dbError);
      return NextResponse.json({ 
        error: 'Erro ao acessar o banco de dados',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

// POST - Criar novo produto
export async function POST(req: NextRequest) {
  try {
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
    
    const produto = await req.json();
    const novoProduto = {
      ...produto,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };
    
    try {
      const docRef = await adminDb.collection('produtos').add(novoProduto);
      
      return NextResponse.json({ 
        id: docRef.id, 
        ...novoProduto 
      }, { status: 201 });
    } catch (dbError) {
      console.error('API - Erro ao adicionar ao banco de dados:', dbError);
      return NextResponse.json({ 
        error: 'Erro ao salvar no banco de dados',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
