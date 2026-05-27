export interface ProductReadRepository {
  findByCode(code: string): Promise<{
    id: number | string;
    code: string;
    description: string;
    omieProductId: string | number;
    canCreateProductionOrder: boolean;
  } | null>;
}
