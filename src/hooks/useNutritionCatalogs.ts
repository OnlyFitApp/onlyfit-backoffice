import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listNutritionCatalog,
  saveNutritionCatalogItem,
  setNutritionCatalogItemActive,
  type NutritionCatalogKind,
} from '../lib/nutritionCatalogs';

const nutritionCatalogKey = ['nutrition-catalog'] as const;

export function useNutritionCatalog(kind: NutritionCatalogKind) {
  return useQuery({
    queryKey: [...nutritionCatalogKey, kind],
    queryFn: () => listNutritionCatalog(kind),
    staleTime: 30_000,
  });
}

function useRefreshNutritionCatalog() {
  const client = useQueryClient();
  return () => void client.invalidateQueries({ queryKey: nutritionCatalogKey });
}

export function useSaveNutritionCatalogItem() {
  const refresh = useRefreshNutritionCatalog();
  return useMutation({ mutationFn: saveNutritionCatalogItem, onSuccess: refresh });
}

export function useSetNutritionCatalogItemActive() {
  const refresh = useRefreshNutritionCatalog();
  return useMutation({ mutationFn: setNutritionCatalogItemActive, onSuccess: refresh });
}
