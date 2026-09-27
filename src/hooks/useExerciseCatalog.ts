import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listExerciseCatalog,
  saveExerciseCatalogEntry,
  setExerciseCatalogActive,
  uploadExerciseMedia,
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

export function useSaveExerciseCatalogEntry() {
  const refresh = useRefreshExerciseCatalog();
  return useMutation({ mutationFn: saveExerciseCatalogEntry, onSuccess: refresh });
}

export function useSetExerciseCatalogActive() {
  const refresh = useRefreshExerciseCatalog();
  return useMutation({ mutationFn: setExerciseCatalogActive, onSuccess: refresh });
}

export function useUploadExerciseMedia() {
  return useMutation({ mutationFn: ({ file, kind }: { file: File; kind: 'video' | 'thumbnail' }) => uploadExerciseMedia(file, kind) });
}
