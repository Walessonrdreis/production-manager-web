import { useMyProducts } from '../../../hooks/products/useMyProducts';
import { useOrders } from '../../../hooks/orders/useOrders';
import { usePlanning } from '../../../hooks/planner/usePlanning';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { BookmarkCheck, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MyProductsLogic } from '../domain/MyProductsLogic';
import { MyProductsTable } from './components/MyProductsTable';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product } from '../../../types/api';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export function MyProductsPage() {
  const { savedProducts, removeProduct, clearAll, updateBulkMinStock } = useMyProducts();
  const { orders } = useOrders();
  const { addItem } = usePlanning();
  const { data: sectors = [] } = useSectors();
  
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Confirmação de Exclusão
  const [itemToDelete, setItemToDelete] = useState<string | 'ALL' | null>(null);

  const families = useMemo(() => {
    const fams = new Set<string>();
    savedProducts.forEach(p => {
      if (p.family) fams.add(p.family);
    });
    return Array.from(fams).sort();
  }, [savedProducts]);

  const filteredProducts = useMemo(() => {
    return MyProductsLogic.filterProducts(savedProducts, search, selectedFamily, selectedSector);
  }, [savedProducts, search, selectedFamily, selectedSector]);

  const demandMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!orders) return map;
    
    // Filtro para ordens ativas (não canceladas/encerradas)
    const activeOrders = orders.filter(o => o.cancelado !== 'Y' && o.encerrado !== 'Y');
    
    activeOrders.forEach(order => {
      order.items?.forEach(item => {
        const productCode = item.omieItemCode || item.description;
        if (productCode) {
          map[productCode] = (map[productCode] || 0) + Number(item.quantity) || 0;
        }
      });
    });
    
    return map;
  }, [orders]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handlePlanProduct = async (product: Product) => {
    const productCode = String(product.code || product.id || product.description);
    const demand = demandMap[productCode] || 0;
    const stock = product.stock || 0;
    let qtyToPlan = 1;
    
    if (demand > stock) {
      qtyToPlan = demand - stock;
    }
    
    await addItem(product, qtyToPlan, 'geral', 'Produção Geral');
    navigate('/planner');
  };

  const handleConfirmDelete = () => {
    if (itemToDelete === 'ALL') {
      clearAll();
    } else if (itemToDelete) {
      removeProduct(itemToDelete);
    }
    setItemToDelete(null);
  };

  if (savedProducts.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto salvo"
        description="Salve produtos do catálogo para acessá-los rapidamente aqui."
        actionLabel="Ir para o Catálogo"
        onAction={() => navigate('/products')}
        icon={<BookmarkCheck size={40} />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Meus Produtos</h1>
          <p className="text-zinc-500 text-sm">Sua seleção personalizada de bens de produção</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setItemToDelete('ALL')} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
          <Trash2 size={16} className="mr-2" />
          Limpar Tudo
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar nos meus produtos..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {families.length > 0 && (
          <div className="sm:w-48 relative">
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white font-medium text-slate-700"
            >
              <option value="all">Todas Famílias</option>
              {families.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        )}

        {sectors.length > 0 && (
          <div className="sm:w-48 relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-slate-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white font-medium text-slate-700"
            >
              <option value="all">Todos Setores</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      <MyProductsTable 
        products={filteredProducts} 
        demandMap={demandMap}
        onRemoveProduct={(id) => setItemToDelete(id)} 
        onViewDetails={handleViewDetails}
        onPlanProduct={handlePlanProduct}
        onUpdateBulkMinStock={updateBulkMinStock}
      />

      <ProductDetailsModal 
        product={selectedProduct} 
        demandMap={demandMap}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPlanProduct={handlePlanProduct}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={itemToDelete === 'ALL' ? 'Limpar Todos os Produtos' : 'Remover Produto'}
        message={itemToDelete === 'ALL' 
          ? 'Tem certeza que deseja remover todos os produtos salvos da sua lista? Esta ação não pode ser desfeita.'
          : 'Tem certeza que deseja remover este produto da sua lista?'}
        confirmLabel="Sim, Remover"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
