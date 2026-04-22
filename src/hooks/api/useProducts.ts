import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { Product } from '../../types/api';

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products-raw'],
    queryFn: async (): Promise<Product[]> => {
      let allProducts: Product[] = [];
      let page = 1;
      let hasMore = true;
      let expectedTotal: number | null = null;

      while (hasMore) {
        try {
          const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
            params: { 
              pagina: page, 
              registros_por_pagina: 100,
              page: page,
              limit: 100
            }
          });
          
          const res = response.data;
          
          // Captura o total esperado apenas na primeira página
          if (expectedTotal === null) {
            const findMetaTotal = (obj: any, depth = 0): number | null => {
              if (!obj || typeof obj !== 'object' || depth > 4) return null;
              // Prioriza o formato mencionado pelo usuário: meta.total
              if (obj.meta && typeof obj.meta.total === 'number') return obj.meta.total;
              
              const totalKeys = ['total_registros', 'totalItems', 'total', 'total_itens', 'count_total'];
              for (const key of totalKeys) {
                if (typeof obj[key] === 'number' && obj[key] > 0) return obj[key];
              }
              for (const key in obj) {
                const found = findMetaTotal(obj[key], depth + 1);
                if (found !== null) return found;
              }
              return null;
            };
            expectedTotal = findMetaTotal(res);
          }
          
          const findArray = (obj: any, depth = 0): any[] | null => {
            if (Array.isArray(obj)) return obj;
            if (!obj || typeof obj !== 'object' || depth > 3) return null;
            const keys = ['data', 'products', 'records', 'registros', 'items', 'registros_produto', 'obj', 'rows'];
            for (const key of keys) {
              if (Array.isArray(obj[key])) return obj[key];
            }
            for (const key in obj) {
              const f = findArray(obj[key], depth + 1);
              if (f) return f;
            }
            return null;
          };

          const pageData = findArray(res);
          
          if (!Array.isArray(pageData) || pageData.length === 0) {
            hasMore = false;
          } else {
            const newProducts = pageData.filter(p => {
              const id = p.omieCode || p.id || p.codigo_produto;
              return !allProducts.find(ex => (ex.id === id || (ex.code === p.codigo || (ex.description === p.descricao && ex.code === p.codigo))));
            }).map(p => ({
              id: String(p.omieCode || p.id || p.codigo_produto),
              code: String(p.codigo || p.code || ''),
              description: String(p.descricao || p.description || ''),
              family: String(p.familia || p.family || ''),
              stock: Number(p.stockQuantity || p.estoque || p.stock || 0),
              price: Number(p.valor_unitario || p.price || 0),
              unit: String(p.unidade || p.unit || 'UN'),
              sectorId: p.sectorId
            }));
            
            if (newProducts.length === 0 && allProducts.length > 0) {
              hasMore = false;
            } else {
              allProducts = [...allProducts, ...newProducts];
              
              if (expectedTotal !== null && allProducts.length >= expectedTotal) {
                hasMore = false;
              } else {
                page++;
              }
            }
          }
        } catch (error) {
          hasMore = false;
        }

        if (page > 300) hasMore = false; 
      }
      
      // Validação Final solicitada
      if (expectedTotal !== null && allProducts.length !== expectedTotal) {
        throw new Error(`Inconsistência na sincronização: API reporta ${expectedTotal} itens, mas apenas ${allProducts.length} foram carregados.`);
      }

      console.log(`Total de produtos: ${allProducts.length} de ${expectedTotal || allProducts.length} do Omie`);
      return allProducts;
    },
    staleTime: 1000 * 60 * 10, 
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(ENDPOINTS.PRODUCTS.SYNC, {});
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-raw'] });
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isFetching: productsQuery.isFetching,
    refetchProducts: productsQuery.refetch,
    syncWithOmie: syncMutation,
  };
}
