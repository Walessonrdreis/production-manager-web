import { apiClient } from '../../shared/api/client';
import { ENDPOINTS } from '../../shared/api/endpoints';

export interface Product {
  id: string;
  code: string;
  description: string;
  family: string;
  unit: string;
  stock: number;
  price?: number;
  sectorId?: string;
  familyDescription?: string;
}

export const ProductService = {
  getProducts: async (params?: { 
    search?: string; 
    family?: string;
    sectorId?: string;
    minStock?: number;
    maxStock?: number;
  }): Promise<Product[]> => {
    try {
      let allRawProducts: any[] = [];
      let currentPage = 1;
      let hasMore = true;
      const pageSize = 50; 
      const processedIds = new Set<string>();

      const MAX_PAGES = 200; 
      
      while (hasMore && currentPage <= MAX_PAGES) {
        // Conforme a documentação pública: /v1/products?page=1&pageSize=50
        const apiParams: any = {
          page: currentPage,
          pageSize: pageSize
        };

        if (params?.search) {
          apiParams.q = params.search;
        }

        try {
          const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, { 
            params: apiParams
          });
          
          const data = response.data;
          // Tratamento flexível da resposta da API
          let pageItems: any[] = [];
          if (Array.isArray(data)) {
            pageItems = data;
          } else {
            pageItems = data.data || data.records || data.products || data.items || [];
          }

          if (!pageItems || pageItems.length === 0) {
            hasMore = false;
            break;
          }

          let newItemsInThisPage = 0;
          for (const item of pageItems) {
            // Criamos uma chave de unicidade mais robusta (OmieId ou OmieCode)
            const itemKey = String(item.omieCode || item.omieId || item.id || item.nCodProd || Math.random());
            if (!processedIds.has(itemKey)) {
              processedIds.add(itemKey);
              allRawProducts.push(item);
              newItemsInThisPage++;
            }
          }

          // Se não veio nada novo, a API provavelmente está ignorando a paginação ou acabaram os itens
          if (newItemsInThisPage === 0) {
            hasMore = false;
            break;
          }

          if (hasMore) currentPage++;
        } catch (err: any) {
          // Fallback resiliente: se a paginação falhou com 400, tentamos buscar TUDO sem parâmetros de página
          if (err.response?.status === 400 && currentPage === 1) {
             console.warn('API rejeitou parâmetros de paginação complexos. Tentando busca simplificada.');
             const fallback = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, { 
               params: params?.search ? { q: params.search } : {} 
             });
             const fallbackData = fallback.data;
             const items = Array.isArray(fallbackData) ? fallbackData : (fallbackData.data || fallbackData.records || fallbackData.products || []);
             allRawProducts = items;
             hasMore = false;
          } else {
            throw err;
          }
        }
      }
      
      return allRawProducts.map((p: any) => ({
        id: String(p.omieCode || p.omieId || p.id || p.id_produto || p.nCodProd || p._id || Math.random().toString(36).substr(2, 9)),
        code: p.omieCode || p.code || p.codigo || p.codigo_produto || p.cCodigo || '',
        description: p.description || p.descricao || p.cDesc || '',
        family: p.family || p.familia || p.cFam || '',
        familyDescription: p.familyDescription || p.descr_familia || p.cDescFam || '',
        unit: p.unit || p.unidade || p.cUnid || '',
        stock: Number(p.stockQuantity !== undefined ? p.stockQuantity : (p.stock || p.quantidade_estoque || p.nEstoque || p.nVlEstoque || 0)),
        price: Number(p.price || p.valor_unitario || p.nValorUnitario || p.nVlUnit || 0),
        sectorId: p.sectorId || p.setor_id || p.nCodSetor
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  syncWithOmie: async (): Promise<{ message: string; count: number }> => {
    const { data } = await apiClient.post(ENDPOINTS.PRODUCTS.SYNC);
    return data;
  }
};
