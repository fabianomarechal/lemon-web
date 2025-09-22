'use client';

import { initializeFirebaseClient } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminAuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  if (loading || !mounted) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-slate-500">Verificando...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-red-600">
          Não autenticado - <Link href="/admin/login" className="underline">fazer login</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-slate-600">
        Logado como: <span className="font-medium text-slate-800">{user.email}</span>
      </span>
    </div>
  );
}
