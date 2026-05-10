import { Card } from '../../../components/ui/Card';
import { LayoutDashboard, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ActivityLogViewer } from './ActivityLogViewer';
import { useProductionSchedules } from '../../../hooks/production/useProductionSchedules';
import { useLocalProduced } from '../../../hooks/dashboard/useLocalProduced';
import { useDashboardTotals } from '../../../hooks/dashboard/useDashboardTotals';
import { isToday, isPast, parseISO, startOfDay } from 'date-fns';
import { useMemo } from 'react';

export function DashboardPage() {
  const { schedules } = useProductionSchedules();
  const { producedRecords } = useLocalProduced();
  const { data: totalsData } = useDashboardTotals();

  const metrics = useMemo(() => {
    const todayStart = startOfDay(new Date());
    
    let producedToday = 0;
    producedRecords?.forEach(record => {
      const recordDate = parseISO(record.updatedAt || '');
      if (isToday(recordDate)) {
        producedToday += record.quantity;
      }
    });

    let scheduledToday = 0;
    let lateSchedules = 0;
    
    schedules?.forEach(schedule => {
      const scheduledDate = startOfDay(parseISO(schedule.scheduledAt));
      if (isToday(scheduledDate)) {
        scheduledToday++;
      } else if (isPast(scheduledDate)) {
        lateSchedules++;
      }
    });

    const pendingOmie = totalsData ? (totalsData.totalItems || 0) : 0;

    return {
      producedToday,
      scheduledToday,
      lateSchedules,
      pendingOmie
    };
  }, [schedules, producedRecords, totalsData]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Painel Estratégico</h1>
        <p className="text-sm text-zinc-500">Visão geral do desempenho da fábrica</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-start p-6">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Produzidos (Hoje)</span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{metrics.producedToday}</div>
            <span className="text-xs font-medium text-zinc-400 mt-1">unidades finalizadas</span>
          </div>
        </Card>

        <Card className="bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-start p-6">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Programados (Hoje)</span>
              <Clock size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{metrics.scheduledToday}</div>
            <span className="text-xs font-medium text-zinc-400 mt-1">itens na fila de hoje</span>
          </div>
        </Card>

        <Card className={`border shadow-sm hover:shadow-md transition-shadow ${metrics.lateSchedules > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-zinc-200'}`}>
          <div className="flex flex-col items-start p-6">
            <div className="flex items-center justify-between w-full mb-4">
              <span className={`text-xs font-bold tracking-wider uppercase ${metrics.lateSchedules > 0 ? 'text-red-600' : 'text-zinc-500'}`}>Atrasos</span>
              <AlertCircle size={20} className={metrics.lateSchedules > 0 ? 'text-red-500' : 'text-zinc-400'} />
            </div>
            <div className={`text-3xl font-bold ${metrics.lateSchedules > 0 ? 'text-red-700' : 'text-zinc-900'}`}>
              {metrics.lateSchedules}
            </div>
            <span className={`text-xs font-medium mt-1 ${metrics.lateSchedules > 0 ? 'text-red-500' : 'text-zinc-400'}`}>
              itens programados vencidos
            </span>
          </div>
        </Card>

        <Card className="bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-start p-6">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Pendente Geral</span>
              <LayoutDashboard size={20} className="text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{metrics.pendingOmie}</div>
            <span className="text-xs font-medium text-zinc-400 mt-1">total de ordens válidas</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm sticky top-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <TrendingUp className="text-blue-500" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">O Painel Analytics está evoluindo</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
              Estes são seus primeiros indicadores e alertas automáticos! A funcionalidade de registro e baixa continuam na aba <strong>"Acompanhamento"</strong>.
            </p>
          </div>
        </div>

        <div className="w-full">
           <ActivityLogViewer />
        </div>
      </div>
    </div>
  );
}
