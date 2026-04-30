import { useState, useMemo } from 'react';
import { useOmieProducts } from '../../../hooks/catalog/useOmieProducts';
import { useSyncCatalog } from '../../../hooks/catalog/useSyncCatalog';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { useMyProducts } from '../../../hooks/products/useMyProducts';
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

export function CatalogPage() {
  const { addToast } = useToast();
  const { data: products = [], isLoading, isError, error, isFetching, refetch: refetchProducts } = useOmieProducts();
  const syncWithOmie = useSyncCatalog();
  const { data: sectors = [] } = useSectors();
  const { saveProduct, isSaved, removeProduct } = useMyProducts();
  
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [sectorFilter, setSectorFilter] = useState('');
  const [stockLevel, setStockLevel] = useState<'all' | 'low' | 'normal'>('all');
  const [familyFilter, setFamilyFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const handleSaveSelected = () => {
    const selectedItems = filteredProducts.filter(p => selectedIds.has(p.id));
    selectedItems.forEach(p => saveProduct(p));
    addToast({
      title: 'Produtos Salvos',
      message: `${selectedIds.size} produtos adicionados à sua lista pessoal.`,
      type: 'success'
    });
    setSelectedIds(new Set());
  };

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-sm mx-auto">
          <p className="text-red-700 font-mono text-sm mb-6">Erro: {(error as any)?.message}</p>
          <Button onClick={() => refetchProducts()} variant="outline" size="sm" className="w-full">Tentar novamente</Button>
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
          onSave={handleSaveSelected}
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
              onSaveProduct={saveProduct}
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
    </div>
  );
}
