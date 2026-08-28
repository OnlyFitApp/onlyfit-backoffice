import { useQuery } from '@tanstack/react-query';
import {
  fetchNetworkHealthSnapshot,
  fetchNetworkHealthUsers,
  type NetworkUserSegment,
} from '../lib/networkHealth';

export function useNetworkHealthSnapshot(enabled: boolean) {
  return useQuery({
    queryKey: ['backoffice-network-health'],
    queryFn: fetchNetworkHealthSnapshot,
    enabled,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useNetworkHealthUsers(segment: NetworkUserSegment, page: number, pageSize: number, enabled: boolean) {
  return useQuery({
    queryKey: ['backoffice-network-health-users', segment, page, pageSize],
    queryFn: () => fetchNetworkHealthUsers(segment, pageSize, page * pageSize),
    enabled,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
