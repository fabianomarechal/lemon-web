// Este arquivo deve ser usado APENAS em API routes ou em Server Components
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializa Firebase Admin para o servidor (API routes)
let adminDb;

if (typeof window === 'undefined') {
  const apps = getApps();

  if (!apps.length) {
    // Se estamos em ambiente de desenvolvimento, pode-se usar um arquivo de config
    if (process.env.NODE_ENV !== 'production') {
      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
      } catch (error) {
        console.error('Firebase admin initialization error', error);
      }
    } else {
      // Em produção, confia nas variáveis de ambiente padrão
      initializeApp();
    }
  }

  adminDb = getFirestore();
}

export { adminDb };
