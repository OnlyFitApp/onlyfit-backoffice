import { useQuery } from '@tanstack/react-query';
import { coreApi } from '../api/core';
import type { StaffSportItem } from '../api/core.gen';

export function useSportsCatalog() {
  return useQuery({
    queryKey: ['staff-catalog', 'sports'],
    queryFn: () => coreApi.staff.catalog({ kind: 'sports' }),
    staleTime: 60_000,
    select: (catalog) => catalog.items.filter((item): item is StaffSportItem => item.kind === 'sports'),
  });
}
