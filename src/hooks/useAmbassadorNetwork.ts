import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  actOnAmbassadorNetwork,
  fetchAmbassadorNetwork,
  type AmbassadorNetworkFilters,
} from '../lib/ambassadorNetwork';

const rootKey = ['staff-ambassador-network'] as const;

export function useAmbassadorNetwork(filters: AmbassadorNetworkFilters = {}) {
  return useQuery({
    queryKey: [...rootKey, filters],
    queryFn: () => fetchAmbassadorNetwork(filters),
    staleTime: 15_000,
  });
}

export function useAmbassadorNetworkAction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: actOnAmbassadorNetwork,
    onSuccess: () => void client.invalidateQueries({ queryKey: rootKey }),
  });
}
