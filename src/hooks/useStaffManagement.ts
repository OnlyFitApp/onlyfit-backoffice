import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/useAuth';
import {
  fetchCurrentStaffRole,
  fetchPlatformStaff,
  removePlatformStaff,
  setPlatformStaffRole,
} from '../lib/staff';

export function useCurrentStaffRole() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['platform_staff_role', user?.id],
    queryFn: () => fetchCurrentStaffRole(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useStaffList(enabled: boolean) {
  return useQuery({
    queryKey: ['platform_staff'],
    queryFn: fetchPlatformStaff,
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useSetPlatformStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPlatformStaffRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['platform_staff'] });
      void queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
}

export function useRemovePlatformStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removePlatformStaff,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['platform_staff'] });
      void queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
}
