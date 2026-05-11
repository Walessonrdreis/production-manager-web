import { PackageCheck, Clock, Box } from 'lucide-react';
import { ProducedRecord } from '../../../../db/models';

interface ProductionHistoryListProps {
  records: ProducedRecord[];
  isLoading: boolean;
}

export function ProductionHistoryList({ records, isLoading }: ProductionHistoryListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-zinc-500">
        Carregando histórico...
      </div>
    );
  }

  // Sort records by updatedAt descending
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });

  if (sortedRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-zinc-200">
        <PackageCheck size={48} className="text-zinc-200 mb-4" />
        <h3 className="text-lg font-bold text-zinc-900 mb-1">Nenhum histórico encontrado</h3>
        <p className="text-zinc-500 text-sm max-w-sm">
          Os produtos que você marcar como produzidos aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Histórico de Produção</h2>
          <p className="text-sm text-zinc-500">Últimos itens finalizados</p>
        </div>
      </div>
      
      <div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto">
        {sortedRecords.map((record) => (
          <div key={record.id} className="p-4 hover:bg-zinc-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircleIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 leading-tight mb-1">{record.description}</h4>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  {record.orderNumber && (
                    <span className="flex items-center gap-1 font-medium bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                      <Box size={12} />
                      Pedido #{record.orderNumber}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(record.updatedAt || '').toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-baseline space-x-1 shrink-0 ml-12 md:ml-0">
              <span className="text-xl font-black text-slate-900">
                +{record.quantity}
              </span>
              <span className="text-xs uppercase text-slate-500 font-bold">
                un
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CheckCircleIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="m9 11 3 3L22 4"></path>
  </svg>
);
