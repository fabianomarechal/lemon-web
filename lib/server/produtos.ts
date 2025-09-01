import { adminDb } from "@/lib/firebase/admin";

/**
 * Função utilitária para obter produtos do Firestore
 * Esta função é executada apenas no lado do servidor
 */
export async function getProdutos(params?: { categoria?: string; destaque?: boolean }) {
  try {
    let query = adminDb.collection('produtos');
    
    if (params?.categoria) {
      query = query.where('categorias', 'array-contains', params.categoria);
    }
    
    if (params?.destaque !== undefined) {
      query = query.where('destaque', '==', params.destaque);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

/**
 * Função utilitária para obter um produto específico do Firestore
 * Esta função é executada apenas no lado do servidor
 */
export async function getProduto(id: string) {
  try {
    const doc = await adminDb.collection('produtos').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}
