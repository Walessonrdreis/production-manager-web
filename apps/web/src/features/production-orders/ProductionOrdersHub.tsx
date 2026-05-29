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

import { useProductionOrdersLayout, Subpage } from './model/useProductionOrdersLayout';
import { BaseSubpageLayout } from './components/BaseSubpageLayout';

// Blocos
import { OpenedOrdersBlock } from './subpages/OpenedOrders/OpenedOrdersBlock';
import { OpenedOrdersView } from './subpages/OpenedOrders/OpenedOrdersView';
import { CreateOrderBlock } from './subpages/CreateOrder/CreateOrderBlock';
import { LiveOrdersBlock } from './subpages/LiveOrders/LiveOrdersBlock';
import { OrderReviewBlock } from './subpages/OrderReview/OrderReviewBlock';
import { OrderHistoryBlock } from './subpages/OrderHistory/OrderHistoryBlock';
import { OrderMetricsBlock } from './subpages/OrderMetrics/OrderMetricsBlock';

import { CreateOrderView } from './subpages/CreateOrder/CreateOrderView';

const blockComponents: Record<Exclude<Subpage, 'none'>, React.FC> = {
  opened: OpenedOrdersBlock,
  create: CreateOrderBlock,
  live: LiveOrdersBlock,
  review: OrderReviewBlock,
  history: OrderHistoryBlock,
  metrics: OrderMetricsBlock,
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
        className="cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform" 
        onClick={(e) => {
          // If the dragging logic starts, pointer up wouldn't be a simple click, but let's 
          // add a prevention mechanism if we really drag. The `useSortable` handles simple 
          // clicks to allow underlying elements to receive them if there is no drag.
          onClick();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ProductionOrdersHub() {
  const { activeSubpage, openSubpage, closeSubpage, blocksOrder, reorderBlocks } = useProductionOrdersLayout();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag before it activates to ensure valid clicks aren't intercepted.
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocksOrder.indexOf(active.id as Exclude<Subpage, 'none'>);
      const newIndex = blocksOrder.indexOf(over.id as Exclude<Subpage, 'none'>);
      reorderBlocks(arrayMove(blocksOrder, oldIndex, newIndex));
    }
  }

  // Se houver uma subpágina ativa expandida, mostra ela em vez do grid de widgets
  if (activeSubpage === 'opened') {
    return (
      <BaseSubpageLayout title="OPs em Aberto" onBack={closeSubpage}>
        <OpenedOrdersView />
      </BaseSubpageLayout>
    );
  }

  if (activeSubpage === 'create') {
    return (
      <BaseSubpageLayout title="Nova OP" onBack={closeSubpage}>
        <CreateOrderView />
      </BaseSubpageLayout>
    );
  }

  // Demais views aqui (expandir depois)
  if (activeSubpage !== 'none') {
    return (
      <BaseSubpageLayout title="Em Construção..." onBack={closeSubpage}>
        <p className="text-gray-500">Esta tela está em desenvolvimento (Fase 2).</p>
      </BaseSubpageLayout>
    );
  }

  // Visão em Modo Hub (Grid de Widgets)
  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Produção (V2)</h1>
        <p className="text-gray-500">Selecione ou reordene os blocos de gestão.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SortableContext
            items={blocksOrder.filter(id => id !== 'none')}
            strategy={rectSortingStrategy}
          >
            {blocksOrder.map((id) => {
              if (id === 'none') return null;
              const BlockComponent = blockComponents[id as Exclude<Subpage, 'none'>];
              
              if (!BlockComponent) return null;

              return (
                <SortableBlock key={id} id={id} onClick={() => openSubpage(id as Subpage)}>
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
