import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentProviderStatus,
  setPaymentProviderCredentials,
  type PaymentEnvironment,
  type PaymentProviderCredentials,
} from '../lib/paymentProviders';

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
