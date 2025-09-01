// Imports para o lado do cliente
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore as getClientFirestore } from 'firebase/firestore';

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
let clientApp;
let clientDb;
let clientAuth;

if (typeof window !== 'undefined') {
  try {
    clientApp = initializeClientApp(clientConfig);
    clientDb = getClientFirestore(clientApp);
    clientAuth = getAuth(clientApp);
    
    // Adicionar um log para depuração
    console.log('Firebase Auth inicializado com sucesso', !!clientAuth);
  } catch (error) {
    console.error('Erro na inicialização do Firebase cliente:', error);
  }
}

export { clientApp, clientAuth, clientDb };
