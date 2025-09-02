'use server';

import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

// POST - Criar novo produto
export async function POST(req: NextRequest) {
  try {
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API Admin - Firebase Admin não inicializado');
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
      console.error('API Admin - Erro ao adicionar ao banco de dados:', dbError);
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

// GET - Listar todos os produtos
export async function GET(req: NextRequest) {
  try {
    console.log('API Admin - Iniciando busca de produtos');
    
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API Admin - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
    
    try {
      console.log('API Admin - Executando consulta ao banco de dados');
      const snapshot = await adminDb.collection('produtos').get();
      console.log('API Admin - Documentos encontrados:', snapshot.size);
      
      const produtos = [];
      
      snapshot.forEach((doc: any) => {
        produtos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('API Admin - Retornando produtos:', produtos.length);
      return NextResponse.json(produtos);
    } catch (dbError) {
      console.error('API Admin - Erro ao acessar o banco de dados:', dbError);
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
