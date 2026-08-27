import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSentEmail, listSentEmails, sendOutboundEmail, type SentEmailFilters } from '../lib/outboundEmail';

export function useSentEmails(filters: SentEmailFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['sent-emails', filters],
    queryFn: () => listSentEmails(filters),
    enabled,
    staleTime: 15_000,
  });
}

export function useSentEmail(id: string | null) {
  return useQuery({
    queryKey: ['sent-email', id],
    queryFn: () => fetchSentEmail(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useSendOutboundEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendOutboundEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sent-emails'] });
      void queryClient.invalidateQueries({ queryKey: ['sent-email'] });
    },
  });
}
