import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type CatalogSubpage = 'none' | 'all-products' | 'low-stock' | 'with-bom' | 'create-product' | 'create-bom';

const DEFAULT_BLOCKS: CatalogSubpage[] = [
  'all-products',
  'create-product',
  'create-bom',
  'low-stock',
  'with-bom'
];

const VALID_VIEWS: CatalogSubpage[] = ['none', 'all-products', 'low-stock', 'with-bom', 'create-product', 'create-bom'];

export function useCatalogLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get('view') as CatalogSubpage;
  
  const [activeSubpage, setActiveSubpage] = useState<CatalogSubpage>(
    VALID_VIEWS.includes(initialView) ? initialView : 'none'
  );
  
  const [blocksOrder, setBlocksOrder] = useState<CatalogSubpage[]>(DEFAULT_BLOCKS);

  const openSubpage = useCallback((sub: CatalogSubpage) => {
    setActiveSubpage(sub);
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('view', sub);
      return newParams;
    });
  }, [setSearchParams]);

  const closeSubpage = useCallback(() => {
    setActiveSubpage('none');
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('view');
      newParams.delete('expandProduct'); // Cleanup expansion state on hub format
      return newParams;
    });
  }, [setSearchParams]);

  useEffect(() => {
    if (initialView && VALID_VIEWS.includes(initialView) && initialView !== activeSubpage) {
      setActiveSubpage(initialView);
    }
  }, [initialView]);

  return {
    activeSubpage,
    openSubpage,
    closeSubpage,
    blocksOrder,
    reorderBlocks: setBlocksOrder
  };
}
