import { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { ProductionSchedule } from '../../../../db/models';

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  currentSchedule?: ProductionSchedule;
  onSave: (date: string, notes: string) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export function ScheduleEditModal({
  isOpen,
  onClose,
  description,
  currentSchedule,
  onSave,
  onRemove,
  isLoading
}: ScheduleEditModalProps) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentSchedule) {
      setDate(currentSchedule.scheduledAt);
      setNotes(currentSchedule.notes || '');
    } else {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setDate(localDate);
      setNotes('');
    }
  }, [currentSchedule, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50/50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Programar Produção</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate max-w-[300px]">{description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <X size={20} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Calendar size={16} className="text-blue-500" />
              Data de Produção
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <AlignLeft size={16} className="text-blue-500" />
              Observações / Notas
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Prioridade total, usar lote XPTO..."
              rows={4}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between gap-3">
          {currentSchedule && (
            <Button 
              variant="ghost" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                onRemove();
                onClose();
              }}
              disabled={isLoading}
            >
              <Trash2 size={18} className="mr-2" />
              Remover
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button 
              onClick={() => {
                onSave(date, notes);
                onClose();
              }}
              disabled={!date || isLoading}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
