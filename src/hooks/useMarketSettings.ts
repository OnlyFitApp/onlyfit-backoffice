import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listProductCategories,
  listMarketStores,
  searchMarketStoreBusinesses,
  saveProductCategory,
  saveMarketStore,
  type ProductCategory,
  type MarketStoreInput,
} from "../lib/marketSettings";

export const useMarketStores = () =>
  useQuery({
    queryKey: ["market-stores"],
    queryFn: listMarketStores,
    staleTime: 30_000,
  });

export const useMarketStoreBusinesses = (query: string) =>
  useQuery({
    queryKey: ["market-store-businesses", query],
    queryFn: () => searchMarketStoreBusinesses(query),
    staleTime: 30_000,
  });

export function useSaveMarketStore() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: MarketStoreInput) => saveMarketStore(input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["market-stores"] });
      void client.invalidateQueries({ queryKey: ["market-store-businesses"] });
    },
  });
}

export const useProductCategories = () =>
  useQuery({
    queryKey: ["product-categories"],
    queryFn: listProductCategories,
    staleTime: 60_000,
  });

export function useSaveProductCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductCategory) => saveProductCategory(input),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ["product-categories"] }),
  });
}
