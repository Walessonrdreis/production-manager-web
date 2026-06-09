import { useMemo } from 'react';
import { useOmieProducts } from '../../../hooks/catalog/useOmieProducts';
import { Product } from '../../../types/api';
import { RecipeUnit } from './RecipeCalculator';

export interface DraftRecipeItem {
  id: string;
  name: string;
  quantity: number;
  unit: RecipeUnit;
  isPackaging: boolean;
  matchedProductId?: string; // Set manually if user maps it explicitly or creates a new one
}

export interface ResolvedRecipeItem extends DraftRecipeItem {
  matchStatus: 'matched' | 'unmatched';
  matchedProduct?: Product;
}

export function useRecipeResolver(draftItems: DraftRecipeItem[]) {
  const { data: products = [], isLoading } = useOmieProducts();

  const resolvedItems = useMemo(() => {
    return draftItems.map(draft => {
      let matchedProduct: Product | undefined = undefined;
      
      if (draft.matchedProductId) {
         matchedProduct = products.find(p => p.id === draft.matchedProductId);
      } else if (draft.name.trim().length > 0) {
         const searchName = draft.name.trim().toLowerCase();
         matchedProduct = products.find(p => p.description.trim().toLowerCase() === searchName);
      }

      return {
        ...draft,
        matchStatus: matchedProduct ? 'matched' : 'unmatched',
        matchedProduct
      } as ResolvedRecipeItem;
    });
  }, [draftItems, products]);

  const allMatched = draftItems.length > 0 && resolvedItems.every(i => i.matchStatus === 'matched');

  return {
    resolvedItems,
    allMatched,
    products,
    isLoading
  };
}
