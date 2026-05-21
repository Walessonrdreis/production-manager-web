import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CatalogRepository } from '../../features/catalog/infra/CatalogRepository';
import { ProductionRepository } from '../../features/production/infra/ProductionRepository';

const FREQUENCY_MS = 1000 * 60 * 5; // 5 minutos (pouco tempo)

export function useAutoSync() {
  // Auto sync disabled temporarily
}
