import { useDashboardTotals } from '../../../hooks/dashboard/useDashboardTotals';
import { useSyncStage20 } from '../../../hooks/dashboard/useSyncStage20';
import { useOrders } from '../../../hooks/orders/useOrders';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useLocalProduced } from '../../../hooks/dashboard/useLocalProduced';
import { useProductionSchedules } from '../../../hooks/production/useProductionSchedules';

import { MonitoringHeader } from './components/MonitoringHeader';
import { MonitoringStats } from './components/MonitoringStats';
import { MonitoringTable } from './components/MonitoringTable';
import { MonitoringDetailsModal } from './components/MonitoringDetailsModal';
import { ScheduleEditModal } from './components/ScheduleEditModal';
import { ProductionHistoryList } from './components/ProductionHistoryList';
import { TrackingLogic } from '../domain/TrackingLogic';
import { cn } from '../../../utils/cn';

export function MonitoringPage() {
  const { data: totals, isLoading: isApiLoading, isError, error, refetch: refetchTotals, isFetching } = useDashboardTotals();
  const syncStage20 = useSyncStage20();
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { producedRecords, toggleOrder, toggleAll, isLoading: isLocalLoading } = useLocalProduced();
  const { schedules, setSchedule, removeSchedule, isSetting } = useProductionSchedules();
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [editingScheduleDesc, setEditingScheduleDesc] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'overdue'>('all');
  const [activeTab, setActiveTab] = useState<'monitoring' | 'history'>('monitoring');

  const isLoading = isApiLoading || isLocalLoading || isOrdersLoading;

  const getProducedQuantity = (description: string) => {
    return TrackingLogic.calculateProducedQuantityByOrders(producedRecords, description, orders || []);
  };

  const filteredData = useMemo(() => {
    if (!totals?.data) return [];
    
    let result = [...totals.data];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter !== 'all') {
      result = result.filter(p => {
        const schedule = schedules.find(s => s.description === p.description);
        if (!schedule) return false;

        const [year, month, day] = schedule.scheduledAt.split('-').map(Number);
        const scheduledDate = new Date(year, month - 1, day);
        scheduledDate.setHours(0, 0, 0, 0);

        if (filter === 'today') return scheduledDate.getTime() === today.getTime();
        if (filter === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          return scheduledDate.getTime() === tomorrow.getTime();
        }
        if (filter === 'week') {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return scheduledDate >= today && scheduledDate <= nextWeek;
        }
        if (filter === 'overdue') {
          const isProduced = getProducedQuantity(p.description) >= p.totalQuantity;
          return scheduledDate < today && !isProduced;
        }
        return true;
      });
    }

    return result;
  }, [totals, schedules, filter, producedRecords]);

  const currentProductData = useMemo(() => {
    if (!selectedProduct || !totals) return null;
    return totals.data.find(p => p.description === selectedProduct) || null;
  }, [selectedProduct, totals]);

  const currentSchedule = useMemo(() => {
    if (!editingScheduleDesc) return undefined;
    return schedules.find(s => s.description === editingScheduleDesc);
  }, [editingScheduleDesc, schedules]);

  const handleToggleProduct = (description: string, totalNeeded: number) => {
    const ordersWithProduct = TrackingLogic.filterOrdersByProduct(orders || [], description);
    toggleAll(ordersWithProduct, description);
  };

  const handleToggleOrder = (orderId: string, description: string, quantity: number, orderNumber: string) => {
    const id = TrackingLogic.generateProducedId(orderId, description);
    toggleOrder(id, description, quantity, orderId, orderNumber);
  };

  const isOrderProduced = (orderId: string, description: string) => {
    const id = TrackingLogic.generateProducedId(orderId, description);
    return producedRecords.some(r => r.id === id);
  };

  const getOrderProducedRecord = (orderId: string, description: string) => {
    const id = TrackingLogic.generateProducedId(orderId, description);
    return producedRecords.find(r => r.id === id);
  };

  const validOrderIds = new Set((orders || []).map(o => String(o.id)));
  const validProducedRecords = producedRecords.filter(r => r.orderId && validOrderIds.has(String(r.orderId)));
  const totalProducedItemsCount = TrackingLogic.calculateTotalProduced(validProducedRecords);
  const adjustedTotal = Math.max(0, (totals?.totalItems || 0) - totalProducedItemsCount);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Atenção</h2>
          <p className="text-red-700 text-sm mb-6 bg-white py-2 px-4 rounded border border-red-100 italic">
            {typeof error === 'string' ? error : 'Ocorreu um erro ao carregar os dados.'}
          </p>
          <Button onClick={() => refetchTotals()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <MonitoringHeader 
        isFetching={isFetching}
        isSyncing={syncStage20.isPending}
        onSync={() => syncStage20.mutate()}
        title="Controle de Produção"
        subtitle="Monitoramento em tempo real (Etapa 20)"
      />

      <div className="flex bg-zinc-100 p-1 rounded-xl w-max">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
            activeTab === 'monitoring' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Monitoramento
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
            activeTab === 'history' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Histórico
        </button>
      </div>

      {activeTab === 'monitoring' ? (
        <>
          <MonitoringStats 
            totalItems={adjustedTotal}
            uniqueSkus={totals?.data.length || 0}
            lastUpdate={totals?.lastUpdate}
            isLoading={isLoading}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-zinc-400" />
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'today', label: 'Para Hoje' },
                  { id: 'tomorrow', label: 'Amanhã' },
                  { id: 'week', label: 'Esta Semana' },
                  { id: 'overdue', label: 'Atrasados', color: 'text-red-600 font-bold' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      filter === f.id 
                        ? "bg-zinc-900 text-white shadow-sm" 
                        : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100",
                      f.color && filter !== f.id ? f.color : ""
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <CalendarIcon size={14} />
              {filteredData.length} itens mostrados
            </div>
          </div>

          <MonitoringTable 
            isLoading={isLoading}
            data={filteredData}
            getProducedQuantity={getProducedQuantity}
            onToggleProduct={handleToggleProduct}
            onSelectProduct={(desc) => {
              setSelectedProduct(desc);
              setShowDetailsModal(true);
            }}
            schedules={schedules}
            onOpenSchedule={(desc) => {
              setEditingScheduleDesc(desc);
              setShowScheduleModal(true);
            }}
          />
        </>
      ) : (
        <ProductionHistoryList records={producedRecords} isLoading={isLocalLoading} />
      )}

      <MonitoringDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        selectedProduct={selectedProduct}
        currentProductData={currentProductData}
        producedQuantity={selectedProduct ? getProducedQuantity(selectedProduct) : 0}
        ordersWithProduct={selectedProduct ? TrackingLogic.filterOrdersByProduct(orders || [], selectedProduct) : []}
        isOrderProduced={isOrderProduced}
        getOrderProducedRecord={getOrderProducedRecord}
        onToggleProduct={handleToggleProduct}
        onToggleOrder={handleToggleOrder}
        onOpenSchedule={() => {
          if (selectedProduct) {
            setShowDetailsModal(false); // maybe close details or not, let's just leave it open or close it
            setEditingScheduleDesc(selectedProduct);
            setShowScheduleModal(true);
          }
        }}
      />

      <ScheduleEditModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        description={editingScheduleDesc || ''}
        currentSchedule={currentSchedule}
        isLoading={isSetting}
        onSave={(date, notes) => {
          if (editingScheduleDesc) {
            setSchedule({ description: editingScheduleDesc, date, notes });
          }
        }}
        onRemove={() => {
          if (editingScheduleDesc) {
            removeSchedule(editingScheduleDesc);
          }
        }}
      />
    </div>
  );
}
