import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listOfferingTypeBilling,
  saveOfferingType,
  setOfferingTypeActive,
  type StaffOfferTypeSaveInput,
} from '../lib/offeringTypes';

const queryKey = ['core', 'staff', 'offer-types'] as const;

export function useOfferingTypeBilling(enabled: boolean) {
  return useQuery({
    queryKey,
    queryFn: listOfferingTypeBilling,
    enabled,
    staleTime: 60_000,
    select: (snapshot) => snapshot.items,
  });
}

export function useOfferingTypesAdmin(enabled: boolean) {
  return useQuery({ queryKey, queryFn: listOfferingTypeBilling, enabled, staleTime: 60_000 });
}

export function useSaveOfferingType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: StaffOfferTypeSaveInput) => saveOfferingType(item),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetOfferingTypeActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setOfferingTypeActive,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  });
}
