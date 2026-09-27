import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSnapshot } from '../lib/dashboard';

export function useDashboardSnapshot(section?: 'overview' | 'acquisition' | 'engagement' | 'business' | 'accounts') {
  return useQuery({
    queryKey: ['backoffice-dashboard-snapshot', section],
    queryFn: () => fetchDashboardSnapshot(section),
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
