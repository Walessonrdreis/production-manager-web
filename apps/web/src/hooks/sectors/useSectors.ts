import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getSectors, sectorsLocalRepository } from '../../features/sectors';

export function useSectors() {
  // Garantimos que a migração ocorra
  useEffect(() => {
    sectorsLocalRepository.ensureMigration();
  }, []);

  const query = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
    staleTime: 0, // Sem cache para evitar atrasos na leitura do DB
    gcTime: 30 * 60 * 1000,   // Perdurar por 30 minutos
  });

  const result = query.data;

  return {
    ...query,
    data: result?.success ? result.data : [],
    isError: query.isError || (result !== undefined && !result.success),
    error: query.error || (result?.success === false ? result.error : null),
  };
}
