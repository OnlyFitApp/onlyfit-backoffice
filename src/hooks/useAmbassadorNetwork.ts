import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAmbassadorOperationsDashboard,
  getAmbassadorAssignmentImpact,
  getAmbassadorSnapshot,
  listAmbassadorAudit,
  listAmbassadorMemberships,
  listAmbassadorRequests,
  prepareAmbassadorCandidate,
  reviewAmbassadorMembership,
  reviewAmbassadorPromotion,
  refreshAmbassadorLegacyInventory,
  resolveAmbassadorLegacyCandidate,
  rollbackAmbassadorRollout,
  saveAmbassadorRollout,
  setAmbassadorRolloutCheck,
  saveAmbassadorAssignment,
  saveAmbassadorNetworkSetting,
  saveCommercialRegion,
  setAmbassadorProgramFlags,
  searchAmbassadorCandidates,
  setCommercialRegionActive,
  transitionAmbassadorAssignment,
  transferAmbassadorAssociate,
  transferAmbassadorMembership,
  transitionAmbassadorRollout,
} from '../lib/ambassadorNetwork';

const rootKey = ['ambassador-network'] as const;

export function useAmbassadorSnapshot(filters: { affinityGroupKey?: string; regionId?: string; status?: string; offset?: number }) {
  return useQuery({ queryKey: [...rootKey, 'snapshot', filters], queryFn: () => getAmbassadorSnapshot(filters), staleTime: 20_000 });
}

export function useAmbassadorCandidates(query: string) {
  return useQuery({ queryKey: [...rootKey, 'candidates', query], queryFn: () => searchAmbassadorCandidates(query), enabled: query.trim().length >= 2, staleTime: 30_000 });
}

export function useAmbassadorAssignmentImpact(id: string | null) {
  return useQuery({ queryKey: [...rootKey, 'impact', id], queryFn: () => getAmbassadorAssignmentImpact(id ?? ''), enabled: Boolean(id), staleTime: 0 });
}

export function useAmbassadorMemberships(id: string | null) {
  return useQuery({ queryKey: [...rootKey, 'memberships', id], queryFn: () => listAmbassadorMemberships({ assignmentId: id ?? undefined }), enabled: Boolean(id), staleTime: 10_000 });
}

export const useAmbassadorRequests = () => useQuery({ queryKey: [...rootKey, 'requests'], queryFn: listAmbassadorRequests, staleTime: 10_000 });
export const useAmbassadorAudit = () => useQuery({ queryKey: [...rootKey, 'audit'], queryFn: listAmbassadorAudit, staleTime: 20_000 });
export const useAmbassadorOperations = () => useQuery({ queryKey: [...rootKey, 'operations'], queryFn: getAmbassadorOperationsDashboard, staleTime: 15_000 });

function useAmbassadorMutation<TInput, TOutput = void>(mutationFn: (input: TInput) => Promise<TOutput>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => void client.invalidateQueries({ queryKey: rootKey }),
  });
}

export const useSaveCommercialRegion = () => useAmbassadorMutation(saveCommercialRegion);
export const useSetCommercialRegionActive = () => useAmbassadorMutation(setCommercialRegionActive);
export const useSaveAmbassadorAssignment = () => useAmbassadorMutation(saveAmbassadorAssignment);
export const usePrepareAmbassadorCandidate = () => useAmbassadorMutation(prepareAmbassadorCandidate);
export const useTransitionAmbassadorAssignment = () => useAmbassadorMutation(transitionAmbassadorAssignment);
export const useTransferAmbassadorAssociate = () => useAmbassadorMutation(transferAmbassadorAssociate);
export const useReviewAmbassadorMembership = () => useAmbassadorMutation(reviewAmbassadorMembership);
export const useTransferAmbassadorMembership = () => useAmbassadorMutation(transferAmbassadorMembership);
export const useReviewAmbassadorPromotion = () => useAmbassadorMutation(reviewAmbassadorPromotion);
export const useSaveAmbassadorNetworkSetting = () => useAmbassadorMutation(saveAmbassadorNetworkSetting);
export const useSetAmbassadorProgramFlags = () => useAmbassadorMutation(setAmbassadorProgramFlags);
export const useRefreshAmbassadorLegacyInventory = () => useAmbassadorMutation(refreshAmbassadorLegacyInventory);
export const useResolveAmbassadorLegacyCandidate = () => useAmbassadorMutation(resolveAmbassadorLegacyCandidate);
export const useSaveAmbassadorRollout = () => useAmbassadorMutation(saveAmbassadorRollout);
export const useSetAmbassadorRolloutCheck = () => useAmbassadorMutation(setAmbassadorRolloutCheck);
export const useTransitionAmbassadorRollout = () => useAmbassadorMutation(transitionAmbassadorRollout);
export const useRollbackAmbassadorRollout = () => useAmbassadorMutation(rollbackAmbassadorRollout);
