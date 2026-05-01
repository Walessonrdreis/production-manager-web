import { Download } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PlanningPDF } from '../PlanningPDF';

interface PlanningHeaderProps {
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (val: 'daily' | 'weekly' | 'monthly') => void;
  onClear: () => void;
  items: any[];
  sectors: any[];
  activeSectorId: string;
  onActiveSectorChange: (id: string) => void;
}

export function PlanningHeader({ 
  period, onPeriodChange, onClear, items, 
  sectors, activeSectorId, onActiveSectorChange 
}: PlanningHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Planejamento de Produção</h1>
        <p className="text-xs sm:text-sm text-zinc-500">Selecione produtos para gerar ordens de fabricação</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
         <select 
           className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none shadow-sm"
           value={activeSectorId}
           onChange={(e) => onActiveSectorChange(e.target.value)}
         >
            <option value="" disabled>Setor Destino...</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
            ))}
         </select>

         <select 
           className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none shadow-sm"
           value={period}
           onChange={(e) => onPeriodChange(e.target.value as any)}
         >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
         </select>
         
         <Button variant="outline" size="sm" onClick={onClear} className="text-xs flex-1 sm:flex-none h-10 px-4">Limpar</Button>
         
         <PDFDownloadLink 
           document={<PlanningPDF items={items} period={period} />} 
           fileName={`planejamento-${period}-${new Date().toISOString().split('T')[0]}.pdf`}
           className="w-full sm:w-auto"
         >
           {({ loading }: { loading: boolean }) => (
              <Button disabled={items.length === 0 || loading} size="sm" className="w-full sm:w-auto text-xs h-10 px-6 font-bold">
                <Download size={14} className="mr-2" />
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </Button>
            )}
         </PDFDownloadLink>
      </div>
    </header>
  );
}
