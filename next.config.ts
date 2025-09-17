import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configurações para melhorar hidratação
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    // Apenas no lado do cliente (navegador)
    if (!isServer) {
      // Não tente processar pacotes do lado do servidor
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        dns: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  // Configuração do ESLint
  eslint: {
    // Desabilitar verificação durante o build
    ignoreDuringBuilds: true,
  },
  // Desabilitar verificação de tipos durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração de imagens
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com',
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;
