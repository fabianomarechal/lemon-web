/**
 * Script para criar usuário inicial na API Carta Saúde AchePlus
 * 
 * Este script utiliza o fetch API nativo do Node.js para fazer requisições à API
 * e criar um usuário inicial com as informações básicas necessárias.
 * 
 * Para executar: node scripts/create-initial-user.js
 */

// Usando import para o Node.js moderno
import fetch from 'node-fetch';

// URL base da API
const API_BASE_URL = 'https://api.cartasaude.acheplus.com.br';

// Dados do usuário a ser criado
// Você deve adaptar estes dados conforme a estrutura exigida pela API
const userData = {
  nome: 'Usuário Inicial',
  email: 'usuario.inicial@exemplo.com',
  senha: 'Senha@123456', // Recomenda-se usar uma senha forte
  perfil: 'admin',
  // Adicione outros campos necessários aqui
};

/**
 * Função para criar um usuário na API
 */
async function createInitialUser() {
  try {
    console.log('Iniciando criação de usuário inicial...');
    
    // Primeiro, vamos tentar descobrir os endpoints disponíveis
    console.log('Tentando descobrir endpoints disponíveis...');
    try {
      const optionsResponse = await fetch(API_BASE_URL, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (optionsResponse.ok) {
        console.log('Endpoints disponíveis:', optionsResponse.headers);
      } else {
        console.log('Não foi possível descobrir endpoints automaticamente.');
      }
    } catch (error) {
      console.log('Erro ao tentar descobrir endpoints:', error.message);
    }
    
    // Lista de possíveis endpoints para tentativa
    const possibleEndpoints = [
      '/users',
      '/users/register',
      '/auth/register',
      '/api/users',
      '/api/auth/register',
      '/register',
      '/signup',
      '/user'
    ];
    
    console.log('Tentando criar usuário em diferentes endpoints...');
    
    // Tentaremos cada endpoint possível
    let success = false;
    
    for (const endpoint of possibleEndpoints) {
      console.log(`\nTentando endpoint: ${endpoint}`);
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Adicione headers de autenticação se necessários
            // 'Authorization': 'Bearer SEU_TOKEN_AQUI',
          },
          body: JSON.stringify(userData),
        });

        // Verificando a resposta
        if (response.ok) {
          success = true;
          const data = await response.json();
          console.log(`Usuário criado com sucesso no endpoint ${endpoint}!`);
          console.log('Dados do usuário:', data);
          break; // Encontramos o endpoint correto, podemos parar
        } else {
          const errorText = await response.text();
          console.log(`Resposta do endpoint ${endpoint}: ${response.status} ${response.statusText}`);
          console.log('Detalhes:', errorText.substring(0, 200) + (errorText.length > 200 ? '...' : ''));
        }
      } catch (error) {
        console.log(`Erro ao tentar o endpoint ${endpoint}:`, error.message);
      }
    }

    // Verificando a resposta
    if (response.ok) {
      const data = await response.json();
      console.log('Usuário criado com sucesso!');
      console.log('Dados do usuário:', data);
    } else {
      const errorData = await response.json();
      console.error('Erro ao criar usuário:', response.status);
      console.error('Detalhes do erro:', errorData);
      
      // Se o erro for 404, significa que o endpoint está incorreto
      if (response.status === 404) {
        console.log('\nO endpoint para criação de usuário pode estar incorreto.');
        console.log('Verifique a documentação da API para obter o endpoint correto.');
      }
    }
    
    if (!success) {
      console.log('\nNão foi possível criar o usuário em nenhum dos endpoints testados.');
      console.log('Sugestões:');
      console.log('1. Verifique a documentação da API para obter o endpoint correto');
      console.log('2. Verifique se a estrutura dos dados do usuário está correta');
      console.log('3. Verifique se a API requer autenticação para criar usuários');
    }
  } catch (error) {
    console.error('Erro ao acessar a API:', error.message);
    console.log('\nVerifique se:');
    console.log('1. A URL da API está correta');
    console.log('2. Você tem conexão com a internet');
    console.log('3. A API está disponível');
  }
}

// Executar a função
createInitialUser();
