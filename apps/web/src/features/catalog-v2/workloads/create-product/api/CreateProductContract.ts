export interface CreateProductInput {
  codigo: string;
  descricao: string;
  unidade: string;
  preco_unitario: number;
  estoque_minimo?: number;
  familia?: string;
  tipoItem?: string;
}

export interface CreateProductOutput {
  id: string; // Omie ID or internal ID
  codigo: string;
  status: 'SUCCESS' | 'ERROR';
  message?: string;
}

export interface CreateProductVariant {
  execute(input: CreateProductInput): Promise<CreateProductOutput>;
}
