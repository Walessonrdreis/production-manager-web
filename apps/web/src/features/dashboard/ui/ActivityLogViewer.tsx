import { motion } from 'motion/react';
import { Package, CalendarClock, Target, Layers, ArrowRight, CloudOff, Cloud } from 'lucide-react';
import { useActivityLogs, ActivityLogItem } from '../../../hooks/dashboard/useActivityLogs';

const icons = {
  production: <Package size={16} className="text-zinc-600 dark:text-zinc-400" />,
  planning: <CalendarClock size={16} className="text-zinc-600 dark:text-zinc-400" />,
  goal: <Target size={16} className="text-zinc-600 dark:text-zinc-400" />,
  product: <Layers size={16} className="text-zinc-600 dark:text-zinc-400" />
};

const colors = {
  production: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50',
  planning: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50',
  goal: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50',
  product: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50'
};

export function ActivityLogViewer() {
  const { data: logs, isLoading, error } = useActivityLogs();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-48 bg-zinc-200 dark:bg-slate-800 rounded"></div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
             <div key={i} className="h-16 w-full bg-zinc-100 dark:bg-zinc-800 dark:bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !logs) {
    return <div className="text-sm text-red-500">Erro ao carregar atividades recentes.</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/50 dark:bg-slate-900/50 border border-zinc-100 dark:border-zinc-800 dark:border-slate-800 rounded-lg p-6 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Nenhuma atividade registrada recentemente.</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Sua linha do tempo aparecerá aqui quando houver produção ou planejamento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border text-left border-zinc-100 dark:border-zinc-800 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 dark:text-white tracking-tight">Linha do Tempo Recente</h3>
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {logs.length} Eventos
        </span>
      </div>
      <div className="flex flex-col p-2 space-y-1">
        {logs.map((log: ActivityLogItem, idx: number) => (
          <motion.div 
            key={log.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-start p-3 gap-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-slate-800 transition-colors group`}
          >
            <div className={`mt-0.5 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border ${colors[log.type]}`}>
               {icons[log.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 dark:text-zinc-100 tracking-tight block truncate">
                  {log.title}
                </span>
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 whitespace-nowrap ml-2 hidden sm:block">
                  {log.timestamp.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed truncate">
                {log.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">
                    {log.user}
                 </span>
                 <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-slate-600"></span>
                 {log.synced ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium"><Cloud size={10} /> Em Nuvem</span>
                 ) : (
                    <span className="text-[10px] text-amber-500 dark:text-amber-400 flex items-center gap-1 font-medium"><CloudOff size={10} /> Local</span>
                 )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
