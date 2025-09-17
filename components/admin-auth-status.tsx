'use client';

import { initializeFirebaseClient } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminAuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const { clientAuth } = initializeFirebaseClient();
    
    if (!clientAuth) {
      console.error("Auth não inicializado corretamente");
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(clientAuth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  const handleLogout = async () => {
    const { clientAuth } = initializeFirebaseClient();
    
    if (!clientAuth) {
      console.error("Auth não inicializado corretamente");
      return;
    }
    
    try {
      await signOut(clientAuth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg shadow text-center mb-4" suppressHydrationWarning>
        <p className="text-blue-800">Verificando status de autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg shadow mb-4" suppressHydrationWarning>
        <p className="text-yellow-800">
          Você não está autenticado. Por favor, faça 
          <Link href="/admin/login" className="underline ml-1">login</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-4 rounded-lg shadow flex justify-between items-center mb-4">
      <p className="text-green-800">
        Logado como: <strong>{user.email}</strong>
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
      >
        Sair
      </button>
    </div>
  );
}
