import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTrainingQuotaSettings, updateTrainingQuotaSettings } from '../lib/trainingQuotaSettings';

const queryKey = ['training-quota-settings'];

export function useTrainingQuotaSettings() {
  return useQuery({
    queryKey,
    queryFn: getTrainingQuotaSettings,
    staleTime: 60 * 1000,
  });
}

export function useUpdateTrainingQuotaSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTrainingQuotaSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKey, settings);
    },
  });
}
