import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listOfferingCatalog,
  listNativeProducts,
  saveNativeStoreProduct,
  type NativeStoreProductInput,
  type OfferingCatalogFilters,
} from '../lib/offeringCatalog';

export function useOfferingCatalog(filters: OfferingCatalogFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['offering-catalog', filters],
    queryFn: () => listOfferingCatalog(filters),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useSaveNativeStoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NativeStoreProductInput) => saveNativeStoreProduct(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offering-catalog'] });
      void queryClient.invalidateQueries({ queryKey: ['native-products'] });
    },
  });
}

export function useNativeProducts() {
  return useQuery({
    queryKey: ['native-products'],
    queryFn: listNativeProducts,
    staleTime: 30 * 1000,
  });
}
