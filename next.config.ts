import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
};

export default nextConfig;
