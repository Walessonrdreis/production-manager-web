import { useState } from 'react';
import { ShoppingBag, Settings2 } from 'lucide-react';
import { SalesOrdersTab } from './components/SalesOrdersTab';
import { ProductionOrdersTab } from './components/ProductionOrdersTab';

type MainTab = 'vendas' | 'producao';

export function OrdersPage() {
  const [mainTab, setMainTab] = useState<MainTab>('vendas');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl flex items-center font-bold text-gray-900 gap-3">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          Gestão de Ordens
        </h1>
        <p className="text-gray-500 mt-2">Gerencie pedidos de venda do Omie e as Ordens de Produção (OPs) locais com seus respectivos lotes.</p>
      </header>

      {/* Main Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl mb-6 shadow-inner">
        <button
          onClick={() => setMainTab('vendas')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${mainTab === 'vendas' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          Pedidos de Venda
        </button>
        <button
          onClick={() => setMainTab('producao')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${mainTab === 'producao' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <Settings2 className="w-4 h-4" />
          Ordens de Produção
        </button>
      </div>

      {mainTab === 'vendas' && <SalesOrdersTab />}
      {mainTab === 'producao' && <ProductionOrdersTab />}
    </div>
  );
}
