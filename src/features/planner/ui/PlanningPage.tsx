import { useMyProducts } from '../../../hooks/products/useMyProducts';
import { usePlanning } from '../../../hooks/planner/usePlanning';
import { useState } from 'react';

import { PlanningHeader } from './components/PlanningHeader';
import { PlanningProductList } from './components/PlanningProductList';
import { PlanningSelectedItems } from './components/PlanningSelectedItems';

export function PlanningPage() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const { savedProducts } = useMyProducts();
  const { items, addItem, addBulkItems, removeItem, period, setPeriod, clearPlanning, updateQuantity } = usePlanning();
  
  const normalizeString = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const searchNormalized = normalizeString(search);
  
  const filteredProducts = savedProducts.filter(p => {
    const descriptionMatch = normalizeString(p.description).includes(searchNormalized);
    const idMatch = normalizeString(p.id).includes(searchNormalized);
    const familyMatch = p.family ? normalizeString(p.family).includes(searchNormalized) : false;
    
    return descriptionMatch || idMatch || familyMatch;
  });

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

  const handleBulkAdd = async () => {
    const productsToAdd = savedProducts.filter(p => selectedIds.includes(p.id));
    await addBulkItems(productsToAdd);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PlanningHeader 
        period={period}
        onPeriodChange={setPeriod}
        onClear={clearPlanning}
        items={items}
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
          onAddItem={addItem}
        />

        <PlanningSelectedItems 
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      </div>
    </div>
  );
}
