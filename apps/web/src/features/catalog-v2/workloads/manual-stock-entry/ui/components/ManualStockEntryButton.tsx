import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ManualStockEntryModal } from './ManualStockEntryModal';
import { useQueryClient } from '@tanstack/react-query';

interface ManualStockEntryButtonProps {
  productId: string;
  codigo: string;
  descricao: string;
}

export function ManualStockEntryButton({ productId, codigo, descricao }: ManualStockEntryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ['products-raw-v2'] });
  };

  return (
    <>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-semibold rounded-xl transition-colors border border-blue-200 dark:border-blue-800/50"
      >
        <PlusCircle size={16} />
        <span className="text-sm">Entrada Manual</span>
      </button>

      {isOpen && (
        <ManualStockEntryModal 
          productId={productId}
          codigo={codigo || productId}
          descricao={descricao}
          onClose={() => setIsOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
