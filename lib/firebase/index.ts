// Imports para o lado do cliente
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore as getClientFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase Client
const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa Firebase do lado do cliente
let clientApp = null;
let clientDb = null;
let clientAuth = null;
let clientStorage = null;

// Este código só será executado no lado do cliente
const initializeFirebaseClient = () => {
  if (!clientApp && typeof window !== 'undefined') {
    try {
      clientApp = initializeClientApp(clientConfig);
      clientDb = getClientFirestore(clientApp);
      clientAuth = getAuth(clientApp);
      clientStorage = getStorage(clientApp);
    } catch (error) {
      console.error('Erro na inicialização do Firebase cliente:', error);
    }
  }
  return { clientApp, clientAuth, clientDb, clientStorage };
};

// Exportar a função de inicialização em vez das variáveis diretamente
export { initializeFirebaseClient };
