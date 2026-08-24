import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listExerciseCatalog,
  setExerciseCatalogActive,
  upsertExerciseCatalogEntry,
  type ExerciseCatalogFilters,
} from '../lib/exerciseCatalog';

const exerciseCatalogKey = ['exercise-catalog'] as const;

export const useExerciseCatalog = (filters: ExerciseCatalogFilters) => useQuery({
  queryKey: [...exerciseCatalogKey, filters],
  queryFn: () => listExerciseCatalog(filters),
  placeholderData: keepPreviousData,
  staleTime: 30_000,
});

function useRefreshExerciseCatalog() {
  const client = useQueryClient();
  return () => void client.invalidateQueries({ queryKey: exerciseCatalogKey });
}

export function useUpsertExerciseCatalogEntry() {
  const refresh = useRefreshExerciseCatalog();
  return useMutation({ mutationFn: upsertExerciseCatalogEntry, onSuccess: refresh });
}

export function useSetExerciseCatalogActive() {
  const refresh = useRefreshExerciseCatalog();
  return useMutation({ mutationFn: setExerciseCatalogActive, onSuccess: refresh });
}
