import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Para o lado do cliente
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getFirestore as getClientFirestore } from 'firebase/firestore';

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa Firebase do lado do cliente
let clientApp;
let clientDb;

if (typeof window !== 'undefined') {
  try {
    clientApp = initializeClientApp(clientConfig);
    clientDb = getClientFirestore(clientApp);
  } catch (error) {
    console.error('Erro na inicialização do Firebase cliente:', error);
  }
}

export { clientApp, clientDb };

// Inicializa Firebase Admin para o servidor (API routes)
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

export const db = getFirestore();
