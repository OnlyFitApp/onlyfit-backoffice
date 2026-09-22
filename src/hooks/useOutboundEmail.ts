import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendOutboundEmail } from '../lib/outboundEmail';

export function useSendOutboundEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendOutboundEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      void queryClient.invalidateQueries({ queryKey: ['email-threads'] });
      void queryClient.invalidateQueries({ queryKey: ['email-thread'] });
    },
  });
}
