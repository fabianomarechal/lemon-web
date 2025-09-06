# Girafa de Papel Web

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Primeiros Passos

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Configuração de Variáveis de Ambiente

Para o funcionamento completo da aplicação, você precisará configurar as seguintes variáveis de ambiente em um arquivo `.env.local`:

### Firebase

```
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Firebase Admin
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=seu_client_email
FIREBASE_PRIVATE_KEY=sua_private_key
```

### Cloudinary (para upload de imagens)

```
CLOUDINARY_CLOUD_NAME=sua_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

## Cloudinary

Este projeto utiliza o [Cloudinary](https://cloudinary.com/) para armazenamento e gerenciamento de imagens. Para configurar:

1. Crie uma conta gratuita no [Cloudinary](https://cloudinary.com/users/register/free)
2. No Dashboard, obtenha suas credenciais (Cloud Name, API Key e API Secret)
3. Adicione estas credenciais ao seu arquivo `.env.local`

## Estrutura do Projeto

```
├── app/               # Rotas e páginas (App Router do Next.js)
├── components/        # Componentes React reutilizáveis
├── lib/              # Utilitários e configurações
│   ├── firebase/     # Configuração do Firebase
│   └── cloudinary.ts # Configuração do Cloudinary
└── public/           # Arquivos estáticos
```

## Deploy on Vercel

A maneira mais fácil de fazer deploy da sua aplicação Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
