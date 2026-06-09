import { DevBadge } from '../../../components/ui/DevBadge';
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useCatalogLayout, CatalogSubpage } from '../model/useCatalogLayout';
import { BaseSubpageLayout } from './components/BaseSubpageLayout';

// Blocks
import { AllProductsBlock } from './blocks/AllProductsBlock';
import { CreateProductBlock } from './blocks/CreateProductBlock';
import { CreateBomBlock } from './blocks/CreateBomBlock';
import { LowStockBlock } from './blocks/LowStockBlock';
import { WithBomBlock } from './blocks/WithBomBlock';

// Views
import { CatalogV2List } from './CatalogV2List';

const blockComponents: Record<Exclude<CatalogSubpage, 'none'>, React.FC> = {
  'all-products': AllProductsBlock,
  'create-product': CreateProductBlock,
  'create-bom': CreateBomBlock,
  'low-stock': LowStockBlock,
  'with-bom': WithBomBlock,
};

function SortableBlock({ id, onClick, children }: { id: string, onClick: () => void, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="transition-transform duration-200 transform"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform h-full" 
        onClick={(e) => {
          // If the user clicks (not drags), we open the subpage
          onClick();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CatalogV2Hub() {
  const { activeSubpage, openSubpage, closeSubpage, blocksOrder, reorderBlocks } = useCatalogLayout();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocksOrder.indexOf(active.id as Exclude<CatalogSubpage, 'none'>);
      const newIndex = blocksOrder.indexOf(over.id as Exclude<CatalogSubpage, 'none'>);
      reorderBlocks(arrayMove(blocksOrder, oldIndex, newIndex));
    }
  }

  // Views Render
  if (activeSubpage === 'all-products') {
    return (
      <BaseSubpageLayout title="Todos os Produtos" onBack={closeSubpage}>
        <CatalogV2List />
      </BaseSubpageLayout>
    );
  }

  if (activeSubpage === 'low-stock') {
    return (
      <BaseSubpageLayout title="Estoque Baixo" onBack={closeSubpage}>
        <CatalogV2List initialStockLevel="low" />
      </BaseSubpageLayout>
    );
  }

  if (activeSubpage === 'with-bom') {
    return (
      <BaseSubpageLayout title="Gerenciar Estruturas" onBack={closeSubpage}>
        <CatalogV2List initialHasBom={true} />
      </BaseSubpageLayout>
    );
  }

  // Em construção ou Criador
  if (activeSubpage === 'create-product') {
    // We could either render a modal and keep the hub, or just render a full page
    // Since the creation feature is usually a dialog on top of the list, 
    // let's do exactly that inside the list view or just render the List with Create Dialog open
    return (
      <BaseSubpageLayout title="Criar Produto" onBack={closeSubpage}>
        <CatalogV2List initialAction="create" />
      </BaseSubpageLayout>
    );
  }

  if (activeSubpage === 'create-bom') {
    return (
      <BaseSubpageLayout title="Criar Estrutura" onBack={closeSubpage}>
        <CatalogV2List initialHasBom={true} initialAction="create" />
      </BaseSubpageLayout>
    );
  }

  // Visão em Modo Hub (Grid de Ajustes Rápidos)
  return (
    <div className="p-6 max-w-7xl mx-auto h-full text-slate-900 dark:text-slate-100">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white mb-2">Painel de Acesso Rápido <DevBadge id="catalogv2hub.title" /></h1>
        <p className="text-gray-500 dark:text-gray-400">Arraste para reordenar suas prioridades de visualização.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SortableContext
            items={blocksOrder.filter(id => id !== 'none')}
            strategy={rectSortingStrategy}
          >
            {blocksOrder.map((id) => {
              if (id === 'none') return null;
              const BlockComponent = blockComponents[id as Exclude<CatalogSubpage, 'none'>];
              
              if (!BlockComponent) return null;

              return (
                <SortableBlock key={id} id={id} onClick={() => openSubpage(id as CatalogSubpage)}>
                  <BlockComponent />
                </SortableBlock>
              );
            })}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
