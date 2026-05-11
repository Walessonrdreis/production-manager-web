import { useState, useMemo } from 'react';
import { useOmieProducts } from '../../../hooks/catalog/useOmieProducts';
import { useSyncCatalog, useSyncStock } from '../../../hooks/catalog/useSyncCatalog';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { useStocks } from '../../../hooks/stocks/useStocks';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { RefreshCw } from 'lucide-react';

import { CatalogHeader } from './components/CatalogHeader';
import { CatalogFilters } from './components/CatalogFilters';
import { CatalogTable } from './components/CatalogTable';
import { CatalogPagination } from './components/CatalogPagination';
import { SelectionBar } from './components/SelectionBar';
import { CatalogLogic } from '../domain/CatalogLogic';
import { SaveToStockModal } from './components/SaveToStockModal';
import { StockType } from '../../../types/api';
import { Product } from '../../../types/api';

export function CatalogPage() {
  const { addToast } = useToast();
  const { data: products = [], isLoading, isError, error, isFetching, refetch: refetchProducts } = useOmieProducts();
  const syncWithOmie = useSyncCatalog();
  const syncStock = useSyncStock();
  const { data: sectors = [] } = useSectors();
  const { saveProduct, isSaved, removeProduct } = useStocks();
  
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [sectorFilter, setSectorFilter] = useState('');
  const [stockLevel, setStockLevel] = useState<'all' | 'low' | 'normal'>('all');
  const [familyFilter, setFamilyFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [pendingProductsToSave, setPendingProductsToSave] = useState<Product[]>([]);

  const filteredProducts = useMemo(() => {
    return CatalogLogic.filterProducts(products, {
      search,
      familyFilter,
      sectorFilter,
      stockLevel
    });
  }, [products, search, familyFilter, sectorFilter, stockLevel]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const families = useMemo(() => {
    return CatalogLogic.extractFamilies(products);
  }, [products]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedProducts.map(p => p.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
    const newSelected = new Set(selectedIds);
    if (allPageSelected) pageIds.forEach(id => newSelected.delete(id));
    else pageIds.forEach(id => newSelected.add(id));
    setSelectedIds(newSelected);
  };

  const requestSaveSingle = (product: Product) => {
    setPendingProductsToSave([product]);
    setIsStockModalOpen(true);
  };

  const requestSaveMultiple = () => {
    const selectedItems = filteredProducts.filter(p => selectedIds.has(p.id));
    setPendingProductsToSave(selectedItems);
    setIsStockModalOpen(true);
  };

  const handleConfirmSave = (stockType: StockType) => {
    pendingProductsToSave.forEach(p => {
       saveProduct({ ...p, stockType });
    });
    addToast({
      title: 'Produtos Salvos',
      message: `${pendingProductsToSave.length} produtos adicionados ao estoque de ${stockType}.`,
      type: 'success'
    });
    setSelectedIds(new Set());
    setPendingProductsToSave([]);
  };

  if (isError) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={24} />
          </div>
          <h3 className="text-lg font-bold text-red-900 mb-2">Ops! Algo deu errado</h3>
          <p className="text-red-700 text-sm mb-6">
            Não conseguimos carregar o catálogo de produtos no momento. Pode ser uma instabilidade na API Omie ou na sua conexão.
          </p>
          <Button onClick={() => refetchProducts()} className="w-full bg-red-600 hover:bg-red-700 text-white border-none">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <CatalogHeader 
        productsCount={products.length}
        isFetching={isFetching}
        onSync={() => syncWithOmie.mutate()}
        isSyncing={syncWithOmie.isPending}
        onSyncStock={() => syncStock.mutate()}
        isSyncingStock={syncStock.isPending}
      />

      <Card>
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

        <SelectionBar 
          selectedCount={selectedIds.size}
          onSave={requestSaveMultiple}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <CatalogTable 
              products={paginatedProducts}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              isSaved={isSaved}
              onSaveProduct={requestSaveSingle}
              onRemoveProduct={removeProduct}
              isLoading={isLoading}
            />

            <CatalogPagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
      {isStockModalOpen && (
        <SaveToStockModal 
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          onConfirm={handleConfirmSave}
          count={pendingProductsToSave.length}
        />
      )}
    </div>
  );
}
