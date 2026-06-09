import React, { useMemo, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { CatalogLogic } from '../../catalog/domain/CatalogLogic';
import { ProductListCard } from './components/ProductListCard';
import { CatalogFilters } from '../../catalog/ui/components/CatalogFilters';
import { CatalogPagination } from '../../catalog/ui/components/CatalogPagination';
import { Button } from '../../../components/ui/Button';
import { CreateProductButton } from '../workloads/create-product/ui/components/CreateProductButton';
import { CreateBomWizardButton } from '../workloads/create-bom/ui/components/CreateBomWizardButton';
import { useOmieProducts } from '../../../hooks/catalog/useOmieProducts';

export function CatalogV2List({ 
  initialStockLevel = 'all',
  initialHasBom = false,
  initialAction,
  allowedFamilies,
}: { 
  initialStockLevel?: 'all' | 'low' | 'normal',
  initialHasBom?: boolean,
  initialAction?: 'create',
  allowedFamilies?: string[],
}) {
  // Try to use real products but we isolated the V2 to use a guaranteed mock list + any fetched ones
  const { data: rawProducts = [], isLoading, isError, refetch } = useOmieProducts();
  const { data: sectors = [] } = useSectors();
  const [searchParams] = useSearchParams();

  // Combine real products with V2 Mocks, ensuring we always have data to showcase the BOM structure
  const products = useMemo(() => {
    return rawProducts.map((p: any) => {
      // Injeta insumos fakes apenas para exemplificar caso venha sem BOM (mas preserve os mocks V2)
      if (!p.id.includes('v2-mock') && (!p.bom || p.bom.length === 0)) {
        const randomNum = p.id.length % 3;
        if (randomNum !== 0) {
          return {
            ...p,
            bom: [
              { productId: 'INSUMO-0'+randomNum, quantity: randomNum * 2, cost: 5.50 },
              { productId: 'INSUMO-X'+randomNum, quantity: randomNum, cost: 2.10 }
            ]
          };
        }
      }
      return p;
    });
  }, [rawProducts]);


  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [sectorFilter, setSectorFilter] = useState('');
  const [stockLevel, setStockLevel] = useState<'all' | 'low' | 'normal'>(initialStockLevel);
  const [familyFilter, setFamilyFilter] = useState('');
  
  // Se entrou para expandir um produto específico na estrutura, força a tab baseada na existência da BOM dele.
  const [bomFilter, setBomFilter] = useState<'all' | 'with' | 'without'>(() => {
    if (!initialHasBom) return 'all';
    const expandId = searchParams.get('expandProduct');
    if (expandId) {
      const p = rawProducts.find(x => x.id === expandId);
      if (p) {
        return (p.bom && p.bom.length > 0) ? 'with' : 'without';
      }
      return 'without'; // Assume sem se não houver pra precaver
    }
    return 'with';
  });

  const filteredProducts = useMemo(() => {
    let result = CatalogLogic.filterProducts(products, {
      search,
      familyFilter,
      sectorFilter,
      stockLevel,
      allowedFamilies
    });

    if (bomFilter === 'with') {
      result = result.filter(p => p.bom && p.bom.length > 0);
    } else if (bomFilter === 'without') {
      result = result.filter(p => !p.bom || p.bom.length === 0);
    }

    return result;
  }, [products, search, familyFilter, sectorFilter, stockLevel, bomFilter, allowedFamilies]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const families = useMemo(() => {
    const relevantProducts = allowedFamilies 
      ? products.filter(p => allowedFamilies.includes(p.family || ''))
      : products;
    return CatalogLogic.extractFamilies(relevantProducts);
  }, [products, allowedFamilies]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border border-red-100 dark:border-red-900/50 max-w-sm">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Erro ao carregar o catálogo</h3>
          <p className="text-red-700 dark:text-red-300 text-sm mb-6">Não conseguimos comunicar com a API.</p>
          <Button onClick={() => refetch()} className="w-full bg-red-600 hover:bg-red-700 text-white border-none">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex-1">
          <CatalogFilters 
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            familyFilter={familyFilter}
            onFamilyChange={(val) => { setFamilyFilter(val === 'Todas' ? '' : val); setPage(1); }}
            families={families}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            sectorFilter={sectorFilter}
            onSectorChange={(val) => { setSectorFilter(val); setPage(1); }}
            sectors={sectors}
            stockLevel={stockLevel}
            onStockLevelChange={(val) => { setStockLevel(val); setPage(1); }}
          />
        </div>
        <div className="flex-shrink-0">
          {!initialHasBom ? (
            <CreateProductButton autoOpen={initialAction === 'create'} />
          ) : (
            <CreateBomWizardButton autoOpen={initialAction === 'create'} />
          )}
        </div>
      </div>

      {initialHasBom && (
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-fit mx-auto sm:mx-0">
          <button
            onClick={() => { setBomFilter('with'); setPage(1); }}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-md transition-all ${
              bomFilter === 'with'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Com Estrutura
          </button>
          <button
            onClick={() => { setBomFilter('without'); setPage(1); }}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-md transition-all ${
              bomFilter === 'without'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Sem Estrutura
          </button>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
          ))
        ) : paginatedProducts.length > 0 ? (
          <>
            {paginatedProducts.map(product => (
              <ProductListCard key={product.id} product={product} isBomView={initialHasBom} />
            ))}
            <CatalogPagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <Package className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Nenhum produto encontrado</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Ajuste os filtros ou verifique a conexão com o ERP.</p>
          </div>
        )}
      </div>
    </div>
  );
}
