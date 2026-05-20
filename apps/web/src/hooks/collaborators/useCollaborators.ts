import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollaboratorsRepository } from '../../features/collaborators/infra/CollaboratorsRepository';
import { Collaborator } from '../../types/api';
import { useToast } from '../../components/ui/Toast';

export function useCollaborators() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data: collaborators = [], isLoading, error } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => CollaboratorsRepository.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (collaborator: Omit<Collaborator, 'id'>) => CollaboratorsRepository.create(collaborator),
    onSuccess: () => {
      success('Colaborador adicionado com sucesso!');
    },
    onError: () => {
      toastError('Falha ao adicionar colaborador.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Collaborator> }) => 
      CollaboratorsRepository.update(id, data),
    onSuccess: () => {
      success('Colaborador atualizado com sucesso!');
    },
    onError: () => {
      toastError('Falha ao atualizar colaborador.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CollaboratorsRepository.delete(id),
    onSuccess: () => {
      success('Colaborador removido com sucesso!');
    },
    onError: () => {
      toastError('Falha ao remover colaborador.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    }
  });

  return {
    collaborators,
    isLoading,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
