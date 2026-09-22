import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listDiets, listPrograms, listWorkouts, saveDiet, saveProgram, saveWorkout, setLibraryItemActive, type DietCatalogItem, type LibraryKind, type LibraryPage, type ProgramCatalogItem, type WorkoutCatalogItem } from '../lib/onlyfitHealthLibrary';

const libraryKey = ['onlyfit-health-library'] as const;
type OnlyFitHealthCatalogItem = WorkoutCatalogItem | DietCatalogItem | ProgramCatalogItem;

export function useOnlyFitHealthCatalog(kind: LibraryKind, search: string, filter: string, limit=25, offset=0) {
  return useQuery<LibraryPage<OnlyFitHealthCatalogItem>>({
    queryKey: [...libraryKey, kind, search, filter, limit, offset],
    queryFn: () => kind === 'workouts'
      ? listWorkouts({search, modality:filter, limit, offset}) as Promise<LibraryPage<OnlyFitHealthCatalogItem>>
      : kind === 'programs' ? listPrograms({search, sport:filter, limit, offset}) as Promise<LibraryPage<OnlyFitHealthCatalogItem>> : listDiets({search, limit, offset}) as Promise<LibraryPage<OnlyFitHealthCatalogItem>>,
    staleTime: 20_000,
  });
}

function useRefresh() { const client=useQueryClient(); return () => void client.invalidateQueries({queryKey:libraryKey}); }
export function useSaveWorkout() { const refresh=useRefresh(); return useMutation({mutationFn:saveWorkout,onSuccess:refresh}); }
export function useSaveDiet() { const refresh=useRefresh(); return useMutation({mutationFn:saveDiet,onSuccess:refresh}); }
export function useSaveProgram() { const refresh=useRefresh(); return useMutation({mutationFn:saveProgram,onSuccess:refresh}); }
export function useSetLibraryActive() { const refresh=useRefresh(); return useMutation({mutationFn:({kind,id,active}:{kind:LibraryKind;id:string;active:boolean})=>setLibraryItemActive(kind,id,active),onSuccess:refresh}); }
