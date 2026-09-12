import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFeedDistributionSettings,
  updateFeedDistributionSettings,
  type FeedDistributionInput,
} from '../lib/feedSettings';

export function useFeedDistributionSettings(enabled: boolean) {
  return useQuery({
    queryKey: ['feed-distribution-settings'],
    queryFn: getFeedDistributionSettings,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useUpdateFeedDistributionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: FeedDistributionInput) => updateFeedDistributionSettings(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed-distribution-settings'] });
    },
  });
}
