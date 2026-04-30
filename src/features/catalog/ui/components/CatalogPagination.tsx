import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({ currentPage, totalPages, totalItems, onPageChange }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
      <p className="text-xs text-slate-500">Total: {totalItems} itens</p>
      <div className="flex items-center gap-1.5">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
          disabled={currentPage === 1} 
          className="w-10 p-0"
        >
          <ChevronLeft size={18} />
        </Button>
        <span className="text-xs font-bold px-4">{currentPage} / {totalPages}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
          disabled={currentPage === totalPages} 
          className="w-10 p-0"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
