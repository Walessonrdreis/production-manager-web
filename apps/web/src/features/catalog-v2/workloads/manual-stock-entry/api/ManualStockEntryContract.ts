export interface ManualStockEntryInput {
  productId: string;
  codigo: string;
  date: string;
  quantity: number;
  unitValue: number;
  observation?: string;
}

export interface ManualStockEntryOutput {
  id?: string;
  status: 'SUCCESS' | 'ERROR';
  message?: string;
}

export interface ManualStockEntryVariant {
  execute(input: ManualStockEntryInput): Promise<ManualStockEntryOutput>;
}
