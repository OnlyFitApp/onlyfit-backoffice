import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  activateChannelCostPolicy,
  activateCompensationMatrix,
  createCompensationMatrix,
  getCompensationSnapshot,
  getAmbassadorFinanceReadiness,
  publishChannelCostPolicy,
  publishCompensationMatrix,
  retireChannelCostPolicy,
  retireCompensationMatrix,
  saveChannelCostPolicy,
  saveCompensationScenario,
  simulateCompensation,
} from '../lib/ambassadorCompensation';

const rootKey = ['ambassador-compensation'] as const;

export function useCompensationSnapshot(filters: { offeringType?: string; status?: string; offset?: number; costOffset?: number } = {}) {
  return useQuery({ queryKey: [...rootKey, 'snapshot', filters], queryFn: () => getCompensationSnapshot(filters), staleTime: 15_000 });
}

export function useAmbassadorFinanceReadiness() {
  return useQuery({ queryKey: [...rootKey, 'readiness'], queryFn: getAmbassadorFinanceReadiness, staleTime: 30_000 });
}

function useFinancialMutation<TInput, TOutput = void>(mutationFn: (input: TInput) => Promise<TOutput>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => void client.invalidateQueries({ queryKey: rootKey }) });
}

export const useCreateCompensationMatrix = () => useFinancialMutation(createCompensationMatrix);
export const useSaveCompensationScenario = () => useFinancialMutation(saveCompensationScenario);
export const usePublishCompensationMatrix = () => useFinancialMutation(publishCompensationMatrix);
export const useActivateCompensationMatrix = () => useFinancialMutation(activateCompensationMatrix);
export const useRetireCompensationMatrix = () => useFinancialMutation(retireCompensationMatrix);
export const useSaveChannelCostPolicy = () => useFinancialMutation(saveChannelCostPolicy);
export const usePublishChannelCostPolicy = () => useFinancialMutation(publishChannelCostPolicy);
export const useActivateChannelCostPolicy = () => useFinancialMutation(activateChannelCostPolicy);
export const useRetireChannelCostPolicy = () => useFinancialMutation(retireChannelCostPolicy);
export const useSimulateCompensation = () => useMutation({ mutationFn: simulateCompensation });
