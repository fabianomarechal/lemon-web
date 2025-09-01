# Configuração do Firebase Authentication

Para que a autenticação funcione corretamente no sistema, você precisa habilitar o provedor de e-mail/senha no console do Firebase. Siga as etapas abaixo:

## 1. Acesse o Console do Firebase

Acesse o [Firebase Console](https://console.firebase.google.com/) e faça login com sua conta Google.

## 2. Selecione o Projeto

Selecione o projeto "lemon-web-de215" da lista de projetos.

## 3. Configure a Autenticação

1. No menu lateral esquerdo, clique em "Authentication"
2. Clique na aba "Sign-in method"
3. Clique no provedor "Email/Password" 
4. Ative a opção "Email/Password"
5. Clique em "Salvar"

## 4. Verifique as Regras de Segurança do Firestore

Para garantir que apenas usuários autenticados possam acessar determinados dados:

1. No menu lateral esquerdo, clique em "Firestore Database"
2. Clique na aba "Regras"
3. Adicione regras que verificam a autenticação do usuário, por exemplo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Produtos podem ser lidos por qualquer um, mas só editados por admin
    match /produtos/{produtoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Outras coleções podem ter regras específicas
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Clique em "Publicar"

## 5. Teste a Autenticação

Após configurar o Firebase Authentication, você pode testar a funcionalidade de autenticação:

1. Acesse a página `/admin/setup` para criar um usuário administrador
2. Use esse usuário para fazer login em `/admin/login`
3. Verifique se você consegue acessar as áreas administrativas protegidas

## Solução de Problemas

Se você encontrar algum problema com a autenticação:

1. Verifique se o Firebase Authentication está habilitado corretamente
2. Verifique se as credenciais no arquivo `.env.local` estão corretas
3. Verifique os logs do console do navegador para possíveis erros
4. Certifique-se de que o domínio da sua aplicação está na lista de domínios autorizados no Firebase Authentication
