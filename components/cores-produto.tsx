'use client';

import { Cor } from '@/types/produto';
import { useEffect, useState } from 'react';

interface CoresProdutoProps {
  coresIds: string[];
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function CoresProduto({ coresIds, showLabels = false, size = 'small' }: CoresProdutoProps) {
  const [cores, setCores] = useState<Cor[]>([]);

  useEffect(() => {
    async function carregarCores() {
      if (coresIds.length === 0) return;
      
      try {
        const response = await fetch('/api/admin/cores');
        if (response.ok) {
          const todasCores: Cor[] = await response.json();
          const coresFiltradas = todasCores.filter(cor => coresIds.includes(cor.id!));
          setCores(coresFiltradas);
        }
      } catch (error) {
        console.error('Erro ao carregar cores:', error);
      }
    }

    carregarCores();
  }, [coresIds]);

  if (cores.length === 0) return null;

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {cores.map((cor) => (
          <div
            key={cor.id}
            className={`${sizeClasses[size]} rounded-full border-2 border-gray-300 shadow-sm`}
            style={{ backgroundColor: cor.codigo }}
            title={cor.nome}
          />
        ))}
      </div>
      {showLabels && cores.length > 0 && (
        <span className="text-xs text-gray-500">
          {cores.length === 1 ? cores[0].nome : `${cores.length} cores`}
        </span>
      )}
    </div>
  );
}
