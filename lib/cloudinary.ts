import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export { cloudinary };

// Função para fazer upload de imagem
export async function uploadImage(file: ArrayBuffer, fileType: string, fileName: string) {
  try {
    // Converter ArrayBuffer para base64
    const buffer = Buffer.from(file);
    const base64String = `data:${fileType};base64,${buffer.toString('base64')}`;
    
    // Fazer upload para o Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'produtos',
      public_id: fileName.split('.')[0], // Usar nome do arquivo sem extensão
      resource_type: 'image'
    });
    
    return {
      url: result.secure_url,
      path: result.public_id
    };
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
}

// Função para excluir uma imagem
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao excluir imagem do Cloudinary:', error);
    throw new Error('Falha ao excluir a imagem');
  }
}
