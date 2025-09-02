'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  existingImage?: string;
  index?: number;
}

export default function ImageUpload({ onImageUpload, existingImage, index }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem não pode ter mais de 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('O arquivo deve ser uma imagem');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload do arquivo usando nossa API
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/upload', true);
      
      // Monitorar progresso do upload
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgress(progress);
        }
      };
      
      // Configurar handlers para sucesso/erro
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploading(false);
          setProgress(100);
          onImageUpload(response.url);
        } else {
          setError('Erro ao fazer upload da imagem. Tente novamente.');
          setUploading(false);
        }
      };
      
      xhr.onerror = () => {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
        setUploading(false);
      };
      
      // Enviar o arquivo
      xhr.send(formData);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro ao fazer upload da imagem. Tente novamente.');
      setUploading(false);
    }
  }, [onImageUpload]);

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload(''); // Informar ao componente pai que a imagem foi removida
  }, [onImageUpload]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="mb-2 text-sm text-gray-600">
        {index !== undefined ? `Imagem ${index + 1}` : 'Imagem do produto'}
      </div>

      {previewUrl ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {previewUrl.startsWith('data:') ? (
            // Data URL (base64) - é seguro usar diretamente
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill
              className="object-contain"
            />
          ) : (
            // URL externa - usar elemento img tradicional para evitar restrições do Next.js Image
            <img
              src={previewUrl}
              alt="Preview"
              className="object-contain w-full h-full"
            />
          )}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            type="button"
            disabled={uploading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={triggerFileInput}
          type="button"
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-yellow-500 transition-colors"
          disabled={uploading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Clique para adicionar imagem</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (máx. 5MB)</p>
        </button>
      )}

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">{progress}% concluído</p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
