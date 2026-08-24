import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCombatTechniques,
  setCombatTechniqueActive,
  upsertCombatTechnique,
  type CombatTechniqueFilters,
} from '../lib/combatTechniques';

const key = ['combat-techniques'] as const;

export const useCombatTechniques = (filters: CombatTechniqueFilters) => useQuery({
  queryKey: [...key, filters],
  queryFn: () => listCombatTechniques(filters),
  placeholderData: keepPreviousData,
  staleTime: 30_000,
});

function useRefresh() {
  const client = useQueryClient();
  return () => void client.invalidateQueries({ queryKey: key });
}

export function useUpsertCombatTechnique() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: upsertCombatTechnique, onSuccess: refresh });
}

export function useSetCombatTechniqueActive() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: setCombatTechniqueActive, onSuccess: refresh });
}
