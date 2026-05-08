import { BookmarkPlus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface SelectionBarProps {
  selectedCount: number;
  onSave: () => void;
}

export function SelectionBar({ selectedCount, onSave }: SelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 mb-4 bg-blue-600 rounded-xl text-white shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <BookmarkPlus size={16} />
        </div>
        <span className="text-sm font-bold">{selectedCount} selecionados</span>
      </div>
      <Button 
        size="sm" 
        className="bg-white text-blue-600 hover:bg-blue-50 font-bold h-9" 
        onClick={onSave}
      >
        Salvar Seleção
      </Button>
    </div>
  );
}
