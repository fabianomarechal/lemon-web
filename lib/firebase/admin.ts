// Este arquivo deve ser usado APENAS em API routes ou em Server Components
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializa Firebase Admin para o servidor (API routes)
let adminDb;

if (typeof window === 'undefined') {
  const apps = getApps();

  if (!apps.length) {
    try {
      // Verificar se as variáveis de ambiente necessárias estão definidas
      if (!process.env.FIREBASE_PROJECT_ID || 
          !process.env.FIREBASE_CLIENT_EMAIL || 
          !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Variáveis de ambiente do Firebase não definidas');
      }
      
      // Corrigir a formatação da chave privada (comum problema na Vercel)
      // A chave pode vir sem as quebras de linha corretas
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.includes('\\n')
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : process.env.FIREBASE_PRIVATE_KEY;
      
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin inicializado com sucesso. Project ID:', process.env.FIREBASE_PROJECT_ID);
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      
      // Adicionar mais detalhes sobre as variáveis de ambiente (sem expor valores sensíveis)
      console.error('Verificação de variáveis de ambiente:');
      console.error('- FIREBASE_PROJECT_ID definido:', !!process.env.FIREBASE_PROJECT_ID);
      console.error('- FIREBASE_CLIENT_EMAIL definido:', !!process.env.FIREBASE_CLIENT_EMAIL);
      console.error('- FIREBASE_PRIVATE_KEY definido:', !!process.env.FIREBASE_PRIVATE_KEY);
      
      if (process.env.FIREBASE_PRIVATE_KEY) {
        // Verificar se a chave começa e termina corretamente, sem revelar a chave
        console.error('- FIREBASE_PRIVATE_KEY começa com "-----BEGIN":', 
          process.env.FIREBASE_PRIVATE_KEY.startsWith('-----BEGIN'));
        console.error('- FIREBASE_PRIVATE_KEY contém caracteres de escape "\\n":', 
          process.env.FIREBASE_PRIVATE_KEY.includes('\\n'));
      }
    }
  }

  adminDb = getFirestore();
}

export { adminDb };
