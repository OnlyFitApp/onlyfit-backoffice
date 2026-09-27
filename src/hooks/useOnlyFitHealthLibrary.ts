import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listHealthLibrary,
  saveDiet,
  saveProgram,
  saveWorkout,
  setLibraryItemActive,
  type LibraryKind,
} from '../lib/onlyfitHealthLibrary';

const libraryKey = ['onlyfit-health-library'] as const;

export function useOnlyFitHealthCatalog(
  kind: LibraryKind,
  query: string,
  sport: string,
  status: 'all' | 'active' | 'inactive',
  limit = 25,
  offset = 0,
) {
  return useQuery({
    queryKey: [...libraryKey, kind, query, sport, status, limit, offset],
    queryFn: () => listHealthLibrary({
      kind,
      query: query || undefined,
      sport: sport || undefined,
      status,
      limit,
      offset,
    }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
  });
}

function useRefresh() {
  const client = useQueryClient();
  return () => void client.invalidateQueries({ queryKey: libraryKey });
}

export function useSaveWorkout() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: saveWorkout, onSuccess: refresh });
}

export function useSaveDiet() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: saveDiet, onSuccess: refresh });
}

export function useSaveProgram() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: saveProgram, onSuccess: refresh });
}

export function useSetLibraryActive() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: setLibraryItemActive, onSuccess: refresh });
}
