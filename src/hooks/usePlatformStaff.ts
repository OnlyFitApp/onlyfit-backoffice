import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/useAuth';
import { fetchCurrentStaffRole } from '../lib/staff';

export function usePlatformStaff(enabled = true) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['platform_is_staff', user?.id],
    queryFn: async () => Boolean(await fetchCurrentStaffRole(user!.id)),
    enabled: enabled && Boolean(user?.id),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
