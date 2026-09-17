import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEmailThread,
  listEmailMailboxes,
  listEmailThreads,
  markEmailThreadRead,
  syncEmailCenter,
  type EmailThreadFilters,
} from '../lib/emailCenter';

export function useEmailMailboxes() {
  return useQuery({
    queryKey: ['email-mailboxes'],
    queryFn: listEmailMailboxes,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useEmailThreads(filters: EmailThreadFilters) {
  return useQuery({
    queryKey: ['email-threads', filters],
    queryFn: () => listEmailThreads(filters),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useEmailThread(id: string | null) {
  return useQuery({
    queryKey: ['email-thread', id],
    queryFn: () => getEmailThread(id as string),
    enabled: Boolean(id),
    staleTime: 10_000,
    refetchInterval: id ? 30_000 : false,
  });
}

export function useMarkEmailThreadRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markEmailThreadRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      void queryClient.invalidateQueries({ queryKey: ['email-threads'] });
    },
  });
}

export function useSyncEmailCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncEmailCenter,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      void queryClient.invalidateQueries({ queryKey: ['email-threads'] });
      void queryClient.invalidateQueries({ queryKey: ['email-thread'] });
    },
  });
}
