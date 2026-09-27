import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actChannelCostPolicy, actCompensationMatrix, getCompensationSnapshot, simulateCompensation } from '../lib/ambassadorCompensation';

const rootKey = ['ambassador-compensation'] as const;

export function useCompensationSnapshot(filters: { status?: string; offset?: number; costOffset?: number } = {}) {
  return useQuery({ queryKey: [...rootKey, filters], queryFn: () => getCompensationSnapshot(filters), staleTime: 15_000 });
}

function useFinancialMutation<TInput, TOutput>(mutationFn: (input: TInput) => Promise<TOutput>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => void client.invalidateQueries({ queryKey: rootKey }) });
}

export const useCompensationMatrixAction = () => useFinancialMutation(actCompensationMatrix);
export const useChannelCostPolicyAction = () => useFinancialMutation(actChannelCostPolicy);
export const useSimulateCompensation = () => useMutation({ mutationFn: simulateCompensation });
