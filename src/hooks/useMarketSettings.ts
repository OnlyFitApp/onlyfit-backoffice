import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMarketAlgorithmSettings,
  deleteOfficialMarketStore,
  getAdInventory,
  listAdBookings,
  listProductCategories,
  listOfficialMarketStores,
  searchOfficialStoreOrganizations,
  saveProductCategory,
  saveOfficialMarketStore,
  setMarketAlgorithmSettings,
  setAdPackage,
  setAdPlacement,
  type AdPackage,
  type AdPlacement,
  type MarketAlgorithmInput,
  type ProductCategory,
  type OfficialMarketStoreInput,
} from '../lib/marketSettings';

export const useOfficialMarketStores = () => useQuery({
  queryKey: ['official-market-stores'],
  queryFn: listOfficialMarketStores,
  staleTime: 30_000,
});

export const useOfficialStoreOrganizations = (query: string) => useQuery({
  queryKey: ['official-store-organizations', query],
  queryFn: () => searchOfficialStoreOrganizations(query),
  staleTime: 30_000,
});

export function useSaveOfficialMarketStore() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: OfficialMarketStoreInput) => saveOfficialMarketStore(input),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['official-market-stores'] }),
  });
}

export function useDeleteOfficialMarketStore() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOfficialMarketStore(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['official-market-stores'] }),
  });
}

export const useMarketAlgorithmSettings = () => useQuery({
  queryKey: ['market-algorithm-settings'],
  queryFn: getMarketAlgorithmSettings,
  staleTime: 60_000,
});

export const useProductCategories = () => useQuery({
  queryKey: ['product-categories'],
  queryFn: listProductCategories,
  staleTime: 60_000,
});

export function useSetMarketAlgorithmSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: MarketAlgorithmInput) => setMarketAlgorithmSettings(input),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['market-algorithm-settings'] }),
  });
}

export function useSaveProductCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductCategory) => saveProductCategory(input),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['product-categories'] }),
  });
}

export const useAdInventory = () => useQuery({
  queryKey: ['ad-inventory'],
  queryFn: getAdInventory,
  staleTime: 30_000,
});

export const useAdBookings = () => useQuery({
  queryKey: ['ad-bookings'],
  queryFn: listAdBookings,
  staleTime: 30_000,
});

export function useSetAdPlacement() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<AdPlacement, 'slug' | 'max_slots' | 'is_active'>) => setAdPlacement(input),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['ad-inventory'] }),
  });
}

export function useSetAdPackage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<AdPackage, 'placement' | 'duration_days' | 'price' | 'is_active'>) => setAdPackage(input),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['ad-inventory'] }),
  });
}
