import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentProviderStatus,
  setPaymentProviderCredentials,
  type PaymentEnvironment,
} from '../lib/paymentProviders';
import type { PaymentProviderCredentials } from '../api/core.gen';

const queryKey = ['core-payment-providers'] as const;

export function usePaymentProviderStatus(enabled: boolean) {
  return useQuery({
    queryKey,
    queryFn: getPaymentProviderStatus,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useSetPaymentProviderCredentials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { environment: PaymentEnvironment; credentials: PaymentProviderCredentials }) =>
      setPaymentProviderCredentials(input),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); },
  });
}
