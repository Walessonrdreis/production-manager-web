import { useStocks } from '../../../hooks/stocks/useStocks';
import { useOmieProducts } from '../../../hooks/catalog/useOmieProducts';
import { usePlanning } from '../../../hooks/planner/usePlanning';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { useMemo, useState, useEffect } from 'react';

import { PlanningHeader } from './components/PlanningHeader';
import { PlanningProductList } from './components/PlanningProductList';
import { PlanningSelectedItems } from './components/PlanningSelectedItems';
import { PlanningLogic } from '../domain/PlanningLogic';

export function PlanningPage() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeSectorId, setActiveSectorId] = useState<string>('');
  
  const { savedProducts } = useStocks();
  const { data: allOmieProducts } = useOmieProducts();
  
  const { 
    items, addItem, addBulkItems, removeItem, 
    period, setPeriod, clearPlanning, updateQuantity,
    scheduledAt, setScheduledAt, generateOrders 
  } = usePlanning();
  const { data: sectors = [] } = useSectors();
  
  // Define o primeiro setor como ativo inicialmente se houver setores
  useEffect(() => {
    if (sectors.length > 0 && !activeSectorId) {
      setActiveSectorId(sectors[0].id);
    }
  }, [sectors, activeSectorId]);

  const activeSector = useMemo(() => 
    sectors.find(s => s.id === activeSectorId) || (sectors.length > 0 ? sectors[0] : null)
  , [sectors, activeSectorId]);

  const filteredProducts = useMemo(() => {
    const dataSource = search.length > 0 ? (allOmieProducts.length > 0 ? allOmieProducts : savedProducts) : savedProducts;
    return PlanningLogic.filterProducts(dataSource, search);
  }, [savedProducts, allOmieProducts, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleAddItem = async (product: any, qty: number) => {
    if (!activeSector) return;
    await addItem(product, qty, activeSector.id, activeSector.name);
  };

  const handleBulkAdd = async () => {
    if (!activeSector) return;
    const dataSource = search.length > 0 ? (allOmieProducts.length > 0 ? allOmieProducts : savedProducts) : savedProducts;
    const productsToAdd = dataSource.filter(p => selectedIds.includes(p.id));
    await addBulkItems(productsToAdd, activeSector.id, activeSector.name);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PlanningHeader 
        period={period}
        onPeriodChange={setPeriod}
        scheduledAt={scheduledAt}
        onScheduledAtChange={setScheduledAt}
        onClear={clearPlanning}
        onGenerateOrder={generateOrders}
        items={items}
        sectors={sectors}
        activeSectorId={activeSectorId}
        onActiveSectorChange={setActiveSectorId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <PlanningProductList 
          search={search}
          onSearchChange={setSearch}
          filteredProducts={filteredProducts}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onBulkAdd={handleBulkAdd}
          onAddItem={handleAddItem}
          activeSectorName={activeSector?.name}
          sectors={sectors}
        />

        <PlanningSelectedItems 
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          scheduledAt={scheduledAt}
        />
      </div>
    </div>
  );
}
