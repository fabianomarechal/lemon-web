import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar todas as cores
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    const coresSnapshot = await adminDb.collection('cores').orderBy('nome').get();
    const cores = coresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cores);
  } catch (error) {
    console.error('Erro ao buscar cores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cores' },
      { status: 500 }
    );
  }
}

// POST - Criar nova cor
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    const { nome, codigo } = await request.json();

    if (!nome || !codigo) {
      return NextResponse.json(
        { error: 'Nome e código da cor são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma cor com o mesmo nome
    const coresExistentes = await adminDb
      .collection('cores')
      .where('nome', '==', nome)
      .get();

    if (!coresExistentes.empty) {
      return NextResponse.json(
        { error: 'Já existe uma cor com este nome' },
        { status: 400 }
      );
    }

    const novaCor = {
      nome,
      codigo,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const docRef = await adminDb.collection('cores').add(novaCor);

    return NextResponse.json({
      id: docRef.id,
      ...novaCor
    });
  } catch (error) {
    console.error('Erro ao criar cor:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cor' },
      { status: 500 }
    );
  }
}
