import { useQuery } from '@tanstack/react-query';
import { getOmieProducts } from '../../features/catalog';

const V2_MOCK_PRODUCTS = [
  {
    id: "v2-mock-1",
    code: "MESA-01",
    description: "Mesa de Escritório 1.20m (Exemplo V2)",
    family: "Móveis",
    stock: 45,
    minStock: 10,
    price: 350.0,
    unit: "UN",
    sectorIds: ["tempering", "manufacturing"],
    bom: [
      { productId: "v2-mock-3", quantity: 1, cost: 45.00 },
      { productId: "v2-mock-4", quantity: 4, cost: 2.50 }
    ]
  },
  {
    id: "v2-mock-2",
    code: "CAD-01",
    description: "Cadeira Ergonômica (Exemplo V2)",
    family: "Móveis",
    stock: 12,
    minStock: 20,
    price: 850.0,
    unit: "UN",
    sectorIds: ["manufacturing"],
    bom: []
  },
  {
    id: "v2-mock-3",
    code: "TMP-VID",
    description: "Tampo de Vidro Temperado (Exemplo V2)",
    family: "Vidros",
    stock: 200,
    minStock: 50,
    price: 45.0,
    unit: "M2",
    sectorIds: ["tempering"],
    bom: []
  },
  {
    id: "v2-mock-4",
    code: "PAR-SEX",
    description: "Parafuso Sextavado (Componente V2)",
    family: "Ferragens",
    stock: 1500,
    minStock: 500,
    price: 0.15,
    unit: "PÇ",
    sectorIds: [],
    bom: []
  }
];

export function useOmieProducts() {
  const query = useQuery({
    queryKey: ['products-raw-v2'],
    queryFn: getOmieProducts,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const result = query.data;
  
  // Combina os produtos retornados da API com os Mocks locais isolados para a V2
  let rawData = result?.success ? (result.data || []) : [];
  
  // Filtra os mocks fallbacks antigos (v1) para garantir uma lista limpa
  rawData = rawData.filter((p: any) => !p.id.includes('v2-mock') && !p.id.includes('389201948'));
  
  // Adiciona os nossos Mocks V2 com estruturas
  const combinedData = [...V2_MOCK_PRODUCTS, ...rawData];

  return {
    ...query,
    data: combinedData,
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
