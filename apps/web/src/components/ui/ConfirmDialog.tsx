import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-md">
      <div className="flex flex-col items-center text-center p-4">
        <div className={`p-4 rounded-full mb-4 ${
          variant === 'danger' ? 'bg-red-100 text-red-600' :
          variant === 'warning' ? 'bg-amber-100 text-amber-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">{message}</p>
        
        <div className="flex gap-3 w-full">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            className={`flex-1 ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
              variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
              'bg-blue-600 hover:bg-blue-700 text-white'
            }`} 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
