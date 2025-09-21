// Script para adicionar produtos de exemplo ao Firebase
// Execute este script no console do navegador ou crie uma API route temporária

const produtosExemplo = [
  {
    nome: "Caderno Artesanal Floral",
    descricao: "Caderno artesanal com capa floral, 100 páginas pautadas, papel de alta qualidade.",
    preco: 29.90,
    peso: 250,
    categorias: ["cadernos", "artesanal"],
    cores: ["rosa", "azul", "verde"],
    imagens: [
      "https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Caderno+Floral",
      "https://via.placeholder.com/400x400/87CEEB/FFFFFF?text=Caderno+Azul"
    ],
    estoque: 15,
    destaque: true
  },
  {
    nome: "Kit Canetas Coloridas",
    descricao: "Kit com 12 canetas coloridas de alta qualidade, ideais para desenho e escrita criativa.",
    preco: 45.90,
    peso: 120,
    categorias: ["canetas", "kit"],
    cores: ["multicolor"],
    imagens: [
      "https://via.placeholder.com/400x400/FFD700/FFFFFF?text=Kit+Canetas",
      "https://via.placeholder.com/400x400/FF6347/FFFFFF?text=Canetas+Cores"
    ],
    estoque: 25,
    destaque: true
  },
  {
    nome: "Adesivos Washi Tape",
    descricao: "Conjunto de 8 fitas adesivas decorativas Washi Tape com diferentes padrões e cores.",
    preco: 19.90,
    peso: 80,
    categorias: ["adesivos", "decoração"],
    cores: ["rosa", "azul", "amarelo", "verde"],
    imagens: [
      "https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Washi+Tape",
      "https://via.placeholder.com/400x400/98FB98/FFFFFF?text=Fitas+Decorativas"
    ],
    estoque: 30,
    destaque: true
  },
  {
    nome: "Bloco de Notas Minimalista",
    descricao: "Bloco de notas com design minimalista, 80 folhas não pautadas, ideal para anotações rápidas.",
    preco: 15.90,
    peso: 150,
    categorias: ["blocos", "minimalista"],
    cores: ["branco", "cinza"],
    imagens: [
      "https://via.placeholder.com/400x400/F5F5F5/000000?text=Bloco+Minimalista",
      "https://via.placeholder.com/400x400/DCDCDC/000000?text=Notas+Simples"
    ],
    estoque: 20,
    destaque: true
  }
];

// Função para adicionar os produtos (para usar no console do navegador ou em uma API route)
async function adicionarProdutosExemplo() {
  for (const produto of produtosExemplo) {
    try {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
      });
      
      if (response.ok) {
        const resultado = await response.json();
        console.log(`Produto "${produto.nome}" adicionado com sucesso:`, resultado);
      } else {
        console.error(`Erro ao adicionar produto "${produto.nome}":`, await response.text());
      }
    } catch (error) {
      console.error(`Erro ao adicionar produto "${produto.nome}":`, error);
    }
  }
}

// Para executar, descomente a linha abaixo:
// adicionarProdutosExemplo();

console.log('Script carregado. Para adicionar os produtos, execute: adicionarProdutosExemplo()');