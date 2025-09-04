export interface Produto {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  peso?: number; // Peso em gramas
  categorias: string[];
  cores: string[]; // Array de IDs das cores
  imagens: string[];
  estoque: number;
  destaque: boolean;
  dataCriacao?: Date | string;
  dataAtualizacao?: Date | string;
}

export interface ProdutoFormData extends Omit<Produto, 'id' | 'dataCriacao' | 'dataAtualizacao'> {}

export interface Cor {
  id?: string;
  nome: string;
  codigo: string; // Código hexadecimal da cor
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}
