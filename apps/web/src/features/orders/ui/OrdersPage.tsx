import { ShoppingBag } from 'lucide-react';
import { SalesOrdersTab } from './components/SalesOrdersTab';

export function OrdersPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl flex items-center font-bold text-gray-900 dark:text-gray-100 gap-3">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          Pedidos de Venda
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Gerencie pedidos de venda sincronizados com o Omie.</p>
      </header>

      <SalesOrdersTab />
    </div>
  );
}
