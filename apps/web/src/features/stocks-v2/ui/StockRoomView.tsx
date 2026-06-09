import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DevBadge } from '../../../components/ui/DevBadge';
import { StockRoom } from '../domain/StockRoomGateway';
import { getStockRoomsGateway } from '../infra/StockRoomsGatewayFactory';
import { CatalogV2List } from '../../catalog-v2/ui/CatalogV2List';
import * as Icons from 'lucide-react';

export function StockRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<StockRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      if (!roomId) return;
      try {
        const gateway = getStockRoomsGateway();
        const data = await gateway.getRoomById(roomId);
        setRoom(data);
      } catch (err) {
        console.error('Failed to load stock room', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sala não encontrada</h2>
        <button 
          onClick={() => navigate('/v2/stocks')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Voltar para Estoques
        </button>
      </div>
    );
  }

  const IconComponent = (Icons as any)[room.iconName] || Icons.Box;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-6 relative">
        <button 
          onClick={() => navigate('/v2/stocks')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl flex items-center font-bold text-gray-900 dark:text-gray-100 gap-3">
            <IconComponent className="w-8 h-8 text-blue-600" />
            {room.title}
            <DevBadge id={`stocks.room.${room.id}`} domain={room.devBadgeDomain} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            {room.description}
          </p>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-0 sm:p-6">
        <CatalogV2List 
          allowedFamilies={room.omieFamilies} 
        />
      </div>
    </div>
  );
}
