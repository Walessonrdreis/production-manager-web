import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { DevBadge } from '../../../components/ui/DevBadge';
import { StockRoom } from '../domain/StockRoomGateway';
import { getStockRoomsGateway } from '../infra/StockRoomsGatewayFactory';
import * as Icons from 'lucide-react';

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
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}

export function StocksHub() {
  const [rooms, setRooms] = useState<StockRoom[]>([]);
  const [blocksOrder, setBlocksOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRooms() {
      try {
        const gateway = getStockRoomsGateway();
        const data = await gateway.getRooms();
        setRooms(data);
        // Só inicializar a ordem se ainda estiver vazio para manter caso de uso (futuramente em persistência)
        setBlocksOrder((prev) => prev.length === 0 ? data.map(r => r.id) : prev);
      } catch (err) {
        console.error('Failed to load stock rooms', err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

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
      const oldIndex = blocksOrder.indexOf(active.id as string);
      const newIndex = blocksOrder.indexOf(over.id as string);
      setBlocksOrder(arrayMove(blocksOrder, oldIndex, newIndex));
    }
  }

  // Filtramos apenas as salas válidas para evitar erros silenciosos
  const orderedRooms = blocksOrder
    .map(id => rooms.find(r => r.id === id))
    .filter((r): r is StockRoom => !!r);

  // Fallback caso chegue novas salas e elas ainda não estejam no order
  const missingRooms = rooms.filter(r => !blocksOrder.includes(r.id));
  const fullRoomsToRender = [...orderedRooms, ...missingRooms];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl flex items-center font-bold text-gray-900 dark:text-gray-100 gap-3 mb-2">
            <Layers className="w-8 h-8 text-blue-600" />
            Estoques
            <DevBadge id="stocks.hub" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Salas de armazenagem e gestão física de inventário. Arraste para reordenar suas prioridades de visualização.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fullRoomsToRender.map(r => r.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fullRoomsToRender.map(room => {
                // Dynamically load icon
                const IconComponent = (Icons as any)[room.iconName] || Icons.Box;

                return (
                  <SortableBlock 
                    key={room.id} 
                    id={room.id}
                    onClick={() => navigate(`/v2/stocks/${room.id}`)}
                  >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between relative group transition-colors">
                      <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:scale-105 transition-transform">
                        <IconComponent size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 w-full text-left">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                          {room.title}
                          <DevBadge id={`stocks.room.${room.id}`} domain={room.devBadgeDomain} />
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {room.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Famílias mapeadas</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{room.omieFamilies.length}</span>
                      </div>
                    </div>
                  </SortableBlock>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
