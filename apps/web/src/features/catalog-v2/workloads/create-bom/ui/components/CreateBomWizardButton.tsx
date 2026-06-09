import React, { useState, useEffect } from 'react';
import { Plus, Layers } from 'lucide-react';
import { CreateBomWizardModal } from './CreateBomWizardModal';

export function CreateBomWizardButton({ autoOpen = false }: { autoOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(autoOpen);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-sm shadow-indigo-900/20 active:scale-95"
      >
        <Layers size={18} />
        <span>Nova Estrutura</span>
      </button>

      {isOpen && (
        <CreateBomWizardModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
