import { Card } from '../../../components/ui/Card';
import { LayoutDashboard, TrendingUp, AlertCircle, BarChart3, Activity } from 'lucide-react';
import { ActivityLogViewer } from './ActivityLogViewer';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Painel Estratégico</h1>
        <p className="text-sm text-zinc-500">Visão geral do desempenho da fábrica</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-50/50 border-dashed border-zinc-200">
          <div className="flex flex-col items-center justify-center py-6">
            <TrendingUp size={24} className="text-zinc-300 mb-2" />
            <span className="text-xs font-medium text-zinc-400">Em Breve: Eficiência</span>
          </div>
        </Card>
        <Card className="bg-zinc-50/50 border-dashed border-zinc-200">
          <div className="flex flex-col items-center justify-center py-6">
            <Activity size={24} className="text-blue-400 mb-2" />
            <span className="text-xs font-medium text-blue-500 tracking-wide uppercase">Atividades Ativas</span>
          </div>
        </Card>
        <Card className="bg-zinc-50/50 border-dashed border-zinc-200">
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle size={24} className="text-zinc-300 mb-2" />
            <span className="text-xs font-medium text-zinc-400">Em Breve: Atrasos</span>
          </div>
        </Card>
        <Card className="bg-zinc-50/50 border-dashed border-zinc-200">
          <div className="flex flex-col items-center justify-center py-6">
            <LayoutDashboard size={24} className="text-zinc-300 mb-2" />
            <span className="text-xs font-medium text-zinc-400">Em Breve: KPIs</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm sticky top-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <BarChart3 className="text-blue-500" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">O Painel foi atualizado</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
              A funcionalidade de acompanhamento de planejamento foi movida para a aba <strong>"Acompanhamento"</strong> no menu lateral principal.
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
