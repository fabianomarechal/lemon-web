'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// GET - Buscar um produto específico
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API Admin - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
  
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    try {
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
    } catch (dbError) {
      console.error('API Admin - Erro ao acessar o banco de dados:', dbError);
      return NextResponse.json({ 
        error: 'Erro ao acessar o banco de dados',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
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
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API Admin - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
    
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    try {
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

      // Revalidate homepage and products page when product is updated
      revalidatePath('/');
      revalidatePath('/produtos');
      revalidatePath(`/produtos/${id}`);

      return NextResponse.json({
        id: id,
        ...updatedProduct
      });
    } catch (dbError) {
      console.error('API Admin - Erro ao atualizar no banco de dados:', dbError);
      return NextResponse.json({ 
        error: 'Erro ao atualizar no banco de dados',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
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
    // Verificar se o Firebase Admin está inicializado corretamente
    if (!adminDb) {
      console.error('API Admin - Firebase Admin não inicializado');
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
    }
    
    // Primeiro, garantimos que o context.params existe
    if (!context?.params) {
      return NextResponse.json({ error: 'Parâmetros não encontrados' }, { status: 400 });
    }
    
    // Agora extraímos o ID de forma segura
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    
    try {
      // Verifica se o produto existe
      const docRef = adminDb.collection('produtos').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
      }
      
      await docRef.delete();

      // Revalidate homepage and products page when product is deleted
      revalidatePath('/');
      revalidatePath('/produtos');

      return NextResponse.json({ message: 'Produto removido com sucesso' });
    } catch (dbError) {
      console.error('API Admin - Erro ao remover do banco de dados:', dbError);
      return NextResponse.json({ 
        error: 'Erro ao remover do banco de dados',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 });
  }
}
