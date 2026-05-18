import { Download } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PlanningPDF } from '../PlanningPDF';

interface PlanningHeaderProps {
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (val: 'daily' | 'weekly' | 'monthly') => void;
  scheduledAt: string;
  onScheduledAtChange: (val: string) => void;
  onClear: () => void;
  onGenerateOrder: () => void;
  items: any[];
  sectors: any[];
  activeSectorId: string;
  onActiveSectorChange: (id: string) => void;
}

export function PlanningHeader({ 
  period, onPeriodChange, scheduledAt, onScheduledAtChange,
  onClear, onGenerateOrder, items, sectors, activeSectorId, onActiveSectorChange 
}: PlanningHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Planejamento de Produção</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Selecione produtos para gerar ordens de fabricação</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
         <select 
           className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 px-3 text-sm font-bold bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none shadow-sm"
           value={activeSectorId}
           onChange={(e) => onActiveSectorChange(e.target.value)}
         >
            <option value="" disabled>Setor Destino...</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
            ))}
         </select>

         <select 
           className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 px-3 text-sm font-bold bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none shadow-sm"
           value={period}
           onChange={(e) => onPeriodChange(e.target.value as any)}
         >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
         </select>

         <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-10 px-3 rounded-xl shadow-sm flex-1 sm:flex-none">
           <span className="text-[10px] uppercase font-bold text-zinc-400">Data Produção:</span>
           <input 
             type="date"
             value={scheduledAt}
             onChange={(e) => onScheduledAtChange(e.target.value)}
             className="text-sm font-bold outline-none bg-transparent"
           />
         </div>
         
         <Button variant="outline" size="sm" onClick={onClear} className="text-xs flex-1 sm:flex-none h-10 px-4">Limpar</Button>
         
         <PDFDownloadLink 
           document={<PlanningPDF items={items} period={period} scheduledAt={scheduledAt} />} 
           fileName={`planejamento-${period}-${new Date().toISOString().split('T')[0]}.pdf`}
           className="w-full sm:w-auto"
         >
           {({ loading }: { loading: boolean }) => (
              <Button disabled={items.length === 0 || loading} variant="outline" size="sm" className="w-full sm:w-auto text-xs h-10 px-4 font-bold">
                <Download size={14} className="mr-2" />
                PDF
              </Button>
            )}
         </PDFDownloadLink>

         <Button 
            disabled={items.length === 0} 
            size="sm" 
            className="w-full sm:w-auto text-xs h-10 px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onGenerateOrder}
          >
            Gerar Ordens
         </Button>
      </div>
    </header>
  );
}
