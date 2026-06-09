import { DevBadge } from '../../../components/ui/DevBadge';
import { useStocks } from '../../../hooks/stocks/useStocks';
import { useOrders } from '../../../hooks/orders/useOrders';
import { usePlanning } from '../../../hooks/planner/usePlanning';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { BookmarkCheck, Trash2, Search, Filter, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MyProductsLogic } from '../domain/MyProductsLogic';
import { MyProductsTable } from './components/MyProductsTable';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product } from '../../../types/api';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useGoals } from '../../../hooks/goals/useGoals';
import { GoalPeriod } from '../../goals/domain/Goal';
import { useToast } from '../../../components/ui/Toast';
import { StockType } from '../../../types/api';
import { cn } from '../../../utils/cn';

const STOCK_TYPES: { id: StockType; label: string }[] = [
  { id: 'Barras', label: 'Barras' },
  { id: 'Confeitaria', label: 'Confeitaria' },
  { id: 'Chocolate Refinado', label: 'Chocolate Refinado' },
  { id: 'Insumos', label: 'Insumos' },
  { id: 'Limpeza', label: 'Limpeza' },
  { id: 'Maquinários', label: 'Maquinários' }
];

export function StocksPage() {
  const { savedProducts, removeProduct, clearAll, updateBulkMinStock, updateBulkCategory, updateBulkSectors } = useStocks();
  const { orders } = useOrders();
  const { addItem } = usePlanning();
  const { data: sectors = [] } = useSectors();
  const { saveBulkGoals, goals } = useGoals();
  const { success } = useToast();
  
  const [activeTab, setActiveTab] = useState<StockType>('Barras');
  
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Confirmação de Exclusão
  const [itemToDelete, setItemToDelete] = useState<string | 'ALL' | null>(null);

  const selectedProduct = useMemo(() => {
    return selectedProductId ? savedProducts.find(p => p.id === selectedProductId) || null : null;
  }, [selectedProductId, savedProducts]);

  // Filter products by active tab
  const productsInCurrentStock = useMemo(() => {
    return savedProducts.filter(p => {
       // Legacy products (without stockType) go to 'Barras'
       const stock = p.stockType || 'Barras';
       return stock === activeTab;
    });
  }, [savedProducts, activeTab]);

  const families = useMemo(() => {
    const fams = new Set<string>();
    productsInCurrentStock.forEach(p => {
      if (p.family) fams.add(p.family);
    });
    return Array.from(fams).sort();
  }, [productsInCurrentStock]);

  const filteredProducts = useMemo(() => {
    return MyProductsLogic.filterProducts(productsInCurrentStock, search, selectedFamily, selectedSector);
  }, [productsInCurrentStock, search, selectedFamily, selectedSector]);

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
    setSelectedProductId(product.id);
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

  const handleBulkPlanProducts = async (productIds: string[]) => {
    try {
      const promises = productIds.map(async (id) => {
        const product = savedProducts.find(p => p.id === id);
        if (product) {
          const productCode = String(product.code || product.id || product.description);
          const demand = demandMap[productCode] || 0;
          const stock = product.stock || 0;
          let qtyToPlan = 1;
          if (demand > stock) {
            qtyToPlan = demand - stock;
          }
          await addItem(product, qtyToPlan, 'geral', 'Produção Geral');
        }
      });

      await Promise.all(promises);
      navigate('/planner');
    } catch (err) {
      console.error(err);
      success('Erro ao planejar.');
    }
  };

  const handleBulkGoals = async (productIds: string[], sectorId: string, quantity: number, goalPeriod: GoalPeriod) => {
    try {
      const dataToSend = [];
      for (const id of productIds) {
        const product = savedProducts.find(p => p.id === id);
        if (product) {
           dataToSend.push({
             productCode: String(product.code || product.id),
             productDescription: product.description,
             sectorId: sectorId,
             targetQuantity: quantity,
             period: goalPeriod,
             isActive: true
           });
        }
      }
      await saveBulkGoals(dataToSend);
      success('Metas definidas com sucesso.');
    } catch (err) {
      console.error(err);
      success('Erro ao definir metas.');
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete === 'ALL') {
      // Clean only the active tab
      productsInCurrentStock.forEach(p => removeProduct(p.id));
    } else if (itemToDelete) {
      removeProduct(itemToDelete);
    }
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl flex items-center font-bold text-gray-900 dark:text-gray-100 gap-3">
            <Layers className="w-8 h-8 text-blue-600" />
            Estoques
           <DevBadge id="stockspage.title" /></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Gerencie categorias de produtos e visualização de seus estoques.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setItemToDelete('ALL')} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
          <Trash2 size={16} className="mr-2" />
          Limpar Categoria Atual
        </Button>
      </header>

      {/* Main Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl mb-6 shadow-inner overflow-x-auto hide-scrollbar">
         {STOCK_TYPES.map(tab => (
           <button
             key={tab.id}
             onClick={() => { setActiveTab(tab.id); setSearch(''); setSelectedFamily('all'); setSelectedSector('all') }}
             className={cn(
               "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap px-4",
               activeTab === tab.id 
                 ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm" 
                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-200/50"
             )}
           >
             {tab.label}
           </button>
         ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={`Buscar em ${activeTab}...`}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {families.length > 0 && (
          <div className="sm:w-48 relative">
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">Todas Famílias</option>
              {families.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        )}

        {sectors.length > 0 && (
          <div className="sm:w-48 relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">Todos Setores</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      {productsInCurrentStock.length === 0 ? (
        <EmptyState
          title={`Nenhum produto salvo em ${activeTab}`}
          description="Acesse o catálogo e adicione produtos a este estoque."
          actionLabel="Ir para o Catálogo"
          onAction={() => navigate('/products')}
          icon={<BookmarkCheck size={40} />}
        />
      ) : (
        <MyProductsTable 
          products={filteredProducts} 
          demandMap={demandMap}
          onRemoveProduct={(id) => setItemToDelete(id)} 
          onViewDetails={handleViewDetails}
          onPlanProduct={handlePlanProduct}
          onUpdateBulkMinStock={updateBulkMinStock}
          onUpdateBulkCategory={updateBulkCategory}
          onUpdateBulkSectors={updateBulkSectors}
          onUpdateBulkGoals={handleBulkGoals}
          onBulkPlanProducts={handleBulkPlanProducts}
        />
      )}

      <ProductDetailsModal 
        product={selectedProduct} 
        demandMap={demandMap}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPlanProduct={handlePlanProduct}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={itemToDelete === 'ALL' ? `Limpar ${activeTab}` : 'Remover Produto'}
        message={itemToDelete === 'ALL' 
          ? `Tem certeza que deseja remover todos os produtos da seção ${activeTab}? Esta ação não pode ser desfeita.`
          : 'Tem certeza que deseja remover este produto da sua lista?'}
        confirmLabel="Sim, Remover"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
