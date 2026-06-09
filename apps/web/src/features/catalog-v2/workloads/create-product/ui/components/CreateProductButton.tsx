import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateProductFormModal } from './CreateProductFormModal';
import { useQueryClient } from '@tanstack/react-query';

interface CreateProductButtonProps {
  autoOpen?: boolean;
}

export function CreateProductButton({ autoOpen = false }: CreateProductButtonProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    setIsOpen(false);
    // Invalidate queries to refresh the catalog
    queryClient.invalidateQueries({ queryKey: ['products-raw-v2'] });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-sm shadow-emerald-900/20 active:scale-95"
      >
        <Plus size={18} />
        <span>Novo Produto</span>
      </button>

      {isOpen && (
        <CreateProductFormModal 
          onClose={() => setIsOpen(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </>
  );
}
