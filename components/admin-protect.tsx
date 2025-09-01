'use client';

import { clientAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminProtect({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!clientAuth) {
      console.error("Auth não inicializado corretamente");
      router.push('/admin/login');
      return;
    }
    
    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      if (!user) {
        // Não autenticado, redireciona para página de login
        router.push('/admin/login');
      } else {
        // Usuário autenticado, continua carregando a página
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="ml-4 text-lg text-gray-700">Verificando acesso...</p>
      </div>
    );
  }

  return <>{children}</>;
}
