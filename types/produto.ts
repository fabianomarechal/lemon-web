export interface Produto {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categorias: string[];
  imagens: string[];
  estoque: number;
  destaque: boolean;
  dataCriacao?: Date | string;
  dataAtualizacao?: Date | string;
}

export interface ProdutoFormData extends Omit<Produto, 'id' | 'dataCriacao' | 'dataAtualizacao'> {}
