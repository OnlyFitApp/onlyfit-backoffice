import { useQuery } from '@tanstack/react-query';
import { fetchUserOverview, searchUsers, type UserSearchFilters } from '../lib/users';

export function useUserSearch(filters: UserSearchFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['staff-accounts', filters],
    queryFn: () => searchUsers(filters),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useUserOverview(userId: string | null) {
  return useQuery({
    queryKey: ['staff-account', userId],
    queryFn: () => fetchUserOverview(userId as string),
    enabled: Boolean(userId),
    staleTime: 15 * 1000,
  });
}
