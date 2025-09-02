'use client';

import { useState } from 'react';
import ImageUpload from './image-upload';

interface MultiImageUploadProps {
  onImagesChange: (images: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export default function MultiImageUpload({ 
  onImagesChange, 
  existingImages = [], 
  maxImages = 5 
}: MultiImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(existingImages);

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...imageUrls];
    
    if (url === '') {
      // Remover imagem
      newImages.splice(index, 1);
    } else {
      // Atualizar imagem existente
      newImages[index] = url;
    }
    
    setImageUrls(newImages);
    onImagesChange(newImages);
  };

  const addImageSlot = () => {
    if (imageUrls.length < maxImages) {
      setImageUrls([...imageUrls, '']);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Imagens do Produto</h3>
        <span className="text-sm text-gray-500">
          {imageUrls.filter(url => url).length}/{maxImages} imagens
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <ImageUpload
            key={index}
            index={index}
            existingImage={url}
            onImageUpload={(newUrl) => handleImageUpload(newUrl, index)}
          />
        ))}
        
        {imageUrls.length < maxImages && (
          <button
            type="button"
            onClick={addImageSlot}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-yellow-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Adicionar mais imagens</p>
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        Dica: A primeira imagem será usada como capa do produto.
      </p>
    </div>
  );
}
