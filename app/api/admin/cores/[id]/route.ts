import { adminDb } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

// PUT - Atualizar cor específica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const { nome, codigo } = await request.json();

    if (!nome || !codigo) {
      return NextResponse.json(
        { error: 'Nome e código da cor são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a cor existe
    const corDoc = await adminDb.collection('cores').doc(id).get();
    if (!corDoc.exists) {
      return NextResponse.json(
        { error: 'Cor não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se já existe outra cor com o mesmo nome
    const coresExistentes = await adminDb
      .collection('cores')
      .where('nome', '==', nome)
      .get();

    const corComMesmoNome = coresExistentes.docs.find(doc => doc.id !== id);
    if (corComMesmoNome) {
      return NextResponse.json(
        { error: 'Já existe uma cor com este nome' },
        { status: 400 }
      );
    }

    const corAtualizada = {
      nome,
      codigo,
      atualizadoEm: new Date()
    };

    await adminDb.collection('cores').doc(id).update(corAtualizada);

    return NextResponse.json({
      id,
      ...corAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar cor:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir cor específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    const { id } = await params;

    // Verificar se a cor existe
    const corDoc = await adminDb.collection('cores').doc(id).get();
    if (!corDoc.exists) {
      return NextResponse.json(
        { error: 'Cor não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se a cor está sendo usada em algum produto
    const produtosComCor = await adminDb
      .collection('produtos')
      .where('cores', 'array-contains', id)
      .get();

    if (!produtosComCor.empty) {
      return NextResponse.json(
        { error: 'Não é possível excluir esta cor pois ela está sendo usada em produtos' },
        { status: 400 }
      );
    }

    await adminDb.collection('cores').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir cor:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir cor' },
      { status: 500 }
    );
  }
}
